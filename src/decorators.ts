import "reflect-metadata";

export interface ApiField {
    name: string;
    subType: new(...args: any[]) => any;
    subName: string;
    countName: string
}

export function ApiField(name: string, subType?: new(...args: any[]) => any, countName?: string): PropertyDecorator {
    return (target, _propertyName) => {
        Reflect.defineMetadata(_propertyName.toString(), 
            {name: name, subType: subType, countName: countName}, 
            target.constructor); 
    }
};