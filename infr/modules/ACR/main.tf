resource "azurerm_container_registry" "acr" {
  location            = var.acr_location
  name                = var.container_registry_name
  resource_group_name = var.rg_name
  sku                 = "Standard"
  admin_enabled = false
}