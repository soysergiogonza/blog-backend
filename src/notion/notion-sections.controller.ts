import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { NotionService, NotionPage, NotionDatabase } from './notion.service';

@Controller('notion/sections')
export class NotionSectionsController {
  private readonly logger = new Logger(NotionSectionsController.name);

  constructor(private readonly notionService: NotionService) {}

  @Get('folders')
  async getFolders(): Promise<NotionPage[]> {
    this.logger.log('Get folders requested');
    const filter = {
      property: 'Type',
      select: {
        equals: 'Folder'
      }
    };
    try {
      return await this.notionService.queryDatabase(filter);
    } catch (error: any) {
      this.logger.warn('Notion API error, returning empty array:', error.message);
      return [];
    }
  }

  @Get('articles')
  async getArticles(): Promise<NotionPage[]> {
    this.logger.log('Get articles requested');
    const filter = {
      property: 'Type',
      select: {
        equals: 'Article'
      }
    };
    try {
      return await this.notionService.queryDatabase(filter);
    } catch (error: any) {
      this.logger.warn('Notion API error, returning empty array:', error.message);
      return [];
    }
  }

  @Get('by-category/:category')
  async getPagesByCategory(@Param('category') category: string): Promise<NotionPage[]> {
    this.logger.log('Get pages by category requested', { category });
    const filter = {
      property: 'Category',
      select: {
        equals: category
      }
    };
    try {
      return await this.notionService.queryDatabase(filter);
    } catch (error: any) {
      this.logger.warn('Notion API error, returning empty array:', error.message);
      return [];
    }
  }

  @Get('by-status/:status')
  async getPagesByStatus(@Param('status') status: string): Promise<NotionPage[]> {
    this.logger.log('Get pages by status requested', { status });
    const filter = {
      property: 'Status',
      status: {
        equals: status
      }
    };
    try {
      return await this.notionService.queryDatabase(filter);
    } catch (error: any) {
      this.logger.warn('Notion API error, returning empty array:', error.message);
      return [];
    }
  }

  @Get('categories')
  async getCategories(): Promise<{ categories: string[] }> {
    this.logger.log('Get categories requested');
    const database = await this.notionService.getDatabase();
    const categoryProperty = database.properties.Category;
    const categories = categoryProperty.select.options.map((option: any) => option.name);
    return { categories };
  }

  @Get('statuses')
  async getStatuses(): Promise<{ statuses: string[] }> {
    this.logger.log('Get statuses requested');
    const database = await this.notionService.getDatabase();
    const statusProperty = database.properties.Status;
    const statuses = statusProperty.status.options.map((option: any) => option.name);
    return { statuses };
  }

  @Get('types')
  async getTypes(): Promise<{ types: string[] }> {
    this.logger.log('Get types requested');
    const database = await this.notionService.getDatabase();
    const typeProperty = database.properties.Type;
    const types = typeProperty.select.options.map((option: any) => option.name);
    return { types };
  }

  @Get('hierarchy')
  async getHierarchy(): Promise<{ folders: NotionPage[], articles: NotionPage[] }> {
    this.logger.log('Get hierarchy requested');
    const folders = await this.getFolders();
    const articles = await this.getArticles();
    return { folders, articles };
  }

  @Get('folder/:folderId/pages')
  async getPagesInFolder(@Param('folderId') folderId: string): Promise<NotionPage[]> {
    this.logger.log('Get pages in folder requested', { folderId });
    const filter = {
      property: 'Parent',
      relation: {
        contains: folderId
      }
    };
    return await this.notionService.queryDatabase(filter);
  }

  @Get('search')
  async searchPages(@Query('query') query: string): Promise<NotionPage[]> {
    this.logger.log('Search pages requested', { query });
    const filter = {
      property: 'Title',
      title: {
        contains: query
      }
    };
    return await this.notionService.queryDatabase(filter);
  }

  @Get('recent')
  async getRecentPages(@Query('limit') limit: number = 10): Promise<NotionPage[]> {
    this.logger.log('Get recent pages requested', { limit });
    const sorts = [
      {
        property: 'Created',
        direction: 'descending'
      }
    ];
    const pages = await this.notionService.queryDatabase(undefined, sorts);
    return pages.slice(0, limit);
  }

  @Get('popular')
  async getPopularPages(@Query('limit') limit: number = 10): Promise<NotionPage[]> {
    this.logger.log('Get popular pages requested', { limit });
    const sorts = [
      {
        property: 'Position',
        direction: 'ascending'
      }
    ];
    const pages = await this.notionService.queryDatabase(undefined, sorts);
    return pages.slice(0, limit);
  }
} 