// src/province/province.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProvinceService } from './province.service';
import { ProvinceDto } from './dto/province.dto';
import { Province } from './province.entity';

@ApiTags('province')
@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a province' })
  @ApiResponse({
    status: 201,
    description: 'The province has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createProvince(
    @Body() createProvinceDto: ProvinceDto,
  ): Promise<Province> {
    return this.provinceService.createProvince(createProvinceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Provinces by Country' })
  @ApiResponse({
    status: 200,
    description: 'Return all provinces by country.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllProvinces(
    @Query('countryId') countryId: number,
  ): Promise<Province[]> {
    return this.provinceService.getAllProvincesByCountry(countryId);
  }
}
