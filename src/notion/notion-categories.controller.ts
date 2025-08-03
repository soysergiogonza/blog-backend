import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { NotionService, NotionPage } from './notion.service';

export interface CategoryStructure {
  id: string;
  title: string;
  category: string;
  type: string;
  url: string;
  icon?: any;
  children?: CategoryStructure[];
}

@Controller('notion/categories')
export class NotionCategoriesController {
  private readonly logger = new Logger(NotionCategoriesController.name);

  constructor(private readonly notionService: NotionService) {}

  @Get()
  async getAllCategories(): Promise<{ categories: string[] }> {
    this.logger.log('Get all categories requested');
    const database = await this.notionService.getDatabase();
    const categoryProperty = database.properties.Category;
    const categories = categoryProperty.select.options.map((option: any) => option.name);
    return { categories };
  }

  @Get('structure')
  async getCategoryStructure(): Promise<CategoryStructure[]> {
    this.logger.log('Get category structure requested');
    const pages = await this.notionService.queryDatabase();
    
    // Obtener todas las categorías principales
    const categories = pages.filter(page => 
      page.properties.Category?.select?.name && 
      page.properties.Type?.select?.name === 'Folder'
    );

    // Construir estructura jerárquica
    const structure: CategoryStructure[] = categories.map(category => ({
      id: category.id,
      title: category.properties.Title.title[0].text.content,
      category: category.properties.Category.select.name,
      type: category.properties.Type.select.name,
      url: category.url,
      icon: category.icon,
      children: this.getChildrenForCategory(pages, category.properties.Category.select.name)
    }));

    return structure;
  }

  @Get('main')
  async getMainCategories(): Promise<CategoryStructure[]> {
    this.logger.log('Get main categories requested');
    const pages = await this.notionService.queryDatabase();
    
    // Obtener solo las categorías principales (tipo Folder)
    const mainCategories = pages.filter(page => 
      page.properties.Category?.select?.name && 
      page.properties.Type?.select?.name === 'Folder'
    );

    return mainCategories.map(category => ({
      id: category.id,
      title: category.properties.Title.title[0].text.content,
      category: category.properties.Category.select.name,
      type: category.properties.Type.select.name,
      url: category.url,
      icon: category.icon
    }));
  }

  @Get(':category')
  async getCategoryContent(@Param('category') category: string): Promise<{
    category: string;
    pages: CategoryStructure[];
    subcategories: CategoryStructure[];
    articles: CategoryStructure[];
  }> {
    this.logger.log('Get category content requested', { category });
    const pages = await this.notionService.queryDatabase();
    
    const categoryPages = pages.filter(page => 
      page.properties.Category?.select?.name === category
    );

    const subcategories = pages.filter(page => 
      page.properties.Category?.select?.name === category &&
      page.properties.Type?.select?.name === 'Folder'
    );

    const articles = pages.filter(page => 
      page.properties.Category?.select?.name === category &&
      page.properties.Type?.select?.name === 'Article'
    );

    return {
      category,
      pages: categoryPages.map(page => ({
        id: page.id,
        title: page.properties.Title?.title?.[0]?.text?.content || 'Sin título',
        category: page.properties.Category?.select?.name || 'Sin categoría',
        type: page.properties.Type?.select?.name || 'Sin tipo',
        url: page.url,
        icon: page.icon
      })),
      subcategories: subcategories.map(page => ({
        id: page.id,
        title: page.properties.Title?.title?.[0]?.text?.content || 'Sin título',
        category: page.properties.Category?.select?.name || 'Sin categoría',
        type: page.properties.Type?.select?.name || 'Sin tipo',
        url: page.url,
        icon: page.icon
      })),
      articles: articles.map(page => ({
        id: page.id,
        title: page.properties.Title?.title?.[0]?.text?.content || 'Sin título',
        category: page.properties.Category?.select?.name || 'Sin categoría',
        type: page.properties.Type?.select?.name || 'Sin tipo',
        url: page.url,
        icon: page.icon
      }))
    };
  }

  @Get(':category/subcategories')
  async getSubcategories(@Param('category') category: string): Promise<CategoryStructure[]> {
    this.logger.log('Get subcategories requested', { category });
    const pages = await this.notionService.queryDatabase();
    
    const subcategories = pages.filter(page => 
      page.properties.Category?.select?.name === category &&
      page.properties.Type?.select?.name === 'Folder'
    );

    return subcategories.map(page => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || 'Sin título',
      category: page.properties.Category?.select?.name || 'Sin categoría',
      type: page.properties.Type?.select?.name || 'Sin tipo',
      url: page.url,
      icon: page.icon
    }));
  }

  @Get(':category/articles')
  async getCategoryArticles(@Param('category') category: string): Promise<CategoryStructure[]> {
    this.logger.log('Get category articles requested', { category });
    const pages = await this.notionService.queryDatabase();
    
    const articles = pages.filter(page => 
      page.properties.Category?.select?.name === category &&
      page.properties.Type?.select?.name === 'Article'
    );

    return articles.map(page => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.text?.content || 'Sin título',
      category: page.properties.Category?.select?.name || 'Sin categoría',
      type: page.properties.Type?.select?.name || 'Sin tipo',
      url: page.url,
      icon: page.icon
    }));
  }

  @Get(':category/:subcategory')
  async getSubcategoryContent(
    @Param('category') category: string,
    @Param('subcategory') subcategory: string
  ): Promise<{
    category: string;
    subcategory: string;
    pages: CategoryStructure[];
  }> {
    this.logger.log('Get subcategory content requested', { category, subcategory });
    const pages = await this.notionService.queryDatabase();
    
    // Buscar páginas que coincidan con la categoría y el título del subcategory
    const subcategoryPages = pages.filter(page => 
      page.properties.Category?.select?.name === category &&
      page.properties.Title.title[0].text.content.toLowerCase().includes(subcategory.toLowerCase())
    );

    return {
      category,
      subcategory,
      pages: subcategoryPages.map(page => ({
        id: page.id,
        title: page.properties.Title.title[0].text.content,
        category: page.properties.Category.select.name,
        type: page.properties.Type.select.name,
        url: page.url,
        icon: page.icon
      }))
    };
  }

  @Get('search/:query')
  async searchInCategories(@Param('query') query: string): Promise<CategoryStructure[]> {
    this.logger.log('Search in categories requested', { query });
    const pages = await this.notionService.queryDatabase();
    
    const matchingPages = pages.filter(page => 
      page.properties.Title.title[0].text.content.toLowerCase().includes(query.toLowerCase()) ||
      page.properties.Category?.select?.name?.toLowerCase().includes(query.toLowerCase())
    );

    return matchingPages.map(page => ({
      id: page.id,
      title: page.properties.Title.title[0].text.content,
      category: page.properties.Category.select.name,
      type: page.properties.Type.select.name,
      url: page.url,
      icon: page.icon
    }));
  }

  @Get('tree/structure')
  async getCategoryTree(): Promise<{
    categories: {
      name: string;
      subcategories: string[];
      articleCount: number;
    }[];
  }> {
    this.logger.log('Get category tree requested');
    const pages = await this.notionService.queryDatabase();
    
    const categories = new Map<string, { subcategories: Set<string>, articles: number }>();
    
    pages.forEach(page => {
      const category = page.properties.Category?.select?.name;
      if (category) {
        if (!categories.has(category)) {
          categories.set(category, { subcategories: new Set(), articles: 0 });
        }
        
        if (page.properties.Type?.select?.name === 'Folder') {
          categories.get(category)!.subcategories.add(page.properties.Title.title[0].text.content);
        } else if (page.properties.Type?.select?.name === 'Article') {
          categories.get(category)!.articles++;
        }
      }
    });

    return {
      categories: Array.from(categories.entries()).map(([name, data]) => ({
        name,
        subcategories: Array.from(data.subcategories),
        articleCount: data.articles
      }))
    };
  }

  private getChildrenForCategory(pages: NotionPage[], categoryName: string): CategoryStructure[] {
    return pages
      .filter(page => 
        page.properties.Category?.select?.name === categoryName &&
        page.properties.Type?.select?.name === 'Article'
      )
      .map(page => ({
        id: page.id,
        title: page.properties.Title.title[0].text.content,
        category: page.properties.Category.select.name,
        type: page.properties.Type.select.name,
        url: page.url,
        icon: page.icon
      }));
  }
} 