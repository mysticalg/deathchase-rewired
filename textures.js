import {assetUrl} from './assets.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function applyForestTextures({THREE,scene,renderer,mats,trees,ground}){
 const loader=new THREE.TextureLoader();
 function repeat(path,u,v){let tex=loader.load(assetUrl(path));tex.colorSpace=THREE.SRGBColorSpace;tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(u,v);tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return tex}
 const floor=repeat('/forest-floor.png',70,80);mats.ground.onBeforeCompile=()=>{};mats.ground.map=floor;mats.ground.color.set('#b0b9a3');mats.ground.bumpMap=floor;mats.ground.bumpScale=.18;mats.ground.roughness=.97;mats.ground.needsUpdate=true;
 const bark=repeat('/bark.png',2,5);mats.bark.map=bark;mats.bark.bumpMap=bark;mats.bark.bumpScale=.16;mats.bark.color.set('#a4aca4');mats.bark.needsUpdate=true;
 const foliage=loader.load(assetUrl('/spruce.png'));foliage.colorSpace=THREE.SRGBColorSpace;foliage.anisotropy=4;
 const leaves=new THREE.MeshStandardMaterial({map:foliage,alphaTest:.4,side:THREE.DoubleSide,roughness:.94,color:'#bdcbb8',emissive:'#25382d',emissiveMap:foliage,emissiveIntensity:.32});
 const geos=[];for(let level=0;level<9;level++){let width=(1-level/10)*7.5;for(let a=0;a<3;a++){const p=new THREE.PlaneGeometry(width,2.2);p.rotateX(-.18);p.rotateY(a*Math.PI/3+level*.77);p.translate(0,6+level*2.1,0);geos.push(p)}}const canopy=mergeGeometries(geos);geos.forEach(g=>g.dispose());
 for(let t of trees){if(!t.userData.r)continue;let h=t.children[0].geometry.parameters.height;for(let c of [...t.children])if(c.geometry?.type==='ConeGeometry'){t.remove(c);c.geometry.dispose()}let crown=new THREE.Mesh(canopy,leaves);crown.scale.set(1,h/24,1);crown.rotation.y=(t.position.x*13)%6.28;t.add(crown)}
 // Layered ground wisps reuse the photographic alpha material.
 const fernGeo=new THREE.PlaneGeometry(1.3,.7);fernGeo.translate(0,.28,0);for(let i=0;i<trees.length;i+=3){let t=trees[i];if(!t.userData.r)continue;for(let a=0;a<2;a++){let fern=new THREE.Mesh(fernGeo,leaves);fern.position.set(1.5,0,.5);fern.rotation.y=a*Math.PI/2;t.add(fern)}}
 return floor;
}

