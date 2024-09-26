import {
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '@/tenant/tenant.entity';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { SiteGetDto } from './dto/siteGet.dto';
import { Site } from './site.entity';
import { SiteGetFilterDto } from './dto/siteGetFilter.dto';
import { SiteDto } from './dto/site.dto';
import { SiteUpdateDto } from './dto/siteUpdate.dto';
import { UploadSiteService } from '@/upload/uploadSite.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SiteService {
  private readonly logger = new Logger(SiteService.name);
  private readonly logoEndpoint = '/upload/get-logo/';

  private readonly nameNotAllowed: string[] = [
    'raiz',
    'root',
    'afifsystems',
    'afif',
    'systems',
    'admin',
  ];

  constructor(
    @InjectRepository(Site)
    private readonly siteRepository: Repository<Site>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @Inject(forwardRef(() => UploadSiteService))
    private readonly uploadSiteService: UploadSiteService,
    // Languaje Service
    private readonly i18n: I18nService,
  ) {}

  // Find sites with filter
  async findAllFilter(siteFilterDto: SiteGetFilterDto): Promise<any> {
    const lang = I18nContext.current().lang;

    this.logger.log(
      await this.i18n.t('messages.site.fetching_all_sites', { lang }),
    );

    const { name, createdAt, status, page = 1, limit = 10 } = siteFilterDto;

    const query = this.siteRepository.createQueryBuilder('site');

    if (name) {
      query.andWhere('site.name ILIKE :name', { name: `%${name}%` });
    }

    if (createdAt) {
      query.andWhere('DATE(site.createdAt) = :createdAt', { createdAt });
    }

    if (status !== undefined) {
      query.andWhere('site.status = :status', { status });
    }

    // Order by createdAt in descending order
    query.orderBy('site.createdAt', 'DESC');

    query.skip((page - 1) * limit).take(limit);

    try {
      const [sites, totalCount] = await query.getManyAndCount();

      this.logger.log(
        await this.i18n.t('messages.site.fetched_sites', {
          args: { count: totalCount },
          lang,
        }),
      );

      const totalPages = Math.ceil(totalCount / limit);

      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

      const sitesWithLogoUrl = sites.map((site) => ({
        ...site,
        logo: site.logo ? `${baseUrl}${this.logoEndpoint}${site.logo}` : null,
      }));

      const sitePaginated: any = {
        data: sitesWithLogoUrl,
        totalCount,
        sitePerPage: sites.length,
        totalPages,
      };

      return {
        SitePaginated: sitePaginated,
        totalCount,
      };
    } catch (error) {
      this.logger.error(
        await this.i18n.t('errors.site.error_fetching_sites', { lang }),
        error.stack,
      );

      const errorMessage = await this.i18n.t(
        'errors.site.error_fetching_sites',
        { lang },
      );
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Find By Id the Site
  async findOneById(id: number): Promise<SiteGetDto> {
    const lang = I18nContext.current().lang;
    this.logger.log(
      await this.i18n.t('messages.quote.fetching_quote', {
        args: { id },
        lang,
      }),
    );
    const site = await this.siteRepository.findOne({
      where: { id },
    });

    if (!site) {
      this.logger.error(
        await this.i18n.t('errors.site.site_not_found', {
          args: { id },
          lang,
        }),
      );
      const errorMessage = await this.i18n.t('errors.site.site_not_found', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    return site;
  }

  // Create Site
  async createSite(siteDto?: SiteDto): Promise<Site> {
    const lang = I18nContext.current().lang;

    const {
      name,
      description,
      primaryColor,
      secondaryColor,
      status,
      logo,
      template,
    } = siteDto;

    // Check the name of the site
    if (this.nameNotAllowed.includes(name.toLocaleLowerCase())) {
      const errorMessage = await this.i18n.t('errors.site.invalid_name', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    // Check if a site with the same name already exists
    const existingNameSite = await this.siteRepository.findOne({
      where: { name },
    });
    if (existingNameSite) {
      const errorMessage = await this.i18n.t('messages.site.name_site_exists', {
        lang,
      });
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    // Create tenant with the same name as the site
    let tenant: any;
    try {
      // Check if the tenant already exists
      const existingTenant = await this.tenantRepository.findOne({
        where: { name },
      });
      if (existingTenant) {
        tenant = existingTenant;
      } else {
        tenant = this.tenantRepository.create({ name });
        tenant = await this.tenantRepository.save(tenant);
      }
    } catch (error) {
      this.logger.error(
        await this.i18n.t('errors.tenant.tenant_creation_error', { lang }),
        error.stack,
      );

      const errorMessage = await this.i18n.t(
        'errors.tenant.tenant_creation_error',
        { lang },
      );
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let newSite: Site;

    try {
      newSite = this.siteRepository.create({
        name,
        description,
        primaryColor,
        secondaryColor,
        tenant,
        status,
        template,
      });

      if (logo) {
        const filename = await this.uploadSiteService.saveSiteLogo(logo);
        newSite.logo = filename;
      }

      newSite = await this.siteRepository.save(newSite);

      this.logger.log(
        await this.i18n.t('messages.site.site_created', { lang }),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Error when the name site already exists
      if (error.code === '23505') {
        const errorMessage = await this.i18n.t(
          'messages.site.name_site_exists',
          { lang },
        );
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      this.logger.error(
        await this.i18n.t('errors.site.site_creation_error', { lang }),
        error.stack,
      );

      const errorMessage = await this.i18n.t(
        'errors.site.site_creation_error',
        { lang },
      );
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return newSite;
  }

  // Update a Site
  async updateSite(id: number, siteUpdateDto: SiteUpdateDto): Promise<Site> {
    const lang = I18nContext.current().lang;
    const { description, primaryColor, secondaryColor, logo, template } =
      siteUpdateDto;

    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!site) {
      const errorMessage = await this.i18n.t('errors.site.site_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: ID ${id}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    site.description = description;
    site.primaryColor = primaryColor;
    site.secondaryColor = secondaryColor;
    site.template = template;

    if (logo) {
      const filename = await this.uploadSiteService.updateSiteLogo(
        site.id,
        logo,
      );
      site.logo = filename;
    }

    try {
      await this.siteRepository.save(site);
    } catch (error) {
      const errorMessage = await this.i18n.t('errors.site.site_update_error', {
        lang,
      });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return site;
  }

  // Change State of a Site
  async changeState(id: number, siteUpdateDto: SiteUpdateDto): Promise<Site> {
    const lang = I18nContext.current().lang;
    const { status } = siteUpdateDto;

    const site = await this.siteRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });

    if (!site) {
      const errorMessage = await this.i18n.t('errors.site.site_not_found', {
        lang,
      });
      this.logger.error(`${errorMessage}: ID ${id}`);
      throw new HttpException(errorMessage, HttpStatus.NOT_FOUND);
    }

    if (site.status === status) {
      const errorMessage = await this.i18n.t('messages.site.site_same_state', {
        lang,
      });
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    if (status === undefined) {
      const errorMessage = await this.i18n.t('messages.site.enter_state_site', {
        lang,
      });
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }

    site.status = status;

    try {
      await this.siteRepository.save(site);
    } catch (error) {
      const errorMessage = await this.i18n.t('errors.site.site_update_error', {
        lang,
      });
      this.logger.error(errorMessage, error.stack);
      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return site;
  }
}
