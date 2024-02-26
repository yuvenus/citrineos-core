/**
 * Number identifying the different types of OCPP messages.
 */
export enum MessageType {
  // Call identifies a request.
  Call = 2,
  // CallResult identifies a successful response.
  CallResult = 3,
  // CallError identifies an erroneous response.
  CallError = 4,
}