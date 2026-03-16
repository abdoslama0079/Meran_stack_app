terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.32.0"
    }
  }
}
resource "tls_private_key" "ssh_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

data "azurerm_kubernetes_service_versions" "aks_version" {
  location        = var.aks_location
  include_preview = false
}

resource "azurerm_kubernetes_cluster" "meran_stack_app" {
  location                          = var.aks_location
  name                              = var.cluser_name
  resource_group_name               = var.rg_name
  dns_prefix                        = "${var.rg_name}-cluster"
  kubernetes_version                = data.azurerm_kubernetes_service_versions.aks_version
  node_resource_group               = "${var.rg_name}-node-group"
  sku_tier                          = "Free"
  role_based_access_control_enabled = true

  default_node_pool {
    name                 = "systempool"
    vm_size              = "Standard_D2s_v3"
    auto_scaling_enabled = true
    min_count            = 1
    max_count            = 2
    vnet_subnet_id       = var.subnet
  }

  identity {
    type = "SystemAssigned"
  }

  linux_profile {
    admin_username = "ubuntu"
    ssh_key {
      key_data = tls_private_key.ssh_key.public_key_openssh
    }
  }
  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "app_pool" {
  kubernetes_cluster_id = azurerm_kubernetes_cluster.meran_stack_app.id
  name                  = "apppool"
  vm_size               = "Standard_D2s_v3"
  vnet_subnet_id        = var.subnet
  node_count            = 1
  node_labels = {
    workload = "applications"
  }
}

resource "azurerm_role_assignment" "acr_aks_assignment" {
  principal_id         = azurerm_kubernetes_cluster.meran_stack_app.kubelet_identity[0].object_id
  scope                = var.acr_id
  role_definition_name = "AcrPull"
  depends_on           = [azurerm_kubernetes_cluster.meran_stack_app]
}
