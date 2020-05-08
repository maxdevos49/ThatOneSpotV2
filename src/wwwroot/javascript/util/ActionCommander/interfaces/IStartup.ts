import { ActionCommander } from "../ActionCommander.js";
import { IServiceCollection } from "../../DependencyInjection.js";

export interface IStartup {


    /**
     * Configure any services or register non decorated ones
     */
    configureServices(services: IServiceCollection): void;//TODO


    /**
     * configure any command middleware and other startup features
     */
    configure(app: ActionCommander): void;

}