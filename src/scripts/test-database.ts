import axios from 'axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function testDatabase() {
  const apiToken = process.env.NOTION_API_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  
  if (!apiToken) {
    console.error('❌ NOTION_API_TOKEN no está configurado');
    process.exit(1);
  }

  if (!databaseId) {
    console.error('❌ NOTION_DATABASE_ID no está configurado');
    console.log('💡 Ejecuta: pnpm run list:databases para ver las bases de datos disponibles');
    process.exit(1);
  }

  console.log('🧪 Probando base de datos de Notion...\n');
  console.log(`📊 Database ID: ${databaseId}\n`);

  try {
    // 1. Obtener información de la base de datos
    console.log('1️⃣ Obteniendo información de la base de datos...');
    const dbResponse = await axios.get(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    const database = dbResponse.data;
    console.log('✅ Información de la base de datos:');
    console.log(`   Título: ${database.title?.[0]?.plain_text || 'Sin título'}`);
    console.log(`   URL: ${database.url}`);
    console.log(`   Propiedades: ${Object.keys(database.properties).join(', ')}`);
    console.log('');

    // 2. Consultar páginas en la base de datos
    console.log('2️⃣ Consultando páginas en la base de datos...');
    const pagesResponse = await axios.post(`https://api.notion.com/v1/databases/${databaseId}/query`, {}, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    const pages = pagesResponse.data.results;
    console.log(`✅ Se encontraron ${pages.length} página(s):`);
    
    pages.forEach((page: any, index: number) => {
      const title = page.properties?.Title?.title?.[0]?.plain_text || 
                   page.properties?.Name?.title?.[0]?.plain_text ||
                   'Sin título';
      console.log(`   ${index + 1}. ${title} (ID: ${page.id})`);
    });

    console.log('\n🎉 ¡Base de datos configurada correctamente!');
    console.log('🚀 El microservicio está listo para usar.');

  } catch (error: any) {
    console.error('❌ Error al probar la base de datos:', error.response?.data || error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que el Database ID sea correcto');
    console.log('   2. Asegúrate de que la integración tenga acceso a la base de datos');
    console.log('   3. Comparte la base de datos con tu integración en Notion');
  }
}

testDatabase(); 