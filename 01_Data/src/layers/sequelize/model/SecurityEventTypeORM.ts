// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import {CustomDataType, Namespace, SecurityEventNotificationRequest} from "@citrineos/base";
import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class SecurityEventTypeORM extends BaseEntity implements SecurityEventNotificationRequest {

  static readonly MODEL_NAME: string = Namespace.SecurityEventNotificationRequest;

  customData?: CustomDataType

  /**
   * Fields
   */
  @PrimaryGeneratedColumn()
  stationId: string;

  @Column()
  type: string;

  @Column({
    type: 'datetime',
    // transformer: {
    //     from: (value: Date): string => {
    //        return value.toISOString();
    //     },
    //     to: (value: string): string => {
    //        return value.toISOString();
    //     }
    // } // todo .toISOString(); serialization
  })
  timestamp: Date;

  @Column('varchar', {nullable: true})
  techInfo?: string;
}