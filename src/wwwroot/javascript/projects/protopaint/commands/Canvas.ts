import { ActionCommand, ActionOptions } from "../../../util/ActionCommander.js";
import { ProtoPaint } from "../protopaint.js";

export class Canvas extends ActionCommand<ProtoPaint>{


    constructor() {
        super({
            summary: "Manipulate the canvas",
            description: "Canvas is a primary command used to manipulate the canvas or access other subcommands.",
            keyBinding: new Map<string, string>([]),
            subcommands: new Map<string, ActionCommand<ProtoPaint>>([
                ["pan", new Pan()],
                ["scale", new Scale()]
            ])
        });
    }

    public action(dependency: ProtoPaint, commandOptions: ActionOptions<ProtoPaint>): boolean {
        return false;//Just a parent command
    }

}

export class Pan extends ActionCommand<ProtoPaint>{

    constructor() {
        super({
            summary: "Pans the canvas",
            description: "Pans the canvas by an x and/or y offset",
            keyBinding: new Map<string, string>([]),
            subcommands: null
        })
    }

    public action(dependency: ProtoPaint, o: ActionOptions<ProtoPaint>): boolean {
        let c = dependency.canvas;
        let r = false;

        if (o.values.has("-x")) {
            let x = parseInt(o.values.get("-x"));
            c.pan(x, 0)
            r = true;
        }

        if (o.values.has("-y")) {
            let y = parseInt(o.values.get("-y"));
            c.pan(y, 0)
            r = true;
        }

        return r;
    }
}

export class Scale extends ActionCommand<ProtoPaint>{

    constructor() {
        super({
            summary: "Scales the canvas",
            description: "Scales the canvas by a scalar value",
            keyBinding: new Map<string, string>([]),
            subcommands: null
        })
    }

    public action(dependency: ProtoPaint, o: ActionOptions<ProtoPaint>): boolean {
        let c = dependency.canvas;
        let r = false;

        if (o.values.has("--scale")) {
            let s = parseInt(o.values.get("--scale"));
            c.setScale(s);
            r = true;
        } else if (o.values.has("-s")) {
            let s = parseInt(o.values.get("-s"));
            c.setScale(s);
            r = true;
        }

        return r;
    }
}