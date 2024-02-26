import {ErrorCode} from "../enums/error.code";

/**
 * Definition of CallError Message (4.2.1 CALLERROR)
 */
export type CallError = [
  messageTypeId: 4,
  messageId: string,
  errorCode: ErrorCode,
  errorDescription: string,
  errorDetails: object,
];
