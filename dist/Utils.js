class Utils {
    static between(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    static random(low, high) {
        let result = Math.random() * (high - low) + low;
        return result;
    }
    static snapTo(n, snap) {
        let x = n % snap;
        if (x === 0)
            return n;
        return Math.floor(n / snap) * snap;
    }
}
//# sourceMappingURL=Utils.js.map