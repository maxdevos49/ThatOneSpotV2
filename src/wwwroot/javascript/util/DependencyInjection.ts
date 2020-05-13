import "../util/reflect-metadata-browser.js";

export type GenericClassDecorator<T> = (target: T) => void;

export interface Type<T> {
    new(...args: any[]): T;
}

export function service(): GenericClassDecorator<Type<object>> {
    //By decorating the class the constuctor will have its parameters decorated with type metadata
    return function (target: Type<object>) {
        //Maybe in the future itll be necessary to do something here 
    };
};

export class Injector {

    /**
     * Recursivley resolves the dependencies of a given service
     * @param target The service to resolve
     */
    public static resolve<T>(target: Type<any>): T {

        //What the required dependencies are
        let tokens = Reflect.getMetadata("design:paramtypes", target) ?? []

        //inject the dependencies while recursivly resolving those dependencies dependencies
        let injections = tokens.map((token: any) => {

            try {
                //return a registered service if exist
                return ServiceCollection.getService(token);
            }
            catch (err) {
                //resolve unregistered service if possible
                return Injector.resolve<any>(token);
            }

        });

        return new target(...injections);
    }

    public static resolveGroup(tokens: any[]): any[] {
        return tokens.map((token) => Injector.resolve(token));
    }

}

export interface IServiceCollection {

    /**
     * Adds a service that will only be instantiated once even if requested multiple times
     * @param service The service to make
     */
    addSingleton<T>(service: new (...args: any) => T): void;

    /**
     * Adds a service that will be remade every time it is requested
     * @param service The service to make
     */
    addTransient<T>(service: new (...args: any) => T): void;

    /**
     * Allows the option to configure a service after being created
     * @param service The service you want to configure
     * @param configureCallback callback to perform the configuration
     */
    configure<T>(service: new (...args: any) => T, configureCallback: (service: T) => void): void;

    /**
     * Retrieves the service of the given type
     * @param service The service to retrieve
     */
    getService<T>(service: new (...args: any) => T): T | null;
}

enum ServiceType {
    Transient,
    Singleton,
    Scoped
}

interface IServiceDefinition {

    serviceType: ServiceType;

    serviceConfiguration?: (service: any) => void
}

export const ServiceCollection = new class ServiceCollection implements IServiceCollection {

    private _singletonInstances: Map<new (...args: any) => any, any> = new Map();
    private _services: Map<new (...args: any) => any, IServiceDefinition> = new Map();


    public addSingleton<T>(service: new (...args: any) => T): void {

        if (this._services.has(service))
            throw `Service: ${service.name} is already registered.`;

        this._services.set(service, {
            serviceType: ServiceType.Singleton
        });
    }

    public addTransient<T>(service: new (...args: any) => T): void {

        if (this._services.has(service))
            throw `Service: ${service.name} is already registered.`;

        this._services.set(service, {
            serviceType: ServiceType.Transient
        });
    }

    public configure<T>(service: new (...args: any) => T, configureCallback: (service: T) => void): void {

        if (!this._services.has(service))
            throw `The service: ${service.name} is not registered. Register the service before attempting to configure it.`;

        //retrieve definition
        let serviceDef = this._services.get(service);

        //update definition
        serviceDef.serviceConfiguration = configureCallback;

        //save definition
        this._services.set(service, serviceDef);

    }

    public getService<T>(service: new (...args: any) => T): T {

        if (!this._services.has(service))
            throw `The service: ${service.name} is not registered`;

        let sdef = this._services.get(service);

        if (this._singletonInstances.has(service))
            return this._singletonInstances.get(service);

        let newService: T = Injector.resolve(service);
        sdef.serviceConfiguration?.(newService);

        if (sdef.serviceType === ServiceType.Singleton)
            this._singletonInstances.set(service, newService);

        return newService;
    }
}