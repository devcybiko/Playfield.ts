// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

export interface File {
    get status(): string;
    set status(s: string);
    get isError(): boolean;
    get isDone(): boolean;
    get isInProgress(): boolean;
    get data(): any;
    set data(s: any);
    get string(): string;
    set string(s: string);
    get json(): any;
    set json(j: any);
    wait(timeout?: number): Promise<File>;

}

export interface Files {
    load(key: string, path: string): File;
    save(filename: string, text: string): void;
    get(key: string): File;
}
