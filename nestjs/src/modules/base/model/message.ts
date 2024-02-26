import {MessageOrigin} from "../enums/message.origin";
import {EventGroup} from "../enums/event.group";
import {CallAction} from "../enums/call.action";
import {MessageState} from "../enums/message.state";
import {MessageContext} from "./message.context";

export class Message {

  protected origin: MessageOrigin;
  protected eventGroup: EventGroup;
  protected action: CallAction;
  protected state: MessageState;
  protected context: MessageContext;
  protected payload: any;

  constructor(
    origin: MessageOrigin,
    eventGroup: EventGroup,
    action: CallAction,
    state: MessageState,
    context: MessageContext,
    payload: any
  ) {
    this.origin = origin;
    this.eventGroup = eventGroup;
    this.action = action;
    this.state = state;
    this.context = context;
    this.payload = payload;
  }
}