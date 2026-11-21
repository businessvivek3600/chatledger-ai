import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  async getDocuments(tenantId: string) {
    return this.prisma.knowledgeDocument.findMany({
      where: { tenantId },
      include: {
        _count: { select: { chunks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(tenantId: string, id: string) {
    const doc = await this.prisma.knowledgeDocument.findFirst({
      where: { id, tenantId },
      include: { chunks: true },
    });

    if (!doc) {
      throw new NotFoundException('Knowledge document not found');
    }

    return doc;
  }

  async createDocument(
    tenantId: string,
    dto: {
      title: string;
      docType: string;
      rawText: string;
      originalName?: string;
    },
  ) {
    // 1. Create Knowledge Document
    const doc = await this.prisma.knowledgeDocument.create({
      data: {
        tenantId,
        title: dto.title,
        docType: dto.docType || 'FAQ',
        rawText: dto.rawText,
        originalName: dto.originalName,
        status: 'INDEXED',
      },
    });

    // 2. Chunk text intelligently by paragraphs or 250 words
    const paragraphs = dto.rawText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10);

    const chunksData = paragraphs.map((para, index) => ({
      documentId: doc.id,
      tenantId,
      chunkIndex: index,
      content: para,
      tokenCount: Math.round(para.length / 4),
    }));

    if (chunksData.length > 0) {
      await this.prisma.knowledgeChunk.createMany({
        data: chunksData,
      });

      await this.prisma.knowledgeDocument.update({
        where: { id: doc.id },
        data: { chunkCount: chunksData.length },
      });
    }

    return this.getDocumentById(tenantId, doc.id);
  }

  async deleteDocument(tenantId: string, id: string) {
    await this.prisma.knowledgeChunk.deleteMany({
      where: { documentId: id, tenantId },
    });

    return this.prisma.knowledgeDocument.delete({
      where: { id },
    });
  }
}
