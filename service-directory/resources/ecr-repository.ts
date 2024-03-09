import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type MfDockerImageRepoArgs = {
  Name: string;
  Product: string;
};

export class MfDockerImageRepo extends pulumi.ComponentResource {
  public repository: aws.ecr.Repository; // Public property to hold the repository

  constructor(args: MfDockerImageRepoArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:MfDockerImageRepo", resourceName, {}, opts);

    // Create the ECR repository and assign it to the public property
    this.repository = new aws.ecr.Repository(resourceName.toLowerCase(), {
        name: resourceName.toLowerCase(),
        imageTagMutability: "MUTABLE",
        imageScanningConfiguration: {
            scanOnPush: false,
        },
    }, { parent: this });
  }
}
