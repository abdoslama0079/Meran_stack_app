resource "azurerm_virtual_network" "vnet" {
  location            = var.location
  name                = var.meran_stack_vnet
  resource_group_name = var.rg_name
  address_space = var.address_space
}

resource "azurerm_subnet" "aks_subnet" {
  address_prefixes = var.address_prefix
  name                 = var.aks_subnet_name
  resource_group_name  = var.rg_name
  virtual_network_name = azurerm_virtual_network.vnet.name
}