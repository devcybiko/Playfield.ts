type primative = number | string | boolean;

export class Logger {
    private level: string;
    private link: string;
    private uselink: boolean;
    private vscodeProject = "/Volumes/GregsGit/git/Playfield.ts/src/AgileFrontiers/Playfield";

    constructor(logLevel = "error", uselink = true) {
        this.level = logLevel;
        this.uselink = uselink;
    }
    source(depth = 0): string {
        let err = new Error("error");
        let stack = err.stack.split("\n");
        let source = stack[depth];
        return source;
    }
    vscodeLink(lineno: string) {
        let words = lineno.trim().split("/")
        let link = words[words.length - 1];
        words = link.split(":");
        link = "vscode://file" + this.vscodeProject + "/" + words[0].replace(".js", ".ts") + ":" + words[1];
        return link;
    }
    module(): string {
        let source = this.source(4).trim();
        let words = source.split(" ");
        let module = words[1];
        this.link = words[2];
        if (module === "new") {
            module = words[2] + ".new";
            this.link = words[3];
        }
        else return module;
    }
    setLogLevel(level: string) {
        this.level = level;
    }
    format(level: string, module: string, ...args: any[]) {
        let format = `${level}: ${module}: ${args.join(", ")}`;
        if (this.uselink) format += "\n" + " ".repeat(level.length + 2) + this.link;
        return format;
    }
    info(...args: any[]) {
        // most verbose
        if (["info"].includes(this.level)) console.log(this.format("INFO", this.module()), ...args);
    }
    log(...args: any[]) {
        // less verbose
        if (["info", "log"].includes(this.level)) console.log(this.format("LOG", this.module()), ...args);
    }
    warn(...args: any[]) {
        // less verbose
        if (["info", "log", "warn"].includes(this.level)) console.log(this.format("WARN", this.module()), ...args);
    }
    error(...args: primative[]) {
        // always show errors
        console.error(this.format("ERROR", this.module(), ...args));
    }
}