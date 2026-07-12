/* ==========================================================
   AUROUN DATASYN 2.0
   Neural Network Background
========================================================== */

"use strict";

const canvas = document.createElement("canvas");
canvas.id = "neural-canvas";

document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "-2";
canvas.style.pointerEvents = "none";

window.addEventListener("resize", () => {

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

});

/* ==========================================================
   NODE CLASS
========================================================== */

class Node {

    constructor() {

        this.x = Math.random() * width;
        this.y = Math.random() * height;

        this.dx = (Math.random() - 0.5) * 0.8;
        this.dy = (Math.random() - 0.5) * 0.8;

        this.radius = 2 + Math.random() * 2;

    }

    update() {

        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > width)
            this.dx *= -1;

        if (this.y < 0 || this.y > height)
            this.dy *= -1;

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#00e5ff";

        ctx.fill();

    }

}

const nodes = [];

for (let i = 0; i < 180; i++) {

    nodes.push(new Node());

}
/* ==========================================================
   MOUSE INTERACTION
========================================================== */

const mouse = {

    x: null,

    y: null,

    radius: 160

};

window.addEventListener("mousemove", (event) => {

    mouse.x = event.x;

    mouse.y = event.y;

});

/* ==========================================================
   CONNECT NODES
========================================================== */

function connectNodes() {

    for (let a = 0; a < nodes.length; a++) {

        for (let b = a + 1; b < nodes.length; b++) {

            const dx = nodes[a].x - nodes[b].x;
            const dy = nodes[a].y - nodes[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {

                ctx.beginPath();

                Style =
                    rgba(0,229,255,$`{1 - distctx.strokeance / 120}`);

                ctx.lineWidth = 1.2;

                ctx.moveTo(nodes[a].x, nodes[a].y);

                ctx.lineTo(nodes[b].x, nodes[b].y);

                ctx.stroke();

            }

        }

    }

}

/* ==========================================================
   MOUSE EFFECT
========================================================== */

function mouseEffect(node) {

    if (mouse.x === null) return;

    const dx = node.x - mouse.x;
    const dy = node.y - mouse.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {

        ctx.beginPath();

        ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);

        ctx.fillStyle = "#ffffff";

        ctx.shadowBlur = 20;
ctx.shadowColor = "#00E5FF";
ctx.fill();
ctx.shadowBlur = 0;

    }

}

/* ==========================================================
   ANIMATION LOOP
========================================================== */

function animate() {

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle="rgba(3,8,22,.15)";
ctx.fillRect(0,0,width,height);

    nodes.forEach(node => {

        node.update();

    if(mouse.x!==null){

    node.x += (mouse.x-node.x)*0.0007;
    node.y += (mouse.y-node.y)*0.0007;

}

        node.draw();

        mouseEffect(node);

    });

    connectNodes();

    requestAnimationFrame(animate);
    drawCore();

}

animate();

/* ==========================================================
   AI CORE
========================================================== */

let angle = 0;

function drawCore(){

    angle += 0.01;

    const cx = width * 0.73;
    const cy = height * 0.42;

    const radius = 60;

    ctx.save();

    ctx.translate(cx,cy);
    ctx.rotate(angle);

    // outer ring
    ctx.beginPath();
    ctx.arc(0,0,radius,0,Math.PI*2);
    ctx.strokeStyle="rgba(0,229,255,.45)";
    ctx.lineWidth=2;
    ctx.stroke();

    // inner ring
    ctx.beginPath();
    ctx.arc(0,0,radius-18,0,Math.PI*2);
    ctx.strokeStyle="rgba(255,255,255,.25)";
    ctx.stroke();

    // glowing center
    const g=ctx.createRadialGradient(0,0,8,0,0,38);
    g.addColorStop(0,"#ffffff");
    g.addColorStop(.35,"#00e5ff");
    g.addColorStop(1,"rgba(0,229,255,0)");

    ctx.beginPath();
    ctx.fillStyle=g;
    ctx.arc(0,0,38,0,Math.PI*2);
    ctx.fill();

    // orbit dots
    for(let i=0;i<8;i++){

        const a=angle+i*Math.PI/4;

        const x=Math.cos(a)*radius;
        const y=Math.sin(a)*radius;

        ctx.beginPath();
        ctx.fillStyle="#7cf8ff";
        ctx.arc(x,y,3,0,Math.PI*2);
        ctx.fill();

    }

    ctx.restore();

}

/* ==========================================================
   CONSOLE
========================================================== */

console.log("Auroun DataSYN Neural Engine Loaded");
