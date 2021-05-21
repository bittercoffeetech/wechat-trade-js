/**
 * Xml级联标签数据定义，用于将返回的单层XML转换为嵌套结构的对象
 */
 export interface XmlModel {
    name: string;
    subType: new(...args: any[]) => any;
    countName: string
}

/**
 * Xml级联标签注解
 * 
 * @param name 当前属性名
 * @param subType 对应集合中的子类型
 * @param countName 表示数量的字段名
 */
 export function XmlModel(name: string, subType?: new(...args: any[]) => any, countName?: string): PropertyDecorator {
    return (target, propertyName) => {
        Reflect.defineMetadata(propertyName.toString(), 
            {name: name, subType: subType, countName: countName}, 
            target.constructor); 
    }
};