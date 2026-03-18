resource "azurerm_resource_group" "rg_name_tf" {
  location = var.location
  name     = var.rg_name
}

module "Vnet" {
  source = "./modules/Vnet"

  location    = var.location
  rg_name     = azurerm_resource_group.rg_name_tf
  aks_storage = module.StorageAccount.aks_storage_id
  depends_on  = [module.StorageAccount]
}

module "StorageAccount" {
  source        = "./modules/StorageAccount"
  location      = var.location
  rg_name       = azurerm_resource_group.rg_name_tf
}

resource "azurerm_storage_account_network_rules" "lockdown" {
  storage_account_id = module.StorageAccount.aks_storage_id
  default_action     = "Deny"
  bypass             = ["AzureServices"]
  virtual_network_subnet_ids = [module.Vnet.aks_subnet_id]
}

module "ACR" {
  source = "./modules/ACR"

  acr_location = var.location
  rg_name      = azurerm_resource_group.rg_name_tf
}

module "KeyVault" {
  source      = "./modules/Key vault"
  kv_location = var.location
  rg_name     = azurerm_resource_group.rg_name_tf
}

module "AKS" {
  source = "./modules/AKS"

  aks_location = var.location
  acr_id       = module.ACR.acr_id
  subnet       = module.Vnet.aks_subnet_id
  rg_name      = azurerm_resource_group.rg_name_tf
  rg_id        = azurerm_resource_group.rg_name_tf.id
  kv_aks_id    = module.KeyVault.key_vault_id

  depends_on = [module.ACR, module.Vnet, module.KeyVault]
}

