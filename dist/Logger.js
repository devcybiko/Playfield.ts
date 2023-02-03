class Logger {
    constructor(module) {
        this.level = "log";
        this.module = module;
        this.level = "log";
    }
    setLogLevel(level) {
        this.level = level;
    }
    log(...args) {
        if (this.level === "log")
            console.log(this.module + ": ", ...args);
    }
    error(...args) {
        console.log(this.module + ": ", ...args);
    }
}
//# sourceMappingURL=Logger.js.map