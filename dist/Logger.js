class Logger {
    constructor(module, logLevel = "error") {
        this.level = "log";
        this.module = module;
        this.level = logLevel;
    }
    setLogLevel(level) {
        this.level = level;
    }
    info(...args) {
        // most verbose
        if (["warn", "log", "info"].includes(this.level))
            console.log("INFO:", this.module + ": ", ...args);
    }
    log(...args) {
        // less verbose
        if (["warn", "log"].includes(this.level))
            console.log("LOG:", this.module + ": ", ...args);
    }
    warn(...args) {
        // less verbose
        if (["warn"].includes(this.level))
            console.log("WARN:", this.module + ": ", ...args);
    }
    error(...args) {
        // always show errors
        console.error("ERROR:", this.module + ": ", ...args);
    }
}
//# sourceMappingURL=Logger.js.map