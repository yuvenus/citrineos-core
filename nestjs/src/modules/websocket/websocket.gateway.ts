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
import {Logger} from "@nestjs/common";

@WebSocketGateway()
// 8888,
// {
// namespace: 'events',
// transports: ['websocket']
// }
// )
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new Logger(WebsocketGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  @SubscribeMessage("ping")
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: "pong",
      data: "Wrong data that will make the test fail",
    };
  }

  afterInit(server: any): any {
    console.log('WebsocketGateway afterInit', server);
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('WebsocketGateway handleConnection', client, ...args);
  }

  handleDisconnect(client: any): any {
    console.log('WebsocketGateway handleDisconnect', client);
  }

}