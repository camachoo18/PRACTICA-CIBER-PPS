# 🤖 Ansible Playbook - Practica Ciber PPS

Este playbook de Ansible automatiza la instalación y configuración de la aplicación en una máquina Debian 13.

## 📋 Requisitos Previos

1. **Ansible instalado** en tu máquina local:
   ```bash
   pip install ansible>=2.9
   ```

2. **SSH configurado** hacia la máquina Debian 13:
   - Tener configurada la clave SSH (pública/privada)
   - O acceso con usuario/contraseña

3. **IP de la máquina Debian 13**

## 🚀 Instalación y Uso

### Paso 1: Configurar el inventario

Edita el archivo `hosts` y reemplaza la IP:

```bash
nano hosts
```

Busca esta línea:
```
debian13 ansible_host=192.168.0.XXX
```

Y reemplaza `192.168.0.XXX` con la IP real de tu máquina Debian 13.

### Paso 2: Verificar conectividad SSH

```bash
ansible all -i hosts -m ping
```

Deberías ver:
```
debian13 | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

### Paso 3: Ejecutar el playbook

```bash
ansible-playbook playbook.yml
```

O para ver más detalles:
```bash
ansible-playbook playbook.yml -v
```

O para ver mucho más detalle (debug):
```bash
ansible-playbook playbook.yml -vvv
```

## 📦 ¿Qué hace el playbook?

El playbook ejecuta los siguientes roles:

### 1. **system**
   - ✅ Actualiza paquetes del sistema
   - ✅ Instala dependencias base (git, curl, build-essential, etc.)
   - ✅ Crea usuario dedicado para la aplicación
   - ✅ Crea directorio de la aplicación

### 2. **nodejs**
   - ✅ Agrega repositorio NodeSource
   - ✅ Instala Node.js v20 y npm
   - ✅ Actualiza npm
   - ✅ Verifica versiones instaladas

### 3. **app**
   - ✅ Clona el repositorio git
   - ✅ Instala dependencias npm
   - ✅ Ejecuta setup.sh
   - ✅ Crea servicio systemd
   - ✅ Inicia la aplicación
   - ✅ Verifica que la aplicación esté respondiendo

## 🔧 Configuración Personalizada

Puedes editar variables en `playbook.yml`:

```yaml
vars:
  app_repo: "https://github.com/camachoo18/PRACTICA-CIBER-PPS.git"
  app_directory: "/opt/practica-ciber-pps"
  app_user: "app"
  app_port: 3000
```

## 🐛 Solución de Problemas

### Error de autenticación SSH
```bash
# Asegúrate de que tienes acceso SSH
ssh -i ~/.ssh/id_rsa root@192.168.0.XXX

# Si usas contraseña, puedes pasar la opción:
ansible-playbook playbook.yml --ask-pass
```

### Error de permisos
```bash
# Si necesitas usar sudo:
ansible-playbook playbook.yml --ask-become-pass
```

### Ver logs de la aplicación
```bash
ssh root@192.168.0.XXX
journalctl -u practica-ciber-pps -f
```

### Reiniciar la aplicación remotamente
```bash
ansible app_servers -i hosts -m systemd -a "name=practica-ciber-pps state=restarted"
```

## 📊 Estructura del Proyecto

```
ansible/
├── hosts                          # Archivo de inventario
├── ansible.cfg                    # Configuración de Ansible
├── playbook.yml                   # Playbook principal
├── README.md                      # Este archivo
└── roles/
    ├── system/
    │   └── tasks/
    │       └── main.yml          # Tareas de sistema
    ├── nodejs/
    │   └── tasks/
    │       └── main.yml          # Instalación de Node.js
    └── app/
        ├── tasks/
        │   └── main.yml          # Tareas de aplicación
        └── templates/
            └── app.service.j2    # Template del servicio
```

## 🌐 Acceso a la Aplicación

Una vez completada la ejecución del playbook:

1. **URL**: `http://<IP_DEBIAN>:3000`
2. **Usuario del sistema**: `app`
3. **Directorio**: `/opt/practica-ciber-pps`

## 🔄 Comandos Útiles

### Ver estado del servicio
```bash
ansible app_servers -i hosts -m systemd -a "name=practica-ciber-pps state=started"
```

### Ejecutar el playbook solo en una máquina
```bash
ansible-playbook playbook.yml -l debian13
```

### Ejecución en seco (dry-run)
```bash
ansible-playbook playbook.yml --check
```

### Variables adicionales en tiempo de ejecución
```bash
ansible-playbook playbook.yml -e "app_port=8080"
```

## 📝 Notas

- El playbook requiere acceso root o permisos sudo
- Idealmente usado con cloud-init o provisioning inicial
- El puerto por defecto es 3000 (modificable en variables)
- La aplicación se inicia automáticamente con el servicio systemd

## 🚨 Importante

- **Backup**: Realiza un backup antes de ejecutar en producción
- **Testing**: Prueba primero en un entorno de desarrollo
- **Firewalls**: Asegúrate de que el puerto 3000 está abierto
- **SSH Keys**: Configura las claves SSH de forma segura
