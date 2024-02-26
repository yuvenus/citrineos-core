import {HttpException, HttpStatus} from "@nestjs/common";
import {ErrorCode} from "../enums/error.code";
import {MessageType} from "../enums/messageType";

/**
 * Custom error to handle OCPP errors better.
 */
export class OcppError extends HttpException {

  private _messageId: string;
  private _errorCode: ErrorCode;
  private _errorDetails: object;

  constructor(messageId: string, errorCode: ErrorCode, errorDescription: string, errorDetails: object = {}) {
    super('OcppError', HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'OcppError';
    this._messageId = messageId;
    this._errorCode = errorCode;
    this._errorDetails = errorDetails;
  }

  asCallError(): OcppError {
    return [MessageType.CallError, this._messageId, this._errorCode, this.message, this._errorDetails] as any;
  }
}