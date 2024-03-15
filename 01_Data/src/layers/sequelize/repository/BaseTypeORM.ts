// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import {ICrudRepository} from "@citrineos/base";
import {ObjectLiteral} from "typeorm"
import {Repository} from "typeorm/repository/Repository";
import {injectable} from "tsyringe";
import {EntityTarget} from "typeorm/common/EntityTarget";
import {EntityManager} from "typeorm/entity-manager/EntityManager";
import {QueryRunner} from "typeorm/query-runner/QueryRunner";

// todo: remove entirely w typeorm
@injectable()
export class BaseRepositoryTypeORM<T extends ObjectLiteral> extends Repository<T> implements ICrudRepository<T> {

  create(value: T): Promise<T | undefined> {
    return this.save(value);
  }

  // createByKey(value: T, key: string): Promise<T> {
  //   value.setDataValue("id", key);
  //   return this.save(value);
  // }
  //
  // readByKey(id: string): Promise<T | null> {
  //   return this.findOneBy({
  //     id
  //   });
  // }
  //
  readByQuery(query: T): Promise<T> {
    return this.findOne(query);
  }

  //
  // readAllByQuery(query: T): Promise<Array<T>> {
  //   return this.find(query);
  // }
  //
  // updateByKey(value: T, id: string): Promise<T | undefined> {
  //   return this.save({
  //     id,
  //     ...value
  //   });
  // }
  //
  updateByQuery(value: T, query: T): Promise<T | undefined> {
    return this.readByQuery(query).then(model => {
      const update = {
        ...model,
        ...value
      };
      return this.save(update);
    })
  }

  deleteByKey = async (id: string): Promise<boolean> => {
    await this.remove((({id} as unknown) as T));
    return true;
    // .then(count => count > 0); // todo why count?
  }

  deleteAllByQuery(query: T): Promise<number> {
    return this.remove(query);
  }

  //
  // existsByKey(id: string): Promise<boolean> {
  //   return this.findOne({id})
  //     .then(row => row !== null);
  // }
  //
  existsByQuery(query: T): Promise<boolean> {
    return this.findOne(query)
      .then(row => row !== null);
  }
}