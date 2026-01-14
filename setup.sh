#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   🚀 Setup Proyecto - Sistema de Registro IMC${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# 1. Crear archivo .env
echo -e "${YELLOW}📝 Creando archivo .env...${NC}"

cat > .env << 'EOF'
JWT_SECRET=APPClassPPS
PORT=3000
NODE_ENV=development
EOF

if [ -f .env ]; then
    echo -e "${GREEN}✅ Archivo .env creado exitosamente${NC}"
else
    echo -e "${RED}❌ Error al crear .env${NC}"
    exit 1
fi

# 2. Crear carpeta data si no existe
if [ ! -d "data" ]; then
    echo -e "${YELLOW}📁 Creando carpeta data...${NC}"
    mkdir -p data
    echo -e "${GREEN}✅ Carpeta data creada${NC}"
else
    echo -e "${GREEN}✅ Carpeta data ya existe${NC}"
fi

# 3. Crear archivo records.json si no existe
if [ ! -f "data/records.json" ]; then
    echo -e "${YELLOW}📄 Creando data/records.json...${NC}"
    cat > data/records.json << 'EOF'
{
  "records": []
}
EOF
    echo -e "${GREEN}✅ data/records.json creado${NC}"
else
    echo -e "${YELLOW}⚠️  data/records.json ya existe, no se sobrescribe${NC}"
fi

# 4. Crear .gitignore si no existe o actualizar
if [ ! -f ".gitignore" ]; then
    echo -e "${YELLOW}🔒 Creando .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Database
*.db
*.sqlite
*.sqlite3

# Coverage
coverage/

# Build
dist/
build/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
EOF
    echo -e "${GREEN}✅ .gitignore creado${NC}"
else
    # Verificar que .env está en .gitignore
    if ! grep -q "^\.env$" .gitignore; then
        echo -e "${YELLOW}⚠️  Añadiendo .env a .gitignore${NC}"
        echo "" >> .gitignore
        echo "# Environment variables" >> .gitignore
        echo ".env" >> .gitignore
    fi
    echo -e "${GREEN}✅ .gitignore actualizado${NC}"
fi

# 5. Instalar dependencias
echo ""
echo -e "${YELLOW}📦 Instalando dependencias npm...${NC}"
echo -e "${BLUE}   (Esto puede tardar un momento)${NC}"
echo ""

npm install

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
else
    echo ""
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

# 6. Verificar base de datos SQLite (se creará automáticamente)
if [ ! -f "data/imc.db" ]; then
    echo -e "${YELLOW}🗄️  Base de datos SQLite se creará al iniciar el servidor${NC}"
else
    echo -e "${GREEN}✅ Base de datos SQLite ya existe${NC}"
fi

# Resumen final
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✅ Setup completado exitosamente!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📋 Archivos creados/verificados:${NC}"
echo "   ✅ .env                 (variables de entorno)"
echo "   ✅ data/records.json    (almacenamiento registros)"
echo "   ✅ .gitignore           (control de versiones)"
echo "   ✅ node_modules/        (dependencias)"
echo ""
echo -e "${BLUE}📋 Próximos pasos:${NC}"
echo ""
echo -e "${YELLOW}   1. Iniciar el servidor:${NC}"
echo "      npm start"
echo ""
echo -e "${YELLOW}   2. Abrir en navegador:${NC}"
echo "      http://localhost:3000"
echo ""
echo -e "${YELLOW}   3. Ejecutar tests (opcional):${NC}"
echo "      npm test"
echo "      npm run test:coverage"
echo ""
echo -e "${GREEN} ¡Listo para usar!${NC}"
echo ""