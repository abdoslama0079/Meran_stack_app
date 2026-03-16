resource "azurerm_resource_group" "rg_name_tf" {
  location = var.location
  name     = var.rg_name
}

module "Vnet" {
  source = "./modules/Vnet"

  location   = var.location
  rg_name    = var.rg_name
  depends_on = [azurerm_resource_group.rg_name_tf]
}

module "ACR" {
  source = "./modules/ACR"

  acr_location = var.location
  rg_name      = var.rg_name
  depends_on   = [azurerm_resource_group.rg_name_tf]
}

module "AKS" {
  source = "./modules/AKS"

  aks_location = var.location
  acr_id       = module.ACR.acr_id
  subnet       = module.Vnet.aks_subnet
  rg_name      = var.rg_name
  depends_on   = [module.ACR, module.Vnet]
}
