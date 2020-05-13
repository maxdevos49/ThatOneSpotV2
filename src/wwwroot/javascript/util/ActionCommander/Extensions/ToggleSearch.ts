import { IActionExtension } from "../interfaces/IActionExtension.js";
import { IActionCommander } from "../ActionCommander.js";
import { IParsedCommmand } from "../interfaces/IParsedCommand.js";

export class ToggleSearch implements IActionExtension {

    private _actionCommander: IActionCommander;

    public searchContainerId: string;

    constructor(actionCommander: IActionCommander) {
        this._actionCommander = actionCommander;

        this.searchContainerId = "search-container";//default value
    }

    public init(): void {

        this._actionCommander.registerKeyBinding("Meta+p", () => {
            if (this._actionCommander.isFocused())
                this._actionCommander.blur();
            else
                this._actionCommander.focus();
        });
    }

    public onSuccess(parsedCommand: IParsedCommmand): void {
        this._actionCommander.blur();
    }

    public onInput(e: KeyboardEvent): void {
        if ((e.key === "p" && e.metaKey) || e.key === "Escape")
            this._actionCommander.blur();//wow im dumb
    }

    public onFocus(): void {
        document.getElementById(this.searchContainerId).classList.add("show");
    }

    public onBlur(): void {
        document.getElementById(this.searchContainerId).classList.remove("show");
        this._actionCommander.setText("");
    }
}