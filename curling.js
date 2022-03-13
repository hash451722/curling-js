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
  // console.log(engine);

  const fps = 50;
  let intervalStep = Math.floor( 1/(fps*engine.dt) );
  let intervalTime = engine.dt*1000*intervalStep;  // [msec]

  console.log("animation frame rate:", 1/intervalTime*1000, "fps");

  let itr = 0;
  console.log(engine.itr);
  let intervalID = setInterval(() => {
    engine.stones.forEach(stone => {
      let id = stone.id;
      let xx = stone.posisionHistory[itr].x;
      let yy = stone.posisionHistory[itr].y;
      let aa = stone.angleHistory[itr];
      svgStones[id].setAttribute("transform", `translate(${xx*SCALE}, ${yy*SCALE}) rotate(${aa})`);
    }); 
    console.log(itr);
    itr++;
    if (itr > engine.itr) {
      enableBtn(btnShot)
      clearInterval(intervalID);
    }
  }, intervalTime);
}

function enableBtn(btnElement) {
  btnElement.removeAttribute("disabled");
}
