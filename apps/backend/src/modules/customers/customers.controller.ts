import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId, CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('customers')
@UseGuards(JwtAuthGuard, TenantGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  async getCustomers(
    @CurrentTenantId() tenantId: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    return this.customersService.getCustomers(tenantId, { search, tag });
  }

  @Get(':id')
  async getCustomer(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.customersService.getCustomerById(tenantId, id);
  }

  @Post()
  async createCustomer(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.customersService.createCustomer(tenantId, body);
  }

  @Post(':id/notes')
  async addNote(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body('content') content: string,
  ) {
    return this.customersService.addNote(tenantId, id, userId, content);
  }
}
