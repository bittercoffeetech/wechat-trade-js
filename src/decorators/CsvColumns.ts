/**
 * 定义CSV返回结果的列信息
 * 
 * @param columns 列属性id数组
 */
 export function CsvColumns(columns: string[]): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata("columns", 
            columns, 
            target); 
    }
};