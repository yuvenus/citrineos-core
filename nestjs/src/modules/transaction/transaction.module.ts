import {Module} from '@nestjs/common';
import {TestController} from "./api/test.controller";

@Module({
  controllers: [
    TestController
  ]
})
export class TransactionModule {
}
