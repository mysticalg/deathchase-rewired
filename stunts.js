export function stepLean(value,back,front,airborne,dt){if(back&&!front)return Math.min(airborne?Math.PI/2:.65,value+dt*1.35);if(front&&!back)return Math.max(-.95,value-dt*1.5);if(!airborne)return Math.abs(value)<dt?0:value-Math.sign(value)*dt;return value;}
export function takeoffForce(base,lean,backHeld){return base*(1+.8*Math.max(lean,backHeld?.35:0));}
export function unsafeTakeoff(lean,forwardHeld){return lean<-.28||forwardHeld;}
