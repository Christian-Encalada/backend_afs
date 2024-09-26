import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParishService } from './parish.service';
import { ParishDto } from './dto/parish.dto';
import { Parish } from './parish.entity';

@ApiTags('parish')
@Controller('parish')
export class ParishController {
  constructor(private readonly parishService: ParishService) {}

  @Post()
  @ApiOperation({ summary: 'Create a parish' })
  @ApiResponse({
    status: 201,
    description: 'The parish has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createParish(@Body() createParishDto: ParishDto): Promise<Parish> {
    return this.parishService.createParish(createParishDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Parishes by Canton' })
  @ApiResponse({
    status: 200,
    description: 'Return all parishes by canton.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getAllParishesByCanton(
    @Query('cantonId') cantonId: number,
  ): Promise<Parish[]> {
    return this.parishService.getAllParishesByCanton(cantonId);
  }
}
