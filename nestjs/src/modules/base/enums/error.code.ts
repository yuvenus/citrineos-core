/**
 * Error codes for CallError message (4.3 RPC Framework Error Codes)
 *
 */
export enum ErrorCode {
  FormatViolation = 'FormatViolation', // Payload for Action is syntactically incorrect
  NotImplemented = 'NotImplemented', // Requested Action is not known by receiver
  ProtocolError = 'ProtocolError', // Payload for Action is not conform the PDU structure
  GenericError = 'GenericError', // Any other error not covered by the more specific error codes in this table
  InternalError = 'InternalError', // An internal error occurred and the receiver was not able to process the requested Action successfully
  MessageTypeNotSupported = 'MessageTypeNotSupported', // A message with an Message Type Number received that is not supported by this implementation.
  NotSupported = 'NotSupported', // Requested Action is recognized but not supported by the receiver
  OccurrenceConstraintViolation = 'OccurrenceConstraintViolation', // Payload for Action is syntactically correct but at least one of the fields violates occurrence constraints
  PropertyConstraintViolation = 'PropertyConstraintViolation', // Payload is syntactically correct but at least one field contains an invalid value
  RpcFrameworkError = 'RpcFrameworkError', // Content of the call is not a valid RPC Request, for example: MessageId could not be read.
  SecurityError = 'SecurityError', // During the processing of Action a security issue occurred preventing receiver from completing the Action successfully
  TypeConstraintViolation = 'TypeConstraintViolation', // Payload for Action is syntactically correct but at least one of the fields violates data type constraints (e.g. 'somestring': 12)
}