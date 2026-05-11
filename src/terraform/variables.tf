# Este archivo define las variables de entrada para la configuración de Terraform,
# permitiendo la parametrización de credenciales y configuraciones del despliegue.

variable "pm_api_url" {
  description = "URL del servidor Proxmox"
  type        = string
}

variable "pm_node" {
  description = "Proxmox target node"
  type        = string
}

variable "pm_template" {
  description = "Plantilla de la que se clona la MV"
  type = string
}

# variable "pm_user" {
#   description = "PVE username"
#   type        = string
# }

# variable "pm_password" {
#   description = "PVE password"
#   type        = string
# }  

variable "pm_api_token_id" {
  description = "Id del token"
  type        = string
}

variable "pm_api_token_secret" {
 description = "Token secret"
 type        = string
 sensitive   = true
}

variable "pm_pool" {
  description = "Pool del usuario"
  type = string
}

variable "pm_storage" {
  description = "Almacenamiento de los discos"
  type = string
}

variable "pm_bridge" {
  description = "Tarjeta de red de puente"
  type = string
}

variable "ci_user" {
  description = "Usuario por defecto para la máquina virtual (Cloud-Init)"
  type        = string
}

variable "ci_password" {
  description = "Contraseña para el usuario de la máquina virtual (Cloud-Init)"
  type        = string
  sensitive   = true
}

# variable "ssh_key_file" {
#  description = "Public key to insert in the VM"
#  type = string
#}

variable "ip" {
  description = "Dirección IP"
  type = string
}

variable "mask" {
  description = "Máscara de subred"
  type = string
}

variable "gw" {
  description = "Dirección Gateway"
  type = string
}