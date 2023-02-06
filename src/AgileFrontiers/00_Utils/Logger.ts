class Logger {
    private module: string;
    private level = "log";
    constructor(module: string, logLevel = "error") {
      this.module = module;
      this.level = logLevel;
    }
    setLogLevel(level: string) {
      this.level = level;
    }
    info(...args: any[]) {
      // most verbose
      if (["warn", "log", "info"].includes(this.level)) console.log("INFO:", this.module + ": ", ...args);
    }
    log(...args: any[]) {
      // less verbose
      if (["warn", "log"].includes(this.level)) console.log("LOG:", this.module + ": ", ...args);
    }
    warn(...args: any[]) {
      // less verbose
      if (["warn"].includes(this.level)) console.log("WARN:", this.module + ": ", ...args);
    }
    error(...args: any[]) {
      // always show errors
      console.error("ERROR:", this.module +": ", ...args);
    }
  }