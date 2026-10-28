import * as THREE from 'three';

// Anatomical riding pose, with separately shaped clothing, joints and full-face helmet.
export function createRider(looks){
 const rider=new THREE.Group();rider.name='anatomical-rider';
 const leather=looks.leather,armor=new THREE.MeshStandardMaterial({color:'#252b2e',map:looks.leatherMap,roughness:.76}),seam=new THREE.MeshStandardMaterial({color:'#70797b',roughness:.75}),rubber=new THREE.MeshStandardMaterial({color:'#101719',roughness:.88});
 const ball=new THREE.SphereGeometry(1,20,14);
 function ellipsoid(mat,p,s){const m=new THREE.Mesh(ball,mat);m.position.set(...p);m.scale.set(...s);rider.add(m);return m;}
 function limb(a,b,r1,r2,mat=leather){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from),m=new THREE.Mesh(new THREE.CylinderGeometry(r2,r1,delta.length(),16,4),mat);m.position.copy(from).add(to).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());rider.add(m);return m;}
 function piping(points,mat=seam,radius=.008){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),m=new THREE.Mesh(new THREE.TubeGeometry(curve,20,radius,6,false),mat);rider.add(m);return m;}
 const profile=[[.15,0],[.21,.04],[.215,.14],[.235,.30],[.285,.48],[.30,.59],[.275,.66],[.19,.70],[.11,.72]].map(([r,y])=>new THREE.Vector2(r,y));
 const jacket=new THREE.Mesh(new THREE.LatheGeometry(profile,28),leather);jacket.name='tapered-jacket';jacket.scale.z=.66;jacket.position.set(0,1.12,.28);jacket.rotation.x=-.36;rider.add(jacket);
 ellipsoid(leather,[0,1.08,.33],[.235,.16,.26]);
 ellipsoid(armor,[0,1.49,.29],[.145,.26,.045]);
 // Shoulder protectors, elbow pads, two-joint legs and proper ankle-high riding boots.
 for(const side of [-1,1]){
  const shoulder=[side*.275,1.72,.025],elbow=[side*.44,1.38,-.05],wrist=[side*.54,1.18,-.50];
  ellipsoid(leather,shoulder,[.11,.13,.11]);limb(shoulder,elbow,.105,.089);ellipsoid(armor,elbow,[.097,.10,.10]);limb(elbow,wrist,.087,.066);
  ellipsoid(leather,wrist,[.085,.069,.11]);
  for(let finger=0;finger<3;finger++){const x=side*(.49+finger*.031);limb([x,1.2,-.56],[x,1.14,-.57],.017,.015);}
  const hip=[side*.17,1.10,.36],knee=[side*.385,.76,-.10],ankle=[side*.34,.48,.28];
  limb(hip,knee,.13,.105);ellipsoid(armor,knee,[.115,.14,.115]);limb(knee,ankle,.103,.077);ellipsoid(leather,ankle,[.09,.15,.11]);
  const boot=ellipsoid(leather,[side*.34,.355,.13],[.105,.09,.235]);boot.rotation.x=.08;
  ellipsoid(rubber,[side*.34,.305,.12],[.11,.025,.23]);
  piping([[side*.19,1.2,.40],[side*.24,1.41,.40],[side*.25,1.63,.25],[side*.20,1.76,.15]]);
  piping([[side*.25,1.73,.13],[side*.31,1.69,.08],[side*.35,1.62,-.02]],looks.trim,.014);
 }
 limb([0,1.77,.035],[0,1.91,-.16],.095,.09,rubber);
 const helmet=ellipsoid(looks.helmet,[0,2.005,-.18],[.225,.265,.255]);helmet.name='full-face-helmet';helmet.rotation.x=-.12;
 const visor=new THREE.Mesh(new THREE.SphereGeometry(.232,32,16,Math.PI,Math.PI,Math.PI*.31,Math.PI*.29),looks.visor);visor.position.set(0,2.005,-.19);visor.scale.set(1,1.08,1.12);rider.add(visor);
 const chin=new THREE.Mesh(new THREE.SphereGeometry(.234,28,12,Math.PI,Math.PI,Math.PI*.60,Math.PI*.24),looks.helmet);chin.position.set(0,2.015,-.20);chin.scale.set(1,.99,1.17);rider.add(chin);
 piping([[-.11,1.87,-.39],[0,1.85,-.425],[.11,1.87,-.39]],rubber,.012);
 for(const side of [-1,1])ellipsoid(rubber,[side*.11,2.035,.057],[.052,.012,.012]);
 ellipsoid(looks.trim,[0,2.055,.072],[.045,.014,.007]);
 rider.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
 return rider;
}
