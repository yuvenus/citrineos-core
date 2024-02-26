import {Module} from '@nestjs/common';
import {TestController} from "./api/test.controller";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {name: 'APP_SERVICE', transport: Transport.TCP},
    ]),
  ],
  controllers: [
    TestController
  ]
})
export class TransactionModule {
}
