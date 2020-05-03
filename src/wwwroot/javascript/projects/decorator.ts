import "../util/reflect-metadata-browser.js";
import { ActionService, ActionInjector } from "../util/ActionCommander/ActionDependency.js";


const controller = function (constructor: Function) {

}

@ActionService()
class OtherOtherTest{
    public yeet: boolean = false;
}


@ActionService()
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


@controller
class OtherTest {

    public test: Test;

    public yee: number = 56;



    constructor(dependency: Test) {
        this.test = dependency;
    }
}

let ot = ActionInjector.resolve(OtherTest);

console.log(ot);

