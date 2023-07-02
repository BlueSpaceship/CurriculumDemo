import { ResourceGroup} from '@pulumi/azure-native/resources';
import { storage } from '@pulumi/azure-native';
import {interpolate, Output} from "@pulumi/pulumi";

export function signedBlobReadUrl(blob: storage.Blob,
    container: storage.BlobContainer,
    account: storage.StorageAccount,
    resourceGroup: ResourceGroup): Output<string> {

const blobSAS = storage.listStorageAccountServiceSASOutput({
accountName: account.name,
protocols: storage.HttpProtocol.Https,
sharedAccessExpiryTime: "2030-01-01",
sharedAccessStartTime: "2021-01-01",
resourceGroupName: resourceGroup.name,
resource: storage.SignedResource.C,
permissions: storage.Permissions.R,
canonicalizedResource: interpolate`/blob/${account.name}/${container.name}`,
contentType: "application/json",
cacheControl: "max-age=5",
contentDisposition: "inline",
contentEncoding: "deflate",
});
return interpolate`https://${account.name}.blob.core.windows.net/${container.name}/${blob.name}?${blobSAS.serviceSasToken}`;
}