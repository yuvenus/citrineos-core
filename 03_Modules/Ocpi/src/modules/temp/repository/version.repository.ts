// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import { SequelizeRepository } from '@citrineos/data/dist/layers/sequelize/repository/Base';
import { Version } from '../../../model/Version';

export class VersionRepository extends SequelizeRepository<Version> {}
