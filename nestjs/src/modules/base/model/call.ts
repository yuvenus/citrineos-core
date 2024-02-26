import {CallAction} from "../enums/call.action";
import {OcppRequest} from "./ocpp.request";
import {MessageType} from "../enums/messageType";

/**
 * Definition of Call Message (4.2.1 CALL)
 */
export type Call = [
  2,
  messageId: string,
  action: CallAction,
  payload: OcppRequest
];

export class OcppMessage {
  messageType: MessageType;
  messageId: string;
  action: CallAction;
  payload: any;

  constructor(
    messageType: MessageType,
    messageId: string,
    action: CallAction,
    payload: any
  ) {
    this.messageType = messageType;
    this.messageId = messageId;
    this.action = action;
    this.payload = payload;
  }

  static fromString(message: string): OcppMessage {
    const json = JSON.parse(message);
    return new OcppMessage(
      json[0] as MessageType,
      json[1] as string,
      json[2] as CallAction,
      json[3] as any
    );
  }
}