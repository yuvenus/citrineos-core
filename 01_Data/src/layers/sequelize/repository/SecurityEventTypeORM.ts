import {SecurityEventNotificationRequest} from "@citrineos/base";
import {Op} from "sequelize";
import {ISecurityEventRepository} from "../../../interfaces/repositories";
import {BaseRepositoryTypeORM} from "./BaseTypeORM";
import {SecurityEventTypeORM} from "../model/SecurityEventTypeORM";
import {DependencyContainer, injectable, registry} from "tsyringe";
import {TypeORMRepositoryFactory} from "../TypeORMRepositoryFactory";

@injectable()
@registry([
  {
    token: SecurityEventRepositoryTypeORM,
    useFactory: (dependencyContainer: DependencyContainer) => {
      const typeORMRepositoryFactory = dependencyContainer.resolve(TypeORMRepositoryFactory);
      typeORMRepositoryFactory.create(SecurityEventRepositoryTypeORM)
    },
  }
])
export class SecurityEventRepositoryTypeORM extends BaseRepositoryTypeORM<SecurityEventTypeORM> implements ISecurityEventRepository {

  async createByStationId(input: SecurityEventNotificationRequest, stationId: string): Promise<SecurityEventTypeORM | undefined> {
    const create = SecurityEventTypeORM.create(input);
    const merge = SecurityEventTypeORM.merge(create, {
      stationId
    })
    return await this.create(merge);
  }

  readByStationIdAndTimestamps(stationId: string, from?: Date, to?: Date): Promise<SecurityEventTypeORM[]> {
    const timestampQuery = this.generateTimestampQuery(from?.toISOString(), to?.toISOString());
    return this.find({
      where: {
        stationId: stationId,
        ...timestampQuery
      }
    });
  }

  // deleteByKey(key: string): Promise<boolean> {
  //   return super.deleteByKey(key, SecurityEvent.MODEL_NAME);
  // }

  /**
   * Private Methods
   */
  private generateTimestampQuery(from?: string, to?: string): any {
    if (!from && !to) {
      return {};
    }
    if (!from && to) {
      return {timestamp: {[Op.lte]: to}};
    }
    if (from && !to) {
      return {timestamp: {[Op.gte]: from}};
    }
    return {timestamp: {[Op.between]: [from, to]}};
  }

}