import { inject, singleton } from "tsyringe";
import { SystemConfig, SystemConfigInput } from "../types";
import { merge } from "../../util/merge";
import { defineConfig } from "../defineConfig";
import { RegistrationStatusEnumType } from "../../ocpp/model";

const defaultConfig: SystemConfigInput = {
  env: "development",
  centralSystem: {
    host: "0.0.0.0",
    port: 8080,
  },
  modules: {
    certificates: {
      endpointPrefix: "/certificates",
    },
    configuration: {
      heartbeatInterval: 60,
      bootRetryInterval: 15,
      unknownChargerStatus: RegistrationStatusEnumType.Accepted,
      getBaseReportOnPending: true,
      bootWithRejectedVariables: true,
      autoAccept: true,
      endpointPrefix: "/configuration",
    },
    evdriver: {
      endpointPrefix: "/evdriver",
    },
    monitoring: {
      endpointPrefix: "/monitoring",
    },
    reporting: {
      endpointPrefix: "/reporting",
    },
    smartcharging: {
      endpointPrefix: "/smartcharging",
    },
    transactions: {
      endpointPrefix: "/transactions",
    },
  },
  data: {
    sequelize: {
      host: "localhost",
      port: 5432,
      database: "citrine",
      dialect: "postgres",
      username: "citrine",
      password: "citrine",
      storage: "",
      sync: false,
    },
  },
  util: {
    cache: {
      memory: true,
    },
    messageBroker: {
      amqp: {
        url: "amqp://guest:guest@localhost:5672",
        exchange: "citrineos",
      },
    },
    swagger: {
      path: "/docs",
      exposeData: true,
      exposeMessage: true,
      logo: "todo",
    },
    directus: {
      generateFlows: false,
    },
    networkConnection: {
      websocketServers: [
        {
          id: "0",
          securityProfile: 0,
          allowUnknownChargingStations: true,
          pingInterval: 60,
          host: "0.0.0.0",
          port: 8081,
          protocol: "ocpp2.0.1",
        },
        {
          id: "1",
          securityProfile: 1,
          allowUnknownChargingStations: false,
          pingInterval: 60,
          host: "0.0.0.0",
          port: 8082,
          protocol: "ocpp2.0.1",
        },
      ],
    },
  },
  logLevel: 2, // debug
  maxCallLengthSeconds: 5,
  maxCachingSeconds: 10,
};

@singleton()
export class SystemConfigService {
  systemConfig: SystemConfig;

  constructor(
    @inject("SystemConfigInput")
    private readonly inputConfig?: SystemConfigInput
  ) {
    const config = merge<SystemConfigInput>(
      defaultConfig,
      inputConfig as SystemConfigInput
    );
    this.systemConfig = defineConfig(config);
  }
}