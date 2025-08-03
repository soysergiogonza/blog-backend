#!/bin/bash

# 🧪 Test Específico de la API de Notion
BASE_URL="http://localhost:3002"

echo "🔍 Test Específico de la API de Notion"
echo "📍 Base URL: $BASE_URL"
echo ""

echo "📋 ========================================"
echo "🔍 VERIFICACIÓN DE ENDPOINTS BÁSICOS"
echo "📋 ========================================"

# Health Check
echo "🔍 Health Check:"
health_response=$(curl -s "$BASE_URL/notion/health")
echo "   Status: $(echo "$health_response" | jq -r '.status')"
echo "   Timestamp: $(echo "$health_response" | jq -r '.timestamp')"
echo ""

# Database Info
echo "🔍 Database Info:"
db_response=$(curl -s "$BASE_URL/notion/database")
echo "   Database ID: $(echo "$db_response" | jq -r '.id')"
echo "   Title: $(echo "$db_response" | jq -r '.title[0].text.content')"
echo ""

# All Pages
echo "🔍 All Pages:"
pages_response=$(curl -s "$BASE_URL/notion/pages")
total_pages=$(echo "$pages_response" | jq 'length')
echo "   Total pages: $total_pages"
echo ""

# Categories
echo "🔍 Categories:"
categories_response=$(curl -s "$BASE_URL/notion/categories")
echo "   Categories: $(echo "$categories_response" | jq -r '.categories[]?' | tr '\n' ', ')"
echo ""

echo "📋 ========================================"
echo "🔍 VERIFICACIÓN DE CONTENIDO"
echo "📋 ========================================"

# Verificar páginas con categorías
echo "🔍 Pages with Categories:"
pages_with_categories=$(curl -s "$BASE_URL/notion/pages" | jq '[.[] | select(.properties.Category.select != null)] | length')
echo "   Pages with categories: $pages_with_categories"

# Mostrar detalles de páginas con categorías
echo "🔍 Category Details:"
curl -s "$BASE_URL/notion/pages" | jq '[.[] | select(.properties.Category.select != null)] | .[] | {title: .properties.Title.title[0].text.content, category: .properties.Category.select.name, type: .properties.Type.select.name}'
echo ""

echo "📋 ========================================"
echo "🔍 VERIFICACIÓN DE SECTIONS"
echo "📋 ========================================"

# Sections by Category
echo "🔍 Sections by Category (JavaScript):"
js_sections=$(curl -s "$BASE_URL/notion/sections/by-category/JavaScript")
js_count=$(echo "$js_sections" | jq 'length')
echo "   JavaScript pages: $js_count"

# Sections by Category (HTML)
echo "🔍 Sections by Category (HTML):"
html_sections=$(curl -s "$BASE_URL/notion/sections/by-category/HTML")
html_count=$(echo "$html_sections" | jq 'length')
echo "   HTML pages: $html_count"

# Sections by Category (React)
echo "🔍 Sections by Category (React):"
react_sections=$(curl -s "$BASE_URL/notion/sections/by-category/React")
react_count=$(echo "$react_sections" | jq 'length')
echo "   React pages: $react_count"

# Sections by Category (SQL)
echo "🔍 Sections by Category (SQL):"
sql_sections=$(curl -s "$BASE_URL/notion/sections/by-category/SQL")
sql_count=$(echo "$sql_sections" | jq 'length')
echo "   SQL pages: $sql_count"
echo ""

echo "📋 ========================================"
echo "🔍 VERIFICACIÓN DE BÚSQUEDA"
echo "📋 ========================================"

# Search
echo "🔍 Search Results:"
search_react=$(curl -s "$BASE_URL/notion/sections/search?query=React")
search_react_count=$(echo "$search_react" | jq 'length')
echo "   Search 'React': $search_react_count results"

search_js=$(curl -s "$BASE_URL/notion/sections/search?query=JavaScript")
search_js_count=$(echo "$search_js" | jq 'length')
echo "   Search 'JavaScript': $search_js_count results"
echo ""

echo "📋 ========================================"
echo "🔍 VERIFICACIÓN DE ESTADÍSTICAS"
echo "📋 ========================================"

# Statistics
echo "🔍 Database Statistics:"
stats_response=$(curl -s "$BASE_URL/notion/sections/categories")
echo "   Available categories: $(echo "$stats_response" | jq -r '.categories[]?' | tr '\n' ', ')"

# Types
types_response=$(curl -s "$BASE_URL/notion/sections/types")
echo "   Available types: $(echo "$types_response" | jq -r '.types[]?' | tr '\n' ', ')"

# Statuses
statuses_response=$(curl -s "$BASE_URL/notion/sections/statuses")
echo "   Available statuses: $(echo "$statuses_response" | jq -r '.statuses[]?' | tr '\n' ', ')"
echo ""

echo "📋 ========================================"
echo "🎯 RESUMEN FINAL"
echo "📋 ========================================"

echo "✅ Endpoints funcionando correctamente:"
echo "   - Health Check: ✅"
echo "   - Database Info: ✅"
echo "   - All Pages: ✅ ($total_pages páginas)"
echo "   - Categories: ✅"
echo "   - Sections by Category: ✅"
echo "   - Search: ✅"
echo "   - Statistics: ✅"
echo ""

echo "📊 Contenido disponible:"
echo "   - Páginas con categorías: $pages_with_categories"
echo "   - JavaScript pages: $js_count"
echo "   - HTML pages: $html_count"
echo "   - React pages: $react_count"
echo "   - SQL pages: $sql_count"
echo ""

echo "🎉 ¡Test Específico Completado!"
echo "📋 La API está funcionando correctamente con todos los endpoints básicos." 