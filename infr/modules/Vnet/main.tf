resource "azurerm_virtual_network" "vnet" {
  location            = var.location
  name                = var.meran_stack_vnet
  resource_group_name = var.rg_name
  address_space       = var.address_space
}

resource "azurerm_subnet" "aks_subnet" {
  address_prefixes     = var.address_prefix
  name                 = var.aks_subnet_name
  resource_group_name  = var.rg_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  service_endpoints    = ["Microsoft.Storage"]
}

resource "azurerm_subnet" "storage_subnet" {
  address_prefixes     = var.storage_address_prefix
  name                 = var.storage_subnet_name
  resource_group_name  = var.rg_name
  virtual_network_name = azurerm_virtual_network.vnet.name
}

resource "azurerm_private_endpoint" "storage_pe" {
  location            = var.location
  name                = "pe-aks-storage"
  resource_group_name = var.rg_name
  subnet_id           = azurerm_subnet.storage_subnet.id
  private_service_connection {
    name                           = "storage-connection"
    private_connection_resource_id = var.aks_storage
    is_manual_connection           = false
    subresource_names              = ["blob"] # Connect to the Blob service specifically
  }
  private_dns_zone_group {
    name                 = "storage-dns-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.blob_dns.id]
  }
}

resource "azurerm_private_dns_zone" "blob_dns" {
  name                = "privatelink.blob.core.windows.net"
  resource_group_name = var.rg_name
}

resource "azurerm_private_dns_zone_virtual_network_link" "dns_link" {
  name                  = "storage-dns-link"
  resource_group_name   = var.rg_name
  private_dns_zone_name = azurerm_private_dns_zone.blob_dns.name
  virtual_network_id    = azurerm_virtual_network.vnet.id
}
