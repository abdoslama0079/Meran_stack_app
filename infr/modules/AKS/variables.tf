variable "aks_location" {
  type = string
}
variable "cluser_name" {
  type = string
  default = "meran_stack_app"
}
variable "rg_name" {
  type = string
}

variable "acr_id" {
  type = string
}

variable "subnet" {}