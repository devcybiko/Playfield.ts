export interface Logger { }
export class Logger {
    private _isLoggable: boolean;
    private _level: string;
    private _link: string;
    private _uselink: boolean;
    public _asLogger: Logger;

    constructor(...args: any[]) {
        if (args.length === 0) return;
        this.Logger(args[0], args[1]);
    }

    // INFO ==> INFO, LOG, WARN, ERROR
    // LOG  ==> LOG, WARN, ERROR
    // WARN ==> WARN, ERROR
    // ERROR==> ERROR
    Logger(logLevel = "error", uselink = true) {
        this._isLoggable = true;
        this._level = logLevel;
        this._uselink = uselink;
        this._asLogger = this;
        return this;
    }

    // --- Public Methods --- //

    info(...args: any[]) {
        // most verbose
        if (["info"].includes(this._level)) console.log(this._format("INFO", this._module()), ...args);
    }
    log(...args: any[]) {
        // less verbose
        if (["info", "log"].includes(this._level)) console.log(this._format("LOG", this._module()), ...args);
    }
    warn(...args: any[]) {
        // less verbose
        if (["info", "log", "warn"].includes(this._level)) console.log(this._format("WARN", this._module()), ...args);
    }
    error(...args: any[]) {
        // always show errors
        console.error(this._format("ERROR", this._module(), ...args));
    }

    // --- Private Methods --- //

    _format(level: string, module: string, ...args: any[]) {
        let format = `${level}: ${module}: ${args.join(", ")}`;
        if (this._uselink) format += "\n" + " ".repeat(level.length + 2) + this._link;
        return format;
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


    // --- Accessors --- //

    get logLevel() {
        return this._level;
    }
    set logLevel(level: string) {
        this._level = level;
    }
    public get isLoggable(): boolean {
        return this._isLoggable;
    }
    public set isLoggable(value: boolean) {
        this._isLoggable = value;
    }


}