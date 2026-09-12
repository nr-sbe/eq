/* Element-specific accents use fixed instance pools; combat owns all hit results. */
(()=>{'use strict';const T=THREE,TAU=Math.PI*2;
class ImpactFX{
 constructor(scene){this.root=new T.Group();scene.add(this.root);this.jobs=[];this.last=Array(5).fill(-99);this.dummy=new T.Object3D();this.meshes={};
  const flame=new T.Shape();flame.moveTo(-.5,0);flame.bezierCurveTo(-.8,1,.4,1.1,-.15,2.6);flame.bezierCurveTo(1,1.5,.8,.5,.5,0);flame.closePath();
  const definitions=[['air',new T.TorusGeometry(1,.045,5,32,Math.PI*1.55),'#e4fff2',80,.75],['fire',new T.ShapeGeometry(flame,10),'#ff963e',100,.85],['foam',new T.IcosahedronGeometry(1,0),'#c9eff2',240,.7],['stone',new T.DodecahedronGeometry(1,0),'#998366',140,1],['embers',new T.IcosahedronGeometry(1,0),'#ffd389',160,.9]];
  for(const [key,geo,color,capacity,opacity] of definitions){const mat=key==='stone'?new T.MeshStandardMaterial({color,roughness:.8,metalness:.15}):new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide,blending:key==='fire'||key==='embers'?T.AdditiveBlending:T.NormalBlending});const mesh=new T.InstancedMesh(geo,mat,capacity);mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.count=0;this.root.add(mesh);this.meshes[key]=mesh;}
 }
 event(e,time){if(e.type==='ignition')e={...e,type:'cast',dx:0,dz:1,range:0,impactX:e.x,impactZ:e.z,critical:true};if(e.type!=='cast'||e.sword||e.element===2)return;const interval=[.17,.25,.3,.3,.4][e.element];if(time-this.last[e.element]<interval&&!e.critical)return;this.last[e.element]=time;this.jobs.push({...e,birth:time,life:e.element===0?.6:e.element===3?1.1:.9,power:Math.min(1.8,1+(e.tier-1)*.075+(e.specialization?.control||0)*.15)});if(this.jobs.length>24)this.jobs.shift();}
 put(key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const mesh=this.meshes[key];if(mesh.count>=mesh.instanceMatrix.count)return;const d=this.dummy;d.position.set(x,y,z);d.scale.set(sx,sy,sz);d.rotation.set(rx,ry,rz);d.updateMatrix();mesh.setMatrixAt(mesh.count++,d.matrix);}
 update(time,game,gentle=false){for(const mesh of Object.values(this.meshes))mesh.count=0;this.jobs=this.jobs.filter(j=>time-j.birth<j.life);
  for(const j of this.jobs){const age=time-j.birth,u=age/j.life,fade=Math.max(0,1-u),power=j.power,tx=j.impactX??j.x+j.dx*j.range,tz=j.impactZ??j.z+j.dz*j.range,y=game.walkHeight(tx,tz),yaw=Math.atan2(j.dx,j.dz),sideX=j.dz,sideZ=-j.dx;
   if(j.element===0){const reach=Math.min(j.range,age*75),radius=(1.3+u*3)*power;for(let i=0;i<(j.critical?5:3);i++){const z=reach-i*1.2;this.put('air',j.x+j.dx*z,2.6+(j.y||0),j.z+j.dz*z,radius*(1-i*.1),radius*.65,fade,0,yaw,time*15+i*1.4);}}
   if(j.element===1){const eruption=Math.sin(Math.PI*Math.min(1,u*1.6));for(let i=0;i<(gentle?4:7);i++){const a=i*2.4,r=(1+u*3)*power;this.put('fire',tx+Math.sin(a)*r,y-.15,tz+Math.cos(a)*r,power*fade,(.6+eruption*2.8)*power,1,0,yaw+a,Math.sin(a)*.22);}for(let i=0;i<(gentle?8:18);i++){const a=i*2.4,r=u*(3+i%4)*power,s=(.08+i%3*.025)*fade;this.put('embers',tx+Math.sin(a)*r,y+u*(7+i%5)-u*u*5,tz+Math.cos(a)*r,s,s*3,s,u*8,a,time*3);}}
   if(j.element===3){for(let i=0;i<(gentle?16:32);i++){const a=i*2.4+u*6,r=(1-u*.55)*(2+i%5)*power;this.put('foam',tx+Math.sin(a)*r,y+.08+Math.sin(u*Math.PI)*(i%3)*.4,tz+Math.cos(a)*r,.12*fade,.06*fade,(.6+u)*power,0,-a,0);}for(let i=0;i<12;i++){const along=i/12*j.range,side=Math.sin(i*3+u*7)*6*power;this.put('foam',j.x+j.dx*along+sideX*side,(j.y||0)+.12+Math.sin(u*Math.PI)*1.3,j.z+j.dz*along+sideZ*side,.12*fade,.1*fade,1.3*fade,0,yaw,0);}}
   if(j.element===4){for(let i=0;i<(gentle?12:24);i++){const ray=i%4,step=Math.floor(i/4),a=ray*TAU/4+yaw+.4,delay=step*.075,v=Math.max(0,(age-delay)/.6),rise=Math.sin(Math.min(1,v)*Math.PI),r=(1+step*1.25)*power;this.put('stone',tx+Math.sin(a)*r,y-.4+rise*(1.5+step*.25)*power,tz+Math.cos(a)*r,.38*power*fade,(.5+rise*1.2)*power*fade,.6*power*fade,Math.sin(a)*.35,a,.2);}}
  }
  for(const mesh of Object.values(this.meshes))mesh.instanceMatrix.needsUpdate=true;
 }
 reset(){this.jobs=[];this.last.fill(-99);for(const mesh of Object.values(this.meshes))mesh.count=0;}
}
window.ImpactFX=ImpactFX;})();
