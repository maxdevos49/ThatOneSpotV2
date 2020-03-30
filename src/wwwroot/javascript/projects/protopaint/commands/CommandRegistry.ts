import { View } from "./View.js";
import { ProtoPaint } from "../protopaint.js";
import { ActionCommand } from "../../../util/ActionCommander.js";

export function CommandRegistry(): Map<string, ActionCommand<ProtoPaint>> {

    return new Map<string, ActionCommand<ProtoPaint>>(
        Object.entries({
            "view": new View(),
        })
    );
}