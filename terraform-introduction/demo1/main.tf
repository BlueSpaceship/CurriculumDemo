# provider.tf
terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "3.48.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "bud1rlz_tf_cop_demo1"
  location = "west europe"
  tags     = { "owner" = "bud1rlz" }
}