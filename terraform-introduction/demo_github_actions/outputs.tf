output "aci_ip_address" {
  value       = azurerm_container_group.aci.ip_address
  description = "The IP address allocated to the container instance group."
}

output "aci_fqdn" {
  value       = azurerm_container_group.aci.fqdn
  description = "The FQDN of the container group derived from `dns_name_label`."
}