import { actioncontroller, action, flag } from "../util/ActionCommander/ActionDecorators.js";
import { service, Injector } from "../util/DependencyInjection.js";

@service()
class OtherOtherTest {
    public yeet: boolean = false;
}


@service()
class Test {


    public test: number = 10;
    public reckt: string = "yeet";

    public otherThingy: OtherOtherTest;


    constructor(otherThingy: OtherOtherTest) {
        this.otherThingy = otherThingy;
    }

    public otherThing(): number {

        // let info = Reflect.getOwnMetadata("design:type", this, "test");
        // console.log(info);

        return 10;
    }

}


@actioncontroller("test", "", "")
class OtherTest {

    private readonly _t: Test;

    public yee: number = 56;



    constructor(dependency: Test) {
        this._t = dependency;
    }

    /**
     * testAction
     */
    @action("test", "Do a test")
    public testAction(
        @flag(["-t", "--test"]) test: boolean,
        @flag(["-x"]) x: number,
        @flag(["-y"]) y: number
    ): IActionResult {
        this._t.otherThing();

        return null;
    }

}

let ot = Injector.resolve(OtherTest);

console.log(ot);



interface IActionResult {

}