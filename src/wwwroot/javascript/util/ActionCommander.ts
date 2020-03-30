import { KeyCommander } from "./KeyCommander.js";


/**
 * Class used to render and build commands using a descision tree. Includes autocomplete and auto generated forms based on command requirements
 */
export class ActionCommander<T> {

    private _inputElement: HTMLInputElement;

    private _commands: Map<string, ActionCommand<T>>;

    private _keyBindings: Map<string, string>;

    private _dependency: T;

    public constructor(inputElement: HTMLInputElement, dependency: T, commands: Map<string, ActionCommand<T>>) {
        this._inputElement = inputElement;
        this._dependency = dependency;
        this._commands = commands;
        this._keyBindings = new Map<string, string>();

        this._commands.forEach(c => {
            this.mapKeyBindings(c);
        });

        this.registerKeyBindings();

        this.init();
    }

    /**
     * Builds a map of all of the key combinations by searching the commands recursivly
     * @param commands 
     */
    private mapKeyBindings(commands: ActionCommand<T>): void {

        this._keyBindings = new Map<string, string>([...this._keyBindings, ...commands.keyBinding]);

        commands?.subcommands?.forEach(x => {
            this.mapKeyBindings(x);
        });
    }

    /**
     * Maps keybindings 
     */
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

    public clearInput(): void {
        this._inputElement.value = "";
    }


    /**
     * Initilizes the search input
     */
    private init(): void {

        this._inputElement.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {


                if (this.parseAndExecute(this._inputElement.value)) {//only clear and toggle if valid command
                    this.parseAndExecute("view toggle -s");
                    this.clearInput();

                    //blur element
                    let el = e.target as HTMLElement;
                    el.blur();
                    console.log("unfocusing")

                }

            } else if (e.key === "Escape") {
                this.parseAndExecute("view toggle -s");
                this.clearInput();

                //blur element
                let el = e.target as HTMLElement;
                el.blur();
                console.log("unfocusing")

            }

        });
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