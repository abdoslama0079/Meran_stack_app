output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  depends_on = [azurerm_container_registry.acr]
  value      = azurerm_container_registry.acr.login_server
}

output "acr_id" {
  value = azurerm_container_registry.acr.id
}

