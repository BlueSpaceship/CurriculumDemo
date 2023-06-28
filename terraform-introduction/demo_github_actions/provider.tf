# provider.tf
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.48.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  tenant_id       = var.subscription_tenant_id
  client_id       = var.service_principal_appid
  client_secret   = var.service_principal_password
}
