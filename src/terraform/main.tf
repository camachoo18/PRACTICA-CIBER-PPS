resource "proxmox_vm_qemu" "vm_instance_1" {

  # Nombre de la MV
  name = "backend-app-alvaro-estiven"

  # Nombre de tu nodo en Proxmox
  target_node = var.pm_node

  # Habilita el agente de qemu
  agent = 1

  # Memoria de la MV
  memory = 8192 

  # Tipo de controlador SCSI
  scsihw = "virtio-scsi-single"

  # Tipo de sistema operativo
  os_type = "cloud-init"

  # Pool al que pertenece la MV
  pool = var.pm_pool

  # Estado de la MV
  vm_state = "running"

  # El orden de arranque debe ser el mismo que el del disco del SO de la plantilla
  boot = "order=scsi0"

  # Plantilla de la que se clona la MV, que ya debe estar creada en Proxmox
  clone = var.pm_template

  # Clave (pública) SSH
  # sshkeys = file(var.ssh_key_file)

  #
  # Cloud-Init configuration
  #

  # Habilita el agente de qemu (/var/lib/vz/snippets/qemu-guest-agent.yml)
  cicustom   = "vendor=local:snippets/qemu-guest-agent.yml"

  # Hace apt update & apt upgrade al arrancar la VM
  ciupgrade  = true

  # DNS
  # nameserver = "192.168.0.1 8.8.8.8"

  # Configura IP
  # ipconfig0  = "ip=192.168.0.200/24,gw=192.168.0.1,ip6=dhcp"
  # ipconfig0  = "ip=dhcp,ip6=dhcp"
  ipconfig0 = "ip=${var.ip}/${var.mask},gw=${var.gw},ip6=dhcp"

  # Deshabilita IPv6
  skip_ipv6  = true

  # Usuario y contraseña de la MV
  ciuser     = var.ci_user
  cipassword = var.ci_password

  # La mayoría de las imágenes cloud-init requieren un dispositivo
  # serie para su visualización
  serial { id = 0 }

  # Configuración de hardware
  cpu {

    # Número de núcleos que la MV verá
    cores = 4

    # Número de sockets que la MV verá
    sockets = 1

    # El número total de hebras o vCPUs será cores * sockets
    # Tipo de modelo de CPU virtual
    type = "host"
  }

  # Configuración de disco

  disks {
    scsi {
      scsi0 {
        disk {
          storage = var.pm_storage
          size = "20G"
        }
      }
    }
    ide {
      # Algunas imágenes requieren un disco cloud-init en el controlador IDE,
      # otras en el controlador SCSI o SATA
      ide1 {
        cloudinit {
          storage = var.pm_storage
        }
      }
    }
  }

  # Configuración de red

  network {
    id     = 0
    model  = "virtio"
    bridge = var.pm_bridge
  }

}
