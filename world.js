import * as THREE from 'three';
export const WORLD_RADIUS=850;
export const FORESTS=[{x:-280,z:-240,r:155},{x:290,z:-270,r:165},{x:-300,z:260,r:175},{x:310,z:290,r:155}];
export function forestAt(x,z){return FORESTS.some(f=>Math.hypot(x-f.x,z-f.z)<f.r);}
let cityTerrain=false;export function setCityTerrain(value){cityTerrain=value;}
export function terrainHeight(x,z){if(cityTerrain)return 0;const broad=Math.sin(z*.014)*3.5+Math.sin(z*.031+x*.012)*1.5+Math.sin(x*.021+z*.006)*2.6;const distance=Math.hypot(x,z),rim=Math.min(1.25,Math.max(0,(distance-570)/220));return broad+Math.pow(rim,2)*55*(.75+.25*Math.sin(Math.atan2(z,x)*9));}
export function createWorld(scene,mats){
 let seed=4917;function rand(){seed=seed*16807%2147483647;return(seed-1)/2147483646;}
 const geo=new THREE.PlaneGeometry(1900,1900,240,240);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,terrainHeight(p.getX(i),p.getZ(i)));geo.computeVertexNormals();const floor=new THREE.Mesh(geo,mats.ground);floor.receiveShadow=true;scene.add(floor);
 const trees=[];function tree(x,z,index,forest=false){const g=new THREE.Group(),h=12+rand()*14,r=.32+rand()*.35;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(r*.62,r,h,8),mats.bark);trunk.position.y=h/2;g.add(trunk);g.position.set(x,terrainHeight(x,z),z);g.userData={r,index,forest,h};scene.add(g);trees.push(g);}
 tree(6,-55,0);for(let i=1;i<90;i++){let a=rand()*Math.PI*2,d=60+rand()*160;tree(Math.sin(a)*d,Math.cos(a)*d,i);}
 for(const f of FORESTS)for(let i=0;i<100;i++){const a=rand()*Math.PI*2,d=Math.sqrt(rand())*f.r;tree(f.x+Math.sin(a)*d,f.z+Math.cos(a)*d,90+i,true);}
 const rocks=[];for(let i=0;i<100;i++){const a=rand()*Math.PI*2,d=50+rand()*650,x=Math.sin(a)*d,z=Math.cos(a)*d;const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.4+rand()*1.8,1),mats.bark);r.position.set(x,terrainHeight(x,z),z);r.scale.y=.65;scene.add(r);rocks.push(r);}
 const logs=[];for(let i=0;i<27;i++){const x=i===0?0:(rand()-.5)*1050,z=i===0?-70:(rand()-.5)*1050,angle=i===0?0:rand()*Math.PI;const group=new THREE.Group(),length=5+rand()*3,r=.4+rand()*.25;const log=new THREE.Mesh(new THREE.CylinderGeometry(r*.85,r,length,14),mats.bark);log.rotation.z=Math.PI/2;group.add(log);const endMaterial=new THREE.MeshStandardMaterial({color:'#97754b',roughness:.95});for(let s of [-1,1]){let end=new THREE.Mesh(new THREE.CircleGeometry(r*.83,16),endMaterial);end.rotation.y=s*Math.PI/2;end.position.x=s*length/2;group.add(end);}group.position.set(x,terrainHeight(x,z)+r,z);group.rotation.y=angle;group.userData={length,r,angle,cooldown:0};group.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});scene.add(group);logs.push(group);}
 return {floor,trees,rocks,logs,forestAt};
}

