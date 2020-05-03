import { Action } from "./Action.js";
import { IFlag } from "./IFlag.js";

export abstract class ActionController<T>{

    public readonly controllerName: string;
    public readonly summary: string;
    public readonly description: string;
    public readonly actions: Map<string, Action<T>>;
    public readonly subActions: Map<string, ActionController<T>>;

    protected constructor(name: string, summary: string, description: string) {
        this.controllerName = name;
        this.summary = summary;
        this.description = description;
        this.actions = new Map<string, Action<T>>();
        this.subActions = new Map<string, ActionController<T>>();
    }

    /**
     * Registers actions for a controller
     * @param action The action to be registered
     */
    public registerAction(action: Action<T>): void {
        let key = action.actionName;

        if (this.actions.has(key)) {
            throw `The action: "${key}" has already been registered. Duplicates are not allowed.`;
        } else {
            this.actions.set(key, action);
        }
    }

    /**
     * Registers a flag for an action
     * @param actionName The name of the action
     * @param flag The flag information
     */
    public registerFlagForAction(actionName: string, flag: IFlag): void {

        if (!this.actions.has(actionName)) {
            throw `The action: "${actionName}" does not exist. Make sure to use the "@action(...)" decorator  and is defined closest to the method`
        } else {
            let action = this.actions.get(actionName);
            action?.registerFlag(flag);
        }
    }

    /**
     * Registers a subActionController for a controller
     * @param controller The actionController constructor to register
     */
    public registerSubAction(controllerContructor: new () => ActionController<T>): void {
        let controller = new controllerContructor();
        let key = controller.controllerName;

        if (!this.subActions.has(key)) {
            throw `The SubActionController: "${key}" already exist. Duplicates are not allowed`
        } else {
            this.subActions.set(key, controller);
        }
    }

}