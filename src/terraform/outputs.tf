# Muestra la dirección IP (útil para conectar por SSH de inmediato)
output "vm_ip_address" {
  description = "La dirección IP pública/privada de la instancia"
  value       = proxmox_vm_qemu.vm_instance_1.default_ipv4_address
}

# Muestra el nombre del nodo donde se desplegó
output "proxmox_node" {
  description = "Nodo de Proxmox donde reside la VM"
  value       = proxmox_vm_qemu.vm_instance_1.target_node
}

# Muestra el ID de la VM (útil para comandos de consola 'qm')
output "vm_id" {
  description = "El ID único de la máquina virtual"
  value       = proxmox_vm_qemu.vm_instance_1.vmid
}

# Muestra un string formateado listo para copiar y pegar
output "ssh_command" {
  description = "Conectar por SSH"
  value       = "ssh ${var.ci_user}@${proxmox_vm_qemu.vm_instance_1.default_ipv4_address}"
}