import { Stone , Engine } from "./physics.js";
import { Skipper } from "./skipper.js"
import { svgSheet, svgStone } from "./svg.js";



window.addEventListener("DOMContentLoaded", init);

function init(){
  
  const sheet = svgSheet();
  const svgOverall = document.getElementById('overall');
  svgOverall.appendChild(sheet);
  
  let svgStones = initSvgStone(svgOverall);

  let engine = new Engine(1e-3);
  let skip = new Skipper("straight");  // Curling AI


  let btnShot = document.getElementById("btnShot");
  btnShot.addEventListener('click', {
    engine: engine,
    skip: skip,
    btnShot: btnShot,
    displayElement: svgOverall,
    svgStones: svgStones,
    handleEvent: nextShot
  });

};


function nextShot() {

  console.log("Shot num: ", this.engine.nShot);
  this.btnShot.setAttribute("disabled", true);

  let stoneColor = assignStoneColor(this.engine.nShot);  // team color
  let bestShot = this.skip.shot(this.engine.stones, stoneColor);
  let stone = new Stone(this.engine.nShot, bestShot);
  let normalEnd = this.engine.shot(stone);

  console.log(this.engine);

  animate(this.engine, this.displayElement, this.btnShot, this.svgStones);
}


function assignStoneColor(n) {
  if((n%2) == 0) {
    return "red";  // first shot
  } else {
    return "yellow";  // second shot
  }
}


function initSvgStone(displayElement) {
  let svgStones = [];
  for (let i = 0; i < 16; i++) {
    let stoneColor = assignStoneColor(i);
    let s = svgStone( i, stoneColor );
    svgStones.push( s );
    displayElement.appendChild(s);

    let x = 21 * (-1)**i;
    let y = 205 + Math.floor(i/2) * 3;

    s.setAttribute("transform", `translate(${x}, ${y})`);
  }
  return svgStones;
}


function animate(engine, displayElement, btnShot, svgStones) {
  const SCALE = 10.0;

  const fps = 50;
  let intervalStep = Math.floor( 1/(fps*engine.dt) );
  let intervalTime = engine.dt*1000*intervalStep;  // [msec]
  let maxItr = Math.round( engine.itr/intervalStep );
  
  console.log("animation frame rate:", 1/intervalTime*1000, "fps");
  console.log(engine.itr, intervalStep, maxItr);
 
  engine.stones.forEach(stone => {
    let pos = stone.posisionHistory[stone.posisionHistory.length-1];
    let ang = stone.angleHistory[stone.angleHistory.length-1];
    for (let k = 0; k < intervalStep; k++) {
      stone.posisionHistory.push(pos);
      stone.angleHistory.push(ang);
    }
  }); 
  
  let itr = 0;
  let intervalID = setInterval(() => {
    console.log(itr);
    engine.stones.forEach(stone => {
      let n = itr * intervalStep;
      let id = stone.id;
      let x = stone.posisionHistory[n].x;
      let y = stone.posisionHistory[n].y;
      let a = stone.angleHistory[n];


      y = -y + 21.945/2+6.401+1.829+1.829;

      svgStones[id].setAttribute("transform", `translate(${x*SCALE}, ${y*SCALE}) rotate(${a})`);
    }); 
    itr++;
    if (itr > maxItr) {
      enableBtn(btnShot)
      clearInterval(intervalID);
    }
  }, intervalTime);
}

function enableBtn(btnElement) {
  btnElement.removeAttribute("disabled");
}
