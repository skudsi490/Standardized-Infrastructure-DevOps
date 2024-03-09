import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { MfDockerImageRepo } from "../resources/ecr-repository";

const config = new pulumi.Config("service-directory");
const ecsTaskExecutionRoleArn = config.require("ecsTaskExecutionRoleArn");
const subnets = config.requireObject<string[]>("subnets");
const securityGroupId = config.require("securityGroupId");

type MfBackendArgs = {
  name: string;
  product: string;
};

export class MfBackend extends pulumi.ComponentResource {
  public ecrRepository: aws.ecr.Repository;
  public ecsCluster: aws.ecs.Cluster;
  public ecsService: aws.ecs.Service;

  constructor(args: MfBackendArgs, opts?: pulumi.CustomResourceOptions) {
    const resourceName = `${args.product}-${args.name}`;
    super("pkg:index:MfBackend", resourceName, {}, opts);

    // ECR Repository for backend Docker images
    this.ecrRepository = new MfDockerImageRepo({
      Name: args.name,
      Product: args.product,
    }, { parent: this }).repository;

    // ECS Cluster
    this.ecsCluster = new aws.ecs.Cluster(`${args.name}-cluster`, {}, { parent: this });

    // ECS Task Definition (Placeholder for actual task definition)
    const taskDefinition = new aws.ecs.TaskDefinition(`${args.name}-task`, {
      family: `${args.name}`,
      cpu: "256",
      memory: "512",
      networkMode: "awsvpc",
      requiresCompatibilities: ["FARGATE"],
      executionRoleArn: ecsTaskExecutionRoleArn,
      containerDefinitions: pulumi.all([this.ecrRepository.repositoryUrl]).apply(([url]) => JSON.stringify([{
        name: `${args.name}-container`,
        image: url,
        cpu: 256,
        memory: 512,
        essential: true,
        portMappings: [{ containerPort: 80, hostPort: 80 }],
      }])),
    }, { parent: this });

// ECS Service
this.ecsService = new aws.ecs.Service(`${args.name}-service`, {
  cluster: this.ecsCluster.id,
  taskDefinition: taskDefinition.arn,
  desiredCount: 1,
  launchType: "FARGATE",
  networkConfiguration: {
    assignPublicIp: true,
    subnets: subnets,
    securityGroups: [securityGroupId], // Default VPC security group
  },
}, { parent: this });

  }
}
