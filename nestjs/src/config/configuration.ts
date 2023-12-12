import { RegistrationStatusEnumType } from '../modules/common/common.module';

export default () => ({
  env: process.env.ENV_NAME || 'development',
  provisioning: {
    heartbeatInterval: parseInt(process.env.PROVISIONING_HEARTBEAT_INTERVAL) || 60,
    bootRetryInterval: parseInt(process.env.PROVISIONING_BOOT_RETRY_INTERVAL) || 15,
    unknownChargerStatus: process.env.PROVISIONING_UNKNOWN_CHARGER_STATUS || RegistrationStatusEnumType.Accepted,
    getBaseReportOnPending: process.env.PROVISIONING_GET_BASE_REPORT_ON_PENDING || true,
    bootWithRejectedVariables: process.env.PROVISIONING_BOOT_WITH_REJECTED_VARIABLES || true,
    autoAccept: process.env.PROVISIONING_AUTO_ACCEPT || true,
    api: {
      endpointPrefix: process.env.API_ENDPOINT_PREFIX || '/provisioning',
      port: parseInt(process.env.API_PORT) || 8081,
    },
  },
  availability: {
    api: {
      endpointPrefix: '/availability',
      port: 8081,
    },
  },
  authorization: {
    api: {
      endpointPrefix: '/authorization',
      port: 8081,
    },
  },
  transaction: {
    api: {
      endpointPrefix: '/transaction',
      port: 8081,
    },
  },
  monitoring: {
    api: {
      endpointPrefix: '/monitoring',
      port: 8081,
    },
  },
  data: {
    sequelize: {
      host: 'localhost',
      port: 5432,
      database: 'citrine',
      dialect: 'postgres',
      username: 'citrine',
      password: 'citrine',
      storage: '',
      sync: true,
    },
  },
  util: {
    redis: {
      host: 'localhost',
      port: 6379,
    },
    pubsub: {
      topicPrefix: 'ocpp',
      topicName: 'citrineos',
      servicePath: 'path/to/service/file.json',
    },
    amqp: {
      url: 'amqp://guest:guest@localhost:5672',
      exchange: 'citrineos',
    },
  },
  server: {
    logLevel: 3,
    host: 'localhost',
    port: 8081,
    swagger: {
      enabled: true,
      path: '/docs',
      exposeData: true,
      exposeMessage: true,
    },
  },
  websocketServer: {
    tlsFlag: false,
    host: 'localhost',
    port: 8080,
    protocol: 'ocpp2.0.1',
    pingInterval: 60,
    maxCallLengthSeconds: 5,
    maxCachingSeconds: 10,
  },
});
