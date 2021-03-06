import { extension } from "../../../util/DependencyInjection.js";
import { FooterService } from "../services/FooterService.js";
import { IActionCommander } from "../../../util/ActionCommander/ActionCommander.js";
import { InteractionModeService } from "../services/InteractionModeService.js";
import { MouseService } from "../services/MouseService.js";
import { CanvasService } from "../services/CanvasService.js";
import { PanelService } from "../services/PanelService.js";

@extension()
export class FooterConfiguration {

    private readonly _actionCommander: IActionCommander;
    private readonly _footer: FooterService;

    private readonly _mouse: MouseService;
    private readonly _ims: InteractionModeService;
    private readonly _canvas: CanvasService;
    private readonly _panel: PanelService;


    constructor(
        actionCommander: IActionCommander,
        footer: FooterService,
        mouse: MouseService,
        ims: InteractionModeService,
        canvas: CanvasService,
        panel: PanelService
    ) {
        this._actionCommander = actionCommander;
        this._footer = footer;

        this._mouse = mouse;
        this._ims = ims;
        this._canvas = canvas;
        this._panel = panel;

        this._panel.injectActionCommander(actionCommander);
    }

    public init(): void {
        this._footer.registerObservableButton(this._canvas.$x, null, (v) => `X: ${Math.round(v)}`);
        this._footer.registerObservableButton(this._canvas.$y, null, (v) => `Y: ${Math.round(v)}`);
        this._footer.registerObservableButton(this._canvas.$scale, null, (v) => `Scale: ${Math.round(v * 100)}%`);
        this._footer.registerObservableButton(this._canvas.$width, null, (v) => `Width: ${v}px`);
        this._footer.registerObservableButton(this._canvas.$height, null, (v) => `Height: ${v}px`);
        this._footer.registerObservableButton(this._mouse.$canvasPosition, () => console.log("click"), (value) => `Mouse X: ${Math.round(value.x)} Mouse Y: ${Math.round(value.y)}`);

        this._footer.registerObservableMenu(
            "Interaction Mode Menu",
            this._ims.$activeInteractionModeKey,//The value
            () => this._ims.interactionModesKeys,//The menu options
            (value) => `Mode: ${value}`,//Value formatter for display
            (value) => ({ value: value }),//The menu option formatter for autocomplete
            (value) => this._ims.activeInteractionModeKey = value //the action to perform on select
        );
        // this._footer.registerObservableButton(this._ims.$activeInteractionModeKey, () => console.log("loopy"), (value) => `Mode: ${value}`);
    }
}
