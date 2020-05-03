// import { ActionController } from "./ActionCommander/ActionController.js";
// import { KeyCommander } from "./KeyCommander.js";


// /**
//  * Class used to render and build commands using a descision tree. Includes autocomplete and auto generated forms based on command requirements
//  */
// export class ActionCommander<T> {

//     private _dependency: T;

//     private _searchContainer: HTMLElement;

//     private _inputElement: HTMLInputElement;

//     private _autocompleteElement: HTMLDListElement;

//     private _errorElement: HTMLSpanElement;

//     private _keyBindings: Map<string, string>;

//     private _commands: ActionController<T>;

//     private _history: ActionHistory;

//     private _autocomplete: Autocomplete;


//     public constructor(dependency: T, searchContainer: HTMLElement, commands: ActionController<T>) {

//         this._dependency = dependency;
//         this._searchContainer = searchContainer;
//         this._commands = commands;
//         this._keyBindings = new Map<string, string>();
//         this._history = new ActionHistory();



//         this._autocomplete = new Autocomplete(this._inputElement, this._autocompleteElement)

//         // this.mapKeyBindings(this._commands);
//         this.registerKeyBindings();
//         this.init();
//     }

//     private autocompleteMode(mode: AutocompleteMode) {
//         this._autocomplete.mode = mode;

//         this._autocomplete.clear();

//         if (mode === AutocompleteMode.Command) {
//             this.triggerAutocomplete();
//         } else if (mode === AutocompleteMode.History) {
//             this._autocomplete.generateHTML("History", this._history.getHistoryData());
//         }
//     }

//     // private mapKeyBindings(commands: ActionCommand<T>): void {

//     //     // this._keyBindings = new Map<string, string>([...this._keyBindings, ...commands.keyBinding]);
//     //     //TODO
//     //     // commands?.subcommands?.forEach(x => {
//     //     //     this.mapKeyBindings(x);
//     //     // });
//     // }

//     private registerKeyBindings(): void {
//         this._keyBindings.forEach((value, key) => {

//             KeyCommander.bind(key, (e, s) => {
//                 this.parseAndExecute(value);
//             });

//         })
//     }

//     /**
//      * Parses a text command and returns information needed to execute the command
//      * @param command 
//      */
//     public parse(command: string): ActionOptions<T> {

//         let result: ActionOptions<T> = new ActionOptions<T>();


//         //view toggle --right true

//         //Command Mode
//         //"v".."view" show the options for the currently selected command
//         //"view " => we select the command here once we have a space

//         //Flag Mode 
//         //"-f" or "--force" shown interchangeable. Adds fullname flag when selected in autocomplete

//         //Quote Mode
//         //Only can occcur during flag mode
//         //Ties a sequence of characters together regardless of spaces or special characters



//         result.command = null;
//         result.commandString = command = command.trim();

//         let parseIndex: number = 0;

//         let quoteMode: boolean = false;
//         let commandMode: boolean = true;

//         // view toggle -r "rawr"
//         while (parseIndex < command.length) {

//             if (commandMode) { //Command Mode

//                 switch (command[parseIndex]) {
//                     case " ":

//                         //select next command if exist
//                         //if (result.command.subcommands.has(result.searchKey))
//                         //     result.command = result.command.subcommands.get(result.searchKey);
//                         //else
//                         //  result.error = `The sub command "${result.searchKey}" does not exist`;

//                         //reset search key
//                         result.searchKey = "";

//                         break;
//                     case "-":

//                         //validate flag marker syntax
//                         if (command[parseIndex - 1] === " ")
//                             commandMode = false;
//                         else
//                             result.error = "Illegal character in command. \"-\" can only occur after a space"

//                         //reset the search key
//                         result.searchKey = "";

//                         break;
//                     default:
//                         //add char to the search string
//                         result.searchKey += command[parseIndex];
//                 }

//             } else {// Flag Mode

//                 switch (command[parseIndex]) {
//                     case " ":
//                         console.log("Space")
//                         break;
//                     case "-":
//                         console.log("-")
//                         break;
//                     case '"':
//                         console.log('"')
//                         break;
//                     default:
//                         console.log("Normal")
//                         break;
//                 }

//             }

//             parseIndex++;
//         }

//         if (quoteMode) {
//             result.error = "Syntax error: No closing quote found";
//         }
//         console.log(result)
//         return result;

//         // //split command by spaces
//         // let splitCommand = command.match(/(?:[^\s"]+|"[^"]*")+/gi);
//         // //removes any escaped quotes
//         // splitCommand.forEach(x => x.replace("\\\"", ""));

//         // //selects the first section of the command.(Primary command)
//         // let commandKey = result.searchKey = splitCommand.shift();

//         // if (!this._commands.has(commandKey)) {
//         //     result.error += "Command does not exist or is invalid";
//         //     return result;
//         // }

//         // //assign the primary command
//         // result.command = this._commands.get(commandKey);

//         // var flagMode = false;
//         // //Search the commands tree and parse out values and flags to the command
//         // while (splitCommand.length > 0) {

//         //     commandKey = result.searchKey = splitCommand.shift();

//         //     if (flagMode && commandKey[0] !== "-") {
//         //         result.error = "Subcommands can not be declared after flags";
//         //         break;
//         //     }

//         //     if (commandKey[0] === "-")//Parse flag/flag+value
//         //     {
//         //         if (commandKey.length < 2
//         //             || (commandKey.length === 2 && commandKey[1] === "-")
//         //             || (commandKey.length > 2 && commandKey[2] === "-")) {//Probabaly overkill or not enough here
//         //             result.error = "Invalid flag. Flag must be in form as '-<single letter>' or '--<word>'";
//         //         }

//         //         //No more sub commands
//         //         flagMode = true;

//         //         let valueKey = commandKey;
//         //         let value = "";

//         //         //ensure we have another value and determine if we have a 'flag' or a 'flag and value'
//         //         if (splitCommand.length && splitCommand[0][0] !== "-")
//         //             value = splitCommand.shift();

//         //         //record values
//         //         result.values.set(valueKey, value);
//         //     } else {//Parse sub command

//         //         //command has subcommands and the sub command exist
//         //         if (result.command.subcommands && result.command.subcommands.has(commandKey)) {
//         //             result.command = result.command.subcommands.get(commandKey);
//         //         } else {
//         //             result.error = "Subcommand does not exist or is invalid";
//         //             break;
//         //         }
//         //     }
//         // }

//         // return result;
//     }

//     /**
//      * Executes a command that has been prepared
//      * @param commandOptions 
//      */
//     public execute(commandOptions: ActionOptions<T>): boolean {

//         if (commandOptions.isValid) {
//             //let value = commandOptions.command.action(this._dependency, commandOptions);

//             // if (!value) {
//             //     this._errorElement.innerHTML = `Command requires flag. Ex: '-r | --right' or '-v <myvalue> | --value <myvalue>';`
//             //     this._errorElement.classList.add("show");
//             // }

//             // return value;
//             return null;//TODO
//         }
//         else {
//             return false;
//         }
//     }

//     /**
//      * Parses a text command and then executes it
//      * @param command 
//      */
//     public parseAndExecute(command: string): boolean {
//         return this.execute(this.parse(command));
//     }

//     /**
//      * Shows the search and properly gives it focus
//      */
//     // public showSearch(): void {//TODO Focus
//     //     this.triggerAutocomplete();
//     //     this._searchContainer.classList.add("show");
//     //     this._inputElement.focus();
//     // }

//     /**
//      * Hides and clears the search
//      */
//     // public hideSearch(): void {//TODO Blur
//     //     this._searchContainer.classList.remove("show");
//     //     // this.autocompleteMode(AutocompleteMode.Command)
//     //     this.clearInput();
//     //     this._autocomplete.clear();
//     // }

//     private clearInput(): void {
//         this._inputElement.value = "";
//         this._inputElement.blur();
//     }

//     private triggerAutocomplete() {
//         if (this._autocomplete.mode === AutocompleteMode.History)
//             return;

//         if (this._inputElement.value.length === 0) {

//             this._errorElement.innerHTML = "";
//             this._errorElement.classList.remove("show");

//             //TODO
//             //this._autocomplete.generateHTML(null, [...this._commands.subcommands]?.map((value) => {
//             //     return {
//             //         header: value[0],
//             //         subHeader: value[1].summary
//             //     }
//             // }));

//             return;
//         }

//         this._errorElement.innerHTML = "";
//         this._errorElement.classList.remove("show");

//         let parsedcommand = this.parse(this._inputElement.value);

//         //TODO
//         // let commandMap = (!parsedcommand.command)
//         //     ? this._commands.subcommands
//         //     : parsedcommand.command.subcommands;

//         // let data = [...commandMap]?.map((value) => {
//         //     return {
//         //         header: value[0],
//         //         subHeader: value[1].summary
//         //     }
//         // });

//         // if (parsedcommand.searchKey.length > 0 && !parsedcommand.isValid)
//         //     data = data.filter(value => value.header.startsWith(parsedcommand.searchKey));

//         // if (!data.length) {
//         //     this._errorElement.innerHTML = parsedcommand.error;
//         //     this._errorElement.classList.add("show");
//         // }

//         // this._autocomplete.generateHTML(null, data);
//     }

//     private init(): void {

//         this._inputElement.addEventListener("keydown", (e) => {

//             if (e.altKey || e.metaKey || e.ctrlKey || e.key === "Tab") {
//                 e.preventDefault();//prevent all special actions like printing :D
//             }

//             if (e.key === "Enter") {
//                 if (this._autocomplete.isSelecting()) {
//                     this._autocomplete.selectIndex();
//                 }

//                 this._history.add(this._inputElement);

//                 if (this.parseAndExecute(this._inputElement.value)) {
//                     this.hideSearch();
//                 }
//             } else if (e.key == "Tab") {
//                 if (this._autocomplete.isSelecting()) {
//                     this._autocomplete.selectIndex();

//                     this.autocompleteMode(AutocompleteMode.Command)
//                 }
//             } else if (e.key === "Escape" || (e.key === "p" && e.metaKey)) {
//                 this.hideSearch();
//             } else if (e.key === "Alt") {
//                 //toggle command mode
//                 if (this._autocomplete.mode === AutocompleteMode.Command) {
//                     this.autocompleteMode(AutocompleteMode.History)
//                 } else {
//                     this.autocompleteMode(AutocompleteMode.Command)
//                 }
//             } else if (e.key === "ArrowUp") {
//                 this._autocomplete.moveSelection(-1)
//             } else if (e.key === "ArrowDown") {
//                 this._autocomplete.moveSelection(1);
//             }

//         }, false);

//         this._inputElement.addEventListener("input", (e) => {
//             this.triggerAutocomplete();
//         }, false)

//         this._inputElement.addEventListener("focusout", (e) => {
//             this.hideSearch();
//         }, false);

//     }
// }

// export class ActionHistory {

//     private _history: Array<string>;

//     constructor() {
//         this._history = JSON.parse(localStorage.getItem("actionCommandHistory")) ?? new Array<string>();
//     }

//     public getHistoryData(): AutocompleteData[] {
//         return this._history.map((value) => {
//             return {
//                 header: value
//             }
//         })
//     }

//     public add(input: HTMLInputElement): void {
//         if (input.value.length > 0) {
//             this._history.unshift(input.value);

//             localStorage.setItem("actionCommandHistory", JSON.stringify(this._history.slice(0, this._history.length < 50 ? this._history.length : 50)));
//         }
//     }

// }

