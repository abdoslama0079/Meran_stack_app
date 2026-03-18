output "aks_storage_account_name" {
  value = azurerm_storage_account.aks_storage_account.name
}
output "aks_storage_id" {
  value = azurerm_storage_account.aks_storage_account.id
}

output "aks_storage_account_private_end_point" {
  value = azurerm_storage_account.aks_storage_account.primary_blob_endpoint
  depends_on = [azurerm_storage_account.aks_storage_account]
}

output "storage_container_name" {
  value = azurerm_storage_container.aks_db.name
}