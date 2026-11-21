import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('team')
  async getTeam(@CurrentTenantId() tenantId: string) {
    return this.usersService.getTeamMembers(tenantId);
  }

  @Post('team/invite')
  async invite(
    @CurrentTenantId() tenantId: string,
    @Body() body: any,
  ) {
    return this.usersService.inviteMember(tenantId, body);
  }

  @Patch('team/:id')
  async updateRole(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.usersService.updateMemberRole(tenantId, id, body);
  }

  @Delete('team/:id')
  async remove(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.removeMember(tenantId, id);
  }
}
