import { ActionCommand, ActionOptions } from "../../../util/ActionCommander.js";
import { ProtoPaint } from "../protopaint.js";

export class View extends ActionCommand<ProtoPaint>{

    public constructor() {
        super({
            summary: "Manipulate view components",
            description: "",
            keyBinding: new Map<string, string>(
                Object.entries({
                    "Control+h": "view -h",
                    "Control+s": "view -s"
                })
            ),
            subcommands: new Map<string, ActionCommand<ProtoPaint>>(
                Object.entries({
                    "toggle": new Toggle()
                }))
        });
    }

    public action(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {

        if (options.values.has("-h") || options.values.has("--hide")) {
            dependency.hidePanel("left");
            dependency.hidePanel("right");
        }

        if (options.values.has("-s") || options.values.has("--show")) {
            dependency.showPanel("left");
            dependency.showPanel("right");
        }
        return true;
    }
}


export class Toggle extends ActionCommand<ProtoPaint>{

    public constructor() {
        super({
            summary: "Toggles View Components",
            description: "",
            keyBinding: new Map<string, string>(
                Object.entries({
                    "Meta+p": "view toggle -s",
                    "Control+l": "view toggle -l",
                    "Control+r": "view toggle -r",
                })
            ),
            subcommands: new Map<string, ActionCommand<ProtoPaint>>(
                Object.entries({}))

        });
    }

    public action(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {

        if (options.values.has("-l") || options.values.has("--left")) {
            dependency.togglePanel("left");
        }

        if (options.values.has("-r") || options.values.has("--right")) {
            dependency.togglePanel("right");
        }

        if (options.values.has("-s") || options.values.has("--search")) {
            dependency.showSearch();
        }

        return true;
    }
}
