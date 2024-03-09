import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { MfBucket } from "../resources/bucket";

type MfFrontendArgs = {
  name: string;
  product: string;
};

export class MfFrontend extends pulumi.ComponentResource {
  public s3Bucket: aws.s3.Bucket;
  public cloudFrontDistribution: aws.cloudfront.Distribution;

  constructor(args: MfFrontendArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.product}-${args.name}`;
    super("pkg:index:MfFrontend", resourceName, {}, opts);

    // S3 Bucket for static files
    this.s3Bucket = new MfBucket({
      Name: args.name,
      Product: args.product,
      Public: true,
    }, { parent: this }).bucket;

    // CloudFront Distribution for the S3 Bucket
    this.cloudFrontDistribution = new aws.cloudfront.Distribution(`${args.name}-cf`, {
      enabled: true,
      origins: [{
        originId: this.s3Bucket.arn,
        domainName: this.s3Bucket.websiteEndpoint,
        customOriginConfig: {
          originProtocolPolicy: "http-only",
          httpPort: 80,
          httpsPort: 443,
          originSslProtocols: ["TLSv1.2"],
        },
      }],
      defaultCacheBehavior: {
        targetOriginId: this.s3Bucket.arn,
        viewerProtocolPolicy: "redirect-to-https",
        allowedMethods: ["GET", "HEAD"],
        cachedMethods: ["GET", "HEAD"],
        forwardedValues: {
          queryString: false,
          cookies: { forward: "none" },
        },
        minTtl: 0,
        defaultTtl: 3600,
        maxTtl: 86400,
      },
      restrictions: {
        geoRestriction: {
          restrictionType: "none",
        },
      },
      viewerCertificate: {
        cloudfrontDefaultCertificate: true,
      },
    }, { parent: this });
  }
}
