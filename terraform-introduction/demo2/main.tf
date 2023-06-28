# main.tf
resource "azurerm_resource_group" "rg" {
  name     = "bud1rlz_tf_cop_demo2"
  location = var.location
  tags     = { "owner" = "bud1rlz" }
}