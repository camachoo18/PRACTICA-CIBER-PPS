#!/bin/bash

# 🤖 Script de verificación post-instalación
# Verifica que todo se instaló correctamente

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REMOTE_HOST="${1:-debian13}"
INVENTORY="$SCRIPT_DIR/hosts"

echo "🔍 Verificando instalación en $REMOTE_HOST..."
echo ""

# Verificar Node.js
echo "✅ Versión de Node.js:"
ansible $REMOTE_HOST -i $INVENTORY -m shell -a "node --version"
echo ""

# Verificar npm
echo "✅ Versión de npm:"
ansible $REMOTE_HOST -i $INVENTORY -m shell -a "npm --version"
echo ""

# Verificar que la aplicación está clonada
echo "✅ Directorio de la aplicación:"
ansible $REMOTE_HOST -i $INVENTORY -m shell -a "ls -la /opt/practica-ciber-pps | head -20"
echo ""

# Verificar que node_modules existe
echo "✅ Módulos de Node.js:"
ansible $REMOTE_HOST -i $INVENTORY -m shell -a "ls /opt/practica-ciber-pps/node_modules | wc -l"
echo ""

# Verificar estado del servicio
echo "✅ Estado del servicio:"
ansible $REMOTE_HOST -i $INVENTORY -m systemd -a "name=practica-ciber-pps state=started"
echo ""

# Ver logs recientes
echo "✅ Últimos logs de la aplicación:"
ansible $REMOTE_HOST -i $INVENTORY -m shell -a "journalctl -u practica-ciber-pps -n 20"
echo ""

# Verificar conectividad al puerto
echo "✅ Verificando puerto 3000:"
ansible $REMOTE_HOST -i $INVENTORY -m wait_for -a "port=3000 timeout=5"
echo ""

echo "🎉 Verificación completada!"
