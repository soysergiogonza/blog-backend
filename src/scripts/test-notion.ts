import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.MICROSERVICE_HOST || 'localhost',
      port: parseInt(process.env.MICROSERVICE_PORT || '3001'),
    },
  });

  console.log('🚀 Notion Microservice starting...');
  console.log(`📍 Host: ${process.env.MICROSERVICE_HOST || 'localhost'}`);
  console.log(`🔌 Port: ${process.env.MICROSERVICE_PORT || '3001'}`);
  console.log('📝 Available patterns:');
  console.log('  - notion.health');
  console.log('  - notion.get_database');
  console.log('  - notion.query_database');
  console.log('  - notion.get_page');
  console.log('  - notion.create_page');
  console.log('  - notion.update_page');
  console.log('  - notion.delete_page');

  await app.listen();
  console.log('✅ Notion Microservice is running!');
}

bootstrap().catch((error) => {
  console.error('❌ Error starting microservice:', error);
  process.exit(1);
}); 