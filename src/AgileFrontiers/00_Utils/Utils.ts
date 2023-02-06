class Utils {
    static between(a: any, b: any, c: any): boolean {
        let result = a <= b && b <= c;
        return result;
    }
    static random(low: number, high: number): number {
        let result = Math.random() * (high - low) + low;
        return result;
    }
    static snapTo(n: number, snap: number) {
        let x = n % snap;
        if (x === 0) return n;
        return Math.floor(n / snap) * snap;
    }
}
