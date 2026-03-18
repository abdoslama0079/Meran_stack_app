resource "azurerm_storage_account" "aks_storage_account" {
  name                     = var.storage_account_name
  resource_group_name      = var.rg_name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "aks_db" {
  name = var.storage_container_name
  storage_account_id = azurerm_storage_account.aks_storage_account.id
  container_access_type = "private"
}