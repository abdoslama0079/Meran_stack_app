resource "azurerm_resource_group" "rg_name_tf" {
  location = var.location
  name     = var.rg_name
}

module "Vnet" {
  source = "./modules/Vnet"

  location    = var.location
  rg_name     = var.rg_name
  aks_storage = module.StorageAccount.aks_storage_id
  depends_on  = [azurerm_resource_group.rg_name_tf, module.StorageAccount]
}

module "StorageAccount" {
  source        = "./modules/StorageAccount"
  location      = var.location
  rg_name       = var.rg_name
  aks_subnet_id = module.Vnet.aks_subnet_id

  depends_on = [azurerm_resource_group.rg_name_tf]
}

module "ACR" {
  source = "./modules/ACR"

  acr_location = var.location
  rg_name      = var.rg_name
  depends_on   = [azurerm_resource_group.rg_name_tf]
}

module "KeyVault" {
  source      = "./modules/Key vault"
  kv_location = var.location
  rg_name     = var.rg_name
}

module "AKS" {
  source = "./modules/AKS"

  aks_location = var.location
  acr_id       = module.ACR.acr_id
  subnet       = module.Vnet.aks_subnet_id
  rg_name      = var.rg_name
  rg_id        = azurerm_resource_group.rg_name_tf.id
  kv_aks_id    = module.KeyVault.key_vault_id

  depends_on = [module.ACR, module.Vnet, module.KeyVault]
}

