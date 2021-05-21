/**
 * 定义CSV返回结果的列信息
 * 
 * @param columns 列属性id数组
 */
 export function CsvModel(columns: string[]): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata("columns", 
            columns, 
            target); 
    }
};