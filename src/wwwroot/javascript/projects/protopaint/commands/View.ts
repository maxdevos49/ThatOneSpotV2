import { ActionCommand, ActionOptions } from "../../../util/ActionCommander.js";
import { ProtoPaint } from "../protopaint.js";

export class View extends ActionCommand<ProtoPaint>{

    public constructor() {
        super({
            summary: "Manipulate view components",
            description: "",
            keyBinding: new Map<string, string>([
                ["Control+h", "view -h"],
                ["Control+s", "view -s"]
            ]),
            subcommands: new Map<string, ActionCommand<ProtoPaint>>([
                ["toggle", new Toggle()],
                ["fullscreen", new Fullscreen()]
            ])
        });
    }

    public action(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {

        let r = false;

        if (options.values.has("-h") || options.values.has("--hide")) {
            dependency.hidePanel("left");
            dependency.hidePanel("right");
            r = true;
        }

        if (options.values.has("-s") || options.values.has("--show")) {
            dependency.showPanel("left");
            dependency.showPanel("right");
            r = true;
        }

        return r;
    }
}

export class Fullscreen extends ActionCommand<ProtoPaint>{
    public constructor() {
        super({
            summary: "Toggles Full Screen",
            description: "Toggles Full Screen",
            keyBinding: new Map<string, string>([
                ["f", "view fullscreen"],
            ])
        });
    }

    public action(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {
        let doc = window.document as any;
        let docEl = doc.documentElement as any;

        let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
        }
        else {
            cancelFullScreen.call(doc);
        }

        return true
    }
}


export class Toggle extends ActionCommand<ProtoPaint>{

    public constructor() {
        super({
            summary: "Toggles View Components",
            description: "",
            keyBinding: new Map<string, string>([
                ["Meta+p", "view toggle -s"],
                ["Control+l", "view toggle -l"],
                ["Control+r", "view toggle -r"],
            ]),
        });
    }

    public action(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {

        let r = false;

        if (options.values.has("-l") || options.values.has("--left")) {
            dependency.togglePanel("left");
            r = true;
        }

        if (options.values.has("-r") || options.values.has("--right")) {
            dependency.togglePanel("right");
            r = true;
        }

        if (options.values.has("-s") || options.values.has("--search")) {
            dependency.showSearch();
            r = true;
        }

        return r;
    }
}
