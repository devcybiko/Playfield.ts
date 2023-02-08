import { iBase, Base, Mixin } from "../../../Mixins";

export interface iMouseEnabled extends iBase {
    MouseEnabled(): void;
}


export const MouseEnabledBase = MouseEnabled(Base);
export abstract class MouseEnabledClass extends MouseEnabledBase { };
export function MouseEnabled<TBase extends Mixin>(_base: TBase) {
    return class extends _base {
        any: any;

        MouseEnabled() {
        }
        MouseUp(event: any) {
            this.any.log("MouseUp:", event);
        }
        MouseDown(event: any) {
            this.any.log("MouseDown:", event);
        }
        MenuUp(event: any) {
            this.any.log("MenuUp:", event);
        }
        MenuDown(event: any) {
            this.any.log("MenuDown:", event);
        }
        MiddleUp(event: any) {
            this.any.log("MiddleUp:", event);
        }
        MiddleDown(event: any) {
            this.any.log("MiddleDown:", event);
        }
        WheelUp(event: any, delta: number) {
            this.any.log("WheelUp:", delta, event);
        }
        WheelDown(event: any, delta: number) {
            this.any.log("WheelDown:", delta, event);
        }
        MouseMove(event: any) {
            this.any.log("MouseMove:", event);
        }    
    };
}
