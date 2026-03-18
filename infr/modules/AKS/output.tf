output "kube_config" {
  value     = azurerm_kubernetes_cluster.meran_stack_app.kube_config_raw
  sensitive = true
}

output "oidc_issuer_url" {
  value = azurerm_kubernetes_cluster.meran_stack_app.oidc_issuer_url
}

output "user_identity_client_id" {
  description = "The Client ID of the Managed Identity for Workload Identity"
  value       = azurerm_user_assigned_identity.kv_identity.client_id
}