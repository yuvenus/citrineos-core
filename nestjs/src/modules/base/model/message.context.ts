export class MessageContext {
  correlationId: string;
  tenantId: string;
  stationId: string;

  constructor(
    correlationId: string,
    tenantId: string,
    stationId: string
  ) {
    this.correlationId = correlationId;
    this.tenantId = tenantId;
    this.stationId = stationId;
  }
}