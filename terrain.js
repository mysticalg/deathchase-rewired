import * as THREE from 'three';
// The same world-space height function drives mesh, actors and bike physics.
export function terrainHeight(x,z){const broad=Math.sin(z*.024)*3.6+Math.sin(z*.051+x*.019)*1.4;const valleys=Math.sin(x*.043+z*.009)*2.8;const crest=Math.pow(Math.max(0,Math.sin(z*.068)),10)*2.7;return broad+valleys+crest;}
export function createTerrain(ground){ground.geometry.dispose();ground.geometry=new THREE.PlaneGeometry(450,500,130,170);const pos=ground.geometry.attributes.position;return travel=>{for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=-pos.getY(i)-180;pos.setZ(i,terrainHeight(x,z-travel));}pos.needsUpdate=true;ground.geometry.computeVertexNormals();};}
