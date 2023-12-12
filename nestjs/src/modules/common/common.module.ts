import { Module } from '@nestjs/common';

export declare const enum RegistrationStatusEnumType {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum CONTROLLER {
  DEVICE = 'Device',
  BOOT = 'Boot',
}

@Module({})
export class CommonModule {}
