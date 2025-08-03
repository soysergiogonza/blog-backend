# 🚀 API de Notion - Referencia Completa de Endpoints

## 📍 Base URL
```
http://localhost:3002
```

## 🔍 Health & Database

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/health` | GET | Verificar estado de la API | `curl http://localhost:3002/notion/health` |
| `/notion/database` | GET | Información de la base de datos | `curl http://localhost:3002/notion/database` |

## 📄 Pages Management

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/pages` | GET | Todas las páginas | `curl http://localhost:3002/notion/pages` |
| `/notion/pages/:id` | GET | Página específica | `curl http://localhost:3002/notion/pages/1cd05f8b-eced-8031-a02c-fbd7d02e073e` |
| `/notion/pages` | POST | Crear página | `curl -X POST http://localhost:3002/notion/pages -H "Content-Type: application/json" -d '{"parent":{"database_id":"your_id"},"properties":{"Title":{"title":[{"text":{"content":"Nueva página"}}]}}}'` |
| `/notion/pages/:id` | PUT | Actualizar página | `curl -X PUT http://localhost:3002/notion/pages/1cd05f8b-eced-8031-a02c-fbd7d02e073e -H "Content-Type: application/json" -d '{"properties":{"Title":{"title":[{"text":{"content":"Actualizada"}}]}}}'` |
| `/notion/pages/:id` | DELETE | Eliminar página | `curl -X DELETE http://localhost:3002/notion/pages/1cd05f8b-eced-8031-a02c-fbd7d02e073e` |

## 📂 Categories Management

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/categories` | GET | Todas las categorías | `curl http://localhost:3002/notion/categories` |
| `/notion/categories/main` | GET | Categorías principales | `curl http://localhost:3002/notion/categories/main` |
| `/notion/categories/structure` | GET | Estructura jerárquica | `curl http://localhost:3002/notion/categories/structure` |
| `/notion/categories/JavaScript` | GET | Contenido de JavaScript | `curl http://localhost:3002/notion/categories/JavaScript` |
| `/notion/categories/HTML` | GET | Contenido de HTML | `curl http://localhost:3002/notion/categories/HTML` |
| `/notion/categories/React` | GET | Contenido de React | `curl http://localhost:3002/notion/categories/React` |
| `/notion/categories/SQL` | GET | Contenido de SQL | `curl http://localhost:3002/notion/categories/SQL` |
| `/notion/categories/JavaScript/subcategories` | GET | Subcategorías de JavaScript | `curl http://localhost:3002/notion/categories/JavaScript/subcategories` |
| `/notion/categories/JavaScript/articles` | GET | Artículos de JavaScript | `curl http://localhost:3002/notion/categories/JavaScript/articles` |
| `/notion/categories/HTML/articles` | GET | Artículos de HTML | `curl http://localhost:3002/notion/categories/HTML/articles` |
| `/notion/categories/search/React` | GET | Buscar en categorías | `curl http://localhost:3002/notion/categories/search/React` |
| `/notion/categories/tree/structure` | GET | Árbol de categorías | `curl http://localhost:3002/notion/categories/tree/structure` |

## 📁 Sections Management

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/sections/categories` | GET | Categorías disponibles | `curl http://localhost:3002/notion/sections/categories` |
| `/notion/sections/statuses` | GET | Estados disponibles | `curl http://localhost:3002/notion/sections/statuses` |
| `/notion/sections/types` | GET | Tipos disponibles | `curl http://localhost:3002/notion/sections/types` |
| `/notion/sections/folders` | GET | Carpetas/secciones | `curl http://localhost:3002/notion/sections/folders` |
| `/notion/sections/articles` | GET | Artículos | `curl http://localhost:3002/notion/sections/articles` |
| `/notion/sections/by-category/JavaScript` | GET | Por categoría JavaScript | `curl http://localhost:3002/notion/sections/by-category/JavaScript` |
| `/notion/sections/by-category/HTML` | GET | Por categoría HTML | `curl http://localhost:3002/notion/sections/by-category/HTML` |
| `/notion/sections/by-category/React` | GET | Por categoría React | `curl http://localhost:3002/notion/sections/by-category/React` |
| `/notion/sections/by-category/SQL` | GET | Por categoría SQL | `curl http://localhost:3002/notion/sections/by-category/SQL` |
| `/notion/sections/by-status/In progress` | GET | Por estado | `curl http://localhost:3002/notion/sections/by-status/In progress` |
| `/notion/sections/search?query=React` | GET | Buscar páginas | `curl "http://localhost:3002/notion/sections/search?query=React"` |
| `/notion/sections/recent?limit=5` | GET | Páginas recientes | `curl "http://localhost:3002/notion/sections/recent?limit=5"` |
| `/notion/sections/popular?limit=10` | GET | Páginas populares | `curl "http://localhost:3002/notion/sections/popular?limit=10"` |
| `/notion/sections/hierarchy` | GET | Jerarquía de secciones | `curl http://localhost:3002/notion/sections/hierarchy` |
| `/notion/sections/folder/:folderId/pages` | GET | Páginas en carpeta | `curl http://localhost:3002/notion/sections/folder/1cd05f8b-eced-8031-a02c-fbd7d02e073e/pages` |

## 🔧 Advanced Queries

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/pages?filter={...}` | GET | Páginas con filtro | `curl "http://localhost:3002/notion/pages?filter={\"property\":\"Category\",\"select\":{\"equals\":\"JavaScript\"}}"` |
| `/notion/pages?sorts=[...]` | GET | Páginas ordenadas | `curl "http://localhost:3002/notion/pages?sorts=[{\"property\":\"Title\",\"direction\":\"ascending\"}]"` |
| `/notion/pages?filter={...}&sorts=[...]` | GET | Filtro + ordenamiento | `curl "http://localhost:3002/notion/pages?filter={\"property\":\"Type\",\"select\":{\"equals\":\"Article\"}}&sorts=[{\"property\":\"Title\",\"direction\":\"ascending\"}]"` |

## 📊 Data Analysis

| Endpoint | Método | Descripción | Ejemplo |
|----------|--------|-------------|---------|
| `/notion/sections/categories` | GET | Estadísticas de BD | `curl http://localhost:3002/notion/sections/categories` |
| `/notion/categories/tree/structure` | GET | Vista general | `curl http://localhost:3002/notion/categories/tree/structure` |

## 🎯 Ejemplos de Uso por Categoría

### JavaScript
```bash
# Obtener contenido de JavaScript
curl http://localhost:3002/notion/categories/JavaScript

# Obtener subcategorías de JavaScript
curl http://localhost:3002/notion/categories/JavaScript/subcategories

# Obtener artículos de JavaScript
curl http://localhost:3002/notion/categories/JavaScript/articles
```

### HTML
```bash
# Obtener contenido de HTML
curl http://localhost:3002/notion/categories/HTML

# Obtener artículos de HTML
curl http://localhost:3002/notion/categories/HTML/articles
```

### React
```bash
# Obtener contenido de React
curl http://localhost:3002/notion/categories/React

# Buscar contenido relacionado con React
curl http://localhost:3002/notion/categories/search/React
```

### SQL
```bash
# Obtener contenido de SQL
curl http://localhost:3002/notion/categories/SQL

# Obtener artículos de SQL
curl http://localhost:3002/notion/categories/SQL/articles
```

## 🔍 Filtros Avanzados

### Filtrar por Categoría
```bash
curl "http://localhost:3002/notion/pages?filter={\"property\":\"Category\",\"select\":{\"equals\":\"JavaScript\"}}"
```

### Filtrar por Tipo
```bash
curl "http://localhost:3002/notion/pages?filter={\"property\":\"Type\",\"select\":{\"equals\":\"Article\"}}"
```

### Filtrar por Estado
```bash
curl "http://localhost:3002/notion/pages?filter={\"property\":\"Status\",\"select\":{\"equals\":\"In progress\"}}"
```

### Ordenar por Título
```bash
curl "http://localhost:3002/notion/pages?sorts=[{\"property\":\"Title\",\"direction\":\"ascending\"}]"
```

### Combinar Filtro y Ordenamiento
```bash
curl "http://localhost:3002/notion/pages?filter={\"property\":\"Category\",\"select\":{\"equals\":\"JavaScript\"}}&sorts=[{\"property\":\"Title\",\"direction\":\"ascending\"}]"
```

## 📋 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | ✅ Éxito |
| 400 | ❌ Error de solicitud |
| 404 | ❌ No encontrado |
| 500 | ❌ Error interno del servidor |

## 🚀 Importar Colección en Postman

1. Descarga el archivo `NOTION_API_COLLECTION.json`
2. Abre Postman
3. Ve a **Import** → **Upload Files**
4. Selecciona el archivo JSON
5. ¡Listo! Tendrás todos los endpoints organizados

## 📝 Notas Importantes

- **Base URL**: `http://localhost:3002`
- **Puerto**: 3002 (configurable con `HTTP_PORT`)
- **Formato**: JSON para todas las respuestas
- **CORS**: Habilitado para desarrollo
- **Variables**: Usa `{{baseUrl}}` en Postman para cambiar la URL fácilmente

## 🔧 Configuración del Servidor

```bash
# Iniciar servidor
HTTP_PORT=3002 pnpm run start:http

# Verificar estado
curl http://localhost:3002/notion/health

# Ver todas las páginas
curl http://localhost:3002/notion/pages
```

¡Tienes acceso completo a todas las funcionalidades de tu API de Notion! 🎉 