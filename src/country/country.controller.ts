// src/country/country.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CountryDto } from './dto/country.dto';
import { Country } from './country.entity';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'Get all countries.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllCountries(): Promise<Country[]> {
    return this.countryService.findAllCountries();
  }

  @Post()
  @ApiOperation({ summary: 'Create a country' })
  @ApiResponse({
    status: 201,
    description: 'The country has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createCountry(@Body() createCountryDto: CountryDto): Promise<Country> {
    return this.countryService.createCountry(createCountryDto);
  }
}
