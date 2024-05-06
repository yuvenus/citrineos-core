import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { Column, DataType, Index, Model, Table } from 'sequelize-typescript';
import { OcpiNamespace } from './OcpiNamespace';
import { CredentialsRole } from './model/CredentialsRole';

@Table
export class Credentials extends Model {
  static readonly MODEL_NAME: string = OcpiNamespace.Credentials;

  @Index
  @Column(DataType.STRING)
  @MaxLength(64)
  @IsString()
  @IsNotEmpty()
  token!: string;

  @Column(DataType.STRING)
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @Column(DataType.JSON)
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  roles!: CredentialsRole[];
}