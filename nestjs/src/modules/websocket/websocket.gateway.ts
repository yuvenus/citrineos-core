import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import {Server} from "socket.io";
import {Inject, Logger} from "@nestjs/common";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";
import {ClientConnection} from "./client.connection";
import {v4 as uuidv4} from 'uuid';
import {Client, ClientProxy, Transport} from "@nestjs/microservices";
import {CallAction} from "../base/enums/call.action";
import {OcppError} from "../base/exceptions/ocpp.exception";
import {ErrorCode} from "../base/enums/error.code";
import {Call, OcppMessage} from "../base/model/call";
import {CALL_SCHEMA_MAP} from "../base/consts/call.schema.map";
import Ajv, {ErrorObject} from "ajv";
import {MessageConfirmation} from "../base/model/message.confirmation";
import {MessageState} from "../base/enums/message.state";
import {EventGroup} from "../base/enums/event.group";
import {MessageOrigin} from "../base/enums/message.origin";
import {Message} from "../base/model/message";
import {MessageContext} from "../base/model/message.context";

interface ValidationResponse {
  isValid: boolean,
  errors?: ErrorObject[] | null
}

@WebSocketGateway(8081)
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(WebsocketGateway.name);
  private ajv = new Ajv({
    removeAdditional: 'all',
    useDefaults: true,
    coerceTypes: 'array',
    strict: false
  });

  @WebSocketServer()
  server: Server;

  @Client({ transport: Transport.TCP })
  client: ClientProxy;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
  }


  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  @SubscribeMessage("ping")
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    this.client.emit('user_created', {
      boot: true,
    }).subscribe(result => {
      this.logger.log(`Result: ${result}`);
    });
    return {
      event: "pong",
      data: "Wrong data that will make the test fail",
    };
  }

  afterInit(server: any): any {
    // console.log('WebsocketGateway afterInit', server);
  }

  handleConnection = async (client: any, ...args: any[]): Promise<any> => {
    const req = args[0];
    const ip = req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() || req.socket.remoteAddress || "N/A";
    const port = req.socket.remotePort as number;

    // Parse the path to get the client id
    const identifier = (req.url as string).split("/")[1];
    const clientConnection = new ClientConnection(identifier, uuidv4(), ip, port);
    clientConnection.isAlive = true;

    // Register client
    try {
      await this.cacheManager.set(clientConnection.identifier, clientConnection, 10000); // todo ttl? namespace?
      this.logger.debug("Successfully registered websocket client", identifier, clientConnection);
    } catch (error) {
      this.logger.error("Failed to register websocket client", identifier, clientConnection, error);
    }

    client.on('message', async (message: string) => {
      // await this.onWebsocketMessage(clientConnection, OcppMessage.fromString(message));
      console.log('on message', message);
    });
  }

  handleDisconnect(client: any): any {
    // console.log('WebsocketGateway handleDisconnect', client);
  }

  /*async onWebsocketMessage(
    connection: ClientConnection,
    message: OcppMessage
  ): Promise<void> {
    const messageId = message.messageId;
    const action = message.action;

    try {
      const isAllowed = await this.isAllowed(action, connection.identifier);
      if (!isAllowed) {
        throw new OcppError(messageId, ErrorCode.SecurityError, `Action ${action} not allowed`);
      }

      // Run schema validation for incoming Call message
      const validationResponse = this.validateCall(connection.identifier, message);
      if (!validationResponse.isValid) {
        throw new OcppError(messageId, ErrorCode.FormatViolation, "Invalid message format", {errors: validationResponse.errors});
      }

      // Ensure only one call is processed at a time
      const successfullySet = this._cache.setIfNotExist(connection.identifier, `${action}:${messageId}`, CacheNamespace.Transactions, this._config.websocket.maxCallLengthSeconds);

      if (!successfullySet) {
        throw new OcppError(messageId, ErrorCode.RpcFrameworkError, "Call already in progress", {});
      }

      // Route call
      const confirmation = this._router.routeCall(connection, message);
      if (!confirmation.success) {
        throw new OcppError(messageId, ErrorCode.InternalError, 'Call failed', {details: confirmation.payload});
      }

    } catch (error) {
      if (error instanceof OcppError) {
        this.sendCallError(connection.identifier, error.asCallError());
        this._cache.remove(connection.identifier, CacheNamespace.Transactions);
      }
    }

  }

  private isAllowed(action: CallAction, identifier: string): Promise<boolean> {
    return this._cache.exists(action, identifier).then(blacklisted => !blacklisted);
  }

  /!**
   * Validates a Call object against its schema.
   *
   * @param {string} identifier - The identifier of the EVSE.
   * @param {Call} message - The Call object to validate.
   * @return {boolean} - Returns true if the Call object is valid, false otherwise.
   *!/
  protected validateCall(identifier: string, message: OcppMessage): ValidationResponse { // todo can we use class-validator?
    const action = message[2] as CallAction;
    const payload = message[3];

    const schema = CALL_SCHEMA_MAP.get(action);
    if (schema) {
      const validate = this.ajv.compile(schema);
      const result = validate(payload);
      if (!result) {
        this.logger.debug('Validate Call failed', validate.errors);
        return {isValid: false, errors: validate.errors};
      } else {
        return {isValid: true};
      }
    } else {
      this.logger.error("No schema found for action", action, message);
      return {isValid: false}; // TODO: Implement config for this behavior
    }
  }

  routeCall(client: ClientConnection, message: OcppMessage): Promise<MessageConfirmation> {
    return this._sender.send(new Message(
      MessageOrigin.ChargingStation,
      EventGroup.General, // TODO: Change to appropriate event group
      message.action,
      MessageState.Request,
      new MessageContext(
        message.messageId,
        client.identifier,
        '' // TODO: Add tenantId to context
      ),
      message.payload
    ));
  }*/

}