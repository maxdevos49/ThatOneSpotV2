import { ActionAutocompleteData } from "./ActionAutocomplete.js";

export class ActionHistory {

    private _history: Array<string>;

    constructor() {
        let items = localStorage.getItem("actionCommandHistory") ?? "";

        this._history = JSON.parse(items) ?? new Array<string>();
    }

    /**
     * Gets the history data to display in the autocomplete dropdown
     */
    public getHistoryData(): ActionAutocompleteData[] {
        return this._history.map((value) => {
            return {
                header: value
            }
        })
    }

    /**
     * Adds an entry to the history
     * @param input the command to add to the history
     */
    public add(input: HTMLInputElement): void {
        if (input.value.length > 0) {
            this._history.unshift(input.value);

            localStorage.setItem("actionCommandHistory", JSON.stringify(this._history.slice(0, this._history.length < 50 ? this._history.length : 50)));
        }
    }

}