import * as THREE from 'three';
export function createMilitary(mesh,mats,scene){
 const armor=new THREE.MeshStandardMaterial({color:'#48564c',metalness:.55,roughness:.65});
 const glass=new THREE.MeshStandardMaterial({color:'#193b49',metalness:.8,roughness:.16});
 const tank=new THREE.Group();
 mesh(new THREE.BoxGeometry(3.2,.9,4.8),armor,tank,0,.9,0);
 for(let side of [-1,1]){mesh(new THREE.BoxGeometry(.65,1.1,5),mats.rubber,tank,side*1.7,.55,0);for(let z=-1.8;z<=1.8;z+=.72){let w=mesh(new THREE.CylinderGeometry(.43,.43,.7,12),armor,tank,side*1.72,.55,z);w.rotation.z=Math.PI/2}}
 const turret=new THREE.Group();tank.add(turret);turret.position.y=1.8;mesh(new THREE.CylinderGeometry(1.05,1.3,.7,10),armor,turret);const barrel=mesh(new THREE.CylinderGeometry(.13,.16,3.8,12),armor,turret,0,.12,2);barrel.rotation.x=Math.PI/2;mesh(new THREE.BoxGeometry(.5,.16,.1),mats.orange,tank,0,1.5,2.45);
 const heli=new THREE.Group();let hull=mesh(new THREE.SphereGeometry(1,20,12),armor,heli);hull.scale.set(1.1,.9,2.6);let wind=mesh(new THREE.SphereGeometry(.86,16,10),glass,heli,0,.1,1.5);wind.scale.set(.9,.8,1);mesh(new THREE.BoxGeometry(.28,.32,4.3),armor,heli,0,.3,-3.3);mesh(new THREE.BoxGeometry(.12,1.7,.9),armor,heli,0,.8,-5.1);
 for(let side of [-1,1]){mesh(new THREE.BoxGeometry(.12,.12,4),armor,heli,side*1.2,-1.1,0);for(let z of [-1,1])mesh(new THREE.BoxGeometry(.12,.8,.12),armor,heli,side*.9,-.7,z);mesh(new THREE.BoxGeometry(1.7,.17,.45),armor,heli,side*1.2,-.2,-.2);mesh(new THREE.BoxGeometry(.3,.14,.12),mats.orange,heli,side*1.8,-.15,.1)}
 const rotor=new THREE.Group();heli.add(rotor);rotor.position.y=1.2;mesh(new THREE.CylinderGeometry(.12,.12,.7,8),armor,rotor);for(let a of [0,Math.PI/2]){let blade=mesh(new THREE.BoxGeometry(8.7,.045,.18),armor,rotor,0,.35,0);blade.rotation.y=a}heli.userData.rotor=rotor;
 tank.userData.kind='TANK';heli.userData.kind='HELICOPTER';scene.add(tank,heli);return [tank,heli];
}
