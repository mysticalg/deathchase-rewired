import * as THREE from 'three';
export function buildRiderCockpit(cockpit,mats){
 const steering=new THREE.Group();cockpit.add(steering);
 const leatherMap=new THREE.TextureLoader().load('/riding-leather.png');leatherMap.colorSpace=THREE.SRGBColorSpace;leatherMap.wrapS=leatherMap.wrapT=THREE.RepeatWrapping;leatherMap.repeat.set(2,2);leatherMap.anisotropy=4;
 const sleeve=new THREE.MeshStandardMaterial({color:'#c5ccd3',map:leatherMap,bumpMap:leatherMap,bumpScale:.008,roughness:.83});
 const glove=new THREE.MeshStandardMaterial({color:'#929ba5',map:leatherMap,bumpMap:leatherMap,bumpScale:.005,roughness:.7});
 const armor=new THREE.MeshStandardMaterial({color:'#26313c',metalness:.35,roughness:.5});
 function part(geo,mat,pos){const m=new THREE.Mesh(geo,mat);m.position.set(...pos);steering.add(m);return m;}
 function tube(a,b,r,mat,r2=r){const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b);const m=part(new THREE.CylinderGeometry(r2,r,from.distanceTo(to),12),mat,from.clone().add(to).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),to.sub(from).normalize());return m;}
 // A recognisable curved handlebar, with rubber grips and control housings.
 tube([-.37,.07,-.06],[.37,.07,-.06],.025,mats.metal);
 for(const side of [-1,1]){
  tube([side*.35,.07,-.06],[side*.52,.12,.03],.028,mats.metal);
  tube([side*.46,.12,.03],[side*.67,.12,.03],.042,mats.rubber);
  tube([side*.81,-.43,.37],[side*.59,.035,.12],.105,sleeve,.079);
  tube([side*.63,-.04,.16],[side*.56,.08,.09],.083,sleeve,.074);
  const hand=part(new THREE.SphereGeometry(1,18,12),glove,[side*.545,.12,.045]);hand.scale.set(.115,.082,.13);hand.rotation.z=-side*.18;
  // Four fingers curl over and underneath the rubber handlebar grip.
  for(let finger=0;finger<4;finger++){
   const fx=side*(.47+finger*.045);
   tube([fx,.17,.01],[fx,.14,-.065],.019,glove);
   tube([fx,.14,-.065],[fx,.085,-.06],.018,glove);
   const knuckle=part(new THREE.SphereGeometry(.024,10,8),armor,[fx,.185,.015]);knuckle.scale.set(1,.55,1.15);
  }
  tube([side*.47,.11,.09],[side*.45,.055,.02],.028,glove);
  tube([side*.39,.09,-.035],[side*.39,.04,-.13],.014,mats.metal);

 }
 return steering;
}


export function createDashboard(cockpit){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=432;const context=canvas.getContext('2d');const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const bezel=new THREE.Mesh(new THREE.BoxGeometry(.39,.235,.035),new THREE.MeshStandardMaterial({color:'#111b24',metalness:.65,roughness:.35}));bezel.position.set(0,.27,.22);bezel.rotation.x=-.28;cockpit.add(bezel);
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(.354,.199),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.copy(bezel.position);screen.position.z+=.020;screen.rotation.x=bezel.rotation.x;cockpit.add(screen);
 let previous='';return (speed,reserve,level=1)=>{const key=Math.round(speed)+':'+Math.round(reserve/5)+':'+level;if(key===previous)return;previous=key;context.fillStyle='#031820';context.fillRect(0,0,768,432);context.strokeStyle='#1cbebc';context.lineWidth=5;context.strokeRect(15,15,738,402);context.textAlign='center';context.fillStyle='#b6ffff';context.shadowColor='#00e5e5';context.shadowBlur=14;context.font='italic 800 220px Arial';context.fillText(String(Math.round(speed)),384,265);context.shadowBlur=0;context.fillStyle='#78c5d2';context.font='600 43px Arial';context.fillText('KM/H',384,330);context.fillStyle='#183f49';context.fillRect(68,365,632,17);context.fillStyle='#19e8db';context.fillRect(68,365,632*reserve/100,17);context.fillStyle='#7ab6c1';context.font='600 23px Arial';context.fillText('CANNON MK '+level,384,410);texture.needsUpdate=true;};
}

