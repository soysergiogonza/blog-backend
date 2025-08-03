# 🚀 API de Blog Backend - Uso en Producción

## 🌐 URL de Producción
```
https://blog-backend-pink-six.vercel.app/
```

## 📝 Endpoints Disponibles

### **Health Check**
```bash
GET https://blog-backend-pink-six.vercel.app/notion/health
```

### **Base de Datos**
```bash
GET https://blog-backend-pink-six.vercel.app/notion/database
```

### **Páginas**
```bash
# Todas las páginas
GET https://blog-backend-pink-six.vercel.app/notion/pages

# Página específica
GET https://blog-backend-pink-six.vercel.app/notion/pages/{pageId}

# Contenido de página
GET https://blog-backend-pink-six.vercel.app/notion/content/{pageId}
```

### **Títulos**
```bash
GET https://blog-backend-pink-six.vercel.app/notion/titles
```

### **Categorías**
```bash
# Categorías principales
GET https://blog-backend-pink-six.vercel.app/notion/categories/main

# Categoría específica
GET https://blog-backend-pink-six.vercel.app/notion/categories/{category}

# Subcategorías
GET https://blog-backend-pink-six.vercel.app/notion/categories/{category}/subcategories

# Artículos de categoría
GET https://blog-backend-pink-six.vercel.app/notion/categories/{category}/articles

# Búsqueda en categorías
GET https://blog-backend-pink-six.vercel.app/notion/categories/search/{query}

# Estructura de árbol
GET https://blog-backend-pink-six.vercel.app/notion/categories/tree/structure
```

## 🧪 Ejemplos de Uso

### **Con curl**
```bash
# Health check
curl https://blog-backend-pink-six.vercel.app/notion/health

# Obtener páginas
curl https://blog-backend-pink-six.vercel.app/notion/pages

# Obtener categorías
curl https://blog-backend-pink-six.vercel.app/notion/categories/main
```

### **Con JavaScript/Fetch**
```javascript
// Health check
fetch('https://blog-backend-pink-six.vercel.app/notion/health')
  .then(response => response.json())
  .then(data => console.log(data));

// Obtener páginas
fetch('https://blog-backend-pink-six.vercel.app/notion/pages')
  .then(response => response.json())
  .then(data => console.log(data));
```

### **Con Postman**
1. Abre Postman
2. Usa la URL base: `https://blog-backend-pink-six.vercel.app`
3. Agrega el endpoint que necesites (ej: `/notion/health`)
4. Envía la petición

## ⚠️ Configuración de Variables de Entorno

Para que la API funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno en tu dashboard de Vercel:

1. Ve a tu proyecto en Vercel
2. Ve a Settings > Environment Variables
3. Agrega:
   - `NOTION_API_TOKEN`: Tu token de integración de Notion
   - `NOTION_DATABASE_ID`: El ID de tu base de datos de Notion

## 🔧 Troubleshooting

Si obtienes errores como "FUNCTION_INVOCATION_FAILED", verifica:

1. Que las variables de entorno estén configuradas correctamente
2. Que el token de Notion sea válido
3. Que el ID de la base de datos sea correcto
4. Que la integración de Notion tenga permisos para acceder a la base de datos

## 📊 Respuestas de Ejemplo

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2025-08-03T21:24:59.458Z"
}
```

### Páginas
```json
[
  {
    "id": "page-id",
    "title": "Título de la página",
    "category": "Frontend",
    "type": "Article",
    "url": "https://notion.so/...",
    "icon": null
  }
]
``` 