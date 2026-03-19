variable "aks_location" {
  type = string
}
variable "cluser_name" {
  type    = string
  default = "meran_stack_app"
}
variable "rg_name" {
  type = string
}

variable "rg_id" {}

variable "acr_id" {
  type = string
}

variable "subnet" {}

variable "kv_aks_id" {}

variable "k8s_namespace" {
  type    = string
  default = "mern-prod"
}

variable "k8s_service_account_name" {
  type    = string
  default = "mern-sa"
}
