
export class Canvas {
    //TODO
}

// import { ProtoPaint } from "../protopaint.js";
// import { ActionController } from "../../../util/ActionCommander/ActionController.js";
// import { ActionOptions } from "../../../util/ActionCommander/Action.js";
// import { action, flag } from "../../../util/ActionCommander/ActionDecorators.js";

// export class Canvas extends ActionController<ProtoPaint>{

//     constructor() {
//         super("canvas", "Manipulate the canvas",  "Canvas is a primary command used to manipulate the canvas or access other subcommands.");
//     }

//     @flag("x", "x", "Translates the canvas horizontally by a specified amount")
//     @flag("y", "y", "Translates the canvas vertically by a specified amount")
//     @action("Pans the canvas", "Translates the canvas on the x and y axis")
//     public pan(dependency: ProtoPaint, o: ActionOptions<ProtoPaint>): boolean {
//         let c = dependency.canvas;
//         let r = false;

//         if (o.values.has("-x")) {
//             let x = parseInt(o.values.get("-x"));
//             c.pan(x, 0)
//             r = true;
//         }

//         if (o.values.has("-y")) {
//             let y = parseInt(o.values.get("-y"));
//             c.pan(y, 0)
//             r = true;
//         }

//         return r;
//     }

//     @flag("s", "scale", "Scale the canvas by a specified amount")
//     @action("Scale the canvas", "Scales the canvas in the x and y dimensions")
//     public scale(dependency: ProtoPaint, o: ActionOptions<ProtoPaint>): boolean {

//         let s = o.getValue("s","scale") as number ?? 1;
//         dependency.canvas.setScale(s);

//         return true;
//     }
// }