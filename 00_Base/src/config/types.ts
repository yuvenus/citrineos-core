// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import {z} from "zod";
import {RegistrationStatusEnumType} from "../ocpp/model/enums";
import {EventGroup} from "..";
import {IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, Max, Min} from "class-validator";

enum AppEnv {
	development = "development",
	production = "production"
}

// TODO: Refactor other objects out of system config, such as certificatesModuleInputSchema etc.
class ConfigWebsocketServerInputSchema {
	// TODO: Add support for tenant ids on server level for tenant-specific behavior
	@IsString()
	@IsOptional()
	id: string;

	@IsString()
	@IsOptional()
	host: string = 'localhost';

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 8080;

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	pingInterval = 60;

	@IsString()
	@IsOptional()
	protocol: string = 'ocpp2.0.1';

	@IsNumber()
	@IsOptional()
	@Min(0)
	@Max(3)
	@IsInt()
	securityProfile = 0;

	@IsString()
	@IsOptional()
	tlsKeysFilepath: string;

	@IsString()
	@IsOptional()
	tlsCertificateChainFilepath: string;

	@IsString()
	@IsOptional()
	mtlsCertificateAuthorityRootsFilepath: string;

	@IsString()
	@IsOptional()
	mtlsCertificateAuthorityKeysFilepath: string;
}

class ConfigCentralSystem {
	@IsString()
	@IsOptional()
	host: string = "localhost";

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 8081;
}

class ConfigModulesConfiguration {
	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	heartbeatInterval = 60;

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	bootRetryInterval = 10;

	@IsOptional()
	@IsEnum(RegistrationStatusEnumType)
	unknownChargerStatus = RegistrationStatusEnumType.Accepted; // Unknown chargers have no entry in BootConfig table

	@IsOptional()
	@IsBoolean()
	getBaseReportOnPending = true;

	@IsOptional()
	@IsBoolean()
	bootWithRejectedVariables = true;

	@IsOptional()
	@IsBoolean()
	autoAccept = true; // If false, only data endpoint can update boot status to accepted

	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.Configuration;

	@IsString()
	@IsOptional()
	host: string = "localhost";

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 8081;
}

class ConfigModulesBase {
	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.Configuration;

	@IsString()
	@IsOptional()
	host = "localhost";

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 8081;
}

class ConfigModulesCertificates extends ConfigModulesBase{
	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.Certificates;
}

class ConfigModulesEvDriver extends ConfigModulesBase {
	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.EVDriver;
}

class ConfigModulesMonitoring extends ConfigModulesBase {
	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.Monitoring;
}

class ConfigModulesReporting extends ConfigModulesBase{
	@IsString()
	@IsOptional()
	endpointPrefix: string = EventGroup.Reporting;
}

class ConfigModulesSmartCharging extends ConfigModulesBase {
	@IsString()
	@IsOptional()
	endpointPrefix = EventGroup.SmartCharging;
}

class ConfigModulesTransactions extends ConfigModulesBase{
	@IsString()
	@IsOptional()
	endpointPrefix = EventGroup.Transactions;
}

class ConfigModules {
	configuration = new ConfigModulesConfiguration();
	evdriver = new ConfigModulesEvDriver();
	monitoring = new ConfigModulesMonitoring();
	reporting = new ConfigModulesReporting();
	transactions = new ConfigModulesTransactions();

	@IsOptional()
	smartcharging = new ConfigModulesSmartCharging();

	@IsOptional()
	certificates = new ConfigModulesCertificates();

}

class ConfigDataSequelize {
	@IsString()
	@IsOptional()
	host = 'localhost';

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 5432;

	@IsString()
	@IsOptional()
	database = 'csms';

	@IsOptional()
	dialect: any = 'sqlite';

	@IsString()
	@IsOptional()
	username?: string;

	@IsString()
	@IsOptional()
	password?: string;

	@IsString()
	@IsOptional()
	storage = 'csms.sqlite';

	@IsOptional()
	@IsBoolean()
	sync = false;
}

class ConfigData {
	sequelize = new ConfigDataSequelize()
}

class ConfigUtilCacheRedis {
	@IsString()
	@IsOptional()
	host = 'localhost';

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port = 6379;
}

class ConfigUtilCache {
	@IsOptional()
	@IsBoolean()
	memory?: boolean;

	@IsOptional()
	redis = new ConfigUtilCacheRedis();

	// todo .refine(obj => obj.memory || obj.redis, {
	//  message: 'A cache implementation must be set'
}

export class ConfigUtilMessageBrokerPubSub {
	@IsString()
	@IsOptional()
	topicPrefix = 'ocpp';

	@IsString()
	@IsOptional()
	topicName?: string;

	@IsString()
	@IsOptional()
	servicePath?: string;
}

export class ConfigUtilMessageBrokerKafka {
	@IsString()
	@IsOptional()
	topicPrefix?: string;

	@IsString()
	@IsOptional()
	topicName?: string;

	@IsArray()
	brokers: string[];

	sasl: ConfigUtilMessageBrokerKafkaSasl
}

export class ConfigUtilMessageBrokerKafkaSasl {
	@IsString()
	mechanism: string;

	@IsString()
	username: string;

	@IsString()
	password: string
}

export class ConfigUtilMessageBrokerAmpq {
	@IsString()
	url: string;

	@IsString()
	exchange: string;
}

export class ConfigUtilMessageBroker {
	@IsOptional()
	pubsub = new ConfigUtilMessageBrokerPubSub();

	@IsOptional()
	kafka = new ConfigUtilMessageBrokerKafka();

	@IsOptional()
	amqp = new ConfigUtilMessageBrokerAmpq();

	// todo
	// .refine(obj => obj.pubsub || obj.kafka || obj.amqp, {
	//     message: 'A message broker implementation must be set'
	// })
}

class ConfigUtilSwagger {
	@IsString()
	@IsOptional()
	path = '/docs';

	@IsString()
	logoPath: string;

	@IsOptional()
	@IsBoolean()
	exposeData = true;

	@IsOptional()
	@IsBoolean()
	exposeMessage = true;
}

class ConfigUtilNetworkConnection {
	@IsOptional()
	websocketServers: ConfigWebsocketServerInputSchema[];
}

class ConfigUtil {
	cache: ConfigUtilCache
	messageBroker: ConfigUtilMessageBroker
	networkConnection: ConfigUtilNetworkConnection

	@IsOptional()
	swagger: ConfigUtilSwagger
}

export const websocketServerInputSchema = new ConfigWebsocketServerInputSchema();

class ConfigSystemConfigInputSchema {
	@IsEnum(AppEnv)
	env: AppEnv;

	centralSystem: ConfigCentralSystem
	modules: ConfigModules
	data: ConfigData
	util: ConfigUtil

	@IsNumber()
	@IsOptional()
	@Min(0)
	@Max(6)
	logLevel = 0;

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	maxCallLengthSeconds = 5;

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	maxCachingSeconds = 10;
}

export const systemConfigInputSchema = new ConfigSystemConfigInputSchema();

export type SystemConfigInput = z.infer<typeof systemConfigInputSchema>;

class ConfigWebsocketServerSchema extends ConfigSystemConfigHostPort {
	// TODO: Add support for tenant ids on server level for tenant-specific behavior
	@IsString()
	id: string;

	@IsNumber()
	@IsInt()
	@IsPositive()
	pingInterval: number;

	@IsString()
	protocol: string;

	@IsNumber()
	@Min(0)
	@Max(3)
	@IsInt()
	securityProfile: number;

	@IsString()
	@IsOptional()
	tlsKeysFilepath: string;

	@IsString()
	@IsOptional()
	tlsCertificateChainFilepath: string;

	@IsString()
	@IsOptional()
	mtlsCertificateAuthorityRootsFilepath: string;

	@IsString()
	@IsOptional()
	mtlsCertificateAuthorityKeysFilepath: string;


	// todo
	// .refine(obj => {
	//     switch (obj.securityProfile) {
	//     case 0: // No security
	//     case 1: // Basic Auth
	//     return true;
	//     case 2: // Basic Auth + TLS
	//     return obj.tlsKeysFilepath && obj.tlsCertificateChainFilepath;
	//     case 3: // mTLS
	//     return obj.mtlsCertificateAuthorityRootsFilepath && obj.mtlsCertificateAuthorityKeysFilepath;
	//     default:
	//     return false;
	// }
	// });
}

export const websocketServerSchema = new ConfigWebsocketServerSchema();

class ConfigSystemConfigSchemaModulesConfiguration extends EndpointHostPort {
	@IsNumber()
	@IsInt()
	@IsPositive()
	heartbeatInterval: number;

	@IsNumber()
	@IsInt()
	@IsPositive()
	bootRetryInterval: number;

	@IsEnum(RegistrationStatusEnumType)
	unknownChargerStatus: RegistrationStatusEnumType // Unknown chargers have no entry in BootConfig table

	@IsBoolean()
	getBaseReportOnPending: boolean;

	@IsBoolean()
	bootWithRejectedVariables: boolean;

	@IsBoolean()
	autoAccept: boolean; // If false, only data endpoint can update boot status to accepted
}

class ConfigSystemConfigSchema {
	@IsEnum(AppEnv)
	env: AppEnv
	centralSystem: ConfigSystemConfigHostPort
	modules: ConfigSystemConfigSchemaModules
}

class ConfigSystemConfigSchemaDataSequilize extends ConfigSystemConfigHostPort {

	@IsString()
	database: string;


	dialect: any;

	@IsString()
	username: string;

	@IsString()
	password: string;

	@IsString()
	storage: string;

	@IsBoolean()
	sync: boolean;

}

class ConfigSystemConfigSchemaData {
	sequelize: ConfigSystemConfigSchemaDataSequilize
}

class ConfigSystemConfigSchemaModules {
	evdriver: EndpointHostPort
	configuration: ConfigSystemConfigSchemaModulesConfiguration // Configuration module is required
	monitoring: EndpointHostPort
	reporting: EndpointHostPort
	transactions: EndpointHostPort // Transactions module is required

	@IsOptional()
	smartcharging: EndpointHostPort
	@IsOptional()
	certificates: EndpointHostPort
}

class ConfigSystemConfigHostPort {

	@IsString()
	host: string;

	@IsNumber()
	@IsInt()
	@IsPositive()
	port: number;

}

class EndpointHostPort {

	@IsString()
	endpointPrefix: string;

	@IsString()
	@IsOptional()
	host: string;

	@IsNumber()
	@IsOptional()
	@IsInt()
	@IsPositive()
	port: number;

}

class ConfigSystemConfigSchemaUtilCache {

	@IsOptional()
	@IsBoolean()
	memory: boolean;

	@IsOptional()
	redis: ConfigSystemConfigHostPort;


	// todo
	// .refine(obj => obj.memory || obj.redis, {
	//     message: 'A cache implementation must be set'
	// })
}

class ConfigSystemConfigSchemaUtilMessageBrokerPubSub {

	@IsString()
	topicPrefix: string;

	@IsString()
	@IsOptional()
	topicName: string;

	@IsString()
	@IsOptional()
	servicePath: string;

}

class ConfigSystemConfigSchemaUtilMessageBrokerKafkaSasl {
	@IsString()
	mechanism: string;

	@IsString()
	username: string;

	@IsString()
	password: string
}

class ConfigSystemConfigSchemaUtilMessageBrokerKafka {
	@IsString()
	@IsOptional()
	topicPrefix: string;

	@IsString()
	@IsOptional()
	topicName: string;

	@IsString()
	@IsArray()
	brokers: string[];

	sasl: ConfigSystemConfigSchemaUtilMessageBrokerKafkaSasl
}

class ConfigSystemConfigSchemaUtilMessageBrokerAmqp {

	@IsString()
	url: string;

	@IsString()
	exchange: string;

}

class ConfigSystemConfigSchemaUtilMessageBroker {

	@IsOptional()
	pubsub: ConfigSystemConfigSchemaUtilMessageBrokerPubSub;

	@IsOptional()
	kafka: ConfigSystemConfigSchemaUtilMessageBrokerKafka;

	@IsOptional()
	amqp: ConfigSystemConfigSchemaUtilMessageBrokerAmqp;


	// todo
	// .refine(obj => obj.pubsub || obj.kafka || obj.amqp, {
	//     message: 'A message broker implementation must be set'
	// })
}

class ConfigSystemConfigSchemaUtilSwagger {
	@IsString()
	path: string;

	@IsString()
	logoPath: string;

	@IsBoolean()
	exposeData: boolean;

	@IsBoolean()
	exposeMessage: boolean;
}

export class ConfigSystemConfigSchemaUtilNetworkConnection {
	websocketServers: ConfigWebsocketServerSchema[]

	// todo
	// .refine(array => {
	//     const idsSeen = new Set<string>();
	//     return array.filter(obj => {
	//     if (idsSeen.has(obj.id)) {
	//     return false;
	// } else {
	//     idsSeen.add(obj.id);
	//     return true;
	// }
	// });
	// })
}

class ConfigSystemConfigSchemaUtil {
	cache: ConfigSystemConfigSchemaUtilCache
	messageBroker: ConfigSystemConfigSchemaUtilMessageBroker
	networkConnection: ConfigSystemConfigSchemaUtilNetworkConnection

	@IsOptional()
	swagger: ConfigSystemConfigSchemaUtilSwagger
}

class ConfigSystemConfigSchema {
	modules: ConfigSystemConfigSchemaModules
	data: ConfigSystemConfigSchemaData
	util: ConfigSystemConfigSchemaUtil

	@IsNumber()
	@Min(0)
	@Max(6)
	logLevel: number;

	@IsNumber()
	@IsInt()
	@IsPositive()
	maxCallLengthSeconds: number;

	@IsNumber()
	@IsInt()
	@IsPositive()
	maxCachingSeconds: number

	// todo
	// .refine(obj => obj.maxCachingSeconds >= obj.maxCallLengthSeconds, {
	//     message: 'maxCachingSeconds cannot be less than maxCallLengthSeconds'
	// })
}

export const systemConfigSchema = new ConfigSystemConfigSchema();

export type WebsocketServerConfig = z.infer<typeof websocketServerSchema>;
export type SystemConfig = z.infer<typeof systemConfigSchema>;