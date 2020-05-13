import { actioncontroller, flag, bindVariation, action } from "../../../util/ActionCommander/helpers/ActionDecorators.js";

@actioncontroller("view", "Manage the View")
export class View {

    @bindVariation("Runs a test in the way of t", "-b=false", "Control+t")
    @bindVariation("Runs a test in the way of u", "-a=[10,10,34,56]", "Control+u")
    @bindVariation("Runs a test in the way of j", "-b=false")//No key combo. Only accessible if used with a ui extension or a autocomplete queries it
    @action("test", "Executes a test", "Does a test for your testing purposes")
    public testCommand1(
        @flag(["-b", "--boolean"]) b: boolean = false,
        @flag(["-n", "--number"]) n: number = 0,
        @flag(["-a", "--array"]) a: Array<any> = [],
        @flag(["-s", "--string"]) s: string = ""
    ): boolean {

        console.log("--boolean: ", b);
        console.log("--number: ", n);
        console.log("--array: ", a);
        console.log("--string: ", s);

        //Do actions here...

        return false;
    }

    @action("test2", "Does a different test command", "Long description for command...")
    public testCommand2(): boolean {

        //Do actions here

        return false;
    }

}
