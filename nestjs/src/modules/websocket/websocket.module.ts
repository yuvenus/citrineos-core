import {Module} from '@nestjs/common';
import {WebsocketGateway} from './websocket.gateway';
import {CacheModule} from '@nestjs/cache-manager';
import {LoggerModule} from "../logger/logger.module";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {BaseModule} from "../base/base.module";

@Module({
  imports: [
    BaseModule,
    LoggerModule,
    CacheModule.register(),
    // CacheModule.register<RedisClientOptions>({ // todo get redis cache manager to work
    //   store: redisStore,
    //
    //   // Store-specific configuration:
    //   host: 'localhost',
    //   port: 6379,
    // }),
    ClientsModule.register([
      {
        name: 'APP_SERVICE',
        transport: Transport.TCP
      },
    ]),
  ],
  providers: [WebsocketGateway]
})
export class WebsocketModule {
}
