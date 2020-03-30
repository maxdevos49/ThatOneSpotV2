import { ActionCommander } from "../../util/ActionCommander.js"
import { CommandRegistry } from "./commands/CommandRegistry.js";

export class ProtoPaint {

    private _actionCommand: ActionCommander<ProtoPaint>;

    private _panels: Map<string, HTMLElement>;

    public constructor() {
        this._actionCommand = new ActionCommander<ProtoPaint>(document.querySelector('#search'), this, CommandRegistry());
        this._panels = new Map<string, HTMLElement>();

        //Register panels
        document.querySelectorAll("div[data-panel]").forEach((x) => {
            let el: HTMLElement = x as HTMLElement;
            this._panels.set(el.dataset.panel, el);
        });
    }

    public hidePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.add("hide");
        }
    }

    public showPanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.remove("hide");

            if (this._panels.get(panel).dataset.panel === "search") {
                this.focusSearch();
            }
        }
    }

    public togglePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel).classList.toggle("hide");

            if (!this._panels.get(panel).classList.contains("hide")) {
                this.focusSearch();
            }
        }
    }

    private focusSearch() {
        window.setTimeout(() => {
            console.log("focusing")
            document.getElementById("search").focus();
        }, 10);
    }

}

let pp = new ProtoPaint();