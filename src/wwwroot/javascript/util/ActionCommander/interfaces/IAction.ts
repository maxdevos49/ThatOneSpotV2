import { IFlag } from "./IFlag.js";

export interface IAction {
    name: string,
    methodKey: string | symbol;
    summary: string;
    description?: string;
    flags?: Map<string, IFlag>;
}