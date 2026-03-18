variable "rg_name" {
  type = string
}

variable "location" {
  type = string
}

variable "storage_account_name" {
  type = string
  default = "aksstorage097351716"
}

variable "storage_container_name" {
  type = string
  default = "aks_db"
}