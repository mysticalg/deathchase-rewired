import * as THREE from 'three';
import {pointSegmentDistance} from './gameplay.js';
export function trafficContact(a,b,p){return p.jump<1.65&&pointSegmentDistance(0,0,a.x-p.oldX,a.z-p.oldZ,b.x-p.x,b.z-p.z)<2;}
export function createTraffic(scene,fx,onWreck=()=>{}){
 const group=new THREE.Group();scene.add(group);group.visible=false;const cars=[],rubber=new THREE.MeshStandardMaterial({color:'#151719',roughness:.9}),glass=new THREE.MeshStandardMaterial({color:'#263e48',metalness:.7,roughness:.17}),chrome=new THREE.MeshStandardMaterial({color:'#b7c1c3',metalness:.8,roughness:.3}),lamp=new THREE.MeshStandardMaterial({color:'#fff3ce',emissive:'#ffe7a1',emissiveIntensity:1.5}),red=new THREE.MeshStandardMaterial({color:'#b92826',emissive:'#b91816',emissiveIntensity:.7});
 const paints=['#b6b9b7','#315a69','#763a35','#b39351','#4b5353','#d9d4c4'].map(color=>new THREE.MeshStandardMaterial({color,metalness:.65,roughness:.28}));
 const box=new THREE.BoxGeometry(1,1,1),wheel=new THREE.CylinderGeometry(.35,.35,.23,14);
 function add(parent,geo,mat,x,y,z,sx,sy,sz){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
 for(let i=0;i<28;i++){const car=new THREE.Group(),paint=paints[i%paints.length],wagon=i%3===0;add(car,box,paint,0,.65,0,1.85,.65,4.25);add(car,box,paint,0,1.13,-.15,1.65,.5,wagon?2.8:2.3);add(car,box,glass,0,1.35,-.15,1.62,.42,wagon?2.65:2.15);add(car,box,paint,0,1.59,-.15,1.7,.1,wagon?2.8:2.3);
  for(const side of [-1,1]){for(const z of [-1.35,1.35]){const tyre=add(car,wheel,rubber,side*.92,.38,z,1,1,1);tyre.rotation.z=Math.PI/2;const hub=add(car,wheel,chrome,side*1.045,.38,z,.5,.13,.5);hub.rotation.z=Math.PI/2;}for(const z of [-1.2,0,1.1])add(car,box,paint,side*.825,1.32,z,.055,.52,.08);add(car,box,glass,side*1.03,1.16,.75,.23,.13,.25);add(car,box,lamp,side*.63,.8,2.14,.45,.2,.05);add(car,box,red,side*.63,.8,-2.14,.45,.18,.05);add(car,box,chrome,side*.85,.86,-.05,.07,.06,.2);}
  add(car,box,chrome,0,.4,2.15,1.75,.13,.12);add(car,box,rubber,0,.6,2.16,.65,.18,.04);
  const bx=(i%5-2)*90,bz=(Math.floor(i/5)-2)*90,size=90+(i%2)*90,lane=i%2?3.8:-3.8;
  const route=[{x:bx+lane,z:bz+lane},{x:bx+size+lane,z:bz+lane},{x:bx+size+lane,z:bz+size+lane},{x:bx+lane,z:bz+size+lane}];
  car.userData={kind:'CAR',traffic:true,hp:4,wreck:false,route,segment:i%4,speed:9+(i%7)*1.7,velocity:new THREE.Vector3(),aimHeight:1,hitRadius:1.5,cooldown:0,index:i};cars.push(car);group.add(car);
 }
 function destroy(car){const d=car.userData;if(d.wreck)return false;d.wreck=true;d.velocity.set(0,0,0);car.rotation.z=(d.index%2?1:-1)*.08;fx.explode(car.position.clone().add(new THREE.Vector3(0,.8,0)),true);onWreck(car);return true;}
 function update(dt,p){for(const car of cars){const d=car.userData;d.cooldown=Math.max(0,d.cooldown-dt);if(d.wreck)continue;const old=car.position.clone(),next=d.route[(d.segment+1)%4],dx=next.x-car.position.x,dz=next.z-car.position.z,dist=Math.hypot(dx,dz),step=Math.min(dist,d.speed*dt);if(dist<.05){d.segment=(d.segment+1)%4;continue;}car.position.x+=dx/dist*step;car.position.z+=dz/dist*step;car.rotation.y=Math.atan2(dx,dz);d.velocity.copy(car.position).sub(old).divideScalar(Math.max(.001,dt));if(p&&d.cooldown<=0&&trafficContact(old,car.position,p)){d.cooldown=2;d.hp-=p.speed>30?4:2;const wrecked=d.hp<=0;if(wrecked)destroy(car);p.onImpact?.(car,wrecked);}}}
 function reset(){for(const car of cars){const d=car.userData;d.segment=d.index%4;d.hp=4;d.wreck=false;d.cooldown=0;car.rotation.set(0,0,0);car.position.set(d.route[d.segment].x,0,d.route[d.segment].z);d.velocity.set(0,0,0);}update(.001);}
 reset();return {group,cars,update,reset,destroy};
}
