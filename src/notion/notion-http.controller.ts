import { Controller, Get, Post, Put, Delete, Param, Body, Query, Logger } from '@nestjs/common';
import { NotionService, NotionPage, NotionDatabase, NotionBlock } from './notion.service';

@Controller('notion')
export class NotionHttpController {
  private readonly logger = new Logger(NotionHttpController.name);

  constructor(private readonly notionService: NotionService) {}

  @Get('health')
  async health(): Promise<{ status: string; timestamp: string }> {
    this.logger.log('Health check requested');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('database')
  async getDatabase(): Promise<NotionDatabase> {
    this.logger.log('Get database requested');
    try {
      return await this.notionService.getDatabase();
    } catch (error: any) {
      this.logger.warn('Notion API error, returning empty database info:', error.message);
      return {
        id: '',
        title: 'Database not accessible',
        properties: {}
      };
    }
  }

  @Get('pages')
  async getPages(
    @Query('filter') filter?: string,
    @Query('sorts') sorts?: string,
  ): Promise<NotionPage[]> {
    this.logger.log('Get pages requested', { filter, sorts });
    
    let parsedFilter;
    let parsedSorts;
    
    try {
      if (filter) {
        parsedFilter = JSON.parse(filter);
      }
      if (sorts) {
        parsedSorts = JSON.parse(sorts);
      }
    } catch (error) {
      this.logger.warn('Invalid JSON in query parameters');
    }
    
    try {
      return await this.notionService.queryDatabase(parsedFilter, parsedSorts);
    } catch (error: any) {
      this.logger.warn("Notion API error, returning empty array:", error.message);
      return [];
    }
  }

  @Get('titles')
  async getPageTitles(
    @Query('filter') filter?: string,
    @Query('sorts') sorts?: string,
  ): Promise<string[]> {
    this.logger.log('Get page titles requested', { filter, sorts });
    
    let parsedFilter;
    let parsedSorts;
    
    try {
      if (filter) {
        parsedFilter = JSON.parse(filter);
      }
      if (sorts) {
        parsedSorts = JSON.parse(sorts);
      }
    } catch (error) {
      this.logger.warn('Invalid JSON in query parameters');
    }
    
    try {
      const pages = await this.notionService.queryDatabase(parsedFilter, parsedSorts);
      
      // Extraer solo los títulos de las páginas
      const titles = pages.map(page => {
        const title = page.properties?.Title?.title?.[0]?.plain_text || 
                     page.properties?.Name?.title?.[0]?.plain_text ||
                     "Sin título";
        return title;
      });
      
      return titles;
    } catch (error: any) {
      this.logger.warn("Notion API error, returning empty array:", error.message);
      return [];
    }
  }

  @Get('pages/:id')
  async getPage(@Param('id') id: string): Promise<NotionPage> {
    this.logger.log('Get page requested', { pageId: id });
    return await this.notionService.getPage(id);
  }

  @Get('content/:id')
  async getPageContent(@Param('id') id: string): Promise<NotionBlock[]> {
    this.logger.log('Get page content requested', { pageId: id });
    return await this.notionService.getPageBlocks(id);
  }

  @Post('pages')
  async createPage(@Body() body: { properties: Record<string, any>; parent?: any }): Promise<NotionPage> {
    this.logger.log('Create page requested', { properties: body.properties });
    return await this.notionService.createPage(body.properties, body.parent);
  }

  @Put('pages/:id')
  async updatePage(
    @Param('id') id: string,
    @Body() body: { properties: Record<string, any> },
  ): Promise<NotionPage> {
    this.logger.log('Update page requested', { pageId: id, properties: body.properties });
    return await this.notionService.updatePage(id, body.properties);
  }

  @Delete('pages/:id')
  async deletePage(@Param('id') id: string): Promise<{ success: boolean }> {
    this.logger.log('Delete page requested', { pageId: id });
    await this.notionService.deletePage(id);
    return { success: true };
  }
} 