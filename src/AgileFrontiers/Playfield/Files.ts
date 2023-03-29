// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

export interface File {
    get status(): string;
    set status(s: string);
    get isError(): boolean;
    get isDone(): boolean;
    get isInProgress(): boolean;
    wait(timeout?: number): Promise<File>;

}

export interface Files {
    load(key: string, path: string): File;
    get(key: string): File;
}
