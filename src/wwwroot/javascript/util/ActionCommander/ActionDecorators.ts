import { ActionController } from "./ActionController.js";
import { Action } from "./Action.js";
import { IFlag } from "./IFlag.js";

/**
 * Declares a class method as a Action and registers it with the controller
 * @param summary A brief summary of what the action does
 * @param description A longer more detailed explanation of what the action does
 */
export function action<T extends ActionController<any>>(
    summary: string,
    description: string
) {
    return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {
        let a = new Action(propertyKey, summary, description, descriptor.value);
        target.registerAction(a);
    };
}

/**
 * Defines a flag to be used for a action
 * @param shortFlag single character version of a flag
 * @param longFlag single word version of a flag
 * @param summary A brief summary of the purpose of the flag
 * @param type The type of value the flag will return. Default type is "Boolean"
 */
export function flag<T extends ActionController<any>>(
    shortFlag: string,
    longFlag: string,
    summary: string,
    type: new () => Boolean | String | Number | Array<any> = Boolean,
) {
    return function (target: T, propertyKey: string, descriptor: PropertyDescriptor) {

        let flag: IFlag = {
            shortFlag: shortFlag,
            longFlag: longFlag,
            summary: summary,
            type: type,
        };

        target.registerFlagForAction(propertyKey, flag);
    };
}

//TODO eventually
// export function debugAction<T extends ActionController<any>>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
//     let value = descriptor.value;

//     descriptor.value = function (...args: any[]) {

//         console.log("Debugging Action: " + propertyKey + " (WIP maybe doesnt pass parameters through yet)");
//         let returnValue = descriptor.value(...args);
//         console.log("Action resulted in: " + (returnValue ? "Success" : "Failure"));
//         if (!returnValue)
//             console.log("Error Result: \n"/* TODO print error */)

//         return returnValue;
//     }
// }