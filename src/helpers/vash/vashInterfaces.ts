/**
 * Input Types for view model properties
 */
export enum InputType {
    String = "String",
    Number = "Number",
    Date = "Date",
    Boolean = "Boolean",
    File = "File",
    Other = ""
}


export interface IAuthentication {
    /**
     * The session token of the logged in user.
     */
    id?: string;

    /**
     * The nickname of the currently logged in user
     */
    nickname?: string;

    /**
     * The role of the currently logged in user
     */
    role: string;
}

export interface IModelResult {
    /**
     * The authentication object
     */
    authentication: IAuthentication;

    /**
     * The view model for the view
     */
    viewModel?: IViewModel;

    /**
     * The data refrenced from the view model
     */
    data?: any[] | any;

    /**
     * Validatoin errors object
     */
    validation?: IValidation[];

    configuration: IConfig;
}


/**
 *Interface for all config properties that must be present or optional ones
 */
export interface IConfig {
    /**
     * Project Title
     */
    title: string;

    /**
     * Version release date
     */
    versionRelease: string;

    /**
     * Version Title(Alpha, Beta,...)
     */
    versionTitle: string;

    /**
     * Version number
     */
    version: string;

    /**
     *Properties relevant to the server
     */
    server: {

        environment: string;

        port: string;

        domain: string;

        transport: string;
    };

    email: {
        username: string;
        password: string;
    }

    /**
     * Configuration for the database
     */
    database: {
        dbUrl: string;
    };

    /**
     * Configuration for the session
     */
    session: {
        secret: string;
    };

}

export interface IValidation {
    
}

export interface IViewModel {
    /**
     * Outputs the class as json
     */
}

export interface IViewProperty {
    /**
     * The type constructor function
     */
    type: Function;

    /**
     * The database property name
     */
    path: string;

    /**
     * The display name of the property
     */
    name?: string;

    /**
     * The minimum length of the property
     */
    minlength?: number;

    /**
     * The maximum length of the property
     */
    maxlength?: number;

    /**
     * Indicates whether the property is optional
     */
    required?: boolean;

    /**
     * Indicates if the value of the current property
     * should match another property. Give the other
     * property name to compare with.
     */
    matches?: string;
}