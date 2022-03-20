// Curling AI

import { Vector } from "./vector.js";

export class Skipper {
    constructor(strategy) {
        this.strategy = strategy || "straight";  // AI personality
    }

    shot(stones, stoneColor) { // stones: Stones on the sheet
        let shot = new Object();
        if ("straight" == this.strategy) {
            shot.color = stoneColor;
            shot.position = new Vector(0, 0);  //shot coordinate
            shot.angle = 0;
            shot.velocity = 2.38;
            shot.omega = 0;  // Rotation direction
                             // +:clockwise, -:counter-clockwise
        }
        return shot;
    }
}
