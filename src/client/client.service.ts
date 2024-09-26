import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { Client } from './client.entity';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { Country } from '@/country/country.entity';
import { Province } from '@/province/province.entity';
import { Canton } from '@/canton/canton.entity';
import { Parish } from '@/parish/parish.entity';
import { UpdateClientDto } from './dto/updateClient.dto';
import { CreateClientDto } from './dto/createClient.dto';
import { GetClientDto } from './dto/getClient.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(Parish)
    private readonly parishRepository: Repository<Parish>,
    private readonly i18n: I18nService,
  ) {}

  private async findEntityOrThrow<T>(
    repository: Repository<T>,
    id: number | undefined,
    name: string,
  ): Promise<T> {
    const entity = await repository.findOne({ where: { id } as any });
    if (!entity) {
      throw await this.createHttpException(`errors.${name}.${name}_not_found`, {
        [`${name}Id`]: id,
      });
    }
    return entity;
  }

  private async createHttpException(
    messageKey: string,
    args: Record<string, any>,
    status: HttpStatus = HttpStatus.NOT_FOUND,
  ): Promise<HttpException> {
    const errorMsg = await this.i18n.translate(messageKey, {
      args,
      lang: I18nContext.current().lang,
    });
    this.logger.error(errorMsg);
    return new HttpException(errorMsg, status);
  }

  async getAllClients(): Promise<GetClientDto[]> {
    const clients = await this.clientRepository.find({
      relations: ['tenant', 'country', 'province', 'canton', 'parish'],
    });

    return clients.map((client) =>
      plainToInstance(GetClientDto, client, { excludeExtraneousValues: true }),
    );
  }

  async getClientsPaginated(
    tenantId: number,
    page: number,
    limit: number,
    name?: string,
    lastName?: string,
    email?: string,
    document?: string,
    cantonName?: string,
    createdAt?: string,
  ): Promise<{ ClientsPaginated: any; total: number }> {
    if (page < 1 || limit < 1) {
      const errorMessage = await this.i18n.translate(
        'errors.client.client_invalid_pagination_params',
        {
          lang: I18nContext.current().lang,
        },
      );
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    try {
      const fetchingMessage = await this.i18n.translate(
        'messages.client.fetching_all_clients',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(fetchingMessage);

      const queryBuilder = this.clientRepository.createQueryBuilder('client');

      queryBuilder
        .leftJoinAndSelect('client.tenant', 'tenant')
        .leftJoinAndSelect('client.country', 'country')
        .leftJoinAndSelect('client.province', 'province')
        .leftJoinAndSelect('client.canton', 'canton')
        .leftJoinAndSelect('client.parish', 'parish');

      queryBuilder
        .where('client.tenant.id = :tenantId', { tenantId })
        .andWhere('client.deleted = :deleted', { deleted: false });

      if (name) {
        queryBuilder.andWhere('LOWER(client.name) LIKE LOWER(:name)', {
          name: `%${name}%`,
        });
      }

      if (lastName) {
        queryBuilder.andWhere('LOWER(client.lastName) LIKE LOWER(:lastName)', {
          lastName: `%${lastName}%`,
        });
      }

      if (email) {
        queryBuilder.andWhere('LOWER(client.email) LIKE LOWER(:email)', {
          email: `%${email}%`,
        });
      }

      if (document) {
        queryBuilder.andWhere('client.document LIKE :document', {
          document: `%${document}%`,
        });
      }

      if (cantonName) {
        queryBuilder.andWhere('LOWER(canton.name) = LOWER(:cantonName)', {
          cantonName,
        });
      }

      if (createdAt) {
        queryBuilder.andWhere('DATE(client.createdAt) = :createdAt', {
          createdAt,
        });
      }

      const filteredTotal = await queryBuilder.getCount();

      queryBuilder.skip((page - 1) * limit).take(limit);

      const clients = await queryBuilder.getMany();

      const clientDtos = clients.map((client) =>
        plainToInstance(GetClientDto, client, {
          excludeExtraneousValues: true,
        }),
      );

      const fetchedMessage = await this.i18n.translate(
        'messages.client.fetched_clients',
        {
          args: { count: clientDtos.length },
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(fetchedMessage);

      const totalPages = Math.ceil(filteredTotal / limit);

      const clientsPaginated: any = {
        data: clientDtos,
        filteredTotal,
        clientsPerPage: clientDtos.length,
        totalPages,
      };

      return {
        ClientsPaginated: clientsPaginated,
        total: await this.clientRepository.count(),
      };
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.client.client_failed_to_retrieve_clients',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createClient(
    createClientDto: CreateClientDto,
    tenantId: number,
  ): Promise<GetClientDto> {
    const {
      name,
      lastName,
      email,
      document,
      phone,
      direction,
      provinceId,
      cantonId,
      parishId,
      countryId,
    } = createClientDto;

    const existingClient = await this.clientRepository.findOne({
      where: [
        { tenant: { id: tenantId }, document, deleted: false },
        { tenant: { id: tenantId }, email, deleted: false },
      ],
    });

    if (existingClient) {
      throw await this.createHttpException(
        'errors.client.client_already_exists',
        {
          data: existingClient.document === document ? document : email,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const newClient = this.clientRepository.create({
      name,
      lastName,
      email,
      document,
      phone,
      direction,
      province: provinceId
        ? await this.findEntityOrThrow(
            this.provinceRepository,
            provinceId,
            'province',
          )
        : null,
      canton: cantonId
        ? await this.findEntityOrThrow(
            this.cantonRepository,
            cantonId,
            'canton',
          )
        : null,
      parish: parishId
        ? await this.findEntityOrThrow(
            this.parishRepository,
            parishId,
            'parish',
          )
        : null,
      country: countryId
        ? await this.findEntityOrThrow(
            this.countryRepository,
            countryId,
            'country',
          )
        : await this.findEntityOrThrow(this.countryRepository, 1, 'country'),
      tenant: tenantId
        ? await this.findEntityOrThrow(
            this.tenantRepository,
            tenantId,
            'tenant',
          )
        : null,
    });

    try {
      const createdClient = await this.clientRepository.save(newClient);

      const getClientDto = plainToInstance(GetClientDto, createdClient, {
        excludeExtraneousValues: true,
      });

      const successMsg = await this.i18n.translate(
        'messages.client.client_created',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMsg);

      return getClientDto;
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail;
        const regex = /\(([^)]+)\)=\(([^)]+)\)/;
        const match = detail.match(regex);
        const value = match[2].split(',')[1];
        throw await this.createHttpException(
          'errors.client.client_data_unique_error',
          {
            data: value,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const errorMessage = await this.i18n.translate(
        'errors.client.client_creation_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateClient(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<GetClientDto> {
    const client = await this.clientRepository.findOne({
      where: { id },
      relations: ['tenant', 'country', 'province', 'canton', 'parish'],
    });

    if (!client) {
      throw await this.createHttpException('errors.client.client_not_found', {
        clientId: id,
      });
    }

    if (Object.keys(updateClientDto).length === 0) {
      throw await this.createHttpException(
        'errors.client.client_update_data_required',
        {
          clientId: id,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (updateClientDto.document || updateClientDto.email) {
      const existingClient = await this.clientRepository.findOne({
        where: [
          {
            tenant: { id: client.tenant.id },
            document: updateClientDto.document,
            deleted: false,
            id: Not(id),
          },
          {
            tenant: { id: client.tenant.id },
            email: updateClientDto.email,
            deleted: false,
            id: Not(id),
          },
        ],
      });

      if (existingClient) {
        throw await this.createHttpException(
          'errors.client.client_already_exists',
          {
            data:
              existingClient.document === updateClientDto.document
                ? updateClientDto.document
                : updateClientDto.email,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    Object.assign(client, updateClientDto);

    const relationsToFetch = [
      { id: 'tenantId', repo: this.tenantRepository, name: 'tenant' },
      { id: 'countryId', repo: this.countryRepository, name: 'country' },
      { id: 'provinceId', repo: this.provinceRepository, name: 'province' },
      { id: 'cantonId', repo: this.cantonRepository, name: 'canton' },
      { id: 'parishId', repo: this.parishRepository, name: 'parish' },
    ];

    for (const { id, repo, name } of relationsToFetch) {
      if (updateClientDto[id] !== undefined) {
        client[name] = await this.findEntityOrThrow(
          repo as any,
          updateClientDto[id],
          name,
        );
      }
    }

    try {
      const updatedClient = await this.clientRepository.save(client);

      const getClientDto = plainToInstance(GetClientDto, updatedClient, {
        excludeExtraneousValues: true,
      });

      const successMsg = await this.i18n.translate(
        'messages.client.client_updated',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMsg);

      return getClientDto;
    } catch (error) {
      if (error.code === '23505') {
        const detail = error.detail;
        const regex = /\(([^)]+)\)=\(([^)]+)\)/;
        const match = detail.match(regex);
        const value = match[2].split(',')[1];
        throw await this.createHttpException(
          'errors.client.client_data_unique_error',
          {
            data: value,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const errorMessage = await this.i18n.translate(
        'errors.client.client_update_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteClient(
    id: number,
    tenantId: number,
  ): Promise<{ message: string }> {
    const client = await this.clientRepository.findOne({
      where: { id, tenant: { id: tenantId } },
    });

    if (!client) {
      throw await this.createHttpException('errors.client.client_not_found', {
        clientId: id,
      });
    }

    try {
      client.deleted = true;
      await this.clientRepository.save(client);

      const successMsg = await this.i18n.translate(
        'messages.client.client_deleted',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.log(successMsg);

      return { message: successMsg };
    } catch (error) {
      const errorMessage = await this.i18n.translate(
        'errors.client.client_delete_error',
        {
          lang: I18nContext.current().lang,
        },
      );
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
