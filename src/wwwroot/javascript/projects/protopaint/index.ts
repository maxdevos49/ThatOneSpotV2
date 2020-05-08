import { ActionCommanderBuilder } from "../../util/ActionCommander/ActionCommandBuilder.js";
import { ActionCommander } from "../../util/ActionCommander/ActionCommander.js";

import { IConfiguration } from "../../util/ActionCommander/interfaces/IConfiguration.js";
import { IStartup } from "../../util/ActionCommander/interfaces/IStartup.js";
import { IServiceCollection } from "../../util/DependencyInjection.js";

import { ProtoPaint } from "./protopaint.js";

//Action Controllers
import { View } from "./actions/View.js";

class Startup implements IStartup {

    public configureServices(services: IServiceCollection): void {

        services.addSingleton(ProtoPaint);
        services.configure(ProtoPaint, protoPaint => {

        });


    }

    public configure(app: ActionCommander): void {

        // app.registerExtension(Autocomplete);

    }
}

let config: IConfiguration = {
    actionControllers: [
        View,
    ]

}

function main() {
    ActionCommanderBuilder
        .buildConfiguration(config)
        .startup(Startup)
        .run();
}

//entry point
main();