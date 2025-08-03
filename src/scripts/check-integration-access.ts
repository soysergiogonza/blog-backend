import axios from 'axios';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function checkIntegrationAccess() {
  const apiToken = process.env.NOTION_API_TOKEN;
  
  if (!apiToken) {
    console.error('❌ NOTION_API_TOKEN no está configurado');
    process.exit(1);
  }

  console.log('🔍 Verificando acceso de la integración...\n');

  try {
    // 1. Verificar que el token es válido
    console.log('1️⃣ Verificando token de integración...');
    const meResponse = await axios.get('https://api.notion.com/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    const integration = meResponse.data;
    console.log('✅ Token válido - Información de la integración:');
    console.log(`   Nombre: ${integration.name}`);
    console.log(`   ID: ${integration.id}`);
    console.log(`   Tipo: ${integration.type}`);
    console.log('');

    // 2. Buscar todas las bases de datos accesibles
    console.log('2️⃣ Buscando bases de datos accesibles...');
    const searchResponse = await axios.post('https://api.notion.com/v1/search', {
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

    const databases = searchResponse.data.results;
    
    if (databases.length === 0) {
      console.log('📝 No se encontraron bases de datos accesibles.');
      console.log('\n💡 Para solucionar esto:');
      console.log('   1. Ve a tu base de datos en Notion');
      console.log('   2. Haz clic en "Share" en la esquina superior derecha');
      console.log('   3. Busca tu integración por nombre: ' + integration.name);
      console.log('   4. Dale permisos de "Can edit" o "Can view"');
      console.log('   5. Ejecuta este script nuevamente');
    } else {
      console.log(`✅ Se encontraron ${databases.length} base(s) de datos accesibles:\n`);
      
      databases.forEach((db: any, index: number) => {
        console.log(`${index + 1}. 📊 Base de Datos:`);
        console.log(`   ID: ${db.id}`);
        console.log(`   Título: ${db.title?.[0]?.plain_text || 'Sin título'}`);
        console.log(`   URL: ${db.url}`);
        console.log(`   Creada: ${new Date(db.created_time).toLocaleDateString()}`);
        console.log('');
      });

      console.log('📋 Para usar una base de datos, copia su ID y actualiza tu archivo .env:');
      console.log('   NOTION_DATABASE_ID=el_id_de_la_base_de_datos');
    }

  } catch (error: any) {
    console.error('❌ Error al verificar acceso:', error.response?.data || error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Verifica que el API token sea correcto');
    console.log('   2. Asegúrate de que la integración esté activa');
    console.log('   3. Comparte las bases de datos con tu integración');
  }
}

checkIntegrationAccess(); 