import * as THREE from 'three';
export function createCity(scene,loadTextures=true){const group=new THREE.Group(),colliders=[],pedestrianSpawns=[];scene.add(group);let seed=612;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const concrete=loadTextures?new THREE.TextureLoader().load('/granite.png'):new THREE.Texture();concrete.colorSpace=THREE.SRGBColorSpace;concrete.wrapS=concrete.wrapT=THREE.RepeatWrapping;concrete.repeat.set(5,8);const roadMap=concrete.clone();roadMap.repeat.set(230,230);const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const asphalt=mat('#292e33'),pavement=mat('#878983'),paint=mat('#d9caa0'),brick=[mat('#72574c'),mat('#646d72'),mat('#826e56'),mat('#4b555c')],glass=new THREE.MeshStandardMaterial({color:'#8daab0',metalness:.6,roughness:.25}),glow=new THREE.MeshStandardMaterial({color:'#ffc478',emissive:'#ffb45a',emissiveIntensity:.5});
 const box=new THREE.BoxGeometry(1,1,1),batches=new Map();function add(parent,m,x,y,z,w,h,d){const o=new THREE.Object3D();o.position.set(x,y,z);o.scale.set(w,h,d);o.updateMatrix();if(!batches.has(m))batches.set(m,[]);batches.get(m).push(o.matrix.clone());}
 add(group,asphalt,0,-.15,0,1500,.3,1500);
 for(const m of brick){m.map=concrete;m.bumpMap=concrete;m.bumpScale=.06;}asphalt.map=roadMap;const windows=[];
 for(let ix=-6;ix<6;ix++)for(let iz=-6;iz<6;iz++){const x=ix*90+45,z=iz*90+45;add(group,pavement,x,.12,z,62,.24,62);const h=12+Math.floor(rand()*9)*5,w=38+rand()*12,d=38+rand()*12;add(group,brick[Math.floor(rand()*4)],x,h/2,z,w,h,d);colliders.push({x,z,halfX:w/2+.7,halfZ:d/2+.7,height:h});add(group,pavement,x,h+.3,z,w+1,.6,d+1);
  for(let y=4;y<h-1;y+=4)for(let q=-w/2+4;q<w/2-2;q+=6)for(const side of [-1,1])windows.push({x:x+q,y,z:z+side*(d/2+.03),ry:0,lit:rand()>.7});
  for(let y=4;y<h-1;y+=4)for(let q=-d/2+4;q<d/2-2;q+=6)for(const side of [-1,1])windows.push({x:x+side*(w/2+.03),y,z:z+q,ry:Math.PI/2,lit:rand()>.7});
  for(let j=0;j<2;j++)pedestrianSpawns.push({x:x-33,z:z-23+j*46,axis:'z'},{x:x+33,z:z-23+j*46,axis:'z'});
 }
 for(const lit of [false,true]){const entries=windows.filter(w=>w.lit===lit),inst=new THREE.InstancedMesh(new THREE.PlaneGeometry(2,2.1),lit?glow:glass,entries.length),o=new THREE.Object3D();entries.forEach((w,i)=>{o.position.set(w.x,w.y,w.z);o.rotation.y=w.ry;o.updateMatrix();inst.setMatrixAt(i,o.matrix);});inst.material.side=THREE.DoubleSide;group.add(inst);}
 // Broken centre lines, zebra crossings and street lights give roads a readable scale.
 for(let n=-6;n<=6;n++)for(let p=-650;p<650;p+=18){add(group,paint,n*90,.025,p,.18,.025,7);add(group,paint,p,.025,n*90,7,.025,.18);}
 for(let n=-5;n<=5;n++)for(let m=-5;m<=5;m++)for(let j=-3;j<=3;j++)add(group,paint,n*90+j*2,.03,m*90+12,1,.025,7);
 for(let n=-5;n<=5;n++)for(let m=-5;m<=5;m++){const x=n*90+12,z=m*90+15;add(group,brick[3],x,3.5,z,.18,7,.18);add(group,glow,x,7,z,1.3,.16,.6);}
 for(let i=0;i<80;i++){const x=(i%10-5)*90+9,z=(Math.floor(i/10)-4)*90+30;const body=brick[i%4];add(group,darkCar(),x,.6,z,1.9,1,4);add(group,glass,x,1.25,z+.1,1.65,.65,2);for(const side of [-1,1])for(const end of [-1,1])add(group,asphalt,x+side*.95,.4,z+end*1.25,.2,.6,.65);}
for(const b of colliders){add(group,brick[2],b.x,2,b.z-b.halfZ-.2,b.halfX*1.5,.5,1);add(group,glass,b.x,1,b.z-b.halfZ-.1,b.halfX*1.3,1.6,.15);}
function darkCar(){return brick[1];}
for(const [m,matrices] of batches){const inst=new THREE.InstancedMesh(box,m,matrices.length);matrices.forEach((matrix,i)=>inst.setMatrixAt(i,matrix));inst.receiveShadow=true;group.add(inst);}pedestrianSpawns.sort((a,b)=>Math.hypot(a.x,a.z)-Math.hypot(b.x,b.z));group.visible=false;return {group,colliders,pedestrianSpawns};
}
export function cityBlocked(colliders,x,z,radius=.7){return colliders.find(b=>Math.abs(x-b.x)<b.halfX+radius&&Math.abs(z-b.z)<b.halfZ+radius);}
