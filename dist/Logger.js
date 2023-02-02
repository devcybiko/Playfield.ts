class Logger {
    constructor(module) {
        this.level = "log";
        this.module = module;
        this.level = "log";
    }
    setLogLevel(level) {
        this.level = level;
    }
    log(msg) {
        if (this.level === "log")
            console.log(this.module + ": ", msg);
    }
    error(msg) {
        console.log(this.module + ": ", msg);
    }
}
//# sourceMappingURL=Logger.js.map