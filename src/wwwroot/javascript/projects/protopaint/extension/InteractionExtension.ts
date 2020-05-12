// import { Vector } from "../../../protoCore/math/vector.js";
// import { service } from "../../../util/DependencyInjection.js";
// import { InteractionMode } from "../InteractionMode.js";



// @service()
// export class InteractionLayer {

//     private _interactionLayer: HTMLDivElement;
//     private _interactionModes: Map<string, InteractionMode>;


//     // private _canvas: CanvasInfo;
//     private _activeInteractionMode: InteractionMode;


//     public constructor() {

//         // this.canvas = new CanvasInfo(configuration.canvas, configuration.interactionLayer);
//         // this._interactionLayer = configuration.interactionLayer;
//         // this._interactionModes = configuration.interactionModes;

//         // let interactionMode = this._interactionModes.get(configuration.primaryInteractionMode);
//         // if (!interactionMode)
//         //     throw "Primary interaction mode does not exist";

//         // this._activeInteractionMode = interactionMode;

//         // this._panels = configuration.menuPanels;
//     }

//     // public hidePanel(panel: string) {
//     //     if (this._panels.has(panel)) {
//     //         this._panels.get(panel)?.classList.add("hide");
//     //     }
//     // }

//     // public showPanel(panel: string) {
//     //     if (this._panels.has(panel)) {
//     //         this._panels.get(panel)?.classList.remove("hide");
//     //     }
//     // }

//     // public togglePanel(panel: string) {
//     //     if (this._panels.has(panel)) {
//     //         this._panels.get(panel)?.classList.toggle("hide");
//     //     }
//     // }

//     // public switchInteractionMode(canvasModeName: string) {

//     //     if (this._interactionModes.has(canvasModeName)) {
//     //         let interactionMode = this._interactionModes.get(canvasModeName);
//     //         if (!interactionMode)
//     //             throw `Interaction Mode failed to be changed`;

//     //         this._activeInteractionMode = interactionMode;
//     //         this._activeInteractionMode.init(this);
//     //     }
//     // }

//     public init() {



//         this.initEvents();
//     }

//     private initEvents() {

//         //On Click
//         this._interactionLayer.addEventListener("click", (e) => {
//             this._activeInteractionMode.onMouseClick(e);
//         }, false);

//         //On Mouse Down
//         this._interactionLayer.addEventListener("mousedown", (e) => {
//             this._activeInteractionMode.onMouseDown(e);
//         }, false);

//         //On Mouse Up
//         this._interactionLayer.addEventListener("mouseup", (e) => {
//             this._activeInteractionMode.onMouseUp(e);
//         }, false);

//         //On Mouse Move
//         this._interactionLayer.addEventListener("mousemove", (e) => {
//             this._activeInteractionMode.onMouseMove(e);
//         }, false);

//         //On Wheel
//         this._interactionLayer.addEventListener("wheel", (e) => {
//             this._activeInteractionMode.onWheel(e);
//         }, false);

//         //On Context Menu
//         this._interactionLayer.addEventListener("contextmenu", (e) => {
//             this._activeInteractionMode.onContextMenu(e);
//         }, false);

//         //On double click
//         this._interactionLayer.addEventListener("dblclick", (e) => {
//             this._activeInteractionMode.onMouseDblClick(e);
//         }, false);

//         //On Mouse enter
//         this._interactionLayer.addEventListener("mouseenter", (e) => {
//             this._activeInteractionMode.onMouseEnter(e);
//         }, false);

//         //On Mouse leave
//         this._interactionLayer.addEventListener("mouseleave", (e) => {
//             this._activeInteractionMode.onMouseLeave(this, e);
//         }, false);

//     }

// }