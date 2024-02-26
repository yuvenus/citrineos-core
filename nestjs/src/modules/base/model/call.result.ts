import {OcppResponse} from "./ocpp.response";

/**
 * Definition of CallResult Message (4.2.2 CALLRESULT)
 */
export type CallResult = [
  3,
  messageId: string,
  payload: OcppResponse
];