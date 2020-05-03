

export type GenericClassDecorator<T> = (target: T) => void;

export interface Type<T> {
    new(...args: any[]): T;
}

export const ActionService = (): GenericClassDecorator<Type<object>> => {
    return (target: Type<object>) => {
        //By decorating the class the constuctor will have its parameters decorated with type metadata
        //console.log(Reflect.getMetadata('design:paramtypes', target));
    };
};

export const ActionInjector = new class {

    /**
     * Recursivley resolves the dependencies of a given service
     * @param target The service to resolve
     */
    public resolve<T>(target: Type<any>): T {

        // tokens are required dependencies, while injections are resolved tokens from the Injector
        let tokens = Reflect.getMetadata('design:paramtypes', target) ?? []

        let injections = tokens.map((token: any) => ActionInjector.resolve<any>(token));

        return new target(...injections);
    }

}