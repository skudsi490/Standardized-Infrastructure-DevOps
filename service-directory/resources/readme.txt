MfBucket Class Documentation
Overview
The MfBucket class is a component resource designed to simplify the creation and configuration of AWS S3 buckets within Pulumi projects. It offers flexibility in creating both public and private buckets, with additional configurations for website hosting and public access restrictions.

Properties
bucket: aws.s3.Bucket
This property exposes the created S3 bucket instance, allowing for further manipulation or referencing in other parts of the Pulumi project.
Constructor
The constructor initializes a new instance of the MfBucket class with the specified configurations.

Parameters
args: MfBucketArgs

A configuration object with the following properties:
Name: string
The name segment for the bucket, used in conjunction with the product name to generate the full bucket name.
Product: string
The product name, used in generating the full bucket name and ensuring uniqueness.
Public: boolean (optional)
A flag indicating whether the bucket should be configured for public access. Defaults to false if not specified.
opts: pulumi.CustomResourceOptions (optional)

Custom resource options provided to Pulumi, allowing for additional configurations such as resource providers, parents, and dependencies.

Usage Examples
Creating a Public S3 Bucket

const publicBucket = new MfBucket({
  Name: "public-assets",
  Product: "my-website",
  Public: true,
});


This example creates a public S3 bucket configured for website hosting.



Creating a Non-Public S3 Bucket

const replicaBucket = new MfBucket({
  Name: "backup-assets",
  Product: "my-website",
  Public: false,
});


This example creates a non-public S3 bucket with public access restrictions, suitable for backup or replica purposes.



This documentation provides a clear understanding of the MfBucket class, its capabilities, and how to use it within Pulumi projects for S3 bucket management.


