import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { CurrentTenantId } from '../../common/decorators/current-user.decorator';

@Controller('knowledge-base')
@UseGuards(JwtAuthGuard, TenantGuard)
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Get('documents')
  async getDocuments(@CurrentTenantId() tenantId: string) {
    return this.kbService.getDocuments(tenantId);
  }

  @Get('documents/:id')
  async getDocument(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.kbService.getDocumentById(tenantId, id);
  }

  @Post('documents')
  async createDocument(
    @CurrentTenantId() tenantId: string,
    @Body()
    body: {
      title: string;
      docType: string;
      rawText: string;
      originalName?: string;
    },
  ) {
    return this.kbService.createDocument(tenantId, body);
  }

  @Delete('documents/:id')
  async deleteDocument(
    @CurrentTenantId() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.kbService.deleteDocument(tenantId, id);
  }
}
