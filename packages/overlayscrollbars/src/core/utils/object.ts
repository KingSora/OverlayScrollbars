/**
 * Determines whether the passed object has a property with the passed name.
 * @param obj The object.
 * @param prop The name of the property.
 */
export const hasOwnProperty: (obj: any, prop: string | number | symbol) => boolean = (obj: any, prop: string | number | symbol) =>
  Object.prototype.hasOwnProperty.call(obj, prop);

/**
 * Returns the names of the enumerable string properties and methods of an object.
 * @param obj The object of which the properties shall be returned.
 */
export const keys: (obj: any) => Array<string> = (obj: any) => Object.keys(obj);
