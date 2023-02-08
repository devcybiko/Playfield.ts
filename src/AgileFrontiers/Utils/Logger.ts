import { LoggableClass } from "./Loggable";

export class Logger extends LoggableClass {
    constructor(logLevel = "warn", uselink = true) {
        super();
        this.Loggable(logLevel, uselink);
    }
}