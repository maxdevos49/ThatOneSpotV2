import { actioncontroller, flag, action } from "../../../util/ActionCommander/ActionDecorators.js";
import { ProtoPaint } from "../protopaint.js";


@actioncontroller("view", "Manage the View")
export class View {

    // private readonly _paint: ProtoPaint;

    public constructor() {
        // this._paint = paint;
    }

    //@actionGroup("viewgroup1") //TODO future
    // @keyBinding("ctrl+t", "Toggles my cool thing for your thingy thing") //TODO Future
    @action("ssssss", "Executes a thing", "Does a thing for your thing so you can do a thing")
    public myThing(@flag(["-f", "--force"]) force: boolean): boolean {

        return false;
    }

    // @debugAction
    @action("myotherthing", "Does a thing for your thing so you can do a thing")
    public myotherThing(): boolean {


        return false;
    }

}
