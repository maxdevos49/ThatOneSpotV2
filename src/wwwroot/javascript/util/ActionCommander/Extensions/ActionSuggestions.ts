import { IActionExtension } from "../interfaces/IActionExtension.js";
import { IActionCommander } from "../ActionCommander.js";
import { DataSourceCollection, IDataPart, SelectMode, IDataSource, SourceMode } from "../services/DataSourceCollection.js";
import { extension } from "../../DependencyInjection.js";
import { Observable, fromProperty } from "../../Observable/observable.js";
import { flag } from "../helpers/ActionDecorators.js";

@extension()
export class ActionSuggestions implements IActionExtension {

    public onFocusDataSourceKey: string;
    public defaultDataSourceKey: string;
    private readonly _actionCommander: IActionCommander;
    private readonly _dsc: DataSourceCollection;

    public _suggestionDataSource: IDataSource;
    private readonly _$suggestionDataSource: Observable<IDataSource>;



    constructor(actionCommander: IActionCommander, dsc: DataSourceCollection) {
        this._actionCommander = actionCommander;
        this._dsc = dsc;

        this.onFocusDataSourceKey = "controllers"
        this.defaultDataSourceKey = "suggestions"

        this._suggestionDataSource = null;
        this._$suggestionDataSource = fromProperty(this, "_suggestionDataSource");
    }

    public init(): void {

        //Define controller datasource
        let data = [...this._actionCommander.controllers ?? []].map((item) => {
            return {
                value: item[1].name,
                description: item[1].description
            }
        });


        this._suggestionDataSource = {
            title: "Suggestions",
            sourceMode: SourceMode.Action,
            allowFiltering: false,
            resetOnSelect: false,
            tabCharacter: " ",
            selectMode: SelectMode.Append,
            data: data
        }

        this._dsc.addSource(this.defaultDataSourceKey, this._$suggestionDataSource);
    }

    public onChange(): void {

        let command = this._actionCommander.getText();
        let parsedCommand = this._actionCommander.parseCommand(command);
        let datasource = this._suggestionDataSource;

        let filteredResult: any[] = [];
        if (!parsedCommand.controllerMetaData) {
            filteredResult = [...this._actionCommander.controllers ?? []].filter((item) => item[0].startsWith(parsedCommand.controller));
            datasource.onSelect = null;
            datasource.tabCharacter = " ";
            datasource.title = "Controller Suggestions";

            datasource.data = filteredResult.map((item) => {
                return {
                    displayValue: item[1].name,
                    value: item[1].name,
                    description: item[1].description
                }
            });

        } else if (!parsedCommand.actionMetaData) {

            filteredResult = [...(parsedCommand?.controllerMetaData?.actions ?? [])].filter((item) => item[0].startsWith(parsedCommand.action));
            datasource.onSelect = null;
            datasource.tabCharacter = " ";
            datasource.title = "Action Suggestions";

            datasource.data = filteredResult.map((item) => {
                return {
                    displayValue: item[1].name,
                    value: item[1].name,
                    description: item[1].description
                }
            });

        } else {

            let data = new Map<string, IDataPart>();

            [...(parsedCommand?.actionMetaData?.flags ?? [])].forEach((item, _, array) => {

                let index = item[1].parameterIndex;
                let match = array.filter((v) => v[1].parameterIndex === index && v[0] !== item[0]).shift();
                let display = "";

                if (match) {
                    let flags = [item[0], match[0]].sort((a, b) => a.length - b.length);

                    display = `[ ${flags[0]} | ${flags[1]} ]`;
                } else {
                    display = `[ ${item[0]} ]`;
                }
                data.set(display, {
                    displayValue: display,
                    value: item[1].name,
                    description: item[1].description
                });
            });

            filteredResult = [...data.values()]
                .filter((item: IDataPart) => {
                    return item.value.startsWith(parsedCommand.searchKey) && !parsedCommand.rawValues.has(item.value);
                });
            datasource.data = filteredResult;

            datasource.onSelect = null;
            datasource.tabCharacter = "=";
            datasource.title = "Flag Suggestions";

        }

        //Assign results
        this._suggestionDataSource = datasource;
    }

}