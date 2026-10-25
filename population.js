import {createCharacterMaterials,addFace} from './character-materials.js';
import * as THREE from 'three';
import {pointSegmentDistance} from './gameplay.js';

// Population belongs to the map: no nearby spawning or timed corpse cleanup.
export function createPopulation(scene,height,fx,onKill=()=>{},looks=createCharacterMaterials(false)){
 let seed=7319,time=0,ink=0,spacing=0,stampCount=0;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.9});
 const dark=material('#252a28'),skin=material('#bf9474'),wool=material('#d2cbb5'),grey=material('#686b65'),white=material('#dad6c7');
 const jackets=['#9b603a','#566e48','#4d647d','#a59568','#764e5d'].map(material);
 const sphere=new THREE.SphereGeometry(1,8,6),box=new THREE.BoxGeometry(1,1,1);
 const actors=[],corpses=[],camps=[],extraBodies=[];
 function part(parent,geo,mat,x,y,z,sx,sy,sz){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function adult(model,index){const jacket=looks.jackets[index%looks.jackets.length],pants=looks.trousers[index%looks.trousers.length],skinMat=looks.skin[index%looks.skin.length],limbs=[];
  part(model,new THREE.CapsuleGeometry(.23,.31,4,10),jacket,0,1.13,0,1,1, .72);part(model,sphere,skinMat,0,1.65,0,.18,.22,.18);addFace(model,looks,index);
  const hair=part(model,new THREE.SphereGeometry(1,12,8,0,Math.PI*2,0,Math.PI*.48),looks.hair[index%looks.hair.length],0,1.75,.02,.188,.125,.18);
  if(index%3===0)part(model,box,pants,0,1.16,.22,.32,.42,.17);
  part(model,box,looks.trim,0,1.15,-.18,.012,.4,.012);
  for(const side of [-1,1]){limbs.push(part(model,new THREE.CapsuleGeometry(.085,.57,4,8),pants,side*.14,.43,0,1,1,1));limbs.push(part(model,new THREE.CapsuleGeometry(.075,.42,4,8),jacket,side*.3,1.08,0,1,1,1));part(model,sphere,skinMat,side*.3,.76,0,.075,.09,.07);part(model,box,looks.leather,side*.14,.075,-.06,.19,.14,.32);}return limbs;
 }
 function animal(model,kind){const cow=kind==='COW',sheep=kind==='SHEEP',mat=cow?white:sheep?wool:grey,length=cow?1.7:sheep?1.05:1.25,y=cow?1.1:.72,limbs=[];
  part(model,sphere,mat,0,y,0,cow?.52:.36,cow?.55:.35,length*.5);
  if(sheep)for(let i=0;i<8;i++)part(model,sphere,wool,Math.sin(i*2.4)*.25,y+.1,Math.cos(i*2.4)*.38,.27,.3,.27);
  if(cow)for(let s of [-1,1])for(let j=0;j<3;j++)part(model,sphere,dark,s*.43,y+.12*Math.sin(j),-.5+j*.46,.11,.29,.23);
  part(model,sphere,cow?white:dark,0,y+.12,-length*.55,cow?.27:.21,.27,.31);
  part(model,sphere,cow?skin:grey,0,y-.02,-length*.55-.24,.22,.13,.17);
  for(const s of [-1,1]){part(model,new THREE.ConeGeometry(.09,.24,5),mat,s*.17,y+.43,-length*.55,.8,1,1);for(const z of [-1,1])limbs.push(part(model,box,dark,s*(cow?.32:.22),y*.43,z*length*.32,.13,y*.8,.14));}
  const tail=part(model,box,mat,0,y,length*.56,.09,.1,.5);tail.rotation.x=-.5;return limbs;
 }
 function add(kind,x,z,index){const root=new THREE.Group(),model=new THREE.Group();root.add(model);const limbs=kind==='CAMPER'?adult(model,index):animal(model,kind);
  root.userData={population:true,kind,alive:true,hp:kind==='COW'?3:1,aimHeight:kind==='CAMPER'?1.1:kind==='COW'?1.1:.75,hitRadius:kind==='COW'?1:.72,velocity:new THREE.Vector3(),home:{x,z},phase:random()*6.28,model,limbs};scene.add(root);actors.push(root);return root;
 }
 const locations=[[12,-85],[-38,-150],[100,-180],[-180,-210],[260,-160],[-310,120],[210,260],[-120,340],[420,180],[-430,-300],[350,-410],[-200,490]];
 for(let n=0;n<locations.length;n++){const [x,z]=locations[n],camp=new THREE.Group();camp.position.set(x,height(x,z),z);scene.add(camp);camps.push(camp);
  for(let j=0;j<3;j++){const tent=part(camp,new THREE.ConeGeometry(2.8,2.5,4),jackets[(n+j)%5],(j-1)*7,1.25,3,1,1,1);tent.rotation.y=Math.PI/4;part(camp,box,dark,(j-1)*7,.65,1.55,.8,1.3,.05);}
  part(camp,new THREE.CylinderGeometry(1,1,.2,10),dark,0,.1,-3,1,1,1);part(camp,new THREE.ConeGeometry(.4,.85,7),material('#db7432'),0,.55,-3,1,1,1);
  for(let j=0;j<10;j++){const a=random()*6.28,r=5+random()*17;add('CAMPER',x+Math.sin(a)*r,z+Math.cos(a)*r,j+n);}
 }
 for(const [kind,count] of [['WOLF',12],['COW',20],['SHEEP',28]])for(let i=0;i<count;i++){const cluster=i%4,a=random()*6.28,r=12+random()*35;const centres=[[60,-115],[-120,80],[170,130],[-170,-320]];add(kind,centres[cluster][0]+Math.sin(a)*r,centres[cluster][1]+Math.cos(a)*r,i);}
 for(let i=0;i<140;i++){const a=add('CAMPER',0,0,i);a.userData.cityOnly=true;a.userData.enabled=false;a.visible=false;}
 const bloodMat=new THREE.MeshBasicMaterial({color:'#821626',side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3});
 const marks=new THREE.InstancedMesh(new THREE.PlaneGeometry(.16,.65),bloodMat,12000);marks.count=0;marks.frustumCulled=false;scene.add(marks);const dummy=new THREE.Object3D(),normal=new THREE.Vector3(),axis=new THREE.Vector3(0,0,1);
 function align(o,x,z){const dx=(height(x+.15,z)-height(x-.15,z))/.3,dz=(height(x,z+.15)-height(x,z-.15))/.3;normal.set(-dx,1,-dz).normalize();o.position.set(x,height(x,z)+.045,z);o.quaternion.setFromUnitVectors(axis,normal);}
 function pool(x,z){const m=new THREE.Mesh(new THREE.CircleGeometry(.9,10),bloodMat);align(m,x,z);m.scale.set(1.1,.7,1);scene.add(m);return m;}
 function kill(a){if(!a.userData.alive)return false;const d=a.userData;d.alive=false;d.velocity.set(0,0,0);d.model.rotation.z=Math.PI/2;d.model.position.y=d.kind==='CAMPER'?.25:.4;d.pool=pool(a.position.x,a.position.z);corpses.push(a);onKill(d.kind);fx.blood(a.position.clone().add(new THREE.Vector3(0,d.aimHeight,0)));return true;}
 function keepBody(e){const copy=e.clone(true);copy.position.y=height(copy.position.x,copy.position.z)+.35;copy.rotation.z=1.5;scene.add(copy);extraBodies.push(copy,pool(copy.position.x,copy.position.z));}
 function update(dt,p){time+=dt;const travelled=Math.hypot(p.x-p.oldX,p.z-p.oldZ),grounded=p.speed>.2&&p.jump<.65,riding=p.speed>7&&p.jump<.65;
  for(const a of actors){const d=a.userData;if(d.enabled===false)continue;a.visible=Math.hypot(a.position.x-p.x,a.position.z-p.z)<210;if(!a.visible)continue;if(!d.alive){if(grounded&&pointSegmentDistance(a.position.x,a.position.z,p.oldX,p.oldZ,p.x,p.z)<1.2)ink=55;continue;}
   const old=a.position.clone(),distance=Math.hypot(p.x-old.x,p.z-old.z),flee=distance<18&&p.speed>3;let vx,vz,v=flee?(d.kind==='CAMPER'?4:7):d.kind==='WOLF'?2.8:.65;
   if(flee){vx=(old.x-p.x)/Math.max(.1,distance);vz=(old.z-p.z)/Math.max(.1,distance);}else{const tx=d.home.x+Math.sin(time*.12+d.phase)*11,tz=d.home.z+Math.cos(time*.1+d.phase)*11,len=Math.hypot(tx-old.x,tz-old.z);vx=(tx-old.x)/Math.max(1,len);vz=(tz-old.z)/Math.max(1,len);}
   if(d.city){vx=0;vz=Math.sin(time*.25+d.phase)>0?1:-1;}a.position.x+=vx*v*dt;a.position.z+=vz*v*dt;a.position.y=height(a.position.x,a.position.z);a.rotation.y=Math.atan2(-vx,-vz);d.velocity.copy(a.position).sub(old).divideScalar(Math.max(.001,dt));d.limbs.forEach((l,i)=>l.rotation.x=Math.sin(time*v*5+(i%2)*Math.PI)*.3);
   if(riding&&pointSegmentDistance(a.position.x,a.position.z,p.oldX,p.oldZ,p.x,p.z)<d.hitRadius+.45){kill(a);ink=55;}
  }
  if(grounded&&ink>0){spacing+=travelled;const steps=Math.floor(spacing/.55);spacing-=steps*.55;for(let j=0;j<steps;j++){const t=(j+1)/Math.max(1,steps),x=THREE.MathUtils.lerp(p.oldX,p.x,t),z=THREE.MathUtils.lerp(p.oldZ,p.z,t);for(const side of [-1,1]){align(dummy,x+Math.cos(p.yaw)*side*.22-Math.sin(p.yaw),z+Math.sin(p.yaw)*side*.22+Math.cos(p.yaw));dummy.rotateZ(-p.yaw);dummy.scale.set(.8+random()*.35,1,1);dummy.updateMatrix();marks.setMatrixAt(stampCount%12000,dummy.matrix);stampCount++;}}marks.count=Math.min(12000,stampCount);marks.instanceMatrix.needsUpdate=true;ink=Math.max(0,ink-travelled);}
 }
 function reset(){time=ink=spacing=stampCount=0;marks.count=0;corpses.length=0;for(const o of extraBodies)scene.remove(o);extraBodies.length=0;for(const a of actors){const d=a.userData;if(d.pool){scene.remove(d.pool);d.pool.geometry.dispose();delete d.pool;}d.alive=true;d.hp=d.kind==='COW'?3:1;d.model.rotation.set(0,0,0);d.model.position.set(0,0,0);a.position.set(d.home.x,height(d.home.x,d.home.z),d.home.z);d.velocity.set(0,0,0);}}
 function setLevel(city,spawns){for(let i=0;i<actors.length;i++){const a=actors[i],d=a.userData;if(!d.forestHome)d.forestHome={...d.home};d.city=city;d.home=city?{...spawns[i%spawns.length]}:{...d.forestHome};d.enabled=city?d.kind==='CAMPER':!d.cityOnly;a.visible=d.enabled;}for(const c of camps)c.visible=!city;reset();}
 reset();return {actors,corpses,camps,marks,kill,keepBody,update,reset,setLevel,get trailCount(){return marks.count;}};
}
