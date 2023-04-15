export function between(a: any, b: any, c: any): boolean {
    let result = a < b && b < c;
    return result;
}
export function inclusive(a: any, b: any, c: any): boolean {
    let result = a <= b && b <= c;
    return result;
}
export function random(low: number, high: number): number {
    let result = int(Math.random() * (high - low)) + low;
    return result;
}
export function snapTo(n: number, snap: number) {
    let x = n % snap;
    if (x === 0) return n;
    return Math.floor(n / snap) * snap;
}
export function int(n: number) {
    return Math.floor(n);
}
export function round(n: number) {
    return Math.floor(n + 0.5);
}
export function ceil(n: number) {
    return Math.ceil(n);
}
export function limit(min: number, value: number, max: number) {
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
}
