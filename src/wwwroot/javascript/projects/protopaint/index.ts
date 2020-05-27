//Action Commander 
import { ActionCommanderBuilder } from "../../util/ActionCommander/ActionCommandBuilder.js";
import { ActionCommander } from "../../util/ActionCommander/ActionCommander.js";

//Interfaces
import { IConfiguration } from "../../util/ActionCommander/interfaces/IConfiguration.js";
import { IStartup } from "../../util/ActionCommander/interfaces/IStartup.js";
import { IServiceCollection } from "../../util/DependencyInjection.js";

//Action Controllers
import { View } from "./actions/View.js";
import { Canvas } from "./actions/Canvas.js";

//extensions
import { ToggleSearch } from "../../util/ActionCommander/extensions/ToggleSearch.js";
import { ErrorDisplay } from "../../util/ActionCommander/extensions/ErrorDisplay.js";
import { ActionSuggestions } from "../../util/ActionCommander/extensions/ActionSuggestions.js";
import { ActionHistory } from "../../util/ActionCommander/extensions/ActionHistory.js";
import { Autocomplete } from "../../util/ActionCommander/extensions/Autocomplete.js";
import { InputButtons } from "../../util/ActionCommander/extensions/InputButtons.js";
import { InteractionLayer } from "./extension/InteractionLayerExtension.js";
import { FooterConfiguration } from "./extension/FooterConfiguration.js";

//services
import { DataSourceCollection } from "../../util/ActionCommander/services/DataSourceCollection.js";
import { CanvasService } from "./services/CanvasService.js";
import { PanelService } from "./services/PanelService.js";
import { InteractionModeService } from "./services/InteractionModeService.js";
import { FooterService } from "./services/FooterService.js";
import { MouseService } from "./services/MouseService.js";

//interaction Modes
import { PanMode } from "./modes/PanMode.js";
import { EditMode } from "./modes/EditMode.js";

class Startup implements IStartup {

    public configureServices(services: IServiceCollection): void {

        //#region internal services

        services.addSingleton(DataSourceCollection);

        //#endregion

        //custom services
        services.addSingleton(CanvasService);
        services.configure(CanvasService, (cs) => {
            cs.init();
        });

        services.addSingleton(PanelService);
        services.configure(PanelService, (ps) => {
            ps.registerPanel("Left", 'div[data-panel="left"]');
            ps.registerPanel("Right", 'div[data-panel="right"]');
        });

        services.addSingleton(InteractionModeService);
        services.configure(InteractionModeService, (ims) => {
            ims.registerMode("Pan", PanMode);
            ims.registerMode("Edit", EditMode);
        });

        services.addSingleton(FooterService);
        services.addSingleton(MouseService);

    }


    public configure(app: ActionCommander): void {

        //#region Internal optional extensions

        app.registerExtension(ToggleSearch);
        app.registerExtension(ErrorDisplay);

        //Records command history
        app.registerExtension(ActionHistory);
        app.configureExtension(ActionHistory, (ah) => {
            ah.historyDataSourceKey = "action-history";
        });

        //Updates the suggestions displayed in the autocomplete
        app.registerExtension(ActionSuggestions);
        app.configureExtension(ActionSuggestions, (as) => {
            as.defaultDataSourceKey = "suggestions";
            as.onFocusDataSourceKey = "controllers";
        })

        //Register and configure the autocomplete extension
        app.registerExtension(Autocomplete);
        app.configureExtension(Autocomplete, (ac) => {
            ac.defaultDataSourceKey = "suggestions";
            ac.sourceToggles = new Map([
                ["Alt", "action-history"]
            ]);
        });

        app.registerExtension(InputButtons);
        app.configureExtension(InputButtons, (ib) => {
            ib.buttons = new Map([
                [`<i class="fas fa-play"></i>`, (a) => a.submitSearch()],
                [`<i class="fas fa-times"></i>`, (a) => a.clear()],
            ])
        });

        //#endregion

        //Custom extensions
        app.registerExtension(InteractionLayer);
        app.registerExtension(FooterConfiguration);
        //...

    }
}

let config: IConfiguration = {
    actionControllers: [
        View,
        Canvas,
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