import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para Postman
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('🚀 Notion HTTP API starting...');
  console.log(`📍 Host: localhost`);
  console.log(`🔌 Port: ${port}`);
  console.log('📝 Available endpoints:');
  console.log('  - GET  /notion/health');
  console.log('  - GET  /notion/database');
  console.log('  - GET  /notion/pages');
  console.log('  - GET  /notion/titles');
  console.log('  - GET  /notion/pages/:id');
  console.log('  - GET  /notion/content/:id');
  console.log('  - POST /notion/pages');
  console.log('  - PUT  /notion/pages/:id');
  console.log('  - DELETE /notion/pages/:id');
  console.log('');
  console.log('✅ Notion HTTP API is running!');
  console.log(`🌐 Open Postman and use: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting HTTP API:', error);
  process.exit(1);
}); 