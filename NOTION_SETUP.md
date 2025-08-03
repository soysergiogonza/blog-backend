# Configuración del Microservicio de Notion

## 📋 Requisitos Previos

1. **Token de Integración de Notion**
   - Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Crea una nueva integración
   - Copia el token de integración

2. **ID de la Base de Datos de Notion**
   - Abre tu base de datos en Notion
   - Comparte la base de datos con tu integración
   - Copia el ID de la base de datos de la URL

## 🔧 Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Notion API Configuration
NOTION_API_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here

# Microservice Configuration
MICROSERVICE_PORT=3001
MICROSERVICE_HOST=localhost
```

### 2. Instalar Dependencias

```bash
pnpm install
```

## 🚀 Ejecutar el Microservicio

### Desarrollo
```bash
pnpm run start:dev
```

### Producción
```bash
pnpm run build
pnpm run start:prod
```

## 📡 Patrones de Mensajes Disponibles

El microservicio responde a los siguientes patrones de mensajes:

### Health Check
```typescript
// Patrón: 'notion.health'
// Respuesta: { status: 'ok', timestamp: string }
```

### Obtener Base de Datos
```typescript
// Patrón: 'notion.get_database'
// Respuesta: NotionDatabase
```

### Consultar Base de Datos
```typescript
// Patrón: 'notion.query_database'
// Payload: { filter?: any, sorts?: any[] }
// Respuesta: NotionPage[]
```

### Obtener Página
```typescript
// Patrón: 'notion.get_page'
// Payload: { pageId: string }
// Respuesta: NotionPage
```

### Crear Página
```typescript
// Patrón: 'notion.create_page'
// Payload: { properties: Record<string, any>, data?: { parent?: { database_id?: string, page_id?: string } } }
// Respuesta: NotionPage
```

### Actualizar Página
```typescript
// Patrón: 'notion.update_page'
// Payload: { pageId: string, properties: Record<string, any> }
// Respuesta: NotionPage
```

### Eliminar Página
```typescript
// Patrón: 'notion.delete_page'
// Payload: { pageId: string }
// Respuesta: { success: boolean }
```

## 🔌 Ejemplo de Uso con Cliente

```typescript
import { NotionClientService } from './src/client/notion-client.service';

const client = new NotionClientService();

// Health check
const health = await client.health();
console.log('Health:', health);

// Obtener base de datos
const database = await client.getDatabase();
console.log('Database:', database);

// Consultar páginas
const pages = await client.queryDatabase();
console.log('Pages:', pages);

// Crear nueva página
const newPage = await client.createPage({
  'Title': {
    'title': [
      {
        'text': {
          'content': 'Mi nueva página'
        }
      }
    ]
  }
});
console.log('New page:', newPage);
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm run test

# Tests e2e
pnpm run test:e2e
```

## 📝 Notas Importantes

1. **Permisos de Notion**: Asegúrate de que tu integración tenga acceso a la base de datos
2. **Rate Limiting**: Notion tiene límites de rate limiting, maneja los errores apropiadamente
3. **Propiedades**: Las propiedades deben coincidir con la estructura de tu base de datos de Notion
4. **Logging**: El microservicio incluye logging detallado para debugging

## 🔍 Troubleshooting

### Error: "Failed to fetch database"
- Verifica que el `NOTION_DATABASE_ID` sea correcto
- Asegúrate de que la integración tenga acceso a la base de datos

### Error: "Failed to create page"
- Verifica que las propiedades coincidan con la estructura de tu base de datos
- Asegúrate de que el `NOTION_API_TOKEN` sea válido

### Error de conexión TCP
- Verifica que el puerto no esté en uso
- Cambia el puerto en las variables de entorno si es necesario 