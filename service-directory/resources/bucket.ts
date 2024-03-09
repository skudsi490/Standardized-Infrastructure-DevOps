import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

type MfBucketArgs = {
  Name: string;
  Product: string;
  Public?: boolean;
};

export class MfBucket extends pulumi.ComponentResource {
  public bucket: aws.s3.Bucket;

  constructor(args: MfBucketArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.Product}-${args.Name}`;
    super("pkg:index:MfBucket", resourceName, {}, opts);

    const stack = pulumi.getStack();
    const bucketName = `${resourceName}-${stack}`.toLowerCase();

    let bucketArgs: aws.s3.BucketArgs = {
      bucket: bucketName,
      tags: {
        Environment: stack,
      },
    };

    // Include website configuration for public buckets
    if (args.Public) {
      bucketArgs.website = {
        indexDocument: "index.html",
        errorDocument: "error.html",
        routingRules: JSON.stringify([{
          Condition: {
            KeyPrefixEquals: "docs/"
          },
          Redirect: {
            ReplaceKeyPrefixWith: "documents/"
          }
        }])
      };
    }

    this.bucket = new aws.s3.Bucket(args.Name, bucketArgs, { parent: this });

    // Apply public access block for non-public buckets
    if (!args.Public) {
      new aws.s3.BucketPublicAccessBlock(`${args.Name}-public-access-block`, {
        bucket: this.bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      }, { parent: this });
    }
  }
}
