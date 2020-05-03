
export interface IFlag{
    shortFlag: string;
    longFlag: string;
    summary: string;
    type: new () => Boolean | String | Number | Array<any>;
}