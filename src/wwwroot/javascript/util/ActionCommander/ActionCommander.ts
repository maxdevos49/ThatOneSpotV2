import { IActionExtension, IActionExtensionConstructor } from "./interfaces/IActionExtension.js";
import { IActionController } from "./interfaces/IActionController.js";
import { IConfiguration } from "./interfaces/IConfiguration.js";
import { Injector } from "../DependencyInjection.js";
import { getActionsMetadata } from "./ActionDecorators.js";
import { IFlag } from "./interfaces/IFlag.js";
import { IParsedCommmand } from "./interfaces/IParsedCommand.js";
import { CommandParser } from "./CommandParser.js";
import { KeyCommander } from "../KeyCommander.js";

//#region IActionCommander

export interface IActionCommander {

    registerExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>): void;
    configureExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>, configureCallback: (extension: T) => void): void;

    registerController<T>(controller: new (...args: any[]) => T): void;

    parse(command: string): IParsedCommmand;
    execute(parsedCommand: IParsedCommmand): boolean;
    parseAndExecute(command: string): boolean;


    focus(): void;
    blur(): void;
    clear(): void;
    getText(): string;
    setText(text: string): void;
    appendText(text: string): void;

    //error();
    //getDataSource()

    //TODO
    init(): void;
}

//#endregion

export class ActionCommander implements IActionCommander {

    private _configuration: IConfiguration;
    private _inputElement: HTMLInputElement;
    private _controllers: Map<string, IActionController>;

    constructor(configuration?: IConfiguration) {
        this._configuration = configuration;

        this._controllers = new Map();
        this._inputElement = document.createElement("INPUT") as HTMLInputElement;
    }


    //#region Extension Configuration

    public registerExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>): void {
        throw new Error("Method not implemented.");
    }

    public configureExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>, configureCallback: (extension: T) => void): void {
        throw new Error("Method not implemented.");
    }

    //#endregion

    //#region Controller Configuration

    public registerController<T>(controller: new (...args: any[]) => T): void {

        let controllerName = Reflect.getMetadata("name", controller);

        if (!controllerName) {
            console.warn(`The controller: "${controller.name}" was not added due to metadata not being found`);
            return;
        }

        if (this._controllers.has(controllerName)) {
            console.warn(`The controller: "${controller.name}" with command name: "${controllerName}" is registered more than once! The repeated occurences will be omitted`);
            return;
        }

        let instance = Injector.resolve(controller);

        //Build controller metadata
        let controllerInfo: IActionController = {
            name: controllerName,
            summary: Reflect.getMetadata("summary", controller),
            description: Reflect.getMetadata("summary", controller),
            controller: instance,
        }

        //remap the actions by action name and not method
        controllerInfo.actions = new Map([...getActionsMetadata(instance)].map(value => [value[1].name, value[1]]));

        //add flag metadata to actions
        controllerInfo?.actions?.forEach((action) => {

            //# Variation registration for keyboard shortcuts
            action.variations?.forEach((variation) => {
                if (variation.keyCombination) {

                    if(KeyCommander.bindingExist(variation.keyCombination))
                        console.warn(`The keyboard shortcut: "${variation.keyCombination}" already exist. The original binding will be lost.`);

                    KeyCommander.bind(variation.keyCombination, (e) => {
                        e.preventDefault();

                        this.parseAndExecute(`${controllerName} ${action.name} ${variation.flagOptions}`);
                    });
                }
            });


            //# Flag registration
            if (!Reflect.hasMetadata("flags", instance, action.methodKey))
                Reflect.defineMetadata("flags", new Map<string, IFlag>(), instance, action.methodKey);

            action.flags = Reflect.getMetadata("flags", instance, action.methodKey);
        });

        this._controllers.set(controllerInfo.name, controllerInfo);
    }

    //#endregion

    //#region Parsing and Execution

    public parse(command: string): IParsedCommmand {
        return CommandParser.parseCommand(command, this._controllers);
    }


    public execute(parsedCommand: IParsedCommmand): boolean {
        if (!parsedCommand.isValid) {
            console.log(parsedCommand.errors)
            return false;
        }

        try {
            parsedCommand.controllerMetaData.controller[parsedCommand.actionMetaData.methodKey](...parsedCommand.actionArguments);
        } catch (err) {
            return false;
        }

        return true;
    }

    public parseAndExecute(command: string): boolean {
        return this.execute(this.parse(command));
    }

    //#endregion

    //#region Search Manipulation

    public focus(): void {
        this._inputElement.focus();
    }

    public blur(): void {
        this._inputElement.blur();
    }

    public clear(): void {
        this._inputElement.value = "";
    }

    public getText(): string {
        return this._inputElement.value;
    }

    public setText(text: string): void {
        this._inputElement.value = text;
    }

    public appendText(text: string): void {
        this._inputElement.value += text;
    }

    //#endregion

    //#region Initilization

    public init(): void {

        this.initUI();
        this.initEvents();

        //register controllers
        this._configuration?.actionControllers?.forEach((controller) => {
            this.registerController(controller);
        });

        //TODO Init Key Combos

        //TODO Init Extensions

        // throw new Error("Method not fully implemented.");
    }

    private initUI(): void {

        let searchContainer = document.getElementById(this._configuration.searchContainerId ?? "search-container");

        if (!searchContainer)
            throw new Error(`The SearchContainerId: ${this._configuration.searchContainerId ?? "search-container"} is not valid. Aborting Initilization.`);

        this._inputElement.setAttribute("id", "ActionSearch");
        this._inputElement.setAttribute("type", "text");
        this._inputElement.setAttribute("placeholder", "ActionSearch");
        this._inputElement.setAttribute("tabindex", "-1");
        searchContainer.appendChild(this._inputElement);
    }

    private initEvents(): void {

        this._inputElement.addEventListener("keydown", (e) => {

            if (e.altKey || e.metaKey || e.ctrlKey || e.key === "Tab")
                e.preventDefault();//prevent all special actions like printing :D

            //TODO override default with extensions

            if (e.key === "Enter" && this.getText().length > 0) {


                // this._history.add(this.getText());//TODO History

                let parsedCommand = this.parse(this.getText());

                if (this.execute(parsedCommand)) {
                    //TODO onSubmit(command, valid)
                } else {
                    //TODO onError
                }
            }

        }, false);

        this._inputElement.addEventListener("input", (e) => {
            //TODO onInput
        }, false);

        this._inputElement.addEventListener("focusin", (e) => {
            // TODO onFocus
        }, false);

        this._inputElement.addEventListener("focusout", (e) => {
            // TODO onBlur
        }, false);

    }

    //#endregion

}