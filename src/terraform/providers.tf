terraform {
  required_version = ">= 1.0.0"

  required_providers {
    proxmox = {
      source  = "telmate/proxmox"
      version = "3.0.2-rc07" 
    }
  }
}

provider "proxmox" {
  # URL de la API (ej: https://192.168.1.100:8006/api2/json)
  pm_api_url = var.pm_api_url

  # Autenticación mediante API Token (Recomendado por seguridad)
  pm_api_token_id     = var.pm_api_token_id
  pm_api_token_secret = var.pm_api_token_secret

  # Configuración de TLS
  # Se pone en 'true' si usas certificados auto-firmados (sin SSL válido)
  pm_tls_insecure = true 
}