import { Module } from '@nestjs/common';
import { DeviceController } from './controllers/device.controller';
import { BootController } from './controllers/boot.controller';

@Module({
  controllers: [DeviceController, BootController],
})
export class ProvisioningModule {}
