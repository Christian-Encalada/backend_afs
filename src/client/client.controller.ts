import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Param,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { GetClientDto } from './dto/getClient.dto';
import { CreateClientDto } from './dto/createClient.dto';
import { UpdateClientDto } from './dto/updateClient.dto';
import { LocalAuthGuard } from '@/auth/auth.guard';

@Controller('clients')
@ApiTags('clients')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(LocalAuthGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of clients' })
  @ApiOperation({ summary: 'Get paginated list of clients' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated clients.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async getClients(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
    @Query('name') name?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
    @Query('document') document?: string,
    @Query('cantonName') cantonName?: string,
    @Query('createdAt') createdAt?: string,
  ): Promise<{ ClientsPaginated: any; total: number }> {
    const tenantId = req.user.tenantId;
    return this.clientService.getClientsPaginated(
      +tenantId,
      page,
      limit,
      name,
      lastName,
      email,
      document,
      cantonName,
      createdAt,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a client' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createClient(
    @Body() createClientDto: CreateClientDto,
    @Request() req,
  ): Promise<GetClientDto> {
    const tenantId = req.user.tenantId;
    return this.clientService.createClient(createClientDto, +tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateClient(
    @Body() updateClientDto: UpdateClientDto,
    @Param('id') id: string,
  ): Promise<GetClientDto> {
    return this.clientService.updateClient(+id, updateClientDto);
  }

  @Patch(':id/delete')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiResponse({
    status: 200,
    description: 'The client has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  async deleteClient(
    @Request() req,
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    const tenantId = req.user.tenantId;
    return this.clientService.deleteClient(+id, +tenantId);
  }
}
