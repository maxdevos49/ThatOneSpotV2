import { ActionController } from "./ActionController.js";
import { ActionAutocomplete, ActionAutocompleteMode } from "./ActionAutocomplete.js";
import { Action, ActionOptions } from "./Action.js";
import { ActionHistory } from "./ActionHistory.js";

export class ActionCommander<T>{

    public onBlur?: () => void;
    public onFocus?: () => void;
    public onExecute?: (parsedCommand: ParsedCommand<T>) => void;


    private readonly _dependency: T;
    private readonly _commands: ActionController<T>
    private readonly _autocomplete: ActionAutocomplete;
    private readonly _history: ActionHistory;


    private _searchContainer: HTMLElement;
    private _inputElement: HTMLInputElement;
    private _autocompleteElement: HTMLDListElement;
    private _errorElement: HTMLSpanElement;


    constructor(dependency: T, searchContainer: HTMLElement, commands: ActionController<T>) {
        this._dependency = dependency;
        this._searchContainer = searchContainer;
        this._commands = commands;
        this._history = new ActionHistory();


        this._inputElement = document.createElement("INPUT") as HTMLInputElement;
        this._errorElement = document.createElement("SPAN") as HTMLSpanElement;
        this._autocompleteElement = document.createElement("DL") as HTMLDListElement;
        this.initUI();

        //TODO keymapping
        this._autocomplete = new ActionAutocomplete(this._inputElement, this._autocompleteElement);

        this.initEvents();
    }

    /**
     * Blurs the command input
     */
    public blur(): void {
        this._inputElement.value = "";
        this._inputElement.blur();
        this.onBlur?.();
    }

    /**
     * Focuses the command input
     */
    public focus(): void {
        this.onFocus?.();
        this._inputElement.focus();
    }

    /**
     * Clears the command input
     */
    public clearInput(): void {
        this._inputElement.value = "";
    }

    public parse(command: string): ParsedCommand<T> {
        //TODO
        return new ParsedCommand(command, this._commands);
    }

    /**
     * Executes a parsed commands action
     * @param parsedCommand The parsed command information
     */
    public execute(parsedCommand: ParsedCommand<T>): boolean {

        if (parsedCommand.isValid()) {

            let actionOptions = parsedCommand.toActionOptions();

            if (actionOptions === null)
                return false;

            let value = parsedCommand.action?.invoke(this._dependency, actionOptions) ?? false;

            if (!value) {
                this._errorElement.innerHTML = `Command requires flag. Ex: '-r | --right' or '-v <myvalue> | --value <myvalue>';`
                this._errorElement.classList.add("show");
            }

            return value;
        }
        else {
            return false;
        }
    }

    /**
     * Parses a text command and then executes the resulting action
     * @param command The text command to parse into a action
     */
    public parseAndExecute(command: string): boolean {
        return this.execute(this.parse(command));
    }

    /**
     * Refreshes the displayed data in the autocomplete
     * @param mode The mode to change the autocomplete
     */
    private refreshAutocomplete(mode?: ActionAutocompleteMode) {

        if (!mode)//TODO mode change
            mode = this._autocomplete.mode;
        // else


        //remove errors if any
        this._errorElement.innerHTML = "";
        this._errorElement.classList.remove("show");

        //parse current command
        let parsedCommand = this.parse(this._inputElement.value);

        let data = [...parsedCommand.actionController.actions]?.map((value) => {
            return {
                header: value[0],
                subHeader: value[1].summary
            }
        });

        //filter data based on the existing command
        if (parsedCommand.searchKey.length > 0 && !parsedCommand.isValid)
            data = data.filter(value => value.header.startsWith(parsedCommand.searchKey));

        //display error if we have a error
        if (!data.length) {
            this._errorElement.innerHTML = parsedCommand.getErrors();
            this._errorElement.classList.add("show");
        }

        this._autocomplete.generateHTML(null, data);

    }

    /**
     * Initilizes any html needed to display the autocomplete
     */
    private initUI(): void {
        //create input element
        this._inputElement.setAttribute("id", "ActionSearch");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.setAttribute("placeholder", "ActionSearch");
        this._inputElement.setAttribute("tabindex", "-1");
        this._searchContainer.appendChild(this._inputElement);

        //create error element
        this._errorElement.setAttribute("id", "ActionError");
        this._searchContainer.appendChild(this._errorElement);

        //create suggestions element
        this._autocompleteElement.setAttribute("class", "autocomplete");
        this._searchContainer.appendChild(this._autocompleteElement);
    }

    /**
     * Initilizies all event listeners that ActionCommander may use
     */
    private initEvents(): void {

        //keydown event
        this._inputElement.addEventListener("keydown", (e) => {

            if (e.altKey || e.metaKey || e.ctrlKey || e.key === "Tab")
                e.preventDefault();//prevent all special actions like printing :D

            if (e.key === "Enter") {

                if (this._autocomplete.isSelecting())
                    this._autocomplete.selectIndex();

                this._history.add(this._inputElement);

                if (this.parseAndExecute(this._inputElement.value))
                    this.blur();

            } else if (e.key === "Tab") {

                if (this._autocomplete.isSelecting()) {
                    this._autocomplete.selectIndex();

                    this.refreshAutocomplete(ActionAutocompleteMode.Command);
                }

            } else if (e.key === "Alt") {

                if (this._autocomplete.mode === ActionAutocompleteMode.Command)
                    this.refreshAutocomplete(ActionAutocompleteMode.History)
                else
                    this.refreshAutocomplete(ActionAutocompleteMode.Command)

            } else if (e.key === "ArrowUp") {
                this._autocomplete.moveSelection(-1);
            } else if (e.key === "ArrowDown") {
                this._autocomplete.moveSelection(1);
            } else if (e.key === "Escape" || (e.key === "p" && e.metaKey)) {
                this.blur();
            }

        }, false);

        //input event
        this._inputElement.addEventListener("input", (e) => {
            this.refreshAutocomplete();
        }, false);

        //focusout event
        this._inputElement.addEventListener("focusout", (e) => {
            this.blur();
        }, false);

    }
}

export class ParsedCommand<T>{

    public searchKey: string;
    public commandText: string;
    public actionController: ActionController<T>;
    public action: Action<T> | null;


    private _isValid: boolean;
    private _errors: string[];
    private _values: Map<string, string>;


    constructor(command: string, baseController: ActionController<T>) {
        this.commandText = command;
        this.actionController = baseController;
        this.searchKey = "";
        this.action = null;

        this._isValid = true;
        this._errors = [];
        this._values = new Map<string, string>();

    }

    /**
     * Adds a error to the error list
     * @param error The error message to add
     */
    public setError(error: string): boolean {
        this._errors.push(error);
        this._isValid = false;
        return false;
    }

    /**
     * Parses all reported errors together;
     * @param separator The separator to put in between each error.
     * @param template The template to map the error message with.
     */
    public getErrors(separator: string = ";", template: (item: string) => string = x => x): string {
        return this._errors.map(template).join(separator);
    }

    /**
     * Indicates of the parsed command is valid
     */
    public isValid(): boolean {
        return this._isValid;
    }

    /**
     * Generate a action options class to be used for executing a parsed command
     */
    public toActionOptions(): ActionOptions<T> | null {
        if (this.action !== null)
            return new ActionOptions(this.action, this._values);
        else
            return null;
    }
}