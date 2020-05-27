import { service } from "../../DependencyInjection.js";
import { Observable, Subject, Subscription } from "../../Observable/observable.js";

//#region Interfaces

export interface IDataSourceCollection {
    addSource(key: string, data: Observable<IDataSource>): void;

    removeSource(key: string): void;
}

export enum SelectMode {
    Replace,
    Append
}

export enum SourceMode {
    Search,
    Action,
    Menu
}

export interface IDataSource {
    title: string;
    sourceMode: SourceMode
    allowFiltering: boolean;
    resetOnSelect: boolean;
    selectMode: SelectMode;
    tabCharacter: string;
    onSelect?: (value: string, index: number, datasource: IDataSource) => void;
    data: IDataPart[];
}

export interface IDataPart {
    value: string;
    displayValue?: string;
    description?: string;
}

//#endregion

@service()
export class DataSourceCollection implements IDataSourceCollection {

    private _dataSources: Map<string, Observable<IDataSource>>;
    private _$$activeDataSource: Subject<IDataSource>;
    private _activeDataSubscription: Subscription;
    private _activeDataSource: IDataSource;
    private _activeDataSourceKey: string;

    public get activeDataSourceKey(): string { return this._activeDataSourceKey }

    public get activeDataSource(): IDataSource { return this._activeDataSource; }
    public readonly $activeDataSource: Observable<IDataSource>;


    public constructor() {
        this._dataSources = new Map();

        this._$$activeDataSource = new Subject();
        this.$activeDataSource = this._$$activeDataSource.toObservable();
    }

    public setActiveSource(key: string): void {


        if (!this._dataSources.has(key))
            return

        this._activeDataSourceKey = key;

        if (this._activeDataSubscription)
            this._activeDataSubscription.unsubscribe();

        //forward the values to the active source
        this._activeDataSubscription = this._dataSources
            .get(key)
            .subscribe((v) => {
                this._activeDataSource = v;
                this._$$activeDataSource.next(v)
            });
    }

    public addSource(key: string, data: Observable<IDataSource>): void {
        this._dataSources.set(key, data);
    }

    public removeSource(key: string): void {
        if (this._dataSources.has(key))
            this._dataSources.delete(key);
    }

}