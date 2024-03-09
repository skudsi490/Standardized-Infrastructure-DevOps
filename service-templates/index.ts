import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import path from "path";
import * as nunjucks from "nunjucks";

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, "templates"), { autoescape: true });

// Define the structure of a single service in build.json
interface ServiceConfig {
  name: string;
  serviceType: string;
  buildCommands: string[];
  testCommands: string[];
  deployCommands: string[];
}

// Define the structure of build.json
interface BuildJSON {
  services: ServiceConfig[];
}

function renderTemplate(templateName: string, data: any): string {
  return nunjucks.render(`${templateName}.template`, data);
}

// Function to write content to a file, creating the file if it doesn't exist
function writeToFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
}

// Main function to parse command line arguments and generate files
function main() {
  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const argv = yargs(hideBin(process.argv))
    .option("config", {
      type: "string",
      description: "Path to the build config JSON file",
      demandOption: true,
    })
    .parseSync();

  const configFile = path.resolve(__dirname, argv.config);
  if (!fs.existsSync(configFile)) {
    throw new Error(`Config file ${configFile} does not exist.`);
  }

  const fileContents = fs.readFileSync(configFile, "utf8");
  const buildConfig: BuildJSON = JSON.parse(fileContents);

  // Iterate over each service and generate the required files
  buildConfig.services.forEach((service) => {
    // Update the directory to be inside the 'templates' directory
    const serviceOutputDir = path.resolve(outputDir, service.name);
    if (!fs.existsSync(serviceOutputDir)) {
      fs.mkdirSync(serviceOutputDir, { recursive: true });
    }

    // Update file paths to include the service-specific directory
    const dockerfilePath = path.join(serviceOutputDir, "Dockerfile");
    const circleCIPath = path.join(serviceOutputDir, "circleci.yml");


    // In your main function, update the following lines:
    const dockerfileContent = renderTemplate("Dockerfile", service);
    const circleCIContent = renderTemplate("circleci", service);

    writeToFile(dockerfilePath, dockerfileContent);
    writeToFile(circleCIPath, circleCIContent);

    console.log(
      `Generated Dockerfile and CircleCI config for ${service.name} in ${serviceOutputDir}`
    );
  });
}

main();
