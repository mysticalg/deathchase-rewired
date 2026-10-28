import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import {assetUrl} from './assets.js';
import {createRider} from './rider.js';

// Two physical wheels, exposed mechanics and steel armour; lights are actual lamps only.
export function createDeathBike(looks,withRider=false,loadTextures=true){
 const bike=new THREE.Group();bike.name='death-racer-motorcycle';
 const worn=loadTextures?new THREE.TextureLoader().load(assetUrl('/deathbike-steel.png')):new THREE.Texture();worn.colorSpace=THREE.SRGBColorSpace;worn.wrapS=worn.wrapT=THREE.RepeatWrapping;worn.anisotropy=8;
 const steel=new THREE.MeshStandardMaterial({color:'#b5b8b4',map:worn,bumpMap:worn,bumpScale:.009,metalness:.6,roughness:.57}),black=new THREE.MeshStandardMaterial({color:'#666b69',map:worn,bumpMap:worn,bumpScale:.012,metalness:.35,roughness:.8}),paint=new THREE.MeshStandardMaterial({color:'#c46d57',map:worn,bumpMap:worn,bumpScale:.009,metalness:.35,roughness:.76}),chrome=new THREE.MeshStandardMaterial({color:'#888f91',metalness:.9,roughness:.34}),rubber=new THREE.MeshStandardMaterial({color:'#141719',roughness:.95}),brass=new THREE.MeshStandardMaterial({color:'#8c7952',metalness:.7,roughness:.6}),lamp=new THREE.MeshStandardMaterial({color:'#efe3b2',emissive:'#ffe0a1',emissiveIntensity:.7,roughness:.25}),redLamp=new THREE.MeshStandardMaterial({color:'#8a1712',emissive:'#8a120c',emissiveIntensity:.7,roughness:.4});
 const sphere=new THREE.SphereGeometry(1,24,16),box=new THREE.BoxGeometry(1,1,1);
 function part(geo,mat,x,y,z,sx=1,sy=1,sz=1){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);bike.add(m);return m;}
 function oval(mat,p,s){return part(sphere,mat,...p,...s);}
 function tube(a,b,r,mat=steel){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),m=part(new THREE.CylinderGeometry(r,r,from.distanceTo(to),12),mat,...from.clone().add(to).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.sub(from).normalize());return m;}
 function pipe(points,r,mat=chrome){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));return part(new THREE.TubeGeometry(curve,Math.max(28,points.length*2),r,10,false),mat,0,0,0);}
 for(const z of [-.95,.92]){
  const rear=z>0,width=rear?.31:.24;
  const tyre=part(new THREE.TorusGeometry(.35,.13,12,32),rubber,0,.48,z);tyre.rotation.y=Math.PI/2;tyre.scale.z=width/.26;
  for(let i=0;i<32;i++){const angle=i*Math.PI/16,tread=part(box,rubber,0,.48+Math.cos(angle)*.478,z+Math.sin(angle)*.478,width*.95,.032,.075);tread.rotation.x=angle;tread.rotation.z=(i%2?.07:-.07);}
  const hub=part(new THREE.CylinderGeometry(.10,.10,width+.07,16),steel,0,.48,z);hub.rotation.z=Math.PI/2;
  for(const side of [-1,1]){const rim=part(new THREE.TorusGeometry(.265,.025,8,28),chrome,side*width*.38,.48,z);rim.rotation.y=Math.PI/2;for(let i=0;i<12;i++){const angle=i*Math.PI/6;tube([side*width*.32,.48,z],[side*width*.38,.48+Math.sin(angle)*.26,z+Math.cos(angle)*.26],.009,chrome);}}
  const disc=part(new THREE.CylinderGeometry(.205,.205,.018,24),steel,width/2+.015,.48,z);disc.rotation.z=Math.PI/2;part(box,black,width/2+.04,.59,z-.16,.07,.14,.10);
  // Short metal fenders leave plenty of knobbly tyre exposed.
  const fender=part(new THREE.TorusGeometry(.51,.035,6,24,Math.PI*.72),paint,0,.48,z);fender.rotation.set(0,Math.PI/2,Math.PI*.14);fender.scale.z=rear?3:2.3;
 }
 // Triangulated tubular chassis and swingarm.
 for(const side of [-1,1]){const x=side*.21;tube([x,.42,.12],[x,1.02,.28],.036,black);tube([x,1.02,.28],[x,1.04,-.47],.036,black);tube([x,1.04,-.47],[x,.43,-.24],.036,black);tube([x,.43,-.24],[x,.42,.35],.036,black);tube([x,.42,.15],[side*.14,.48,.92],.035,steel);tube([side*.13,.48,.92],[side*.23,.95,.52],.042,black);
  const coil=[];for(let j=0;j<=60;j++){const t=j/60,a=t*Math.PI*10;coil.push([side*.23+Math.cos(a)*.05,.60+t*.28+Math.sin(a)*.035,.84-t*.25+Math.sin(a)*.035]);}pipe(coil,.008,steel);
  tube([side*.13,.48,-.95],[side*.13,1.13,-.51],.037,chrome);tube([side*.13,.48,-.95],[side*.13,.79,-.74],.05,black);
 }
 // Exposed V-twin crankcase and finned cylinders.
 const crank=part(new THREE.CylinderGeometry(.225,.225,.44,24),steel,0,.53,.06);crank.rotation.z=Math.PI/2;
 for(const side of [-1,1]){const cover=part(new THREE.CylinderGeometry(.17,.17,.025,20),black,side*.238,.53,.06);cover.rotation.z=Math.PI/2;for(let i=0;i<5;i++){const angle=i*Math.PI*2/5;oval(chrome,[side*.257,.53+Math.sin(angle)*.135,.06+Math.cos(angle)*.135],[.012,.014,.014]);}}
 for(const direction of [-1,1]){const cylinder=new THREE.Group();cylinder.position.set(0,.70,direction*.17);cylinder.rotation.x=direction*.38;bike.add(cylinder);for(let i=0;i<7;i++){const fin=new THREE.Mesh(new THREE.CylinderGeometry(.155,.155,.018,16),i%2?black:steel);fin.position.y=i*.035;cylinder.add(fin);}const head=new THREE.Mesh(new THREE.BoxGeometry(.30,.07,.24),black);head.position.y=.25;cylinder.add(head);}
 // Rounded fuel tank and sculpted leather saddle.
 oval(paint,[0,.95,-.22],[.265,.185,.43]);oval(chrome,[0,1.122,-.15],[.065,.018,.065]);oval(looks.leather,[0,1.03,.35],[.275,.075,.40]);
 for(const side of [-1,1]){pipe([[side*.17,.83,-.22],[side*.36,.58,-.24],[side*.49,.38,.22],[side*.49,.43,.94]],.035,chrome);tube([side*.49,.43,.66],[side*.49,.43,1.13],.064,black);const mouth=part(new THREE.CylinderGeometry(.045,.045,.018,12),rubber,side*.49,.43,1.14);mouth.rotation.x=Math.PI/2;tube([side*.22,.35,.22],[side*.43,.35,.22],.025,steel);}
 // Armour sides are battered painted steel, with visible rivets.
 for(const side of [-1,1]){const panel=part(box,paint,side*.29,.73,.33,.035,.28,.44);panel.rotation.z=side*.12;for(const z of [.14,.52])for(const y of [.62,.84])oval(chrome,[side*.316,y,z],[.016,.016,.016]);}
 // Low front ram, fork armour and blunt steel spikes.
 tube([-.46,.45,-1.30],[.46,.45,-1.30],.055,black);for(const side of [-1,1])tube([side*.34,.45,-1.30],[side*.18,.68,-.85],.035,steel);
 for(let i=-2;i<=2;i++){const spike=part(new THREE.ConeGeometry(.07,.32,6),steel,i*.19,.45,-1.46);spike.rotation.x=-Math.PI/2;}
 const forkPlate=part(box,black,0,.80,-.88,.40,.24,.055);forkPlate.rotation.x=-.18;
 // Small warm lamps with protective cages; a tiny red rear brake lamp.
 for(const side of [-1,1]){const housing=part(new THREE.CylinderGeometry(.095,.095,.13,16),black,side*.12,1.025,-.64);housing.rotation.x=Math.PI/2;const lens=part(new THREE.CircleGeometry(.076,20),lamp,side*.12,1.025,-.71);lens.rotation.y=Math.PI;for(let i=-1;i<=1;i++)tube([side*.12+i*.04,.96,-.722],[side*.12+i*.04,1.09,-.722],.006,steel);}
 part(box,black,0,.88,.96,.26,.12,.10);part(box,redLamp,0,.90,1.018,.16,.04,.015);
 // Handlebar grips line up with the rider's hands.
 tube([-.57,1.16,-.52],[.57,1.16,-.52],.025,chrome);for(const side of [-1,1]){tube([side*.46,1.16,-.52],[side*.61,1.16,-.52],.035,rubber);tube([side*.47,1.19,-.57],[side*.60,1.19,-.57],.009,chrome);}
 // Compact mechanical gun pods, without glowing rails or energy effects.
 for(const side of [-1,1]){part(box,black,side*.34,.84,-.58,.17,.15,.20);for(let i=0;i<6;i++){const angle=i*Math.PI/3;const barrel=part(new THREE.CylinderGeometry(.015,.015,.39,8),steel,side*.34+Math.sin(angle)*.043,.84+Math.cos(angle)*.043,-.82);barrel.rotation.x=Math.PI/2;}const clamp=part(new THREE.TorusGeometry(.058,.013,6,12),black,side*.34,.84,-.96);}
 if(loadTextures&&typeof document!=='undefined'){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,128,128);ctx.fillStyle='#c7bea5';ctx.font='bold 88px Arial';ctx.textAlign='center';ctx.fillText('13',64,98);const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;const stencil=new THREE.MeshStandardMaterial({map,transparent:true,depthWrite:false,roughness:.9,side:THREE.DoubleSide});for(const side of [-1,1]){const number=part(new THREE.PlaneGeometry(.25,.22),stencil,side*.315,.75,.32);number.rotation.y=side*Math.PI/2;}}
 if(withRider){const rider=createRider(looks);bike.add(rider);bike.userData.rider=rider;}
 // Bake the fixed riding pose and mechanical details into one draw per material.
 // The complete bike still turns, jumps, spins and tumbles as a single 3D object.
 bike.updateMatrixWorld(true);const batches=new Map();bike.traverse(o=>{if(!o.isMesh)return;const geo=o.geometry.clone();geo.applyMatrix4(o.matrixWorld);if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(geo);});bike.clear();for(const [material,geometries] of batches){const geometry=mergeGeometries(geometries,false);for(const geo of geometries)geo.dispose();const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;bike.add(mesh);}
 return bike;
}
