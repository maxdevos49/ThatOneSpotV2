
export class CommandParser {

    private static valueParseMap: Map<Function, (rawValue: string) => Number | String | Boolean | Array<any> | null> = new Map<Function, (rawValue: string) => Number | String | Boolean | Array<any> | null>([
        [Number, (value: string) => { return Number(value); }],
        [String, (value: string) => { return value; }],
        [Boolean, (value: string) => { return (value === "true" || value === "True" || value === "TRUE"); }],
        [Array, (value: string) => { try { return JSON.parse(value); } catch (err) { return null; } }]
    ]);


    


}

export interface IParsedCommmad {
    //TODO
}