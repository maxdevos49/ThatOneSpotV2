import { ActionCommanderBuilder } from "../../util/ActionCommander/ActionCommandBuilder.js";
import { ActionCommander } from "../../util/ActionCommander/ActionCommander.js";

import { IConfiguration } from "../../util/ActionCommander/interfaces/IConfiguration.js";
import { IStartup } from "../../util/ActionCommander/interfaces/IStartup.js";

// import { InteractionLayer } from "./services/InteractionService.js";

//Action Controllers
import { View } from "./actions/View.js";
import { IServiceCollection } from "../../util/DependencyInjection.js";
import { ToggleSearch } from "../../util/ActionCommander/extensions/ToggleSearch.js";
import { ErrorDisplay } from "../../util/ActionCommander/extensions/ErrorDisplay.js";

class Startup implements IStartup {

    public configureServices(services: IServiceCollection): void {

        //internal services


        //custom services
        //TODO CanvasService
        //TODO PanelService

        // services.addSingleton(InteractionLayer);
        // services.configure(InteractionLayer, protoPaint => {
        //     // protoPaint.canvasId = "";
        //     // protoPaint.interactionLayers = new Map([
        //     //     "": 
        //     // ])
        //     // protoPaint.init();
        // });


    }

    public configure(app: ActionCommander): void {

        //Internal optional extensions
        app.registerExtension(ToggleSearch);
        app.registerExtension(ErrorDisplay);
        //TODO Autocomplete
        //TODO History
        //...

        //Custom extensions
        //TODO interactionLayer
        //...

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

