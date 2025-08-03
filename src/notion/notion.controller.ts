import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotionService, NotionPage, NotionDatabase } from './notion.service';

export interface NotionMessage {
  action: string;
  data?: any;
  pageId?: string;
  properties?: Record<string, any>;
  filter?: any;
  sorts?: any[];
}

@Controller()
export class NotionController {
  private readonly logger = new Logger(NotionController.name);

  constructor(private readonly notionService: NotionService) {}

  @MessagePattern('notion.get_database')
  async getDatabase(): Promise<NotionDatabase> {
    this.logger.log('Received get_database request');
    return await this.notionService.getDatabase();
  }

  @MessagePattern('notion.query_database')
  async queryDatabase(@Payload() message: NotionMessage): Promise<NotionPage[]> {
    this.logger.log('Received query_database request', { filter: message.filter, sorts: message.sorts });
    return await this.notionService.queryDatabase(message.filter, message.sorts);
  }

  @MessagePattern('notion.get_page')
  async getPage(@Payload() message: NotionMessage): Promise<NotionPage> {
    this.logger.log('Received get_page request', { pageId: message.pageId });
    if (!message.pageId) {
      throw new Error('Page ID is required');
    }
    return await this.notionService.getPage(message.pageId);
  }

  @MessagePattern('notion.create_page')
  async createPage(@Payload() message: NotionMessage): Promise<NotionPage> {
    this.logger.log('Received create_page request', { properties: message.properties });
    if (!message.properties) {
      throw new Error('Properties are required');
    }
    return await this.notionService.createPage(message.properties, message.data?.parent);
  }

  @MessagePattern('notion.update_page')
  async updatePage(@Payload() message: NotionMessage): Promise<NotionPage> {
    this.logger.log('Received update_page request', { pageId: message.pageId, properties: message.properties });
    if (!message.pageId || !message.properties) {
      throw new Error('Page ID and properties are required');
    }
    return await this.notionService.updatePage(message.pageId, message.properties);
  }

  @MessagePattern('notion.delete_page')
  async deletePage(@Payload() message: NotionMessage): Promise<{ success: boolean }> {
    this.logger.log('Received delete_page request', { pageId: message.pageId });
    if (!message.pageId) {
      throw new Error('Page ID is required');
    }
    await this.notionService.deletePage(message.pageId);
    return { success: true };
  }

  @MessagePattern('notion.health')
  async health(): Promise<{ status: string; timestamp: string }> {
    this.logger.log('Received health check request');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
} 