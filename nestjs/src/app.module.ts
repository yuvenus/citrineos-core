import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { ProvisioningModule } from './provisioning/provisioning.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ProvisioningModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
