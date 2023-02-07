import * as Jed from "../Jed";
import {Playfield} from "../Playfield";

 export class JedTest {
    constructor() {
        let playfield = new Playfield("#my_canvas");
        let TextItem1 = new Jed.TextItem(playfield, "first_name", "First Name:", "Gregory L. Smith", 10, 10, 75, 24);
        let labelBB = TextItem1.labelBB();
        new Jed.TextItem(playfield, "mi", "M.I.:", "Smith", 10, 40, 150, 24, labelBB.w, labelBB.h);
        new Jed.TextItem(playfield, "last_name", "Last Name:", "Smith", 10, 70, 8, 24, labelBB.w, labelBB.h);
        new Jed.CheckBoxItem(playfield, "email_signup", "Email Signup: ", ["yes", "no"], 10, 100, 30, 30, 0, 0, "black", "white", "red");
        playfield.start();
    }
}
