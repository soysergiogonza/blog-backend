import { NotionClientService } from '../client/notion-client.service';

async function testMicroserviceDetailed() {
  console.log('🧪 Testing Notion Microservice (Detailed)...\n');

  const client = new NotionClientService();

  try {
    // Test health check
    console.log('1️⃣ Testing health check...');
    const health = await client.health();
    console.log('✅ Health check successful:', health);
    console.log('');

    // Test get database with error handling
    console.log('2️⃣ Testing get database...');
    try {
      const database = await client.getDatabase();
      console.log('✅ Database info retrieved:', {
        id: database.id,
        title: database.title,
        properties: Object.keys(database.properties),
      });
    } catch (error: any) {
      console.log('❌ Database test failed:');
      console.log('   Error:', error.message);
      if (error.response) {
        console.log('   Response data:', error.response.data);
        console.log('   Status:', error.response.status);
      }
    }
    console.log('');

    // Test query database with error handling
    console.log('3️⃣ Testing query database...');
    try {
      const pages = await client.queryDatabase();
      console.log('✅ Database query successful:', {
        totalPages: pages.length,
        firstPage: pages[0] ? { id: pages[0].id, url: pages[0].url } : null,
      });
    } catch (error: any) {
      console.log('❌ Query test failed:');
      console.log('   Error:', error.message);
      if (error.response) {
        console.log('   Response data:', error.response.data);
        console.log('   Status:', error.response.status);
      }
    }
    console.log('');

    console.log('🎉 All tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.onModuleDestroy();
    process.exit(0);
  }
}

testMicroserviceDetailed(); 