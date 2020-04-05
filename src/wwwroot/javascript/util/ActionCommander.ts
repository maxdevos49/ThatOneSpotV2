import { KeyCommander } from "./KeyCommander.js";


/**
 * Class used to render and build commands using a descision tree. Includes autocomplete and auto generated forms based on command requirements
 */
export class ActionCommander<T> {

    private _dependency: T;

    private _searchContainer: HTMLElement;

    private _inputElement: HTMLInputElement;

    private _autocompleteElement: HTMLDListElement;

    private _keyBindings: Map<string, string>;

    private _commands: Map<string, ActionCommand<T>>;
    private _history: ActionHistory;

    private _autocomplete: Autocomplete;

    private _autocompleteMode: AutocompleteMode;

    public constructor(dependency: T, searchContainer: HTMLElement, commands: Map<string, ActionCommand<T>>) {

        this._dependency = dependency;
        this._searchContainer = searchContainer;
        this._commands = commands;
        this._keyBindings = new Map<string, string>();
        this._history = new ActionHistory();
        this._autocompleteMode = AutocompleteMode.Command;

        //create input
        this._inputElement = document.createElement("INPUT") as HTMLInputElement;
        this._inputElement.setAttribute("id", "ActionSearch");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.setAttribute("placeholder", "ActionSearch");
        this._inputElement.setAttribute("tabindex", "-1");
        searchContainer.appendChild(this._inputElement);

        //create suggestions
        this._autocompleteElement = document.createElement("DL") as HTMLDListElement;
        this._autocompleteElement.setAttribute("class", "autocomplete");
        searchContainer.appendChild(this._autocompleteElement);

        this._autocomplete = new Autocomplete(this._inputElement, this._autocompleteElement)

        this._commands.forEach(c => {
            this.mapKeyBindings(c);
        });

        this.registerKeyBindings();

        this.init();
    }

    private autocompleteMode(mode: AutocompleteMode) {
        this._autocompleteMode = mode;

        this._autocomplete.clear();

        if (mode === AutocompleteMode.Command) {
            //TODO
        } else if (mode === AutocompleteMode.History) {
            this._autocomplete.generateHTML("History", this._history.getHistoryData());
        }
    }

    private mapKeyBindings(commands: ActionCommand<T>): void {

        this._keyBindings = new Map<string, string>([...this._keyBindings, ...commands.keyBinding]);

        commands?.subcommands?.forEach(x => {
            this.mapKeyBindings(x);
        });
    }

    private registerKeyBindings(): void {
        this._keyBindings.forEach((value, key) => {

            KeyCommander.bind(key, (e, s) => {
                this.parseAndExecute(value);
            });

        })
    }

    /**
     * Parses a text command and returns information needed to execute the command
     * @param command 
     */
    public parse(command: string): ActionOptions<T> {

        let result: ActionOptions<T> = new ActionOptions<T>();

        //split command by spaces
        let splitCommand = command.match(/(?:[^\s"]+|"[^"]*")+/gi);
        //removes any escaped quotes
        splitCommand.forEach(x => x.replace("\\\"", ""));

        //selects the first section of the command.(Primary command)
        let commandKey = splitCommand.shift();

        if (!this._commands.has(commandKey)) {
            result.error += "Command does not exist or is invalid";
            return result;
        }

        //assign the primary command
        result.command = this._commands.get(commandKey);

        var flagMode = false;
        //Search the commands tree and parse out values and flags to the command
        while (splitCommand.length > 0) {

            commandKey = splitCommand.shift();

            if (flagMode && commandKey[0] !== "-") {
                result.error = "Subcommands can not be declared after flags;";
                break;
            }

            if (commandKey[0] === "-")//Parse flag/flag+value
            {
                if (commandKey.length < 2
                    || (commandKey.length === 2 && commandKey[1] === "-")
                    || (commandKey.length > 2 && commandKey[2] === "-")) {//Probabaly overkill or not enough here
                    result.error = "Invalid flag. Flag must be in form as '-<single letter>' or '--<word>';";
                }

                //No more sub commands
                flagMode = true;

                let valueKey = commandKey;
                let value = "";

                //ensure we have another value and determine if we have a 'flag' or a 'flag and value'
                if (splitCommand.length && splitCommand[0][0] !== "-")
                    value = splitCommand.shift();

                //record values
                result.values.set(valueKey, value);
            } else {//Parse sub command

                //command has subcommands and the sub command exist
                if (result.command.subcommands && result.command.subcommands.has(commandKey)) {
                    result.command = result.command.subcommands.get(commandKey);
                } else {
                    result.error = "Subcommand does not exist or is invalid;";
                    break;
                }
            }
        }

        return result;
    }

    /**
     * Executes a command that has been prepared
     * @param commandOptions 
     */
    public execute(commandOptions: ActionOptions<T>): boolean {

        if (commandOptions.isValid) {
            return commandOptions.command.action(this._dependency, commandOptions)
        }
        else {
            return false;
        }
    }

    /**
     * Parses a text command and then executes it
     * @param command 
     */
    public parseAndExecute(command: string): boolean {
        return this.execute(this.parse(command));
    }

    /**
     * Shows the search and properly gives it focus
     */
    public showSearch(): void {
        this._searchContainer.classList.add("show");
        this._inputElement.focus();
    }

    /**
     * Hides and clears the search
     */
    public hideSearch(): void {
        this._searchContainer.classList.remove("show");
        this.clearInput();
        this.autocompleteMode(AutocompleteMode.Command)
        this._autocomplete.clear();
    }

    private clearInput(): void {
        this._inputElement.value = "";
        this._inputElement.blur();
    }

    private init(): void {

        this._inputElement.addEventListener("keydown", (e) => {

            if (e.altKey || e.metaKey || e.ctrlKey) {
                e.preventDefault();//prevent all special actions like printing :D
            }

            if (e.key === "Enter") {

                if (this._autocomplete.isSelecting()) {
                    this._autocomplete.selectIndex();
                }

                this._history.add(this._inputElement);

                if (this.parseAndExecute(this._inputElement.value)) {
                    this.hideSearch();
                }

            } else if (e.key == "Tab") {

                if (this._autocomplete.isSelecting()) {
                    this._autocomplete.selectIndex();
                }

            } else if (e.key === "Escape" || (e.key === "p" && e.metaKey)) {
                this.hideSearch();
            } else if (e.key === "Alt") {
                //toggle command mode
                if (this._autocompleteMode === AutocompleteMode.Command) {
                    this.autocompleteMode(AutocompleteMode.History)
                } else {
                    this.autocompleteMode(AutocompleteMode.Command)
                }
            } else if (e.key === "ArrowUp") {
                this._autocomplete.moveSelection(-1)
            } else if (e.key === "ArrowDown") {
                this._autocomplete.moveSelection(1);
            }

        }, false);

        this._inputElement.addEventListener("focusout", (e) => {
            this.hideSearch();
        }, false);

    }

}



export abstract class ActionCommand<T> {

    /**
     * Brief description of the command
     */
    public readonly summary: string;

    /**
     * Full description
     */
    public readonly description: string;

    /**
     * Key binding definition to trigger the command
     */
    public readonly keyBinding?: Map<string, string>;

    /**
     * Map of subcommands and their definitions
     */
    public readonly subcommands?: Map<string, ActionCommand<T>>;

    /**
     * Flags for the commands
     */
    public readonly flags?: Map<string, Function>;

    protected constructor(config: ActionConfiguration<T>) {
        this.summary = config.summary;
        this.description = config.description;
        this.keyBinding = config.keyBinding;
        this.subcommands = config.subcommands;
    }

    /**
     * The action to perform for the command. 
     * @param dependency Any dependencies needed for the command to function
     * @param command options for the 
     */
    public abstract action(dependency: T, commandOptions: ActionOptions<T>): boolean;

}

export class ActionOptions<T>{

    public command?: ActionCommand<T>

    public values: Map<string, string> = new Map<string, string>();

    private _valid: boolean = true;

    private _error: string = "";

    public set error(value: string) {
        this._error += value + ";";
        this._valid = false;
    }

    public get error(): string {
        return this._error;
    }

    public get isValid(): boolean {
        return this._valid;
    }

}

export class ActionHistory {

    private _history: Array<string>;

    constructor() {
        this._history = JSON.parse(localStorage.getItem("actionCommandHistory")) ?? new Array<string>();
    }

    public getHistoryData(): AutocompleteData[] {
        return this._history.map((value) => {
            return {
                header: value
            }
        })
    }

    public add(input: HTMLInputElement): void {
        if (input.value.length > 0) {
            this._history.unshift(input.value);

            localStorage.setItem("actionCommandHistory", JSON.stringify(this._history.slice(0, this._history.length < 50 ? this._history.length : 50)));
        }
    }

}

export class Autocomplete {

    private _selectionIndex?: number;

    private _selectionsCount: number;

    private _initialValue?: string;

    private _autoCompleteElement: HTMLDListElement;

    private _inputElement: HTMLInputElement;

    constructor(input: HTMLInputElement, autocomplete: HTMLDListElement) {
        this._inputElement = input;
        this._autoCompleteElement = autocomplete;

        this._selectionIndex = null;
        this._initialValue = null;

        this.init();
    }

    public generateHTML(title: string, data: AutocompleteData[]): void {

        let html: string = `<dt class="title">${title}</dt>`;

        html += data.map((value: AutocompleteData, index: number) => {

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

    public selectIndex(index?: number): void {
        index = index ?? this._selectionIndex;

        if (index == null)
            return;

        let section = this._autoCompleteElement.querySelector(`section[data-index="${index}"]`) as HTMLElement;
        this._inputElement.value = section?.dataset.value ?? "";

        this._selectionIndex = null;
    }

    public moveSelection(amount: number): void {

        //remove previous selection
        this._autoCompleteElement.querySelector(`section[data-index="${this._selectionIndex}"]`)?.classList.remove("active");

        //apply increment amount
        if (this._selectionIndex == null && amount > 0) {
            this._selectionIndex = 0;
            this._initialValue = this._inputElement.value;
        } else {
            this._selectionIndex += amount;//null + -1 = -1
        }

        //check index bounds
        if (this._selectionIndex < 0) {
            this._selectionIndex = null;
            return;
        } else if (this._selectionIndex >= this._selectionsCount) {
            this._selectionIndex -= 1;
        }

        let newSelection = this._autoCompleteElement.querySelector(`section[data-index="${this._selectionIndex}"]`) as any;
        newSelection?.scrollIntoViewIfNeeded?.()// || newSelection?.scrollIntoView?.();
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

    private init(): void {

        this._autoCompleteElement.addEventListener("mousedown", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("test")
            let target = e.target as HTMLElement;

            let section = target.closest("section[data-index]") as HTMLElement;

            if (section) {

                let index = parseInt(section.dataset.index);
                this.selectIndex(index);
            }

        }, false);
    }
}

export interface AutocompleteData {
    header: string;

    subHeader?: string;
}

export interface ActionConfiguration<T> {
    summary: string;
    description: string;
    keyBinding?: Map<string, string>;
    subcommands?: Map<string, ActionCommand<T>>;
    flags?: Map<string, Function>;
}

export enum AutocompleteMode {
    History,
    Command
}