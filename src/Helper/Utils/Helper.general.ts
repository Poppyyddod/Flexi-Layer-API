export const isLengthZero = (obj: any) => {
    return (obj && Object.keys(obj).length === 0) || (Array.isArray(obj) && obj.length === 0);
}

export const isArray = (obj: any) => {
    return Array.isArray(obj);
}

export const isString = (obj: any) => {
    return typeof obj === 'string';
}

export const isObject = (obj: any) => {
    return obj && typeof obj === 'object' && !Array.isArray(obj);
}

export const isNumber = (obj: any) => {
    return typeof obj === 'number';
}

export const isBoolean = (obj: any) => {
    return typeof obj === 'boolean';
}

export const isNull = (obj: any) => {
    return obj === null;
}

export const isUndefined = (obj: any) => {
    return typeof obj === 'undefined';
}

export const isFunction = (obj: any) => {
    return typeof obj === 'function';
}

export const isDate = (obj: any) => {
    return obj instanceof Date;
}

export const isRegExp = (obj: any) => {
    return obj instanceof RegExp;
}

export const isSymbol = (obj: any) => {
    return typeof obj === 'symbol';
}

export const isPromise = (obj: any) => {
    return obj instanceof Promise;
}

export const isBuffer = (obj: any) => {
    return Buffer.isBuffer(obj);
}