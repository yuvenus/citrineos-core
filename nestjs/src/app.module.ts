import {DynamicModule, Module, Provider} from '@nestjs/common';
import {AppService} from './app.service';
import configuration from './config/configuration';
import {ConfigModule} from '@nestjs/config';
import {TransactionModule} from './modules/transaction/transaction.module';
import {EventGroup} from "./modules/base/enums/event.group";

@Module({})
export class AppModule {
  static register(eventGroup: EventGroup): DynamicModule {
    // todo type
    const defaultImports: any[] = [
      ConfigModule.forRoot({
        load: [configuration],
      }),
    ];
    const defaultProviders: Provider[] = [AppService];
    const exports = [];
    if ([EventGroup.Transactions, EventGroup.General].includes(eventGroup)) {
      defaultImports.push(TransactionModule);
    }
    return {
      module: AppModule,
      imports: defaultImports,
      controllers: [],
      providers: defaultProviders,
      exports: exports,
    };
  }
}
