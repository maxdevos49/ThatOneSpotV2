import { service } from "../../../util/DependencyInjection.js";

@service()
export class CanvasService {



}


// export class CanvasService {

//     public readonly maximumScale: number = 4;
//     public readonly minimumScale: number = 0.25;
//     public readonly dblClickScale: number = 0.5;

//     public readonly element: HTMLCanvasElement;
//     public readonly context: CanvasRenderingContext2D;
//     public readonly interactionLayer: HTMLDivElement;

//     private _scale: number = 1;
//     private _originX: number = 0;
//     private _originY: number = 0;
//     private _offsetX: number = 0;
//     private _offsetY: number = 0;
//     private _x: number;
//     private _y: number;
//     private _width: number;
//     private _height: number;


//     constructor(canvas: HTMLCanvasElement, interactionLayer: HTMLDivElement) {
//         this.element = canvas;
//         let context = canvas.getContext("2d");
//         if (!context)
//             throw "Failed to get the canvas render context";
//         this.context = context;
//         this._width = canvas.width;
//         this._height = canvas.height;
//         this._x = canvas.offsetLeft;
//         this._y = canvas.offsetTop;
//         this.interactionLayer = interactionLayer;
//     }

//     public get scale(): number {
//         return this._scale;
//     }

//     public get x(): number {
//         return this._x + this._offsetX;
//     }

//     public get y(): number {
//         return this._y + this._offsetY;
//     }

//     public get width(): number {
//         return this._width * this._scale;
//     }

//     public get height(): number {
//         return this._width * this._scale;
//     }

//     public pan(panX: number, panY: number): void {
//         this._offsetX += panX;
//         this._offsetY += panY;
//         this.validateOffset();
//         this.applyTransformations();
//     }
//     public setTranslation(offsetX: number, offsetY: number): void {
//         this._offsetX = offsetX;
//         this._offsetY = offsetY;
//         this.validateOffset()
//         this.applyTransformations();
//     }

//     public setScale(scale: number): void {
//         this._scale = Math.min(Math.max(scale, this.minimumScale), this.maximumScale)
//         this.applyTransformations();
//     }

//     public setOrigin(originX: number, originY: number): void {
//         this._originX = originX;
//         this._originY = originY;
//         this.applyTransformations();
//     }

//     public scaleCanvasToPoint(scaleChange: number, mouse: Vector) {
//         let newScale = scaleChange + this.scale;

//         let zoomPointX = (mouse.x - this.x) / this.scale;
//         let zoomPointY = (mouse.y - this.y) / this.scale;

//         if (newScale < this.maximumScale && newScale > this.minimumScale) {
//             this.setScale(newScale);
//             this.pan(-(zoomPointX * scaleChange), -(zoomPointY * scaleChange));
//         }
//     }

//     private validateOffset(): void {
//         let container = this.interactionLayer.getBoundingClientRect();

//         if (this.x > container.width / 2) {
//             this._offsetX -= this.x - container.width / 2;
//         } else if (this.x + this.width < container.width / 2) {
//             this._offsetX -= (this.x + this.width) - container.width / 2
//         }

//         if (this.y > container.height / 2) {
//             this._offsetY -= this.y - container.height / 2;
//         } else if (this.y + this.height < container.height / 2) {
//             this._offsetY -= (this.y + this.height) - container.height / 2
//         }

//     }

//     private applyTransformations(): void {
//         this.element.style.transformOrigin = `${this._originX}px ${this._originY}px`;
//         this.element.style.transform = `translate(${this._offsetX}px,${this._offsetY}px) scale(${this._scale})`;
//     }
// }