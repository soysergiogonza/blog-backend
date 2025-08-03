import { NotionClientService } from '../client/notion-client.service';

async function testNotionClient() {
  console.log('🧪 Testing Notion Microservice Client...\n');

  const client = new NotionClientService();

  try {
    // Test health check
    console.log('1️⃣ Testing health check...');
    const health = await client.health();
    console.log('✅ Health check successful:', health);
    console.log('');

    // Test get database
    console.log('2️⃣ Testing get database...');
    try {
      const database = await client.getDatabase();
      console.log('✅ Database info retrieved:', {
        id: database.id,
        title: database.title,
        properties: Object.keys(database.properties),
      });
    } catch (error) {
      console.log('⚠️ Database test failed (this is expected if Notion is not configured):', error.message);
    }
    console.log('');

    // Test query database
    console.log('3️⃣ Testing query database...');
    try {
      const pages = await client.queryDatabase();
      console.log('✅ Database query successful:', {
        totalPages: pages.length,
        firstPage: pages[0] ? { id: pages[0].id, url: pages[0].url } : null,
      });
    } catch (error) {
      console.log('⚠️ Query test failed (this is expected if Notion is not configured):', error.message);
    }
    console.log('');

    console.log('🎉 All tests completed!');
    console.log('📝 Note: Some tests may fail if Notion API is not properly configured.');
    console.log('📖 Check NOTION_SETUP.md for configuration instructions.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await client.onModuleDestroy();
    process.exit(0);
  }
}

testNotionClient(); 