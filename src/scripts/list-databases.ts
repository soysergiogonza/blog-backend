import axios from 'axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function listDatabases() {
  const apiToken = process.env.NOTION_API_TOKEN;
  
  if (!apiToken) {
    console.error('❌ NOTION_API_TOKEN no está configurado en las variables de entorno');
    process.exit(1);
  }

  console.log('🔍 Buscando bases de datos disponibles...\n');

  try {
    const response = await axios.post('https://api.notion.com/v1/search', {
      filter: {
        property: 'object',
        value: 'database'
      }
    }, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    const databases = response.data.results;
    
    if (databases.length === 0) {
      console.log('📝 No se encontraron bases de datos.');
      console.log('💡 Asegúrate de:');
      console.log('   1. Haber creado una base de datos en Notion');
      console.log('   2. Haber compartido la base de datos con tu integración');
      console.log('   3. Que la integración tenga permisos de lectura');
    } else {
      console.log(`✅ Se encontraron ${databases.length} base(s) de datos:\n`);
      
      databases.forEach((db: any, index: number) => {
        console.log(`${index + 1}. 📊 Base de Datos:`);
        console.log(`   ID: ${db.id}`);
        console.log(`   Título: ${db.title?.[0]?.plain_text || 'Sin título'}`);
        console.log(`   URL: ${db.url}`);
        console.log(`   Creada: ${new Date(db.created_time).toLocaleDateString()}`);
        console.log('');
      });

      console.log('📋 Para usar una base de datos, copia su ID y agrégalo a tu archivo .env:');
      console.log('   NOTION_DATABASE_ID=el_id_de_la_base_de_datos');
    }

  } catch (error: any) {
    console.error('❌ Error al buscar bases de datos:', error.response?.data || error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que el API token sea correcto');
    console.log('   2. Asegúrate de que la integración tenga permisos');
    console.log('   3. Crea una base de datos y compártela con la integración');
  }
}

listDatabases(); 