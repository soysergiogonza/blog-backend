import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotionModule } from './notion/notion.module';
import notionConfig from './config/notion.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [notionConfig],
    }),
    NotionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
