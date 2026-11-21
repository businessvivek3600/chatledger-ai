import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId, CurrentUser } from '../../common/decorators/current-user.decorator';
import { ConversationStatus, HandlingMode, MessageType } from '@nexaflow/shared-types';

@Controller('conversations')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getConversations(
    @CurrentTenantId() tenantId: string,
    @Query('status') status?: string,
    @Query('mode') mode?: string,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('search') search?: string,
  ) {
    return this.conversationsService.getConversations(tenantId, {
      status,
      mode,
      assignedUserId,
      search,
    });
  }

  @Get(':id')
  async getConversation(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.conversationsService.getConversationById(tenantId, id);
  }

  @Post(':id/messages')
  async sendMessage(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
    @Body()
    body: {
      content: string;
      messageType?: MessageType;
      mediaUrl?: string;
      isInternalNote?: boolean;
    },
  ) {
    return this.conversationsService.sendMessage(tenantId, id, userId, body);
  }

  @Patch(':id/assign')
  async assign(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('assignedUserId') assignedUserId: string,
  ) {
    return this.conversationsService.assignConversation(tenantId, id, assignedUserId);
  }

  @Patch(':id/mode')
  async updateMode(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('mode') mode: HandlingMode,
  ) {
    return this.conversationsService.updateHandlingMode(tenantId, id, mode);
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
    @Body('status') status: ConversationStatus,
  ) {
    return this.conversationsService.updateStatus(tenantId, id, status);
  }
}
