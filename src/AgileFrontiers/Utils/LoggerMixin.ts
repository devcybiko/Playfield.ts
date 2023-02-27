export interface Logger {}
export class Logger {
    _level: string;
    _link: string;
    _uselink: boolean;

    // INFO ==> INFO, LOG, WARN, ERROR
    // LOG  ==> LOG, WARN, ERROR
    // WARN ==> WARN, ERROR
    // ERROR==> ERROR
    Logger(logLevel = "error", uselink = true) {
        this._level = logLevel;
        this._uselink = uselink;
        return this;
    }

    _source(depth = 0): string {
        let err = new Error("error");
        let stack = err.stack.split("\n");
        let source = stack[depth];
        return source;
    }
    _module(): string {
        let source = this._source(4).trim();
        let words = source.split(" ");
        let module = words[1];
        this._link = words[2];
        if (module === "new") {
            module = words[2] + ".new";
            this._link = words[3];
        }
        return module;
    }
    get logLevel() {
        return this._level;
    }
    set logLevel(level: string) {
        this._level = level;
    }
    format(level: string, module: string, ...args: any[]) {
        let format = `${level}: ${module}: ${args.join(", ")}`;
        if (this._uselink) format += "\n" + " ".repeat(level.length + 2) + this._link;
        return format;
    }
    info(...args: any[]) {
        // most verbose
        if (["info"].includes(this._level)) console.log(this.format("INFO", this._module()), ...args);
    }
    log(...args: any[]) {
        // less verbose
        if (["info", "log"].includes(this._level)) console.log(this.format("LOG", this._module()), ...args);
    }
    warn(...args: any[]) {
        // less verbose
        if (["info", "log", "warn"].includes(this._level)) console.log(this.format("WARN", this._module()), ...args);
    }
    error(...args: any[]) {
        // always show errors
        console.error(this.format("ERROR", this._module(), ...args));
    }
}