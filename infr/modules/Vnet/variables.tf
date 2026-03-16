variable "rg_name" {
  type = string
  default = "meran_stack_rg"
}

variable "location" {
  type = string
  default = "australiaeast"
}

variable "meran_stack_vnet" {
  type = string
  default = "meran_stack_vnet"
}

variable "address_space" {
  default = ["10.1.0.0/16"]
}

variable "address_prefix" {
  default = ["10.1.1.0/24"]
}

variable "aks_subnet_name" {
  type = string
  default = "aks_subnet"
}