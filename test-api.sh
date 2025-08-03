#!/bin/bash

# 🧪 Test Completo de la API de Notion
# Base URL
BASE_URL="http://localhost:3002"

echo "🚀 Iniciando Test Completo de la API de Notion..."
echo "📍 Base URL: $BASE_URL"
echo ""

# Función para hacer requests y mostrar resultados
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo "🔍 Testing: $description"
    echo "   $method $endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL$endpoint")
    fi
    
    # Separar respuesta y código de estado
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo "   ✅ SUCCESS ($http_code)"
        echo "   📄 Response: $(echo "$body" | jq -c '.' 2>/dev/null || echo "$body" | head -c 100)..."
    else
        echo "   ❌ ERROR ($http_code)"
        echo "   📄 Response: $(echo "$body" | head -c 200)..."
    fi
    echo ""
}

# Función para contar elementos en respuesta JSON
count_items() {
    local response=$1
    echo "$response" | jq 'length' 2>/dev/null || echo "0"
}

echo "📋 ========================================"
echo "🔍 HEALTH & DATABASE TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/health" "Health Check"
test_endpoint "GET" "/notion/database" "Database Info"

echo "📋 ========================================"
echo "📄 PAGES MANAGEMENT TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/pages" "Get All Pages"
test_endpoint "GET" "/notion/pages/1cd05f8b-eced-8031-a02c-fbd7d02e073e" "Get Page by ID"

echo "📋 ========================================"
echo "📂 CATEGORIES MANAGEMENT TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/categories" "Get All Categories"
test_endpoint "GET" "/notion/categories/main" "Get Main Categories"
test_endpoint "GET" "/notion/categories/structure" "Get Category Structure"
test_endpoint "GET" "/notion/categories/JavaScript" "Get JavaScript Category"
test_endpoint "GET" "/notion/categories/HTML" "Get HTML Category"
test_endpoint "GET" "/notion/categories/React" "Get React Category"
test_endpoint "GET" "/notion/categories/SQL" "Get SQL Category"
test_endpoint "GET" "/notion/categories/JavaScript/subcategories" "Get JavaScript Subcategories"
test_endpoint "GET" "/notion/categories/JavaScript/articles" "Get JavaScript Articles"
test_endpoint "GET" "/notion/categories/HTML/articles" "Get HTML Articles"
test_endpoint "GET" "/notion/categories/search/React" "Search Categories for React"
test_endpoint "GET" "/notion/categories/tree/structure" "Get Category Tree Structure"

echo "📋 ========================================"
echo "📁 SECTIONS MANAGEMENT TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/sections/categories" "Get Categories"
test_endpoint "GET" "/notion/sections/statuses" "Get Statuses"
test_endpoint "GET" "/notion/sections/types" "Get Types"
test_endpoint "GET" "/notion/sections/folders" "Get Folders"
test_endpoint "GET" "/notion/sections/articles" "Get Articles"
test_endpoint "GET" "/notion/sections/by-category/JavaScript" "Get Pages by Category (JavaScript)"
test_endpoint "GET" "/notion/sections/by-category/HTML" "Get Pages by Category (HTML)"
test_endpoint "GET" "/notion/sections/by-category/React" "Get Pages by Category (React)"
test_endpoint "GET" "/notion/sections/by-category/SQL" "Get Pages by Category (SQL)"
test_endpoint "GET" "/notion/sections/by-status/In%20progress" "Get Pages by Status"
test_endpoint "GET" "/notion/sections/search?query=React" "Search Pages"
test_endpoint "GET" "/notion/sections/recent?limit=5" "Get Recent Pages"
test_endpoint "GET" "/notion/sections/popular?limit=10" "Get Popular Pages"
test_endpoint "GET" "/notion/sections/hierarchy" "Get Hierarchy"
test_endpoint "GET" "/notion/sections/folder/1cd05f8b-eced-8031-a02c-fbd7d02e073e/pages" "Get Pages in Folder"

echo "📋 ========================================"
echo "🔧 ADVANCED QUERIES TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/pages?filter=%7B%22property%22%3A%22Category%22%2C%22select%22%3A%7B%22equals%22%3A%22JavaScript%22%7D%7D" "Get Pages with Filter (JavaScript)"
test_endpoint "GET" "/notion/pages?sorts=%5B%7B%22property%22%3A%22Title%22%2C%22direction%22%3A%22ascending%22%7D%5D" "Get Pages with Sort"
test_endpoint "GET" "/notion/pages?filter=%7B%22property%22%3A%22Type%22%2C%22select%22%3A%7B%22equals%22%3A%22Article%22%7D%7D&sorts=%5B%7B%22property%22%3A%22Title%22%2C%22direction%22%3A%22ascending%22%7D%5D" "Get Pages with Filter and Sort"

echo "📋 ========================================"
echo "📊 DATA ANALYSIS TESTS"
echo "📋 ========================================"

test_endpoint "GET" "/notion/sections/categories" "Get Database Statistics"
test_endpoint "GET" "/notion/categories/tree/structure" "Get Content Overview"

echo "📋 ========================================"
echo "🎯 TEST DE ESTRUCTURA JERÁRQUICA"
echo "📋 ========================================"

echo "🔍 Verificando estructura de categorías..."
categories_response=$(curl -s "$BASE_URL/notion/categories")
echo "   Categorías disponibles: $(echo "$categories_response" | jq -r '.categories[]?' 2>/dev/null | tr '\n' ', ')"
echo ""

echo "🔍 Verificando contenido de JavaScript..."
js_response=$(curl -s "$BASE_URL/notion/categories/JavaScript")
js_pages_count=$(echo "$js_response" | jq '.pages | length' 2>/dev/null || echo "0")
js_subcategories_count=$(echo "$js_response" | jq '.subcategories | length' 2>/dev/null || echo "0")
js_articles_count=$(echo "$js_response" | jq '.articles | length' 2>/dev/null || echo "0")
echo "   JavaScript - Páginas: $js_pages_count, Subcategorías: $js_subcategories_count, Artículos: $js_articles_count"
echo ""

echo "🔍 Verificando contenido de HTML..."
html_response=$(curl -s "$BASE_URL/notion/categories/HTML")
html_pages_count=$(echo "$html_response" | jq '.pages | length' 2>/dev/null || echo "0")
html_subcategories_count=$(echo "$html_response" | jq '.subcategories | length' 2>/dev/null || echo "0")
html_articles_count=$(echo "$html_response" | jq '.articles | length' 2>/dev/null || echo "0")
echo "   HTML - Páginas: $html_pages_count, Subcategorías: $html_subcategories_count, Artículos: $html_articles_count"
echo ""

echo "🔍 Verificando contenido de React..."
react_response=$(curl -s "$BASE_URL/notion/categories/React")
react_pages_count=$(echo "$react_response" | jq '.pages | length' 2>/dev/null || echo "0")
react_subcategories_count=$(echo "$react_response" | jq '.subcategories | length' 2>/dev/null || echo "0")
react_articles_count=$(echo "$react_response" | jq '.articles | length' 2>/dev/null || echo "0")
echo "   React - Páginas: $react_pages_count, Subcategorías: $react_subcategories_count, Artículos: $react_articles_count"
echo ""

echo "🔍 Verificando contenido de SQL..."
sql_response=$(curl -s "$BASE_URL/notion/categories/SQL")
sql_pages_count=$(echo "$sql_response" | jq '.pages | length' 2>/dev/null || echo "0")
sql_subcategories_count=$(echo "$sql_response" | jq '.subcategories | length' 2>/dev/null || echo "0")
sql_articles_count=$(echo "$sql_response" | jq '.articles | length' 2>/dev/null || echo "0")
echo "   SQL - Páginas: $sql_pages_count, Subcategorías: $sql_subcategories_count, Artículos: $sql_articles_count"
echo ""

echo "📋 ========================================"
echo "🔍 TEST DE BÚSQUEDA"
echo "📋 ========================================"

echo "🔍 Buscando contenido relacionado con 'React'..."
search_response=$(curl -s "$BASE_URL/notion/categories/search/React")
search_count=$(echo "$search_response" | jq 'length' 2>/dev/null || echo "0")
echo "   Resultados de búsqueda para 'React': $search_count"
echo ""

echo "🔍 Buscando contenido relacionado con 'JavaScript'..."
search_js_response=$(curl -s "$BASE_URL/notion/categories/search/JavaScript")
search_js_count=$(echo "$search_js_response" | jq 'length' 2>/dev/null || echo "0")
echo "   Resultados de búsqueda para 'JavaScript': $search_js_count"
echo ""

echo "📋 ========================================"
echo "📊 ESTADÍSTICAS FINALES"
echo "📋 ========================================"

# Obtener estadísticas generales
all_pages_response=$(curl -s "$BASE_URL/notion/pages")
total_pages=$(echo "$all_pages_response" | jq 'length' 2>/dev/null || echo "0")

categories_response=$(curl -s "$BASE_URL/notion/sections/categories")
total_categories=$(echo "$categories_response" | jq '.categories | length' 2>/dev/null || echo "0")

articles_response=$(curl -s "$BASE_URL/notion/sections/articles")
total_articles=$(echo "$articles_response" | jq 'length' 2>/dev/null || echo "0")

folders_response=$(curl -s "$BASE_URL/notion/sections/folders")
total_folders=$(echo "$folders_response" | jq 'length' 2>/dev/null || echo "0")

echo "📊 Resumen de la Base de Datos:"
echo "   📄 Total de páginas: $total_pages"
echo "   📂 Total de categorías: $total_categories"
echo "   📝 Total de artículos: $total_articles"
echo "   📁 Total de carpetas: $total_folders"
echo ""

echo "🎉 ¡Test Completo Finalizado!"
echo "📋 Revisa los resultados arriba para verificar el funcionamiento de todos los endpoints." 