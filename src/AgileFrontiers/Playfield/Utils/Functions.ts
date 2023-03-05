export function between(a: any, b: any, c: any): boolean {
    let result = a < b && b < c;
    return result;
}
export function inclusive(a: any, b: any, c: any): boolean {
    let result = a <= b && b <= c;
    return result;
}
export function random(low: number, high: number): number {
    let result = Math.random() * (high - low) + low;
    return result;
}
export function snapTo(n: number, snap: number) {
    let x = n % snap;
    if (x === 0) return n;
    return Math.floor(n / snap) * snap;
}