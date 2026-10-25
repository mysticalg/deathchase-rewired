export function riderDecision(distance,speed){if(distance>125)return {mode:'PATROL',fire:false,interval:2.2,topSpeed:14};if(speed<20)return {mode:'PRESSURE',fire:true,interval:.65,topSpeed:16};return {mode:'LURE',fire:true,interval:2.2,topSpeed:80};}
export function advanceJump(offset,velocity,dt){if(offset<=0)return {offset:0,velocity:0,landed:false};velocity-=16*dt;offset+=velocity*dt;return offset<=0?{offset:0,velocity:0,landed:true}:{offset,velocity,landed:false};}
export function jumpStrength(speed,log=false){return log?Math.min(48,26+speed*.28):10+Math.min(4,speed*.06);}
export function pointSegmentDistance(x,z,ax,az,bx,bz){const dx=bx-ax,dz=bz-az,l=dx*dx+dz*dz,t=l?Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/l)):0;return Math.hypot(x-(ax+t*dx),z-(az+t*dz));}
