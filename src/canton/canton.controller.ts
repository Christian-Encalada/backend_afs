// src/canton/canton.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CantonService } from './canton.service';
import { CantonDto } from './dto/canton.dto';
import { Canton } from './canton.entity';

@ApiTags('canton')
@Controller('canton')
export class CantonController {
  constructor(private readonly cantonService: CantonService) {}

  @Post()
  @ApiOperation({ summary: 'Create a canton' })
  @ApiResponse({
    status: 201,
    description: 'The canton has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createCanton(@Body() createCantonDto: CantonDto): Promise<Canton> {
    return this.cantonService.createCanton(createCantonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Cantons by Province' })
  @ApiResponse({
    status: 200,
    description: 'Return all cantons by province.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllCantonsByProvince(
    @Query('provinceId') provinceId: number,
  ): Promise<Canton[]> {
    return this.cantonService.getAllCantonsByProvince(provinceId);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get All Cantons' })
  @ApiResponse({
    status: 200,
    description: 'Return all cantons.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllCantons(): Promise<Canton[]> {
    return this.cantonService.getAllCantons();
  }
}
