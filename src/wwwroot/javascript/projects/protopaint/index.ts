import { ProtoPaint, InteractionMode } from "./protopaint.js";
import { PanMode } from "./modes/PanMode.js";
import { View } from "./commands/View.js";
import { ActionCommand } from "../../util/ActionCommander.js";
import { Canvas } from "./commands/Canvas.js";


let pp = new ProtoPaint({
    canvas: document.getElementById("protoCanvas") as HTMLCanvasElement,
    interactionLayer: document.getElementById("interaction-layer") as HTMLDivElement,
    interactionModes: new Map<string, InteractionMode>([
        ["Pan", new PanMode()]
    ]),
    primaryInteractionMode: "Pan",
    menuPanels: new Map<string, HTMLDivElement>([
        ["left", document.querySelector('div[data-panel="left"]')],
        ["right", document.querySelector('div[data-panel="right"]')],
        ["footer", document.querySelector('div[data-panel="footer"]')]
    ]),
    searchPanel: document.querySelector("div[data-search]"),
    actionCommands: new Map<string, ActionCommand<ProtoPaint>>([
        ["view", new View()],
        ["canvas", new Canvas()]
    ]),
});
