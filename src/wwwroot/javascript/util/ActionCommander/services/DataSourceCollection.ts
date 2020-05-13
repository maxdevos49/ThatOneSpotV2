import { service } from "../../DependencyInjection.js";

export interface IDataSourceCollection {
    setSource(key: string, data: any[]): void;

    getSource(key?: string): [] | null;

    removeSource(key: string): void;

    setDefaultSource(key: string): void;
}

@service()
export class DataSourceCollection {//TODO

    public constructor() {

    }



    public addSource(key: string, data: []) {
        throw new Error("Method is not implemented yet.")
    }

    public getSource(key: string): [] {
        throw new Error("Method is not implemented yet.")
    }

    public removeSource(key: string) {
        throw new Error("Method is not implemented yet.")

    }

}