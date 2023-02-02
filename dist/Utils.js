class Utils {
    static between(a, b, c) {
        let result = a <= b && b <= c;
        return result;
    }
    static random(low, high) {
        let result = Math.random() * (high - low) + low;
        return result;
    }
}
//# sourceMappingURL=Utils.js.map