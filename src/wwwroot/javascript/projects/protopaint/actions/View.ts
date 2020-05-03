import { ActionOptions } from "../../../util/ActionCommander/Action.js";
import { ActionController } from "../../../util/ActionCommander/ActionController.js";
import { action, flag } from "../../../util/ActionCommander/ActionDecorators.js";
import { ProtoPaint } from "../protopaint.js";


export class View extends ActionController<ProtoPaint>{

    public constructor() {
        super("view", "Manage View", "Manage aspects of the view. Toggle panels and change layout defaults");
    }

    //@actionGroup("viewgroup1") //TODO future
    @flag("f", "force", "Forces the thing to run", Boolean)
    @flag("v", "value", "Supplies a value for the thing to use", Number)
    // @keyBinding("ctrl+t", "Toggles my cool thing for your thingy thing") //TODO Future
    @action("Executes a thing", "Does a thing for your thing so you can do a thing")
    public myThing(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {


        console.log(options.getValue("f", "force") as boolean);

        if (options.getValue("f", "force") === 10)
            return options.setError("There is a problem");

        options.getValue("g", "goodgame");

        return false;
    }

    // @debugAction
    @action("Executes a thing", "Does a thing for your thing so you can do a thing")
    public myotherThing(dependency: ProtoPaint, options: ActionOptions<ProtoPaint>): boolean {
        return false;
    }

}
