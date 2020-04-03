import { ProtoPaint, InteractionMode } from "./protopaint.js";
import { PanMode } from "./modes/PanMode.js";
import { View } from "./commands/View.js";
import { ActionCommand } from "../../util/ActionCommander.js";


let pp = new ProtoPaint({
    canvas: document.getElementById("protoCanvas") as HTMLCanvasElement,
    interactionLayer: document.getElementById("interaction-layer") as HTMLDivElement,
    interactionModes: new Map<string, InteractionMode>(
        Object.entries({
            "Pan": new PanMode()
        })
    ),
    primaryInteractionMode: "Pan",
    menuPanels: new Map<string, HTMLDivElement>(
        Object.entries({
            "left": document.querySelector('div[data-panel="left"]'),
            "right": document.querySelector('div[data-panel="right"]'),
            "footer": document.querySelector('div[data-panel="footer"]')
        })
    ),
    searchPanel: document.querySelector("div[data-search]"),
    actionCommands: new Map<string, ActionCommand<ProtoPaint>>(
        Object.entries({
            "view": new View()
        })
    ),
});