import { getStack, Config, interpolate, asset, all} from "@pulumi/pulumi";
import { ResourceGroup} from '@pulumi/azure-native/resources';
import { web, documentdb, storage } from '@pulumi/azure-native';
import { PulumiConfiguration } from "./PulumiConfiguration";
import { DatabaseAccount } from "@pulumi/azure-native/documentdb/v20160319";
import { listDatabaseAccountKeysOutput } from "@pulumi/azure-native/documentdb/listDatabaseAccountKeys";
import { signedBlobReadUrl } from "./signedBlobReadUrl";

/**
 * Configuration
 */
  const pulumiConfig = new Config();
  const configuration = pulumiConfig.requireObject<PulumiConfiguration>("configuration")
  const stack = getStack()
  const throughput = 400

 /**
   * Main Pulumi Infrastructure
   */

  //*Ressource Group 
 
  const resourceGroupName = configuration.resourceGroupName

  const resourceGroup = new ResourceGroup(resourceGroupName, {
    resourceGroupName: `${resourceGroupName}-${stack}`
  })


  //* CosmosDB

  //Account
  const dbAccount = new documentdb.DatabaseAccount("cc-db-account",
    {
      resourceGroupName: resourceGroup.name,
      location: resourceGroup.location,
      accountName: "cc-db-account",
      databaseAccountOfferType: "Standard",
      consistencyPolicy: {
        defaultConsistencyLevel: "Session",
      },
      locations: [
          {
              locationName: resourceGroup.location,
              failoverPriority: 0,
              isZoneRedundant: false,
          },
      ],
      }
  );


// Create a Cosmos DB SQL database
const sqlDatabase = new documentdb.SqlResourceSqlDatabase("sqlDatabase", {
  resourceGroupName: resourceGroup.name,
  accountName:dbAccount.name,
  resource: {
      id: "sqlDatabase",
  },
});

// Create a Cosmos DB SQL container
const sqlContainer = new documentdb.SqlResourceSqlContainer("sqlContainer", {
  resourceGroupName: resourceGroup.name,
  accountName: dbAccount.name,
  databaseName: sqlDatabase.name,
  resource: {
      id: "sqlContainer",
      partitionKey: {
          paths: ["/partitionKey"],
          kind: "Hash",
      },
  },
});
const dataBaseAccountKeys =  documentdb.listDatabaseAccountKeysOutput({ resourceGroupName: resourceGroup.name,  accountName: dbAccount.name});
const dataBaseprimaryMasterKey = dataBaseAccountKeys.primaryMasterKey;


  //*FunctionApp
// Storage Account
  const storageAccount = new storage.StorageAccount("storageaccount", {
    resourceGroupName: resourceGroup.name,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
  });

  const storageAccountKeys = storage.listStorageAccountKeysOutput({ resourceGroupName: resourceGroup.name, accountName: storageAccount.name});
  const primaryStorageKey = storageAccountKeys.keys[0].value;

  // Function code stored in this container.
  const codeContainer = new storage.BlobContainer("zips", {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
  });
  // Upload Azure Function's code as a zip archive to the storage account.
  const codeBlob = new storage.Blob("zip", {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
    containerName: codeContainer.name,
    source: new asset.FileArchive("./javascript"),
  });

  const appServicePlan = new web.AppServicePlan("serviceplan", {
    resourceGroupName: resourceGroup.name,
    name: "serviceplan",
    location: resourceGroup.location,
    sku: {
        name: "S1",
    },
});


const codeBlobUrl = signedBlobReadUrl(codeBlob, codeContainer, storageAccount, resourceGroup);

 
const webApp = new web.WebApp("cc-webapp", {
    resourceGroupName: resourceGroup.name,
    serverFarmId: appServicePlan.id,
    kind: "functionapp",
    siteConfig: {
        alwaysOn: true,
        appSettings: [
            {
                name: "AzureWebJobsStorage",
                value: interpolate`DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${primaryStorageKey};EndpointSuffix=core.windows.net`,
            },
            {
                name: "FUNCTIONS_EXTENSION_VERSION",
                value: "~3",
            },
            {
                name: "FUNCTIONS_WORKER_RUNTIME",
                value: "node",
            },
            { 
              name: "WEBSITE_NODE_DEFAULT_VERSION", 
              value: "~14" 
            },
            { 
              name: "WEBSITE_RUN_FROM_PACKAGE", 
              value: codeBlobUrl 
            }
            
        ],
        
        http20Enabled: true,
        nodeVersion: "~14"
    },
});


