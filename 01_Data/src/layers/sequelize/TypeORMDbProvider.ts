import {singleton} from "tsyringe";
import {DataSource} from "typeorm";
import {inject, SystemConfigService} from "@citrineos/base";
import {SecurityEventTypeORM} from "./model/SecurityEventTypeORM";

@singleton()
export class TypeORMDbProvider {

  dataSource: DataSource;
  constructor(
    @inject(SystemConfigService) configService?: SystemConfigService
  ) {
    this.dataSource = new DataSource({
      type: "postgres", // todo?
      host: configService?.systemConfig.data.sequelize.host,
      port: configService?.systemConfig.data.sequelize.port,
      username: configService?.systemConfig.data.sequelize.username,
      password: configService?.systemConfig.data.sequelize.password,
      database: configService?.systemConfig.data.sequelize.database,
      synchronize: configService?.systemConfig.data.sequelize.sync, // todo?
      logging: true, // todo look into
      entities: [SecurityEventTypeORM],
      subscribers: [], // todo
      migrations: [], // todo
    })
  }

}