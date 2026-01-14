@echo off
REM Script de setup para Windows
REM Crea el archivo .env con JWT_SECRET aleatorio

chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ════════════════════════════════════════════════════
echo    🚀 Setup Proyecto - Sistema de Registro IMC
echo ════════════════════════════════════════════════════
echo.

REM 1. Crear archivo .env con JWT_SECRET aleatorio
echo 📝 Creando archivo .env...

REM Generar número aleatorio para simular JWT_SECRET único
for /f %%A in ('powershell -Command "[guid]::NewGuid().ToString().Replace('-','')"') do set GUID=%%A

(
  echo JWT_SECRET=%GUID%
  echo PORT=3000
  echo NODE_ENV=development
) > .env

if exist .env (
    echo ✅ Archivo .env creado con clave única generada
    echo 🔒 Tu JWT_SECRET ha sido generado automáticamente
) else (
    echo ❌ Error al crear .env
    pause
    exit /b 1
)

REM 2. Crear carpeta data si no existe
if not exist "data" (
    echo 📁 Creando carpeta data...
    mkdir data
    echo ✅ Carpeta data creada
) else (
    echo ✅ Carpeta data ya existe
)

REM 3. Crear archivo records.json si no existe
if not exist "data\records.json" (
    echo 📄 Creando data/records.json...
    (
      echo {
      echo   "records": []
      echo }
    ) > data\records.json
    echo ✅ data/records.json creado
) else (
    echo ⚠️  data/records.json ya existe, no se sobrescribe
)

REM 4. Crear .gitignore si no existe o actualizar
if not exist ".gitignore" (
    echo 🔒 Creando .gitignore...
    (
      echo # Dependencies
      echo node_modules/
      echo.
      echo # Environment variables
      echo .env
      echo .env.local
      echo .env.*.local
      echo.
      echo # Database
      echo *.db
      echo *.sqlite
      echo *.sqlite3
      echo.
      echo # Coverage
      echo coverage/
      echo.
      echo # Build
      echo dist/
      echo build/
      echo.
      echo # OS
      echo .DS_Store
      echo Thumbs.db
      echo.
      echo # Logs
      echo *.log
      echo npm-debug.log*
      echo yarn-debug.log*
      echo yarn-error.log*
      echo.
      echo # IDE
      echo .vscode/
      echo .idea/
      echo *.swp
      echo *.swo
    ) > .gitignore
    echo ✅ .gitignore creado
) else (
    echo ✅ .gitignore ya existe
)

REM 5. Instalar dependencias
echo.
echo 📦 Instalando dependencias npm...
echo    (Esto puede tardar un momento)
echo.

call npm install

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ Dependencias instaladas correctamente
) else (
    echo.
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

REM 6. Verificar base de datos SQLite
if not exist "data\imc.db" (
    echo 🗄️  Base de datos SQLite se creará al iniciar el servidor
) else (
    echo ✅ Base de datos SQLite ya existe
)

REM Resumen final
echo.
echo ════════════════════════════════════════════════════
echo    ✅ Setup completado exitosamente!
echo ════════════════════════════════════════════════════
echo.
echo 📋 Archivos creados/verificados:
echo    ✅ .env                 (variables de entorno)
echo    ✅ data/records.json    (almacenamiento registros)
echo    ✅ .gitignore           (control de versiones)
echo    ✅ node_modules/        (dependencias)
echo.
echo 📋 Próximos pasos:
echo.
echo    1. Iniciar el servidor:
echo       npm start
echo.
echo    2. Abrir en navegador:
echo       http://localhost:3000
echo.
echo    3. Ejecutar tests (opcional):
echo       npm test
echo       npm run test:coverage
echo.
echo 🎉 ¡Listo para usar!
echo.
pause
