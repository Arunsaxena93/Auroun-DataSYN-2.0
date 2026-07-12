"use strict";

const canvas = document.getElementById("cubeCanvas");

if (canvas && typeof THREE !== "undefined") {

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
45,
canvas.clientWidth/canvas.clientHeight,
0.1,
1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({

canvas:canvas,

alpha:true,

antialias:true

});

renderer.setSize(canvas.clientWidth,canvas.clientHeight);

renderer.setPixelRatio(window.devicePixelRatio);

//========================
// LIGHTS
//========================

scene.add(new THREE.AmbientLight(0xffffff,1.5));

const point=new THREE.PointLight(0x00e5ff,6);

point.position.set(5,5,5);

scene.add(point);

//========================
// OUTER GLASS CUBE
//========================

const outerGeo=new THREE.BoxGeometry(2.2,2.2,2.2);

const outerMat=new THREE.MeshPhysicalMaterial({

color:0x00e5ff,

transparent:true,

opacity:.18,

transmission:1,

roughness:0,

metalness:.15,

clearcoat:1,

emissive:0x00d9ff,

emissiveIntensity:.8

});

const outerCube=new THREE.Mesh(outerGeo,outerMat);

scene.add(outerCube);

//========================
// WIREFRAME
//========================

const edges=new THREE.LineSegments(

new THREE.EdgesGeometry(outerGeo),

new THREE.LineBasicMaterial({

color:0x7df9ff

})

);

outerCube.add(edges);

//========================
// INNER ENERGY CUBE
//========================

const innerGeo=new THREE.BoxGeometry(1.1,1.1,1.1);

const innerMat=new THREE.MeshStandardMaterial({

color:0xffffff,

emissive:0x00e5ff,

emissiveIntensity:2

});

const innerCube=new THREE.Mesh(innerGeo,innerMat);

scene.add(innerCube);

//========================
// ORBIT RINGS
//========================

const ringMaterial=new THREE.MeshBasicMaterial({

color:0x00e5ff,

transparent:true,

opacity:.6,

side:THREE.DoubleSide

});

const ring1=new THREE.Mesh(

new THREE.TorusGeometry(2.2,.02,16,150),

ringMaterial

);

ring1.rotation.x=Math.PI/2;

scene.add(ring1);

const ring2=ring1.clone();

ring2.rotation.y=Math.PI/2;

scene.add(ring2);

const ring3=ring1.clone();

ring3.rotation.z=Math.PI/2;

scene.add(ring3);

//========================
// PARTICLES
//========================

const particleGeometry=new THREE.BufferGeometry();

const particleCount=300;

const positions=[];

for(let i=0;i<particleCount;i++){

positions.push(

(Math.random()-0.5)*8,

(Math.random()-0.5)*8,

(Math.random()-0.5)*8

);

}

particleGeometry.setAttribute(

"position",

new THREE.Float32BufferAttribute(positions,3)

);

const particleMaterial=new THREE.PointsMaterial({

color:0x7df9ff,

size:.04

});

const particles=new THREE.Points(

particleGeometry,

particleMaterial

);

scene.add(particles);

//========================
// MOUSE ROTATION
//========================

let mouseX=0;

let mouseY=0;

window.addEventListener("mousemove",(e)=>{

mouseX=(e.clientX/window.innerWidth-.5)*1.5;

mouseY=(e.clientY/window.innerHeight-.5)*1.5;

});

//========================
// ANIMATION
//========================

function animate(){

requestAnimationFrame(animate);

outerCube.rotation.x+=0.003;

outerCube.rotation.y+=0.006;

innerCube.rotation.x-=0.01;

innerCube.rotation.y-=0.012;

ring1.rotation.z+=0.004;

ring2.rotation.x+=0.005;

ring3.rotation.y+=0.006;

particles.rotation.y+=0.001;

const float=Math.sin(Date.now()*0.0015)*0.18;

outerCube.position.y=float;

innerCube.position.y=float;

ring1.position.y=float;

ring2.position.y=float;

ring3.position.y=float;

outerCube.rotation.y+=mouseX*0.002;

outerCube.rotation.x+=mouseY*0.002;

renderer.render(scene,camera);

}

animate();

window.addEventListener("resize",()=>{

const w=canvas.clientWidth;

const h=canvas.clientHeight;

camera.aspect=w/h;

camera.updateProjectionMatrix();

renderer.setSize(w,h);

});

}
