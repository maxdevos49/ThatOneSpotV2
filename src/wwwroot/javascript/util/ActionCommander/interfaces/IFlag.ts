export interface IFlag {
    flag: string;
    type: (...args: any[]) => String | Number | Boolean | Array<string>;
    parameterIndex: number;
}