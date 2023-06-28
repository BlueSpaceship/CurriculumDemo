# Introduction to Terraform

## What is Terraform

Terraform enables the definition, preview, and deployment of cloud infrastructure. Using Terraform, you create configuration files using HCL syntax. The HCL syntax allows you to specify the cloud provider - such as Azure - and the elements that make up your cloud infrastructure. After you create your configuration files, you create an execution plan that allows you to preview your infrastructure changes before they're deployed. Once you verify the changes, you apply the execution plan to deploy the infrastructure.

### Documentation / Training Material
https://learn.microsoft.com/en-us/azure/developer/terraform/overview
https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs
## Infrastructure as Code

add pros / cons


## Demo1
Introduction to basic concepts like **terraform CLI**, how to create **first resources**, and **terraform state**. 

```powershell
az login
az account set  --subscription "ffd96b6f-1fcb-4bb8-b0ad-b151d795064a"
az account show

terraform init
terraform plan -out main.tfplan
terraform apply "main.tfplan"
```

Notes:
 - ```az login``` to authenticate with your user account
 - with ```az account set``` the active subscription is set
 - in this example a simple resource group is created
 - ```terraform init``` initializes the folder and downloads provider information (hashicorp/azurerm 3.48.0) to folder ```.terraform```
 - ```terraform plan main.tfplan``` creates a file ```main.tfplan```with
 - ```terraform apply main.tfplan``` executes the plan and stores the current state to ```terraform.tfstate```. It is good practice to store the state not locally but in the Cloud to collaborate.

## Demo2
Introduction to basic concepts like **variables** and authentication with **service principles**. 

```powershell
terraform plan -var "service_principal_password=***" -out main.tfplan 
terraform apply  main.tfplan 
```

Notes:
 - In this example we use a service account (service principle) for authentication. This service principle has contributor rights for our sandbox. It can be created e.g. with
   ```powershell
   az ad sp create-for-rbac --name myServicePrincipalName \
                         --role contributor \
                         --scopes /subscriptions/ffd96b6f-1fcb-4bb8-b0ad-b151d795064a
   ```
 - In this example we have distributed terraform description to mulitple *.tf files to better structure our code. Terraform uses all *.tf files in current folder
 - We defined some variables to make code readable and to hide the password ot the service principle

## Demo3
In this example we will use Azure Container Instances to host a simple containerized app from docker hub. We will learn basic Terraform concepts like **outputs** and **dependencies**.

Notes:
 - plan and apply similar to demo2
 - terraform automatically handles dependencies and creates ressources in correct order
 - after ```terraform apply``` we get the following output:
   ``` powershell 
   aci_fqdn = "cop-cloud-tf-demo3.westeurope.azurecontainer.io"
   aci_ip_address = "20.126.239.232"
   ```
   These are the outputs we have defined. You can browse to http://cop-cloud-tf-demo3.westeurope.azurecontainer.io to see the provisioned container
