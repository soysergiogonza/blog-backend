import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

export interface NotionPage {
  id: string;
  properties: Record<string, any>;
  created_time: string;
  last_edited_time: string;
  url: string;
  icon?: any;
}

export interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
}

export interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  [key: string]: any;
}

@Injectable()
export class NotionService {
  private readonly logger = new Logger(NotionService.name);
  private readonly httpClient: AxiosInstance;
  private readonly apiToken: string;
  private readonly databaseId: string;

  constructor(private readonly configService: ConfigService) {
    this.apiToken = this.configService.get<string>('notion.apiToken') || '';
    this.databaseId = this.configService.get<string>('notion.databaseId') || '';
    
    // Verificar si las credenciales están configuradas
    if (!this.apiToken || this.apiToken === 'your_notion_integration_token_here') {
      this.logger.warn('NOTION_API_TOKEN no está configurado correctamente');
    }
    if (!this.databaseId || this.databaseId === 'your_notion_database_id_here') {
      this.logger.warn('NOTION_DATABASE_ID no está configurado correctamente');
    }
    
    this.httpClient = axios.create({
      baseURL: this.configService.get<string>('notion.baseUrl') || 'https://api.notion.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 segundos de timeout
    });
  }

  async getDatabase(): Promise<NotionDatabase> {
    try {
      // Verificar si las credenciales están configuradas
      if (!this.apiToken || this.apiToken === 'your_notion_integration_token_here') {
        throw new Error('NOTION_API_TOKEN no está configurado. Por favor, configura tu token de Notion en el archivo .env');
      }
      if (!this.databaseId || this.databaseId === 'your_notion_database_id_here') {
        throw new Error('NOTION_DATABASE_ID no está configurado. Por favor, configura tu ID de base de datos en el archivo .env');
      }

      const response = await this.httpClient.get(`/databases/${this.databaseId}`);
      return response.data;
    } catch (error: any) {
      this.logger.error('Error fetching database:', error.response?.data || error.message);
      throw new Error(`Failed to fetch database: ${error.response?.data?.message || error.message}`);
    }
  }

  async queryDatabase(filter?: any, sorts?: any[]): Promise<NotionPage[]> {
    try {
      const response = await this.httpClient.post(`/databases/${this.databaseId}/query`, {
        filter,
        sorts,
      });
      return response.data.results;
    } catch (error: any) {
      this.logger.error('Error querying database:', error.response?.data || error.message);
      throw new Error(`Failed to query database: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPage(pageId: string): Promise<NotionPage> {
    try {
      const response = await this.httpClient.get(`/pages/${pageId}`);
      return response.data;
    } catch (error) {
      this.logger.error('Error fetching page:', error.message);
      throw new Error(`Failed to fetch page: ${error.message}`);
    }
  }

  async getPageBlocks(pageId: string): Promise<NotionBlock[]> {
    try {
      const response = await this.httpClient.get(`/blocks/${pageId}/children`);
      return response.data.results;
    } catch (error: any) {
      this.logger.error('Error fetching page blocks:', error.response?.data || error.message);
      throw new Error(`Failed to fetch page blocks: ${error.response?.data?.message || error.message}`);
    }
  }

  async createPage(properties: Record<string, any>, parent?: { database_id?: string; page_id?: string }): Promise<NotionPage> {
    try {
      const parentConfig = parent || { database_id: this.databaseId };
      const response = await this.httpClient.post('/pages', {
        parent: parentConfig,
        properties,
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error creating page:', error.message);
      throw new Error(`Failed to create page: ${error.message}`);
    }
  }

  async updatePage(pageId: string, properties: Record<string, any>): Promise<NotionPage> {
    try {
      const response = await this.httpClient.patch(`/pages/${pageId}`, {
        properties,
      });
      return response.data;
    } catch (error) {
      this.logger.error('Error updating page:', error.message);
      throw new Error(`Failed to update page: ${error.message}`);
    }
  }

  async deletePage(pageId: string): Promise<void> {
    try {
      await this.httpClient.patch(`/pages/${pageId}`, {
        archived: true,
      });
    } catch (error) {
      this.logger.error('Error deleting page:', error.message);
      throw new Error(`Failed to delete page: ${error.message}`);
    }
  }
} 