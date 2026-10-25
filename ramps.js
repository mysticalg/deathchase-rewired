import * as THREE from 'three';
export const RAMP_SPECS=[
 {x:-18,z:-48,yaw:0,length:12,width:9,degrees:16},
 {x:30,z:-120,yaw:0,length:20,width:12,degrees:30},
 {x:100,z:-230,yaw:.4,length:28,width:14,degrees:45},
 {x:-110,z:-270,yaw:-.5,length:18,width:10,degrees:24},
 {x:180,z:90,yaw:Math.PI,length:32,width:16,degrees:52},
 {x:-210,z:130,yaw:2,length:24,width:12,degrees:38},
 {x:330,z:-110,yaw:1.4,length:14,width:8,degrees:20},
 {x:-350,z:-150,yaw:-1,length:30,width:14,degrees:48},
 {x:40,z:310,yaw:3,length:16,width:10,degrees:28},
 {x:390,z:330,yaw:2.5,length:26,width:14,degrees:42},
 {x:-370,z:370,yaw:-2,length:22,width:12,degrees:35},
 {x:0,z:-460,yaw:0,length:36,width:18,degrees:55}
];
export function rampLocal(r,x,z){const dx=x-r.x,dz=z-r.z;return {along:dx*Math.sin(r.yaw)-dz*Math.cos(r.yaw),side:dx*Math.cos(r.yaw)+dz*Math.sin(r.yaw)};}
export function rampLift(r,x,z){const p=rampLocal(r,x,z);return Math.abs(p.side)<=r.width/2&&Math.abs(p.along)<=r.length/2?(p.along/r.length+.5)*r.height:0;}
export function rampCrossing(r,ax,az,bx,bz){const a=rampLocal(r,ax,az),b=rampLocal(r,bx,bz),lip=r.length/2;if(a.along>=lip||b.along<lip||b.along<=a.along)return false;const t=(lip-a.along)/(b.along-a.along);return Math.abs(a.side+(b.side-a.side)*t)<r.width/2;}
export function rampForce(speed,degrees){return Math.min(52,8+speed*Math.sin(degrees*Math.PI/180)*.72);}
export function createRamps(scene,height,urban=false){const deck=new THREE.MeshStandardMaterial({color:'#666b65',roughness:.8,metalness:.25}),edge=new THREE.MeshStandardMaterial({color:'#e4a13e',roughness:.7});
 return RAMP_SPECS.map((original,i)=>{const spec=urban?{...original,x:[0,90,-90,180,-180,270,-270,360,-360,90,-90,0][i],z:[-45,-135,-225,135,225,-315,315,45,-45,405,-405,-495][i],yaw:i%3===2?Math.PI:0}:original;const r={...spec,height:Math.tan(spec.degrees*Math.PI/180)*spec.length,cooldown:0},group=new THREE.Group(),vertices=[];
  const point=(side,along,up)=>{const x=r.x+Math.cos(r.yaw)*side+Math.sin(r.yaw)*along,z=r.z+Math.sin(r.yaw)*side-Math.cos(r.yaw)*along;return [x,height(x,z)+up+.06,z];};
  const tri=(a,b,c)=>vertices.push(...a,...b,...c);
  for(let j=0;j<12;j++){const a=-r.length/2+j*r.length/12,b=a+r.length/12,ha=(j/12)*r.height,hb=((j+1)/12)*r.height;const p=point(-r.width/2,a,ha),q=point(r.width/2,a,ha),s=point(-r.width/2,b,hb),t=point(r.width/2,b,hb);tri(p,q,s);tri(q,t,s);for(const side of [-r.width/2,r.width/2]){tri(point(side,a,0),point(side,b,hb),point(side,a,ha));tri(point(side,a,0),point(side,b,0),point(side,b,hb));}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();deck.side=THREE.DoubleSide;const surface=new THREE.Mesh(geo,deck);surface.receiveShadow=true;group.add(surface);
  for(const side of [-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(.22,.16,Math.hypot(r.length,r.height)),edge);const pos=point(side*(r.width/2-.15),0,r.height/2+.1);rail.position.set(...pos);rail.rotation.set(spec.degrees*Math.PI/180,-r.yaw,0,'YXZ');group.add(rail);}
  // Bright lip and approach stripes make the launch direction readable.
  for(let j=0;j<4;j++){const marker=new THREE.Mesh(new THREE.BoxGeometry(r.width*.75,.08,.24),edge),along=-r.length/2+1+j*1.3;marker.position.set(...point(0,along,(along/r.length+.5)*r.height+.05));marker.rotation.set(spec.degrees*Math.PI/180,-r.yaw,0,'YXZ');group.add(marker);}
  scene.add(group);r.group=group;return r;
 });
}
