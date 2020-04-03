import { KeyCommander } from "./KeyCommander.js";


/**
 * Class used to render and build commands using a descision tree. Includes autocomplete and auto generated forms based on command requirements
 */
export class ActionCommander<T> {

    private _dependency: T;

    private _searchContainer: HTMLElement;

    private _inputElement: HTMLInputElement;

    private _commandSuggestions: HTMLUListElement;

    private _keyBindings: Map<string, string>;

    private _commands: Map<string, ActionCommand<T>>;
    private _actionHistory: ActionHistory;

    public constructor(dependency: T, searchContainer: HTMLElement, commands: Map<string, ActionCommand<T>>) {

        this._dependency = dependency;
        this._searchContainer = searchContainer;
        this._commands = commands;
        this._keyBindings = new Map<string, string>();
        this._actionHistory = new ActionHistory();

        //create input
        this._inputElement = document.createElement("INPUT") as HTMLInputElement;
        this._inputElement.setAttribute("id", "ActionSearch");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.setAttribute("placeholder", "ActionSearch");
        this._inputElement.setAttribute("tabindex", "-1");
        searchContainer.appendChild(this._inputElement);

        //create suggestions
        this._commandSuggestions = document.createElement("UL") as HTMLUListElement;
        this._commandSuggestions.setAttribute("id", "ActionSuggestions");
        searchContainer.appendChild(this._commandSuggestions);


        this._commands.forEach(c => {
            this.mapKeyBindings(c);
        });

        this.registerKeyBindings();

        this.init();
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
        this.clearInput();
        this._searchContainer.classList.remove("show")
    }

    private clearInput(): void {
        this._inputElement.value = "";
        this._inputElement.blur();
    }

    private init(): void {

        this._inputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {

                this._actionHistory.add(this._inputElement);

                //only clear and hide if valid command
                if (this.parseAndExecute(this._inputElement.value)) {
                    this.hideSearch();
                }

            } else if (e.key === "Escape") {
                this.hideSearch();
            } else if (e.altKey && e.key === "ArrowDown") {
                this._actionHistory.view(this._inputElement, -1);
            } else if (e.altKey && e.key === "ArrowUp") {
                this._actionHistory.view(this._inputElement, 1);
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

export interface ActionConfiguration<T> {
    summary: string;
    description: string;
    keyBinding?: Map<string, string>;
    subcommands?: Map<string, ActionCommand<T>>;
    flags?: Map<string, Function>;
}

class ActionHistory {
    private _initialCommand?: string;
    private _currentIndex?: number;

    private _history: Array<string>;

    constructor() {
        this._initialCommand = null;
        this._currentIndex = null;
        this._history = JSON.parse(localStorage.getItem("actionCommandHistory")) ?? new Array<string>();
    }

    public add(input: HTMLInputElement): void {
        if (input.value.length > 0) {
            this.reset();
            this._history.unshift(input.value);

            localStorage.setItem("actionCommandHistory", JSON.stringify(this._history.slice(0, this._history.length < 100 ? this._history.length : 100)));
        }
    }

    public view(input: HTMLInputElement, offset: number): void {

        if (this._history.length == 0) {
            return;
        }

        if (this._initialCommand === null) {
            this._initialCommand = input.value;
        }

        let index = this._currentIndex == null ? 0 : this._currentIndex + offset;

        if (index < 0) {
            input.value = this._initialCommand;
            this.reset();
            return;
        } else if (index > this._history.length - 1) {
            index = this._history.length - 1;
        }

        this._currentIndex = index;
        input.value = this._history[this._currentIndex];
    }

    public reset(): void {
        this._initialCommand = null;
        this._currentIndex = null;
    }


}