
import { MfFrontend } from "./services/frontend";
import { MfBackend } from "./services/backend";

function main() {

    new MfBackend ({
        name: "Backend-example",
        product: "devops-project"
    });
    new MfFrontend({
       name: "Frontend-example",
        product: "devops-project"
    });
}

main();







