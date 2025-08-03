import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionController } from './notion.controller';
import { NotionHttpController } from './notion-http.controller';
import { NotionSectionsController } from './notion-sections.controller';
import { NotionCategoriesController } from './notion-categories.controller';
import { NotionService } from './notion.service';
import notionConfig from '../config/notion.config';

@Module({
  imports: [
    ConfigModule.forFeature(notionConfig),
  ],
  controllers: [NotionController, NotionHttpController, NotionSectionsController, NotionCategoriesController],
  providers: [NotionService],
  exports: [NotionService],
})
export class NotionModule {} 