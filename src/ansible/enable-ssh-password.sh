#!/bin/bash

# 🔐 Habilitar autenticación por contraseña en SSH
# Ejecutar en la VM Debian 13 como admin (con sudo)

echo "=========================================="
echo "🔐 Habilitando autenticación SSH por contraseña"
echo "=========================================="
echo ""

# Crear backup del archivo original
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
echo "✅ Backup creado: /etc/ssh/sshd_config.backup"
echo ""

# Habilitar PasswordAuthentication
echo "📝 Actualizando /etc/ssh/sshd_config..."
sudo sed -i 's/^#PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
sudo sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config

# Asegurar que PubkeyAuthentication está habilitado también
sudo sed -i 's/^#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config

echo "✅ Configuración actualizada"
echo ""

# Validar sintaxis
echo "🔍 Validando sintaxis de sshd_config..."
sudo sshd -t
if [ $? -eq 0 ]; then
    echo "✅ Sintaxis válida"
    echo ""
    
    # Reiniciar SSH
    echo "🔄 Reiniciando SSH..."
    sudo systemctl restart ssh
    echo "✅ SSH reiniciado"
    echo ""
    
    echo "=========================================="
    echo "✅ ¡Listo! Autenticación por contraseña habilitada"
    echo "=========================================="
    echo ""
    echo "Ahora desde tu máquina local puedes ejecutar:"
    echo "  cd /ruta/a/PRACTICA-CIBER-PPS/src/ansible"
    echo "  ./run.sh"
else
    echo "❌ Error en la sintaxis de sshd_config"
    echo "Revertiendo cambios..."
    sudo cp /etc/ssh/sshd_config.backup /etc/ssh/sshd_config
    exit 1
fi
