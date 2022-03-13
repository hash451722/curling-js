export class Vector {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    normalized() {
        let l = this.length()
        return new Vector(this.x/l, this.y/l)
    }
    inverse() {
        return new Vector(-this.x, -this.y);
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    mul = function (x, y) {   // multiplication
        y = y || x;
        return new Vector(this.x * x, this.y * y);
    }
    dot = function (v) {      // inner product
        return this.x * v.x + this.y * v.y;
    }
    cross = function (v) {    // cross product
        return this.x * v.y - v.x * this.y;
    }
    distance = function(v) {
        return Math.sqrt( this.distance2(v) ); 
    }
    distance2 = function(v) {  // Distance squared
        return (v.x - this.x)**2 + (v.y - this.y)**2; 
    }
    clone = function() {
        return new Vector(this.x, this.y);
    }
    console = function() {
        console.log("x=", this.x, ", y=",this.y);
    }
}
