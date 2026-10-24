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
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=576;const c=canvas.getContext('2d');const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const bezel=new THREE.Mesh(new THREE.BoxGeometry(.74,.29,.035),new THREE.MeshStandardMaterial({color:'#141c24',metalness:.65,roughness:.35}));bezel.position.set(0,.27,.10);bezel.rotation.x=-.24;cockpit.add(bezel);
 const screen=new THREE.Mesh(new THREE.PlaneGeometry(.70,.2625),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));screen.position.copy(bezel.position);screen.position.z+=.021;screen.rotation.x=bezel.rotation.x;cockpit.add(screen);
 let last=0;return state=>{if(performance.now()-last<50)return;last=performance.now();const {speed,reserve,level,hull,score,heading,enemies,trees,pickups,x,z,airborne,mapFull,logs,forestAt}=state;
 c.fillStyle='#061319';c.fillRect(0,0,1536,576);c.strokeStyle='#12333d';c.lineWidth=1;for(let y=0;y<576;y+=24){c.beginPath();c.moveTo(0,y);c.lineTo(1536,y);c.stroke();}c.strokeStyle='#37717b';c.lineWidth=3;c.strokeRect(12,12,1512,552);c.beginPath();c.moveTo(470,90);c.lineTo(470,530);c.moveTo(1030,90);c.lineTo(1030,530);c.stroke();
 function text(t,x,y,size=30,color='#8fb5bd',align='left'){c.font='600 '+size+'px Arial';c.textAlign=align;c.fillStyle=color;c.fillText(t,x,y)}
 text('DEATHCHASE // COMBAT SYSTEM',46,58,27,'#b8d6d9');text('SECTOR '+state.sector+(state.highBeam?' / HIGH BEAM':''),1490,58,24,'#f7bd67','right');
 // Heading tape follows actual lateral movement; zero is north along the chase.
 c.save();c.beginPath();c.rect(490,82,520,60);c.clip();for(let d=Math.floor(heading/15)*15-60;d<heading+75;d+=15){let px=750+(d-heading)*5;let n=(d%360+360)%360;text(n%90===0?['N','E','S','W'][n/90]:String(n),px,125,24,'#6c9ca7','center');}c.restore();text('▼',750,91,20,'#f7bd67','center');
 text('HULL',50,132,28);for(let i=0;i<5;i++){c.fillStyle=i<hull?'#55e69b':'#1b3940';c.fillRect(50+i*73,157,58,37);}text(hull+' / 5',420,190,26,'#8bc1bd','right');
 text('BOOST RESERVE',50,257,27);text(Math.round(reserve)+'%',420,257,27,'#47e6e1','right');c.fillStyle='#173840';c.fillRect(50,282,370,23);c.fillStyle='#32d9d7';c.fillRect(50,282,370*reserve/100,23);
 text('SCORE',50,374,28);text(String(Math.floor(score)).padStart(7,'0'),50,430,51,'#f8cb7d');text('GATLING MK '+level,50,503,28,'#d7e4df');text('ROUNDS '+String(state.rounds).padStart(5,'0'),50,543,21,'#789fa7');
 c.shadowColor='#0acbd5';c.shadowBlur=12;text(String(Math.round(speed)),750,350,173,'#ceffff','center');c.shadowBlur=0;text('KM/H',750,401,31,'#78b6c3','center');text(airborne?'AIR PITCH '+Math.round(state.lean*180/Math.PI)+'°':state.lean>.15?'WHEELIE '+Math.round(state.lean*180/Math.PI)+'°':state.lean<-.15?'LEANING FORWARD':state.pressure?'RIDERS: PRESSURE':'FREE ROAM',750,476,25,airborne?'#ffd47c':'#6ac9a8','center');text('SPACE JUMP · E / R LEAN · CLICK FIRE',750,527,18,'#84a8ae','center');
 const mx=1270,my=323,r=165,range=mapFull?900:160,scale=r/range,cx=mapFull?0:x,cz=mapFull?0:z;
 c.save();c.beginPath();c.arc(mx,my,r,0,Math.PI*2);c.clip();for(let sy=-r;sy<r;sy+=12)for(let sx=-r;sx<r;sx+=12){const wx=cx+sx/scale,wz=cz+sy/scale,dist=Math.hypot(wx,wz);c.fillStyle=dist>650?'#4c5053':forestAt(wx,wz)?'#183e30':'#3f4932';c.fillRect(mx+sx,my+sy,12,12);}c.strokeStyle='#41616a';for(let rr of [55,110,165]){c.beginPath();c.arc(mx,my,rr,0,Math.PI*2);c.stroke();}
 function dot(wx,wz,color,size){c.fillStyle=color;c.fillRect(mx+(wx-cx)*scale-size/2,my+(wz-cz)*scale-size/2,size,size);}for(const t of trees)if(t.visible)dot(t.position.x,t.position.z,'#507549',3);for(const log of logs)dot(log.position.x,log.position.z,'#d8ac67',5);for(const e of enemies)if(e.visible)dot(e.position.x,e.position.z,e.userData.kind==='HELICOPTER'?'#ffd16c':'#ef6f60',e.userData.kind==='GUNMAN'?6:9);for(const p of pickups)dot(p.position.x,p.position.z,'#5effa5',8);
 c.save();c.translate(mx+(x-cx)*scale,my+(z-cz)*scale);c.rotate(heading*Math.PI/180);c.fillStyle='#cafff8';c.beginPath();c.moveTo(0,-12);c.lineTo(-8,9);c.lineTo(8,9);c.closePath();c.fill();c.restore();c.restore();c.strokeStyle='#62888e';c.lineWidth=2;c.beginPath();c.arc(mx,my,r,0,Math.PI*2);c.stroke();text('N',mx,my-r-12,24,'#d6e6d9','center');text(mapFull?'WORLD MAP / M TO ZOOM':'LOCAL MAP / M TO ZOOM',mx,527,21,'#84a8ae','center');
 texture.needsUpdate=true;
 };
}
