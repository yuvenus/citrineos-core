import {
  AbstractModuleApi,
  AsDataEndpoint,
  AuthorizationSecurityList,
  Credentials,
  getOcpiTagString,
  HttpMethod,
  Namespace,
  OcpiResponse,
  OcpiTag,
  SystemConfig,
} from '@citrineos/base';
import { OcpiModule } from './module';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { ILogObj, Logger } from 'tslog';
import { AuthorizationHeaderSchema } from './schema/authorization.header.schema';
import { CredentialsService } from './service/credentials.service';
import { CredentialsRepository } from './repository/credentials.repository';
import { VersionRepository } from './repository/version.repository';
import { VersionIdParam } from './schema/version.id.param.schema';
import { targetConstructorToSchema } from 'class-validator-jsonschema';

export class CredentialsModuleApi extends AbstractModuleApi<OcpiModule> {
  private credentialsService: CredentialsService;

  constructor(
    config: SystemConfig,
    module: OcpiModule,
    server: FastifyInstance,
    logger?: Logger<ILogObj>,
    credentialsRepository?: CredentialsRepository,
    versionRepository?: VersionRepository,
  ) {
    super(module, server, logger);

    const finalCredentialsRepository =
      credentialsRepository || new CredentialsRepository(config, this._logger);

    const finalVersionRepository =
      versionRepository || new VersionRepository(config, this._logger);

    this.credentialsService = new CredentialsService(
      this._logger,
      finalCredentialsRepository,
      finalVersionRepository,
    );
  }

  @AsDataEndpoint(
    '/ocpi/:versionId/credentials',
    HttpMethod.Get,
    undefined,
    undefined,
    targetConstructorToSchema(VersionIdParam),
    targetConstructorToSchema(AuthorizationHeaderSchema),
    targetConstructorToSchema(OcpiResponse<Credentials>),
    getOcpiTagString(OcpiTag.Credentials),
    AuthorizationSecurityList,
  )
  async getCredentials(
    request: FastifyRequest<{
      Params: VersionIdParam;
      Headers: AuthorizationHeaderSchema;
    }>,
  ): Promise<OcpiResponse<Credentials>> {
    return this.credentialsService?.getCredentials(request);
  }

  @AsDataEndpoint(
    '/ocpi/:versionId/credentials',
    HttpMethod.Post,
    undefined,
    targetConstructorToSchema(Credentials),
    targetConstructorToSchema(VersionIdParam),
    targetConstructorToSchema(AuthorizationHeaderSchema),
    targetConstructorToSchema(OcpiResponse<Credentials>),
    getOcpiTagString(OcpiTag.Credentials),
    AuthorizationSecurityList,
  )
  async postCredentials(
    request: FastifyRequest<{
      Params: VersionIdParam;
      Headers: AuthorizationHeaderSchema;
      Body: Credentials;
    }>,
  ): Promise<OcpiResponse<Credentials>> {
    return this.credentialsService?.postCredentials(request);
  }

  @AsDataEndpoint(
    '/ocpi/:versionId/credentials',
    HttpMethod.Put,
    undefined,
    targetConstructorToSchema(Credentials),
    targetConstructorToSchema(VersionIdParam),
    targetConstructorToSchema(AuthorizationHeaderSchema),
    targetConstructorToSchema(OcpiResponse<Credentials>),
    getOcpiTagString(OcpiTag.Credentials),
    AuthorizationSecurityList,
  )
  async putCredentials(
    request: FastifyRequest<{
      Params: VersionIdParam;
      Headers: AuthorizationHeaderSchema;
      Body: Credentials;
    }>,
  ): Promise<OcpiResponse<Credentials>> {
    return this.credentialsService?.putCredentials(request);
  }

  @AsDataEndpoint(
    '/ocpi/:versionId/credentials',
    HttpMethod.Delete,
    undefined,
    undefined,
    targetConstructorToSchema(VersionIdParam),
    targetConstructorToSchema(AuthorizationHeaderSchema),
    targetConstructorToSchema(OcpiResponse<void>),
    getOcpiTagString(OcpiTag.Credentials),
    AuthorizationSecurityList,
  )
  async deleteCredentials(
    request: FastifyRequest<{
      Params: VersionIdParam;
      Headers: AuthorizationHeaderSchema;
    }>,
  ): Promise<OcpiResponse<void>> {
    return this.credentialsService?.deleteCredentials(request);
  }

  /**
   * Overrides superclass method to generate the URL path based on the input {@link Namespace} and the module's endpoint prefix configuration.
   *
   * @param {CallAction} input - The input {@link Namespace}.
   * @return {string} - The generated URL path.
   */
  protected _toDataPath(input: Namespace | string): string {
    return super._toDataPath(input, 'credentials');
  }
}