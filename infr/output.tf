output "acr_login_server" {
  value = module.ACR.acr_login_server
  depends_on = [module.ACR]
}

