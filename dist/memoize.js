"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = void 0;
// @ts-nocheck
const memoize = (_target, key, descriptor) => {
    const fType = descriptor.get ? 'get' : 'value';
    const fn = descriptor[fType];
    const char0 = String.fromCharCode(0);
    const memoizedCache = Symbol.for('memoizedCache');
    descriptor[fType] = function () {
        if (!this[memoizedCache]) {
            this[memoizedCache] = Object.create(null);
        }
        let cacheKey = key;
        for (const arg of arguments) {
            const type = typeof arg;
            cacheKey += char0 + ((arg === null) ? 'null' :
                (arg === void 0) ? 'undefined' :
                    (type === 'function') ? arg :
                        (type === 'object' && arg.id) ? arg.id :
                            (type === 'object' && arg.hashCode) ? arg.hashCode() :
                                (type === 'object') ? JSON.stringify(arg) :
                                    arg);
        }
        if (!(cacheKey in this[memoizedCache])) {
            this[memoizedCache][cacheKey] = fn.apply(this, arguments);
        }
        return this[memoizedCache][cacheKey];
    };
    return descriptor;
};
exports.memoize = memoize;
