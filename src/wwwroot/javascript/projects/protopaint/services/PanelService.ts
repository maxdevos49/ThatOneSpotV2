import { service } from "../../../util/DependencyInjection.js";
import { IActionCommander } from "../../../util/ActionCommander/ActionCommander.js";

@service()
export class PanelService {

    private _panels: Map<string, HTMLElement>;
    private _actionCommander: IActionCommander;

    public constructor() {
        this._panels = new Map();
    }

    public registerPanel(name: string, selector: string): void {
        if (this._panels.has(name))
            throw new Error(`Panel Name: "${name}" is already registered. Try using a different name`);

        let element = document.querySelector(selector) as HTMLElement;

        if (!element)
            throw new Error(`Panel Name: "${name}" with selector: "${selector}" failed to be found. Check your selector.`);

        this._panels.set(name.toLowerCase(), element);
    }

    public getPanelKeys(): string[] {
        return [...this._panels].map((value) => value[0]);
    }

    public hidePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel)?.classList.add("hide");
        }
    }

    public showPanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel)?.classList.remove("hide");
        }
    }

    public togglePanel(panel: string) {
        if (this._panels.has(panel)) {
            this._panels.get(panel)?.classList.toggle("hide");
        }
    }

    public showSearch(): void {
        this._actionCommander.focus();
    }

    public injectActionCommander(actionCommander: IActionCommander): void {
        this._actionCommander = actionCommander;
    }

}