export function isArray(obj) {
    return Object.prototype.toString.apply(obj) === '[object Array]'
}
