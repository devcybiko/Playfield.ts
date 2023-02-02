function _log(msg) {
    // console.log(msg);
}
function _error(msg) {
    console.error(msg);
}
function _between(a, b, c) {
    let result = a <= b && b <= c;
    return result;
}
function random(min, max) {
    let range = Math.abs(max - min);
    let result = Math.floor(Math.random() * range + min);
    return result;
}
function mixin(clazz, mixer) {
    Object.assign(clazz.prototype, mixer);
}
