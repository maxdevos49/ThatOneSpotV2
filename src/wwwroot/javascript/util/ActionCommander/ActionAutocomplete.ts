export class ActionAutocomplete {
    public mode: ActionAutocompleteMode;


    private _selectionIndex: number | null;
    private _selectionsCount: number;


    private _autoCompleteElement: HTMLDListElement;
    private _inputElement: HTMLInputElement;


    constructor(input: HTMLInputElement, autocomplete: HTMLDListElement) {
        this._inputElement = input;
        this._autoCompleteElement = autocomplete;

        this._selectionsCount = 0;
        this._selectionIndex = null;

        this.mode = ActionAutocompleteMode.Command;

        this.initEvents();
    }

    /**
     * Generate html for the autocomplete frop down
     * @param title What to call the data being shown
     * @param data The data to display in the autocomplete
     */
    public generateHTML(title: string | null, data: ActionAutocompleteData[]): void {

        let html: string = "";

        if (title)
            html += `<dt class="title">${title}</dt>`;

        html += data.map((value: ActionAutocompleteData, index: number) => {

            let section = "";

            if (value.subHeader) {
                section += `<dt>${value.header}</dt>`
            }

            section += `<dd>${value.subHeader ?? value.header}</dd>`


            return `<section data-index="${index}" data-value="${value.header}">${section}</section>`;
        }).join("");

        this._selectionsCount = data.length;
        this._autoCompleteElement.innerHTML = html;
        this._selectionIndex = null;

    }

    /**
     * Selects a item from the autocomplete dropdown via a index
     * @param index The index to select
     */
    public selectIndex(index?: number | null): void {
        index = index ?? this._selectionIndex;

        if (index == null)
            return;

        let section = this._autoCompleteElement.querySelector(`section[data-index="${index}"]`) as HTMLElement;

        let newValue = section?.dataset.value ?? "";

        if (this.mode === ActionAutocompleteMode.History) {
            this._inputElement.value = newValue;
        } else {

            let value = this._inputElement.value

            if (value.length === 0) {
                this._inputElement.value += newValue;
                return;
            }

            let lastPart: string = value.split(" ").pop() ?? "";//todo

            if (newValue.startsWith(lastPart)) {

                let index = value.length - lastPart.length;
                value = value.substr(0, index);

                value += newValue;

                this._inputElement.value = value;

            } else {

                if (value[value.length - 1] !== " ") {
                    this._inputElement.value += " " + newValue
                } else if (value[value.length - 1] === " ") {
                    this._inputElement.value += newValue
                }
            }
        }

        this._selectionIndex = null;
    }

    /**
     * Moves the highlighted selection of the autocomplete
     * @param amount How many items to increment the selection
     */
    public moveSelection(amount: number): void {

        //remove previous selection
        this._autoCompleteElement.querySelector(`section[data-index="${this._selectionIndex}"]`)?.classList.remove("active");

        //apply increment amount
        if (this._selectionIndex == null && amount > 0) {
            this._selectionIndex = 0;
        } else if (this._selectionIndex !== null) {
            this._selectionIndex += amount;//null + -1 = -1
        }

        if (this._selectionIndex === null)
            return;

        //check index bounds
        if (this._selectionIndex < 0) {
            this._selectionIndex = null;
            return;
        } else if (this._selectionIndex >= this._selectionsCount) {
            this._selectionIndex -= 1;
        }

        let newSelection = this._autoCompleteElement.querySelector(`section[data-index="${this._selectionIndex}"]`) as any;
        newSelection?.scrollIntoViewIfNeeded?.()
        newSelection?.classList.add("active");
    }

    public isSelecting(): boolean {
        return this._selectionIndex !== null;
    }

    public clear(): void {
        this._autoCompleteElement.innerHTML = "";
        this._selectionIndex = null;
        this._selectionsCount = 0;
    }

    private initEvents(): void {
        //TODO move into ActionCommander.ts to properly blur/refresh the autocomplete
        this._autoCompleteElement.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            let target = e.target as HTMLElement;

            let section = target.closest("section[data-index]") as HTMLElement;

            if (section) {
                let index = parseInt(section.dataset?.index ?? "0");
                this.selectIndex(index);
            }

        }, false);
    }
}


export interface ActionAutocompleteData {
    header: string;

    subHeader?: string;
}

export enum ActionAutocompleteMode {
    History,
    Command
}