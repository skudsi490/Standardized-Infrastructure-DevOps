# DevOps Project Documentation: Service Directory

# Standardized Infrastructure

## **Service Templates Overview**

The service-templates module is a CLI tool designed to standardize the creation of Docker and CircleCI configuration files for services within our infrastructure. This tool leverages templates and a JSON configuration file to generate customized Dockerfiles and CircleCI configuration files, simplifying the process for developers and ensuring consistency across services.

![Diagram Photo](https://github.com/skudsi490/Standardized-Infrastructure-DevOps/blob/main/service-templates/diagram.png)

## **Installation**

Ensure you have Node.js and npm installed. Clone the repository and navigate to the service-templates directory. Run npm install to install the required dependencies.

### **Configuration**

- **Build Configuration (build.json)**: The build.json file is central to the service-templates tool. It contains an array of service configurations, each specifying the name, type, build commands, test commands, and deployment commands for a service. Here's an example structure:

  ```
    {
  "services": [
    {
      "name": "frontend-service",
      "serviceType": "frontend",
      "buildCommands": ["npm run build"],
      "testCommands": ["npm run test"],
      "deployCommands": ["npm run deploy"]
    },
    {
      "name": "backend-service",
      "serviceType": "backend",
      "buildCommands": ["dotnet build"],
      "testCommands": ["dotnet test"],
      "deployCommands": ["dotnet publish"]
    }
  ]
}

    
    ```

### **Template Files**

The templates directory contains Dockerfile.template and circleci.template files. These templates should include placeholders for service-specific configurations that will be replaced by the CLI tool based on the build.json content.

## **Running the CLI Tool**

Navigate to the service-templates directory and run the CLI tool using the following command:

    ```
    npx ts-node --transpileOnly index.ts --config "./build.json"
    
    ```

This command will read the build.json file and generate a Dockerfile and a CircleCI configuration file for each service listed, placing the generated files in the output directory.

### **Generated Files**

After running the CLI tool, check the output directory. You will find a subdirectory for each service, containing the generated Dockerfile and circleci.yml. These files are ready to be used in your CI/CD pipeline.

### **Best Practices**

- Template Maintenance: Regularly update your templates to reflect best practices and new requirements for Docker and CircleCI configurations.
- Version Control: Store build.json, template files, and the CLI tool in a version-controlled repository to track changes and maintain consistency across team members.
- Documentation: Clearly document any changes to templates or the build configuration structure to ensure ease of use for developers.

### **Troubleshooting**

If you encounter issues while running the CLI tool, check the following:

- Template Errors: Ensure your templates are correctly formatted and all placeholders are properly defined.
- JSON Configuration: Validate the build.json file to ensure it's correctly structured and all required fields are present.
- Dependency Issues: Make sure all dependencies are installed and up-to-date.

## **Conclusion**

The service-templates CLI tool streamlines the process of generating Docker and CircleCI configurations for services, promoting consistency and efficiency in the deployment pipeline. By centralizing configurations in the build.json file and utilizing templates, this tool allows developers to quickly prepare services for deployment without the need to manually create configuration files.