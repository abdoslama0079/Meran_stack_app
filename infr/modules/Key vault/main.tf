data "azurerm_client_config" "current" {}

resource "azurerm_key_vault" "kv" {
  location                    = var.kv_location
  name                        = var.keyvault_name
  resource_group_name         = var.rg_name
  sku_name                    = "standard"
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  enabled_for_disk_encryption = true
  purge_protection_enabled    = false # Modify to true after finishing testing infra
  soft_delete_retention_days  = 7
  enable_rbac_authorization   = true
}

resource "azurerm_role_assignment" "kv_admin" {
  scope                = azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}