import { ActionCommander, ActionCommand } from "../../util/ActionCommander.js"

export class ProtoPaint {

    public canvas: CanvasInfo;

    private readonly _interactionLayer: HTMLDivElement;

    private readonly _actionCommand: ActionCommander<ProtoPaint>;

    private readonly _panels: Map<string, HTMLElement>;

    private _activeInteractionMode: InteractionMode;

    private readonly _interactionModes: Map<string, InteractionMode>;


    public constructor(configuration: ProtoPaintConfiguration) {

        this.canvas = new CanvasInfo(configuration.canvas, configuration.interactionLayer);
        this._interactionLayer = configuration.interactionLayer;
        this._interactionModes = configuration.interactionModes;
        ///assign primary interaction mode. No need to check if fails becuase without it we cant do anything anyways
        this._activeInteractionMode = this._interactionModes.get(configuration.primaryInteractionMode);
        this._panels = configuration.menuPanels;

        this._actionCommand = new ActionCommander<ProtoPaint>(
            this,
            configuration.searchPanel,
            configuration.actionCommands);

        this.init();
    }

    public hidePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.add("hide");
        }
    }

    public showPanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.remove("hide");
        }
    }

    public togglePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.toggle("hide");
        }
    }

    public showSearch() {
        this._actionCommand.showSearch();
    }

    public switchCanvasMode(canvasModeName: string) {

        if (this._interactionModes.has(canvasModeName)) {
            this._activeInteractionMode = this._interactionModes.get(canvasModeName);
        }
    }

    private init() {

        //On Click
        this._interactionLayer.addEventListener("click", (e) => {
            this._activeInteractionMode.onMouseClick(this, e);
        }, false);

        //On Mouse Down
        this._interactionLayer.addEventListener("mousedown", (e) => {
            this._activeInteractionMode.onMouseClick(this, e);
        }, false);

        //On Mouse Up
        this._interactionLayer.addEventListener("mouseup", (e) => {
            this._activeInteractionMode.onMouseUp(this, e);
        }, false);

        //On Mouse Move
        this._interactionLayer.addEventListener("mousemove", (e) => {
            this._activeInteractionMode.onMouseMove(this, e);
        }, false);

        //On Wheel
        this._interactionLayer.addEventListener("wheel", (e) => {
            this._activeInteractionMode.onWheel(this, e);
        }, false);

        //On Context Menu
        this._interactionLayer.addEventListener("contextmenu", (e) => {
            this._activeInteractionMode.onContextMenu(this, e);
        }, false);

        //On double click
        this._interactionLayer.addEventListener("dblclick", (e) => {
            this._activeInteractionMode.onMouseDblClick(this, e);
        }, false);

        //On Mouse enter
        this._interactionLayer.addEventListener("mouseenter", (e) => {
            this._activeInteractionMode.onMouseEnter(this, e);
        }, false);

        //On Mouse leave
        this._interactionLayer.addEventListener("mouseleave", (e) => {
            this._activeInteractionMode.onMouseLeave(this, e);
        }, false);

    }

}

export abstract class InteractionMode {

    public readonly name: string;

    public readonly description: string;

    protected constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    public onMouseClick(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseDblClick(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseDown(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseUp(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseMove(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseEnter(dependency: ProtoPaint, e: MouseEvent): void { }
    public onMouseLeave(dependency: ProtoPaint, e: MouseEvent): void { }
    public onContextMenu(dependency: ProtoPaint, e: MouseEvent): void { }
    public onWheel(d: ProtoPaint, e: WheelEvent): void {
        e.preventDefault();

        let c = d.canvas;

        if (e.altKey) {

            let newScale = (c.scale + e.deltaY * -0.01);
            let scalechange = newScale - c.scale;
            let zoomPointX = (e.offsetX - c.x) / c.scale;
            let zoomPointY = (e.offsetY - c.y) / c.scale;

            if (newScale < c.maximumScale && newScale > c.minimumScale) {
                c.setScale(newScale);
                c.pan(-(zoomPointX * scalechange), -(zoomPointY * scalechange));
            }

        } else {
            c.pan(e.deltaX * -0.2, e.deltaY * -0.2);
        }
    }

}

export class CanvasInfo {

    public readonly maximumScale: number = 4;
    public readonly minimumScale: number = 0.25;

    public readonly canvas: HTMLCanvasElement;
    public readonly ctx: CanvasRenderingContext2D;
    public readonly interactionLayer: HTMLDivElement;

    private _scale: number = 1;
    private _originX: number = 0;
    private _originY: number = 0;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;


    constructor(canvas: HTMLCanvasElement, interactionLayer: HTMLDivElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this._width = canvas.width;
        this._height = canvas.height;
        this._x = canvas.offsetLeft;
        this._y = canvas.offsetTop;
        this.interactionLayer = interactionLayer;
    }

    public get scale(): number {
        return this._scale;
    }

    public get x(): number {
        return this._x + this._offsetX;
    }

    public get y(): number {
        return this._y + this._offsetY;
    }

    public get width(): number {
        return this._width * this._scale;
    }

    public get height(): number {
        return this._width * this._scale;
    }

    public pan(panX: number, panY: number): void {
        this._offsetX += panX;
        this._offsetY += panY;
        this.validateOffset();
        this.applyTransformations();
    }
    public setTranslation(offsetX: number, offsetY: number): void {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this.validateOffset()
        this.applyTransformations();
    }

    public setScale(scale: number): void {
        this._scale = Math.min(Math.max(scale, this.minimumScale), this.maximumScale)
        this.applyTransformations();
    }

    public setOrigin(originX: number, originY: number): void {
        this._originX = originX;
        this._originY = originY;
        this.applyTransformations();
    }

    private validateOffset(): void {
        let container = this.interactionLayer.getBoundingClientRect();

        if (this.x > container.width / 2) {
            this._offsetX -= this.x - container.width / 2;
        } else if (this.x + this.width < container.width / 2) {
            this._offsetX -= (this.x + this.width) - container.width / 2
        }

        if (this.y > container.height / 2) {
            this._offsetY -= this.y - container.height / 2;
        } else if (this.y + this.height < container.height / 2) {
            this._offsetY -= (this.y + this.height) - container.height / 2
        }

    }

    private applyTransformations(): void {
        this.canvas.style.transformOrigin = `${this._originX}px ${this._originY}px`;
        this.canvas.style.transform = `translate(${this._offsetX}px,${this._offsetY}px) scale(${this._scale})`;
    }
}

export interface ProtoPaintConfiguration {

    canvas: HTMLCanvasElement;

    interactionLayer: HTMLDivElement;

    interactionModes: Map<string, InteractionMode>;

    primaryInteractionMode: string;

    menuPanels: Map<string, HTMLElement>;

    searchPanel: HTMLDivElement;

    actionCommands: Map<string, ActionCommand<ProtoPaint>>;
}
