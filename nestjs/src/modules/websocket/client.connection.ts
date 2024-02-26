/**
 * Implementation of the client connection
 */
export class ClientConnection {

  identifier: string;
  sessionIndex: string;
  ip: string;
  port: number;
  isAlive = false;

  constructor(identifier: string, sessionIndex: string, ip: string, port: number) {
    this.identifier = identifier;
    this.sessionIndex = sessionIndex;
    this.ip = ip;
    this.port = port;
  }

  public getConnectionUrl(): string {
    return `ws://${this.ip}:${this.port}/${this.identifier}`;
  }
}