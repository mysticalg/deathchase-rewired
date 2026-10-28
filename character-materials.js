import {assetUrl} from './assets.js';
import * as THREE from 'three';
export function createCharacterMaterials(load=true){
 const texture=(path,tile=true)=>{const t=load?new THREE.TextureLoader().load(assetUrl(path)):new THREE.Texture();t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(tile){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);}return t;};
 const leatherMap=texture('/character-leather.png'),fabricMap=texture('/character-fabric.png'),faceMap=texture('/character-face.png',false);
 const cloth=color=>new THREE.MeshStandardMaterial({color,map:fabricMap,bumpMap:fabricMap,bumpScale:.008,roughness:.91});
 const leather=new THREE.MeshStandardMaterial({color:'#d1d4d7',map:leatherMap,bumpMap:leatherMap,bumpScale:.012,roughness:.66});
 const jackets=['#cba16e','#8da175','#7795ad','#c9bca0','#bd817a','#aab6b8'].map(cloth),trousers=['#536170','#787163','#4b5157'].map(cloth),skin=['#c5a185','#9b7253','#d5b59a','#80553e'].map(color=>new THREE.MeshStandardMaterial({color,roughness:.85}));
 const faces=['#ffffff','#c6a186','#f2dbcb','#a57a60'].map(color=>new THREE.MeshStandardMaterial({color,map:faceMap,roughness:.85}));
 const hair=['#30231c','#161a1b','#77624b','#9c9690'].map(color=>new THREE.MeshStandardMaterial({color,roughness:1}));
 const helmet=new THREE.MeshStandardMaterial({color:'#28323b',metalness:.4,roughness:.25}),visor=new THREE.MeshStandardMaterial({color:'#54818c',metalness:.75,roughness:.1}),trim=new THREE.MeshStandardMaterial({color:'#aeb8b9',roughness:.5});
 return {leatherMap,fabricMap,faceMap,leather,jackets,trousers,skin,faces,hair,helmet,visor,trim};
}
export function addFace(parent,looks,index,y=1.65){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.182,16,12,Math.PI,Math.PI),looks.faces[index%looks.faces.length]);mesh.position.set(0,y,-.008);mesh.scale.set(1,1.2,.96);parent.add(mesh);return mesh;}
