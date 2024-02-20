import {DynamicModule, Module, Provider} from '@nestjs/common';
import configuration from './config/configuration';
import {ConfigModule} from '@nestjs/config';
import {TransactionModule} from './modules/transaction/transaction.module';
import {EventGroup} from "./modules/base/enums/event.group";
import {MonitoringModule} from './modules/monitoring/monitoring.module';
import {WebsocketModule} from './modules/websocket/websocket.module';

@Module({})
export class AppModule {
  static register(eventGroup: EventGroup): DynamicModule {
    // todo type
    const defaultImports: any[] = [
      ConfigModule.forRoot({
        load: [configuration],
      }),
      WebsocketModule
    ];
    const defaultProviders: Provider[] = [];
    const exports = [];
    if ([EventGroup.Transactions, EventGroup.General].includes(eventGroup)) {
      defaultImports.push(TransactionModule);
    }
    if ([EventGroup.Monitoring, EventGroup.General].includes(eventGroup)) {
      defaultImports.push(MonitoringModule);
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
