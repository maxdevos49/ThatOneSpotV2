import { IParsedCommmand } from "./interfaces/IParsedCommand.js";
import { IParsedFlag } from "./interfaces/IParsedFlag.js";
import { IActionController } from "./interfaces/IActionController.js";
import { IAction } from "./interfaces/IAction.js";
import { IFlag } from "./interfaces/IFlag.js";

export class CommandParser {

    //#region ParseCommand

    public static parseCommand(command: string, controllers: Map<string, IActionController>): IParsedCommmand {


        let parsedCommand: IParsedCommmand = {
            command: CommandParser.prepareCommand(command),
            searchKey: "",
            isValid: false,
            controller: "",
            controllerMetaData: null,
            action: "",
            actionMetaData: null,
            errors: "",
            searchIndex: 0,
            rawValues: new Map<string, string>(),
            actionArguments: []
        }

        let actions = CommandParser.parseController(parsedCommand, controllers);

        if (!actions || !parsedCommand.isValid) {

            parsedCommand.isValid = false;
            return parsedCommand;
        }

        let flags = CommandParser.parseAction(parsedCommand, actions);

        if (!flags || !parsedCommand.isValid)
            return parsedCommand;

        CommandParser.ParseFlags(parsedCommand, flags);

        return parsedCommand;
    }

    //#endregion

    //#region PrepareCommand

    private static prepareCommand(command: string): string {
        return command.trim() + ";";
    }

    //#endregion

    //#region Parse Controller
    private static parseController(parsedCommand: IParsedCommmand, controllers: Map<string, IActionController>): Map<string, IAction> | null {

        while (parsedCommand.searchIndex < parsedCommand.command.length) {

            let char = parsedCommand.command[parsedCommand.searchIndex];

            if (char === " " || char === ";") {

                parsedCommand.searchIndex++;
                parsedCommand.controller = parsedCommand.searchKey;
                parsedCommand.searchKey = "";

                if (controllers.has(parsedCommand.controller)) {
                    parsedCommand.isValid = true;
                    parsedCommand.controllerMetaData = controllers.get(parsedCommand.controller);
                    return parsedCommand.controllerMetaData.actions;
                } else {
                    parsedCommand.isValid = false;
                    parsedCommand.errors += `Controller: "${parsedCommand.controller}" does not exist;`;
                    return null;
                }

            } else if (char === `"` || char === "-") {

                parsedCommand.isValid = false;
                parsedCommand.errors += `Illegal controller syntax error: <${char}> at column ${parsedCommand.searchIndex};`;

                return null;
            } else {
                parsedCommand.searchKey += char;
            }

            parsedCommand.searchIndex++;
        }

        return null;
    }

    //#endregion

    //#region Parse Action

    private static parseAction(parsedCommand: IParsedCommmand, actions: Map<string, IAction>): Map<string, IFlag> | null {

        while (parsedCommand.searchIndex < parsedCommand.command.length) {

            let char = parsedCommand.command[parsedCommand.searchIndex];

            if (char === " " || char === ";") {

                parsedCommand.searchIndex++;
                parsedCommand.action = parsedCommand.searchKey;
                parsedCommand.searchKey = "";

                if (actions.has(parsedCommand.action)) {
                    parsedCommand.isValid = true;
                    parsedCommand.actionMetaData = actions.get(parsedCommand.action);
                    return parsedCommand.actionMetaData.flags;
                } else {
                    parsedCommand.isValid = false;
                    parsedCommand.errors += `Action: "${parsedCommand.action}" does not exist;`;
                    return null;
                }

            } else if (char === `"` || char === "-") {
                parsedCommand.isValid = false;
                parsedCommand.errors += `Illegal action syntax error: <${char}> at column ${parsedCommand.searchIndex};`;

                return null;
            } else {
                parsedCommand.searchKey += char;
            }

            parsedCommand.searchIndex++;
        }

        return null;
    }

    //#endregion

    //#region Parse Flags
    private static ParseFlags(parsedCommand: IParsedCommmand, flags: Map<string, IFlag>): void {

        let flagActive = false;
        let parsedFlag: IParsedFlag;

        while (parsedCommand.searchIndex < parsedCommand.command.length) {

            let char = parsedCommand.command[parsedCommand.searchIndex];

            if (char === "-" && !flagActive) {//we meet a flag marker and we are not parseing a flag already

                flagActive = true;
                parsedFlag = {
                    key: "",
                    value: "",
                    keyMode: true,
                    insideQuotes: false
                }

            } else if (!flagActive) {//we are not parsing a flag and it is not a "-"
                parsedCommand.searchIndex++;
                continue;
            }

            if (char === "=" && !parsedFlag.insideQuotes) {

                if (!parsedFlag.keyMode) {

                    parsedCommand.errors += `Syntax error: "=", Flag must be structured as "--<flag>=<value>" or "--<flag>";`
                    return;
                }

                parsedFlag.keyMode = false;

            } else if ((char === " " || char === ";") && !parsedFlag.insideQuotes) {

                if (flags.has(parsedFlag.key)) {
                    parsedCommand.rawValues.set(parsedFlag.key, parsedFlag.value);

                    let flag = flags.get(parsedFlag.key);

                    parsedCommand.actionArguments[flag.parameterIndex] = CommandParser.ParseToType(flag.type, parsedFlag.value);
                }

                parsedFlag = null;
                flagActive = false;

            } else {

                //valid characters but need special actions
                if (char === "\"") {
                    parsedFlag.insideQuotes = !parsedFlag.insideQuotes;
                }

                //record key or value characters
                if (parsedFlag.keyMode)
                    parsedFlag.key += char;
                else
                    parsedFlag.value += char;
            }

            parsedCommand.searchIndex++;
        }
    }

    //#endregion

    //#region ParseToType
    public static ParseToType<T extends Boolean | String | Number | Array<any>>(type: (...args: any[]) => T, value: string): boolean | string | number | Array<any> | undefined {

        switch (type.name.toLowerCase()) {
            case "number":
                let number: number = Number(value);

                if (!isNaN(number))
                    return number;
                break;
            case "string":
                return value;
            case "boolean":
                return Boolean(value);
            case "array":
                try {
                    return JSON.parse(value);
                } catch (err) {
                    return undefined;
                }
        }

        return undefined;
    }

    //#endregion

}

