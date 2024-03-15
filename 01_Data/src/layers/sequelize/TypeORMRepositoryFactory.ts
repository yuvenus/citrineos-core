import {TypeORMDbProvider} from "./TypeORMDbProvider";
import {BaseRepositoryTypeORM} from "./repository/BaseTypeORM";
import {EntityTarget, ObjectLiteral} from "typeorm";
import {singleton} from "tsyringe";

// interface ModuleConfig {
//   ModuleClass: new (...args: any[]) => BaseModule
//   ModuleApiClass: new (...args: any[]) => AbstractModuleApi<any>
//   configModule: any // todo type?
// }

// interface GenericBaseRepositoryClass<T> { // todo export and reuse
//   new (...args: any[]) => BaseRepositoryTypeORM
// }

type GenericClass<T> = new (...args: any[]) => T

@singleton()
export class TypeORMRepositoryFactory {
  constructor(private readonly typeORMDbProvider: TypeORMDbProvider) {
  }

  public create<T extends ObjectLiteral, R extends BaseRepositoryTypeORM<T>>(Class: GenericClass<R>): R {
    const repo = this.typeORMDbProvider.dataSource.getRepository(((Class as unknown) as EntityTarget<R>))
    return new Class(repo.target, repo.manager, repo.queryRunner);
  }
}
