# Key vault output
output "key_vault_id" {
  description = "The ID of the Key Vault"
  value       = module.KeyVault.key_vault_id
}

output "key_vault_uri" {
  description = "The URI of the Key Vault (needed for K8s SecretProviderClass)"
  value       = module.KeyVault.key_vault_uri
}

output "key_vault_name" {
  description = "The Name of the Key Vault"
  value       = module.KeyVault.key_vault_name
}


# ACR output
output "acr_name" {
  value = module.ACR.acr_name
}

output "acr_login_server" {
  value      = module.ACR.acr_login_server
}

output "acr_id" {
  value = module.ACR.acr_id
}

# AKS output
output "kube_config" {
  value     = module.AKS.kube_config
  sensitive = true
}

output "oidc_issuer_url" {
  value = module.AKS.oidc_issuer_url
}

output "user_identity_client_id" {
  value       = module.AKS.user_identity_client_id
}


# Storage account output
output "aks_storage_account_name" {
  value = module.StorageAccount.aks_storage_account_name
}
output "aks_storage_id" {
  value = module.StorageAccount.aks_storage_id
}

output "aks_storage_account_private_end_point" {
  value = module.StorageAccount.aks_storage_account_private_end_point
}

output "storage_container_name" {
  value = module.StorageAccount.storage_container_name
}
