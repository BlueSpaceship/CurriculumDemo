resource "azurerm_resource_group" "rg" {
  name     = "cop-cloud-tf-demo-ghactions"
  location = "west europe"
  tags     = { "owner" = "caj1rlz" }
}

resource "azurerm_container_group" "aci" {
  name                = "cop-cloud-tf-demo-ghactions-aci"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  ip_address_type     = "Public"
  dns_name_label      = "cop-cloud-tf-demoghactions"
  os_type             = "Linux"

  container {
    name   = "hello-world"
    image  = "mcr.microsoft.com/azuredocs/aci-helloworld:latest"
    cpu    = "0.5"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }
  }
}
