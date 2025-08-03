import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { NotionPage, NotionDatabase } from '../notion/notion.service';

@Injectable()
export class NotionClientService {
  private readonly logger = new Logger(NotionClientService.name);
  private readonly client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.MICROSERVICE_HOST || 'localhost',
        port: parseInt(process.env.MICROSERVICE_PORT || '3001'),
      },
    });
  }

  async getDatabase(): Promise<NotionDatabase> {
    this.logger.log('Requesting database info');
    return await this.client.send('notion.get_database', {}).toPromise();
  }

  async queryDatabase(filter?: any, sorts?: any[]): Promise<NotionPage[]> {
    this.logger.log('Querying database', { filter, sorts });
    return await this.client.send('notion.query_database', { filter, sorts }).toPromise();
  }

  async getPage(pageId: string): Promise<NotionPage> {
    this.logger.log('Getting page', { pageId });
    return await this.client.send('notion.get_page', { pageId }).toPromise();
  }

  async createPage(properties: Record<string, any>, parent?: { database_id?: string; page_id?: string }): Promise<NotionPage> {
    this.logger.log('Creating page', { properties });
    return await this.client.send('notion.create_page', { properties, data: { parent } }).toPromise();
  }

  async updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage> {
    this.logger.log('Updating page', { pageId, properties });
    return await this.client.send('notion.update_page', { pageId, properties }).toPromise();
  }

  async deletePage(pageId: string): Promise<{ success: boolean }> {
    this.logger.log('Deleting page', { pageId });
    return await this.client.send('notion.delete_page', { pageId }).toPromise();
  }

  async health(): Promise<{ status: string; timestamp: string }> {
    this.logger.log('Checking health');
    return await this.client.send('notion.health', {}).toPromise();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
} 