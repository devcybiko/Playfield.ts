export interface Clickable { }
export class Clickable {
    Clickable() {
        return this;
    }

    onClick(event?: any): boolean {
        let that = this as any;
        if (that.log) that.log("onClicked", that.name);
        return true;
    }
}
