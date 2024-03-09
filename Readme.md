# DevOps Project Documentation: Service Directory

# Standardized Infrastructure

## **Overview**

This DevOps project is designed to automate and manage the infrastructure for a web application using Pulumi with AWS as the cloud provider. The project consists of both frontend and backend services, with the frontend hosted on S3 and served through CloudFront, and the backend running on ECS with images stored in ECR. 

## Objectives

This DevOps project aims to address a critical need within the organization: the standardization of infrastructure for web services, particularly focusing on frontends and backends. Our goal is to provide simple, reusable interfaces that enable developers to deploy and manage services without deep DevOps expertise, fostering autonomy and efficiency.

## **Problem Statement**

Historically, most infrastructures lack defined patterns or standardized approaches for describing services, leading to inconsistencies and inefficiencies. This project introduces standardized, off-the-shelf solutions for deploying frontend and backend services, simplifying the infrastructure management process.

## **Project Structure**

The project is organized into two main directories: **`resources`** and **`services`**. The **`resources`** directory contains components for creating AWS resources like S3 buckets and ECR repositories. The **`services`** directory includes definitions for higher-level constructs like the frontend website and backend API.

### **Resources**

- **S3 Bucket (`bucket.ts`)**: Defines an S3 bucket for hosting static web content. It includes optional website configuration and public access settings.
- **ECR Repository (`ecr-repository.ts`)**: Defines an ECR repository for storing Docker images used by the backend service.

### **Services**

- **Frontend (`frontend.ts`)**: Sets up the frontend service, including an S3 bucket for content storage and a CloudFront distribution for content delivery.
- **Backend (`backend.ts`)**: Sets up the backend service, including an ECR repository for the Docker image, an ECS cluster, task definitions for running the Docker container, and an ECS service to manage the containers.

## **Configuration Setup**

When you first run **`pulumi up`**, Pulumi automatically generates a **`Pulumi.dev.yaml`** file for your stack in the **`service-directory`** folder. This file will store configurations for your project. Some configurations, particularly sensitive ones like AWS secrets, should be set using the **`pulumi config set`** command to ensure they are encrypted.

### **Setting Sensitive Configurations Securely**

Use the following commands to securely set your AWS access and secret keys. These commands encrypt the values in your **`Pulumi.dev.yaml`**:

- **AWS Access Key**:
    
    ```
    pulumi config set aws:accessKey YOUR_ACCESS_KEY --secret
    
    ```
    
- **AWS Secret Key**:
    
    ```
    pulumi config set aws:secretKey YOUR_SECRET_KEY --secret
    
    ```
    

Replace **`YOUR_ACCESS_KEY`** and **`YOUR_SECRET_KEY`** with your actual AWS access key and secret key values.

### **Setting Other Required Configurations**

You also need to set several other configurations for your project to work correctly. These can be added directly to the **`Pulumi.dev.yaml`** file or set using the **`pulumi config set`** command without the **`--secret`** flag since they are not sensitive:

- **AWS Region**:
    
    ```
    pulumi config set aws:region eu-central-1
    
    ```
    
- **ECS Task Execution Role ARN**:
    
    ```
    pulumi config set service-directory:ecsTaskExecutionRoleArn arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/ecsTaskExecutionRole
    
    ```
    
- **Subnets**:
    
    ```
    pulumi config set service-directory:subnets '["subnet-EXAMPLEID1", "subnet-EXAMPLEID2"]'
    
    ```
    
- **Security Group ID**:
    
    ``
    pulumi config set service-directory:securityGroupId sg-EXAMPLEID
    
    ```
    

Replace **`YOUR_AWS_ACCOUNT_ID`**, **`subnet-EXAMPLEID1`**, **`subnet-EXAMPLEID2`**, and **`sg-EXAMPLEID`** with your AWS account ID, your subnet IDs, and your security group ID, respectively.

### **Finalizing Configuration**

After setting the configurations using the commands above, your **`Pulumi.dev.yaml`** should look something like this:

```
config:
  aws:accessKey:
    secure: <encrypted-value>
  aws:region: eu-central-1
  aws:secretKey:
    secure: <encrypted-value>
  service-directory:ecsTaskExecutionRoleArn: "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/ecsTaskExecutionRole"
  service-directory:subnets:
    - "subnet-EXAMPLEID1"
    - "subnet-EXAMPLEID2"
  service-directory:securityGroupId: "sg-EXAMPLEID"

```

The **`secure: <encrypted-value>`** entries represent encrypted configurations set using the **`--secret`** flag.

## **Key Components**

### **Frontend**

- **S3 Bucket**: Stores the static files for the web application.
- **CloudFront Distribution**: Serves the static content from the S3 bucket, providing a fast, globally-distributed frontend.

### **Backend**

- **ECR Repository**: Hosts the Docker images for the backend service.
- **ECS Cluster**: Provides the compute capacity to run the backend containers.
- **ECS Task Definition**: Specifies the Docker container configuration for the backend service.
- **ECS Service**: Manages the running containers, ensuring the desired number of instances are always running.

## **Deployment**

The project uses Pulumi for infrastructure as code (IaC), allowing for repeatable and consistent deployments. To deploy the infrastructure:

1. **Prerequisites**:
    - AWS CLI configured with appropriate credentials.
    - Pulumi CLI installed and configured.
2. **Deployment Steps**:
    - Navigate to the project directory: **`cd E:\DevOps-project\service-directory`**
    - Run **`pulumi up`** to preview and deploy the changes.

## **Security**

- **IAM Roles**: Ensure that the **`ecsTaskExecutionRole`** has the necessary permissions for ECS tasks to pull images from ECR and log to CloudWatch.
- **Security Groups**: Utilize the default VPC security group (**`sg- Your Security Group ID`**), ensuring it's configured to allow the required inbound and outbound traffic.

## **Networking**

- **Subnets**: Deploy the ECS service across multiple subnets for high availability, ensuring they are within the same VPC (**`vpc-Virtual Private Cloud ID`**).

## **Best Practices**

- **Resource Naming**: Use consistent and descriptive naming conventions for all resources.
- **Tagging**: Utilize tags for resource identification and management, particularly for cost tracking.

## **Troubleshooting**

- **Pulumi Errors**: Refer to Pulumi documentation and the detailed error messages for troubleshooting deployment issues.
- **AWS Resource Access**: Ensure that the AWS user or role executing Pulumi commands has sufficient permissions to create and manage the resources defined in the project.

## **Conclusion**

This DevOps project provides a template for deploying a web application with a separate frontend and backend on AWS, using Pulumi to manage the infrastructure as code. It demonstrates best practices for cloud resource management, security, and high availability.