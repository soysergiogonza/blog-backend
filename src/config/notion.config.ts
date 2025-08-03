import { registerAs } from '@nestjs/config';

export default registerAs('notion', () => ({
  apiToken:
    process.env.NOTION_API_TOKEN || 'your_notion_integration_token_here',
  databaseId: process.env.NOTION_DATABASE_ID || 'your_notion_database_id_here',
  baseUrl: 'https://api.notion.com/v1',
}));