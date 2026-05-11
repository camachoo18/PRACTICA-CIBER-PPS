# 🚀 GUÍA PARA EJECUTAR ANSIBLE

## 🔴 Problema Detectado

El servidor SSH de tu VM Debian 13 está configurado para aceptar **SOLO autenticación por clave pública**.

Tu contraseña `1234` no funciona por SSH porque:
- `PasswordAuthentication` está deshabilitado en `/etc/ssh/sshd_config`
- Solo acepta autenticación por clave privada

## ✅ Solución: 2 Opciones

### OPCIÓN 1: Habilitar autenticación por contraseña (RECOMENDADO)

#### Paso 1: Conectar a la VM
```bash
# Aquí necesitas entrar físicamente a la VM o usar otra herramienta de acceso
# Si tienes acceso local, conecta a la consola de Proxmox
# Usuario: admin
# Contraseña: 1234
```

#### Paso 2: Copiar el script
En tu máquina local:
```bash
scp -o PubkeyAuthentication=no src/ansible/enable-ssh-password.sh admin@10.5.1.38:~/
```

O manualmente, en la VM Debian:
```bash
sudo nano /etc/ssh/sshd_config
```

#### Paso 3: Modificar SSH Config
Busca estas líneas:
```
PasswordAuthentication no
```

Cambia a:
```
PasswordAuthentication yes
```

Guarda: `Ctrl+O` → `Enter` → `Ctrl+X`

#### Paso 4: Reiniciar SSH
```bash
sudo systemctl restart ssh
```

#### Paso 5: Vuelve a tu máquina local y ejecuta Ansible
```bash
cd /home/alvaro/Escritorio/PRACTICA-CIBER-PPS/src/ansible
./run.sh
```

---

### OPCIÓN 2: Usar autenticación por clave SSH

Si ya tienes clave SSH configurada en Debian, puedes usarla:

#### Paso 1: Generar clave SSH (si no tienes)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/ansible_key -N ""
```

#### Paso 2: Copiar clave pública a la VM
```bash
ssh-copy-id -i ~/.ssh/ansible_key.pub -o PubkeyAuthentication=no admin@10.5.1.38
```

#### Paso 3: Actualizar archivo hosts
```bash
nano /home/alvaro/Escritorio/PRACTICA-CIBER-PPS/src/ansible/hosts
```

Reemplaza:
```ini
debian13 ansible_host=10.5.1.38 ansible_user=admin ansible_ssh_pass=1234 ansible_become_pass=1234 ansible_ssh_common_args='-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null'
```

Con:
```ini
debian13 ansible_host=10.5.1.38 ansible_user=admin ansible_ssh_private_key_file=~/.ssh/ansible_key ansible_become_pass=1234 ansible_ssh_common_args='-o StrictHostKeyChecking=no'
```

#### Paso 4: Ejecutar Ansible
```bash
cd /home/alvaro/Escritorio/PRACTICA-CIBER-PPS/src/ansible
./run.sh
```

---

## 📋 Checklist

- [ ] ¿Habilitaste PasswordAuthentication en sshd_config?
- [ ] ¿Reiniciaste SSH (`sudo systemctl restart ssh`)?
- [ ] ¿Verificaste con `ssh admin@10.5.1.38 "whoami"`?
- [ ] ¿Ya ejecutaste `./run.sh`?
- [ ] ¿La app está en `http://10.5.1.38:3000`?

---

## 🌐 Una vez que Ansible termine...

### Acceder a la aplicación web

1. **Abre tu navegador** y ve a:
   ```
   http://10.5.1.38:3000
   ```

2. **Deberías ver** la página de login de IMC

3. **Para hacer login**, necesitas registrarte primero:
   - Click en "Registrarse" o "Register"
   - Completa el formulario
   - Usa tu usuario y contraseña

4. **Una vez logueado** puedes:
   - Calcular tu IMC
   - Ver historial de registros
   - Acceder a la parte de admin

### Ver logs de la aplicación

```bash
ssh admin@10.5.1.38
journalctl -u practica-ciber-pps -f
```

### Verificar que todo está funcionando

```bash
ssh admin@10.5.1.38
systemctl status practica-ciber-pps
netstat -tlnp | grep 3000
```

---

## 🆘 Si algo no funciona

### Problema: "Permission denied (publickey)"

**Solución**: Asegúrate de:
1. Editar `/etc/ssh/sshd_config` correctamente
2. Reiniciar SSH: `sudo systemctl restart ssh`
3. Verificar: `grep PasswordAuthentication /etc/ssh/sshd_config` (debe decir `yes`)

### Problema: Ansible no se conecta

**Solución**: Verifica conectividad SSH:
```bash
sshpass -p "1234" ssh -o PubkeyAuthentication=no -o StrictHostKeyChecking=no admin@10.5.1.38 "whoami"
```

Debería mostrar: `admin`

### Problema: La en `http://10.5.1.38:3000` no responde

**Solución**: Verifica estado de la app:
```bash
ssh admin@10.5.1.38
systemctl status practica-ciber-pps
journalctl -u practica-ciber-pps -n 50
```

### Problema: Puerto 3000 no abierto

**Solución**: Abre el firewall:
```bash
ssh admin@10.5.1.38
sudo ufw allow 3000/tcp
sudo ufw reload
```

---

## 📞 Resumen

| Paso | Acción |
|------|--------|
| 1 | Habilitar PasswordAuthentication en `/etc/ssh/sshd_config` |
| 2 | Reiniciar SSH: `sudo systemctl restart ssh` |
| 3 | Ejecutar Ansible: `./run.sh` |
| 4 | Esperar 10-15 minutos a que instale todo |
| 5 | Acceder a `http://10.5.1.38:3000` |
| 6 | ¡Disfrutar! 🎉 |
