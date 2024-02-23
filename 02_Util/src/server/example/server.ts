// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0
/* eslint-disable */

import { AbstractCentralSystem, BOOT_STATUS, CacheNamespace, Call, CallAction, CallError, CallResult, ErrorCode, ICache, ICentralSystem, IMessageHandler, IMessageRouter, IMessageSender, MessageTriggerEnumType, MessageTypeId, OcppError, OcppMessageRouter, RegistrationStatusEnumType, RetryMessageError, SystemConfig, TriggerMessageRequest } from "@citrineos/base";
import Ajv from "ajv";
import { ILogObj, Logger } from "tslog";
import { INetworkConnection } from "./WebsocketNetworkConnection";

/**
 * Implementation of the central system
 */
export class CentralSystemImpl extends AbstractCentralSystem implements ICentralSystem {

    /**
     * Fields
     */

    protected _cache: ICache;
    private _router: IMessageRouter;
    private _networkConnection: INetworkConnection;

    /**
     * Constructor for the class.
     *
     * @param {SystemConfig} config - the system configuration
     * @param {ICache} cache - the cache object
     * @param {IMessageSender} [sender] - the message sender (optional)
     * @param {IMessageHandler} [handler] - the message handler (optional)
     * @param {Logger<ILogObj>} [logger] - the logger object (optional)
     * @param {Ajv} [ajv] - the Ajv object (optional)
     */
    constructor(
        config: SystemConfig,
        cache: ICache,
        sender: IMessageSender,
        handler: IMessageHandler,
        networkConnection: INetworkConnection,
        logger?: Logger<ILogObj>,
        ajv?: Ajv,
    ) {
        super(config, cache, handler, sender, logger, ajv);

        // Initialize router before socket server to avoid race condition
        this._router = new OcppMessageRouter(cache,
            sender,
            handler);

        networkConnection.addOnConnectionCallback((identifier: string) =>
            this.registerConnection(identifier)
        );

        networkConnection.addOnCloseCallback((identifier: string) =>
            this.deregisterConnection(identifier)
        );

        networkConnection.addOnMessageCallback((identifier: string, message: string) =>
            this.onMessage(identifier, message)
        );

        this._networkConnection = networkConnection;

        this._cache = cache;
    }

    /**
     * Interface implementation 
     */

    shutdown(): void {
        this._router.sender.shutdown();
        this._router.handler.shutdown();
    }

    async onMessage(identifier: string, message: string): Promise<boolean> {
        let rpcMessage: any;
        let messageTypeId: MessageTypeId | undefined = undefined
        let messageId: string = "-1"; // OCPP 2.0.1 part 4, section 4.2.3, "When also the MessageId cannot be read, the CALLERROR SHALL contain "-1" as MessageId."
        try {
            try {
                rpcMessage = JSON.parse(message);
                messageTypeId = rpcMessage[0];
                messageId = rpcMessage[1];
            } catch (error) {
                throw new OcppError(messageId, ErrorCode.FormatViolation, "Invalid message format", { error: error });
            }
            switch (messageTypeId) {
                case MessageTypeId.Call:
                    this.onCall(identifier, rpcMessage as Call);
                    break;
                case MessageTypeId.CallResult:
                    this.onCallResult(identifier, rpcMessage as CallResult);
                    break;
                case MessageTypeId.CallError:
                    this.onCallError(identifier, rpcMessage as CallError);
                    break;
                default:
                    throw new OcppError(messageId, ErrorCode.FormatViolation, "Unknown message type id: " + messageTypeId, {});
            }
            return true;
        } catch (error) {
            this._logger.error("Error processing message:", message, error);
            if (messageTypeId != MessageTypeId.CallResult && messageTypeId != MessageTypeId.CallError) {
                if (error instanceof OcppError) {
                    this.sendCallError(identifier, error.asCallError());
                } else {
                    this.sendCallError(identifier, [MessageTypeId.CallError, messageId, ErrorCode.InternalError, "Unable to process message", { error: error }]);
                }
            }
            // TODO: Publish raw payload for error reporting
            return false;
        }
    }

    /**
     * Handles an incoming Call message from a client connection.
     *
     * @param {IClientConnection} connection - The client connection object.
     * @param {Call} message - The Call message received.
     * @return {void}
     */
    onCall(identifier: string, message: Call): void {
        const messageId = message[1];
        const action = message[2] as CallAction;
        const payload = message[3];

        this._onCallIsAllowed(action, identifier)
            .then((isAllowed: boolean) => {
                if (!isAllowed) {
                    throw new OcppError(messageId, ErrorCode.SecurityError, `Action ${action} not allowed`);
                } else {
                    // Run schema validation for incoming Call message
                    return this._validateCall(identifier, message);
                }
            }).then(({ isValid, errors }) => {
                if (!isValid || errors) {
                    throw new OcppError(messageId, ErrorCode.FormatViolation, "Invalid message format", { errors: errors });
                }
                // Ensure only one call is processed at a time
                return this._cache.setIfNotExist(identifier, `${action}:${messageId}`, CacheNamespace.Transactions, this._config.maxCallLengthSeconds);
            }).catch(error => {
                if (error instanceof OcppError) {
                    this.sendCallError(identifier, error.asCallError());
                }
            }).then(successfullySet => {
                if (!successfullySet) {
                    throw new OcppError(messageId, ErrorCode.RpcFrameworkError, "Call already in progress", {});
                }
                // Route call
                return this._router.routeCall(identifier, message);
            }).then(confirmation => {
                if (!confirmation.success) {
                    throw new OcppError(messageId, ErrorCode.InternalError, 'Call failed', { details: confirmation.payload });
                }
            }).catch(error => {
                if (error instanceof OcppError) {
                    this.sendCallError(identifier, error.asCallError());
                    this._cache.remove(identifier, CacheNamespace.Transactions);
                }
            });
    }

    /**
     * Handles a CallResult made by the client.
     *
     * @param {IClientConnection} connection - The client connection that made the call.
     * @param {CallResult} message - The OCPP CallResult message.
     * @return {void}
     */
    onCallResult(identifier: string, message: CallResult): void {
        const messageId = message[1];
        const payload = message[2];

        this._logger.debug("Process CallResult", identifier, messageId, payload);

        this._cache.get<string>(identifier, CacheNamespace.Transactions)
            .then(cachedActionMessageId => {
                this._cache.remove(identifier, CacheNamespace.Transactions); // Always remove pending call transaction
                if (!cachedActionMessageId) {
                    throw new OcppError(messageId, ErrorCode.InternalError, "MessageId not found, call may have timed out", { "maxCallLengthSeconds": this._config.maxCallLengthSeconds });
                }
                const [actionString, cachedMessageId] = cachedActionMessageId.split(/:(.*)/); // Returns all characters after first ':' in case ':' is used in messageId
                if (messageId !== cachedMessageId) {
                    throw new OcppError(messageId, ErrorCode.InternalError, "MessageId doesn't match", { "expectedMessageId": cachedMessageId });
                }
                const action: CallAction = CallAction[actionString as keyof typeof CallAction]; // Parse CallAction
                return { action, ...this._validateCallResult(identifier, action, message) }; // Run schema validation for incoming CallResult message
            }).then(({ action, isValid, errors }) => {
                if (!isValid || errors) {
                    throw new OcppError(messageId, ErrorCode.FormatViolation, "Invalid message format", { errors: errors });
                }
                // Route call result
                return this._router.routeCallResult(identifier, message, action);
            }).then(confirmation => {
                if (!confirmation.success) {
                    throw new OcppError(messageId, ErrorCode.InternalError, 'CallResult failed', { details: confirmation.payload });
                }
            }).catch(error => {
                // TODO: Ideally the error log is also stored in the database in a failed invocations table to ensure these are visible outside of a log file.
                this._logger.error("Failed processing call result: ", error);
            });
    }

    /**
     * Handles the CallError that may have occured during a Call exchange.
     *
     * @param {IClientConnection} connection - The client connection object.
     * @param {CallError} message - The error message.
     * @return {void} This function doesn't return anything.
     */
    onCallError(identifier: string, message: CallError): void {

        const messageId = message[1];

        this._logger.debug("Process CallError", identifier, message);

        this._cache.get<string>(identifier, CacheNamespace.Transactions)
            .then(cachedActionMessageId => {
                this._cache.remove(identifier, CacheNamespace.Transactions); // Always remove pending call transaction
                if (!cachedActionMessageId) {
                    throw new OcppError(messageId, ErrorCode.InternalError, "MessageId not found, call may have timed out", { "maxCallLengthSeconds": this._config.maxCallLengthSeconds });
                }
                const [actionString, cachedMessageId] = cachedActionMessageId.split(/:(.*)/); // Returns all characters after first ':' in case ':' is used in messageId
                if (messageId !== cachedMessageId) {
                    throw new OcppError(messageId, ErrorCode.InternalError, "MessageId doesn't match", { "expectedMessageId": cachedMessageId });
                }
                const action: CallAction = CallAction[actionString as keyof typeof CallAction]; // Parse CallAction
                return this._router.routeCallError(identifier, message, action);
            }).then(confirmation => {
                if (!confirmation.success) {
                    throw new OcppError(messageId, ErrorCode.InternalError, 'CallError failed', { details: confirmation.payload });
                }
            }).catch(error => {
                // TODO: Ideally the error log is also stored in the database in a failed invocations table to ensure these are visible outside of a log file.
                this._logger.error("Failed processing call error: ", error);
            });
    }

    /**
     * Sends a Call message to a charging station with given identifier.
     *
     * @param {string} identifier - The identifier of the charging station.
     * @param {Call} message - The Call message to send.
     * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the call was sent successfully.
     */
    async sendCall(identifier: string, message: Call): Promise<boolean> {
        const messageId = message[1];
        const action = message[2] as CallAction;
        if (await this._sendCallIsAllowed(identifier, message)) {
            if (await this._cache.setIfNotExist(identifier, `${action}:${messageId}`,
                CacheNamespace.Transactions, this._config.maxCallLengthSeconds)) {
                // Intentionally removing NULL values from object for OCPP conformity
                const rawMessage = JSON.stringify(message, (k, v) => v ?? undefined);
                return this._sendMessage(identifier, rawMessage);
            } else {
                this._logger.info("Call already in progress, throwing retry exception", identifier, message);
                throw new RetryMessageError("Call already in progress");
            }
        } else {
            this._logger.info("RegistrationStatus Rejected, unable to send", identifier, message);
            return false;
        }
    }

    /**
     * Sends the CallResult to a charging station with given identifier.
     *
     * @param {string} identifier - The identifier of the charging station.
     * @param {CallResult} message - The CallResult message to send.
     * @return {Promise<boolean>} A promise that resolves to true if the call result was sent successfully, or false otherwise.
     */
    async sendCallResult(identifier: string, message: CallResult): Promise<boolean> {
        const messageId = message[1];
        const cachedActionMessageId = await this._cache.get<string>(identifier, CacheNamespace.Transactions);
        if (!cachedActionMessageId) {
            this._logger.error("Failed to send callResult due to missing message id", identifier, message);
            return false;
        }
        let [cachedAction, cachedMessageId] = cachedActionMessageId?.split(/:(.*)/); // Returns all characters after first ':' in case ':' is used in messageId
        if (cachedMessageId === messageId) {
            // Intentionally removing NULL values from object for OCPP conformity
            const rawMessage = JSON.stringify(message, (k, v) => v ?? undefined);
            return Promise.all([
                this._sendMessage(identifier, rawMessage),
                this._cache.remove(identifier, CacheNamespace.Transactions)
            ]).then(successes => successes.every(Boolean));
        } else {
            this._logger.error("Failed to send callResult due to mismatch in message id", identifier, cachedActionMessageId, message);
            return false;
        }
    }

    /**
     * Sends a CallError message to a charging station with given identifier.
     *
     * @param {string} identifier - The identifier of the charging station.
     * @param {CallError} message - The CallError message to send.
     * @return {Promise<boolean>} - A promise that resolves to true if the message was sent successfully.
     */
    async sendCallError(identifier: string, message: CallError): Promise<boolean> {
        const messageId = message[1];
        const cachedActionMessageId = await this._cache.get<string>(identifier, CacheNamespace.Transactions);
        if (!cachedActionMessageId) {
            this._logger.error("Failed to send callError due to missing message id", identifier, message);
            return false;
        }
        let [cachedAction, cachedMessageId] = cachedActionMessageId?.split(/:(.*)/); // Returns all characters after first ':' in case ':' is used in messageId
        if (cachedMessageId === messageId) {
            // Intentionally removing NULL values from object for OCPP conformity
            const rawMessage = JSON.stringify(message, (k, v) => v ?? undefined);
            return Promise.all([
                this._sendMessage(identifier, rawMessage),
                this._cache.remove(identifier, CacheNamespace.Transactions)
            ]).then(successes => successes.every(Boolean));
        } else {
            this._logger.error("Failed to send callError due to mismatch in message id", identifier, cachedActionMessageId, message);
            return false;
        }
    }

    /**
     * Methods 
     */

    /**
     * Determine if the given action for identifier is allowed.
     *
     * @param {CallAction} action - The action to be checked.
     * @param {string} identifier - The identifier to be checked.
     * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the action and identifier are allowed.
     */
    private _onCallIsAllowed(action: CallAction, identifier: string): Promise<boolean> {
        return this._cache.exists(action, identifier).then(blacklisted => !blacklisted);
    }


    private async _sendCallIsAllowed(identifier: string, message: Call): Promise<boolean> {
        const status = await this._cache.get<string>(BOOT_STATUS, identifier);
        if (status == RegistrationStatusEnumType.Rejected &&
            // TriggerMessage<BootNotification> is the only message allowed to be sent during Rejected BootStatus B03.FR.08
            !(message[2] as CallAction == CallAction.TriggerMessage && (message[3] as TriggerMessageRequest).requestedMessage == MessageTriggerEnumType.BootNotification)) {
            return false;
        }
        return true;
    }
}