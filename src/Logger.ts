class Logger {
  private module: string;
  private level = "log";
  constructor(module: string) {
    this.module = module;
    this.level = "log";
  }
  setLogLevel(level: string) {
    this.level = level;
  }
  log(...args: string[]) {
    if (this.level === "log") console.log(this.module + ": ", ...args);
  }
  error(...args: string[]) {
    console.log(this.module +": ", ...args);
  }
}
