import { IFlag } from "./IFlag.js";

export class Action<T>{
    public readonly actionName: string
    public readonly summary: string;
    public readonly description: string;
    public readonly flags: Map<string, IFlag>
    public readonly invoke: (dependency: T, options: ActionOptions<T>) => boolean;

    public constructor(actionName: string, summary: string, description: string, action: (dependency: T, options: any/** TODO */) => boolean) {
        this.actionName = actionName;
        this.summary = summary;
        this.description = description;
        this.invoke = action;
        this.flags = new Map<string, IFlag>();
    }

    /**
     * Registers a flag for a action
     * @param flag Information about the flag
     */
    public registerFlag(flag: IFlag): void {
        let key = flag.shortFlag + flag.longFlag;

        if (this.flags.has(key)) {
            throw `The action: ${this.actionName} already has the flag: [-${flag.shortFlag} | --${flag.longFlag}] registered. Duplicate flags are not allowed`;
        } else {
            this.flags.set(key, flag);
        }
    }
}

export class ActionOptions<T>{
    private _action: Action<T>;
    private _values: Map<string, string>;
    private _errors: string[];

    public static readonly ParseMap: Map<Function, (value: string) => any> = new Map<Function, (value: string) => any>([
        [Number, (value: string) => {
            return Number(value);
        }],
        [String, (value: string) => {
            return value;
        }],
        [Boolean, (value: string) => {
            return (value === "true" || value === "True" || value === "TRUE");
        }],
        [Array, (value: string) => {
            try {
                return JSON.parse(value);
            } catch (err) {
                return null;
            }
        }]
    ]);

    constructor(action: Action<T>, values: Map<string, string>) {
        this._action = action;
        this._values = values;
        this._errors = [];
    }

    /**
     * Gets the value for the desired flag.
     * @param shortFlag The short version of the flag
     * @param longFlag The long version of the flag
     */
    public getValue(shortFlag: string, longFlag: string): number | string | boolean | Array<any> | null {

        if (this._action.flags.has(shortFlag + longFlag)) {

            let flag = this._action.flags.get(shortFlag + longFlag);
            let value = this._values.get(shortFlag) ?? this._values.get(longFlag);

            if (!value || !flag)
                return null;

            return ActionOptions.ParseMap.get(flag.type)?.(value);

        } else {
            throw `The Flag: "[ -${shortFlag} | --${longFlag}]" does not exist`;
        }

    }

    /**
     * Adds a error to the error list
     * @param error The error message to add
     */
    public setError(error: string): boolean {
        this._errors.push(error);
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
}