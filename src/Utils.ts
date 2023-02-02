class Utils {
  static between(a: number, b: number, c: number): boolean {
    let result = a <= b && b <= c;
    return result;
  }
  static random(low: number, high: number) : number {
    let result = Math.random() * (high - low) + low;
    return result;
  }
}
