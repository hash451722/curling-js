const SCALE = 10.0;


export function svgStone(id, color, scale) {
    let s = scale || SCALE;
    let rOut = 0.145;
    let rIn = rOut*0.6;

    let stone = document.createElementNS('http://www.w3.org/2000/svg','g');
    stone.setAttribute('id', id);

    let cOut = svgCircle(0, 0, rOut*s, 0, "black", "gray")
    stone.appendChild(cOut);

    let cIn = svgCircle(0, 0, rIn*s, 0, "black", color);
    stone.appendChild(cIn);
    
    let handle = document.createElementNS('http://www.w3.org/2000/svg','rect');
    handle.setAttribute("x", 0);
    handle.setAttribute("y", 0);
    handle.setAttribute("width", 30);
    handle.setAttribute("height", 10);
    handle.setAttribute("rx", 5);
    // stone.appendChild(handle);
    
    return stone;
}




export function svgSheet(scale) {
    let s = scale || SCALE;

    let sheet = document.createElementNS('http://www.w3.org/2000/svg','g');
    sheet.setAttribute('id', "sheet");
    

    let frame = svgRect(-4.750/2*s-2, -45.720/2*s-2, 4.750*s+4, 45.720*s+4, "black");
    sheet.appendChild(frame);

    let rect = svgRect(-4.750/2*s, -45.720/2*s, 4.750*s, 45.720*s, "white");
    sheet.appendChild(rect);
    


    let house1 = svgHouse(0, 34.747/2*s);
    sheet.appendChild(house1);
    let house2 = svgHouse(0, -34.747/2*s);
    sheet.appendChild(house2);


    let centerLine = svgLine(0, -(45.720/2-1.829)*s, 0, (45.720/2-1.829)*s, 0.3, "black");
    sheet.appendChild(centerLine);

    let teeLine1 = svgLine(-4.750/2*s, -34.747/2*s, 4.750/2*s, -34.747/2*s, 0.3, "black");
    sheet.appendChild(teeLine1);
    let teeLine2 = svgLine(-4.750/2*s, 34.747/2*s, 4.750/2*s, 34.747/2*s, 0.3, "black");
    sheet.appendChild(teeLine2);

    let backLine1 = svgLine(-4.750/2*s, -(34.747/2+1.829)*s, 4.750/2*s, -(34.747/2+1.829)*s, 0.3, "black");
    sheet.appendChild(backLine1);
    let backLine2 = svgLine(-4.750/2*s, (34.747/2+1.829)*s, 4.750/2*s, (34.747/2+1.829)*s, 0.3, "black");
    sheet.appendChild(backLine2);

    let hogLine1 = svgLine(-4.750/2*s, -(21.945/2)*s, 4.750/2*s, -(21.945/2)*s, 0.6, "red");
    sheet.appendChild(hogLine1);
    let hogLine2 = svgLine(-4.750/2*s, (21.945/2)*s, 4.750/2*s, (21.945/2)*s, 0.6, "red");
    sheet.appendChild(hogLine2);
    

    return sheet;
}




function svgHouse(cx, cy, scale) {
    let s = scale || SCALE;

    let house = document.createElementNS('http://www.w3.org/2000/svg','g');
    
    let twelveFoot = svgCircle(cx, cy, 1.829*s, 0.3, "black", "#016ae3");
    house.appendChild(twelveFoot);
    
    let eightFoot = svgCircle(cx, cy, 1.219*s, 0.3, "black", "white");
    house.appendChild(eightFoot);
    
    let fourFoot = svgCircle(cx, cy, 0.610*s, 0.3, "black", "#e03851");
    house.appendChild(fourFoot);
    
    let button = svgCircle(cx, cy, 0.152*s, 0.3, "black", "white");
    house.appendChild(button);
    
    return house;
}



// Primitive ------

function svgLine(x1, y1, x2, y2, lineWidth, lineColor) {
    let line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke-width", lineWidth);
    line.setAttribute("stroke", lineColor);
    return line;
}

function svgCircle(cx, cy, radius, lineWidth, lineColor, fillColor) {
    let circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', radius);
    circle.setAttribute("stroke-width", lineWidth);
    circle.setAttribute('stroke', lineColor);
    circle.setAttribute('fill', fillColor);
    return circle;
}

function svgRect(x, y, width, height, fillColor) {
    let rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", fillColor);
    return rect;
}