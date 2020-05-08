import { IActionExtension, IActionExtensionConstructor } from "./interfaces/IActionExtension.js";
import { IParsedCommmad } from "./CommandParser.js";
import { IActionController } from "./interfaces/IActionController.js";
import { IConfiguration } from "./interfaces/IConfiguration.js";
import { Injector } from "../DependencyInjection.js";
import { getActionsMetadata } from "./ActionDecorators.js";
import { IFlag } from "./interfaces/IFlag.js";

//#region IActionCommander

export interface IActionCommander {

    registerExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>): void;
    configureExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>, configureCallback: (extension: T) => void): void;
    unregisterExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>): void;

    registerController<T>(controller: new (...args: any[]) => T): void;
    getController<T>(controller: new (...args: any[]) => T): T;//TODO

    parse(command: string): IParsedCommmad;
    execute(parsedCommand: IParsedCommmad): boolean;
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

    public unregisterExtension<T extends IActionExtension>(extension: IActionExtensionConstructor<T>): void {
        throw new Error("Method not implemented.");
    }

    //#endregion

    //#region Controller Configuration

    public registerController<T>(controller: new (...args: any[]) => T): void {

        let name = Reflect.getMetadata("name", controller);

        if (!name) {
            console.warn(`The controller: "${controller.name}" was not added due to metadata not being found`);
            return;
        }

        if (this._controllers.has(name)) {
            console.warn(`The controller: "${controller.name}" with command name: "${name}" is registered more than once! The repeated occurences will be omitted`);
            return;
        }

        let instance = Injector.resolve(controller);

        //Build controller metadata
        let controllerInfo: IActionController = {
            name: name,
            summary: Reflect.getMetadata("summary", controller),
            description: Reflect.getMetadata("summary", controller),
            controller: instance,
        }

        //remap the actions by action name and not method
        controllerInfo.actions = new Map([...getActionsMetadata(instance)].map(value => [value[1].name, value[1]]));

        //add flag metadata to actions
        controllerInfo?.actions?.forEach((action) => {

            if (!Reflect.hasMetadata("flags", instance, action.methodKey))
                Reflect.defineMetadata("flags", new Map<string, IFlag>(), instance, action.methodKey);

            action.flags = Reflect.getMetadata("flags", instance, action.methodKey);
        });

        this._controllers.set(controllerInfo.name, controllerInfo);
    }
    public getController<T>(controller: new (...args: any[]) => T): T {
        throw new Error("Method not implemented.");
    }

    //#endregion

    //#region Parsing and Execution

    public parse(command: string): IParsedCommmad {
        throw new Error("Method not implemented.");
    }


    public execute(parsedCommand: IParsedCommmad): boolean {
        throw new Error("Method not implemented.");
    }

    public parseAndExecute(command: string): boolean {
        throw new Error("Method not implemented.");
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

            if (e.key === "Enter") {

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