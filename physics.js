const G = 9.80665;  // Gravity acceleration [m/s2]
const EPS8 = 1e-8;
const EPS16 = 1e-16;
const EPS32 = 1e-32;


import { Vector } from "./vector.js";


export class Stone {
    constructor(id, shot) {
        this.id = id;
        this.color = shot.color;  // stone color
        this.position = shot.position;  // center position [m]
        
        this.velocity = this.convertShotAngleVelocity(shot.angle, shot.velocity);  // [m/s]
        this.omega = shot.omega;   // angular velocity [rad/s]
                                   // +:clockwise, -:counter-clockwise

        this.angle = 0;  // rotation angle [deg]

        this.m = 19.0;      // stone weight [kg]
        this.r = 0.29;       // stone radius [m]
        this.restitution = 1.0;  // coefficient of restitution

        this.accel = new Vector(0, 0);  // [m/s2]
        this.active = true;
        this.state = null;

        this.rank = null;
        this.distansTee = null;  // Distance from tee

        this.posisionHistory = [];
        this.angleHistory = [];
    }
    static get radius() {
        return this.r;
    }
    static get weight() {
        return this.m;
    }
    convertShotAngleVelocity(shotAngle, shotVelocity) {
        let radian = shotAngle * Math.PI / 180.0;
        let vx = shotVelocity * Math.sin(radian);
        let vy = shotVelocity * Math.cos(radian);
        return new Vector(vx, vy);
    }
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    collide(peer) {  //Stone collision
        let d2 = (peer.x - this.x)**2 + (peer.y - this.y)**2;
        if (d2 >= (this.radius*2)**2) {
            return;
        }
        
        let v = new Vector(this.x - peer.x, this.y - peer.y);  // peer -> this
        let aNormUnit = v.normalized();       // normal vector peer -> this
        let bNormUnit = aNormUnit.inverse();  // normal vector this -> peer
        
        // Eliminate overlap
        let distance = Math.sqrt(d2);  // distance between two stones
        let overlap = this.r * 2 - distance;
        let displacement = overlap * 0.5;
        this.move(aNormUnit.x * displacement, aNormUnit.y * displacement);
        peer.move(bNormUnit.x * displacement, bNormUnit.y * displacement);

         // Rightward tangent vector
        let aTangUnit = new Vector(aNormUnit.y * -1, aNormUnit.x);
        let bTangUnit = new Vector(bNormUnit.y * -1, bNormUnit.x);

        // Vector A
        let aNorm = aNormUnit.mul(aNormUnit.dot(this.velocity));  // Normal component
        let aTang = aTangUnit.mul(aTangUnit.dot(this.velocity));  // Tangent component
        
        // Vector B
        let bNorm = bNormUnit.mul(bNormUnit.dot(peer.velocity));  // Normal component
        let bTang = bTangUnit.mul(bTangUnit.dot(peer.velocity));  // Tangent component

        // Uapdate velocity
        this.velocity = new Vector(bNorm.x + aTang.x, bNorm.y + aTang.y);
        peer.velocity = new Vector(aNorm.x + bTang.x, aNorm.y + bTang.y);
    }
    
}


export class Sheet {  // unit: [m]
    static get length() {
        return 45.72;
    }
    static get width() {
        return 4.75;
    }
    static get teeLine2backBoard() {  // Distance from Tee-Line to Back-Board
        return 1.829*3;
    }
    static get teeLine2backLine() {  // Distance from Tee-Line to Back-Line
        return 1.829;
    }
    static get teeCenter() {
        return new Vector(0, 0);  // target tee
    }
    static get houseRadius() {
        return 1.829;
    }
}


export class Engine {
    constructor(dt) {
        this.stones = [];
        this.dt = dt || 1e-3;
        this.friction = 0.8;  // friction coefficient (stone & ice)
        this.nShot = 0;  // number of shots
        this.itr = 0;  // simulation step
    }

    shot(stone) {
        this.itr = 0;
        this.resetHistory();
        this.stones.push(stone);
        this.nShot++;
        this.simulateShot(500);
        this.rank();
        this.countScore();

        return true;
    }
    
    resetHistory() {
        this.stones.forEach(stone => {
            stone.posisionHistory = [];
            stone.angleHistory = [];
        });  
    }

    simulateShot(maxStep) {
        maxStep = maxStep || 100000;
        this.storeHistory();
        let i;
        for (i = 0; i < maxStep; i++) {
            this.step();
            this.touchWall();
            this.crossBackLine();
            this.storeHistory();
            if (this.simEnd()) {
                break;
            }
        }
        this.zeroVelocityAcceleration();
        this.itr = i;
        this.removeStones();
    }


    storeHistory() {
        this.stones.forEach(stone => {
            stone.posisionHistory.push(stone.position);
            stone.angleHistory.push(stone.angle);
        }); 
    }

    step() {
        let dt = this.dt;
        this.stones.forEach(stone => {

            if (stone.velocity.length() < EPS32) {
                return;
            }

            let aUnit = stone.velocity.clone().normalized().inverse();
            let a = aUnit.mul(this.friction*G);

            let v = stone.velocity = stone.velocity.add( a.mul(dt) );

            if (this.sameDirection(v, a)) {
                console.log("stop");
                console.log(v);
                stone.velocity = new Vector(0, 0);
            } else {
                stone.position = stone.position.add( stone.velocity.mul(dt) );
                stone.velocity = v.clone();
            }
            stone.velocity.console();
        });    
    }
    sameDirection(vec1, vec2) {
        let vec1Unit = vec1.normalized();
        let vec2Unit = vec2.normalized();
        let inner = vec1Unit.dot(vec2Unit);

        if (Math.abs(1-inner) < EPS32) {
            return true;            
        } else {
            return false;
        }
    }

    // Stop the stone when it touches the wall. (Set velocity to zero.)
    touchWall() {
        this.stones.forEach(stone => {
            if (stone.position.x > Sheet.width/2 ||  // touches the side line
                stone.position.x < -Sheet.width/2 ||
                stone.position.y > Sheet.length/2 ||  // touches the back boards
                stone.position.y < -Sheet.length/2) {
                    stone.velocity.x = 0.0;
                    stone.velocity.y = 0.0;
                    stone.active = false;
            }
        });
    }


    // Deactivate when stones cross the backline
    crossBackLine() {
        this.stones.forEach(stone => {
            if (-Sheet.teeLine2backLine > stone.position.y ) {
                stone.active = false;
            }
        });
    }


    
    // Simulation ends when all stones have stopped.
    simEnd() {
        let vSum = 0;
        this.stones.forEach(stone => {
            vSum += stone.velocity.length();
        }); 
        if (vSum < EPS32) {
            return true;
        } else {
            return false;
        }
    }
    
    
    zeroVelocityAcceleration() {
        this.stones.forEach(stone => {
            stone.velocity = new Vector(0, 0);
            stone.accel = new Vector(0, 0);

        });
    }



    // Remove stones outside the play area.
    removeStones() {
        this.stones =  this.stones.filter(stone => stone.active === true);
    }


    rank() {
        // console.log("rank");
        this.stones.forEach(stone => {
            stone.distansTee = stone.position.distance( Sheet.teeCenter );
        });

        this.stones = this.stones.sort(function(a, b) {
            return (a.distansTee < b.distansTee) ? -1 : 1; //昇順ソート
        });
        // https://keizokuma.com/js-array-object-sort/
        // console.log(this.stones);
    }


    countScore() {
        
        let score = new Object();
        score.color = "red";
        score.score = 1;


        return 0;
    }

}
