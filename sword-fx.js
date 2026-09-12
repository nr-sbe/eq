/* Blade enchantments and confirmed-contact effects. Fixed pools, no combat decisions. */
(()=>{'use strict';const T=THREE;
class SwordElementFX{
 constructor(scene){this.root=new T.Group();scene.add(this.root);this.jobs=[];this.meshes={};this.dummy=new T.Object3D();
  const flame=new T.Shape();flame.moveTo(-.35,0);flame.bezierCurveTo(-.55,.5,.35,.8,0,1.6);flame.bezierCurveTo(.65,.7,.5,.1,.35,0);flame.closePath();
  for(const [key,geo,color,solid] of [
   ['wind',new T.TorusGeometry(1,.035,4,24,Math.PI*1.6),'#d8fff0'],
   ['flame',new T.ShapeGeometry(flame,6),'#ff792b'],
   ['ember',new T.IcosahedronGeometry(1,0),'#ffd17c'],
   ['bolt',new T.BoxGeometry(1,1,1),'#bb81ff'],
   ['wave',new T.TorusGeometry(1,.12,5,24,Math.PI*1.35),'#39bde7'],
   ['foam',new T.IcosahedronGeometry(1,0),'#e2f9ff'],
   ['stone',new T.OctahedronGeometry(1,0),'#bc9669',true]]){
   const mat=solid?new T.MeshStandardMaterial({color,roughness:.8,metalness:.12}):new T.MeshBasicMaterial({color,transparent:true,opacity:.82,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});
   const m=new T.InstancedMesh(geo,mat,192);m.count=0;m.frustumCulled=false;m.instanceMatrix.setUsage(T.DynamicDrawUsage);this.meshes[key]=m;this.root.add(m);
  }
 }
 put(key,p,x,y=x,z=x,rx=0,ry=0,rz=0){const m=this.meshes[key];if(m.count>=m.instanceMatrix.count)return;const d=this.dummy;d.position.copy(p);d.scale.set(x,y,z);d.rotation.set(rx,ry,rz);d.updateMatrix();m.setMatrixAt(m.count++,d.matrix);}
 line(a,b,width){const m=this.meshes.bolt;if(m.count>=m.instanceMatrix.count)return;const d=this.dummy;d.position.copy(a).add(b).multiplyScalar(.5);d.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),b.clone().sub(a).normalize());d.scale.set(width,a.distanceTo(b),width);d.updateMatrix();m.setMatrixAt(m.count++,d.matrix);}
 event(e,time){if(e.type!=='swordcontact')return;this.jobs.push({...e,birth:time,life:e.element===4?.65:.45});if(this.jobs.length>20)this.jobs.shift();}
 update(time,segment,element,active,tier,gentle,game){
  for(const m of Object.values(this.meshes))m.count=0;
  const strength=Math.min(1.8,1+(tier-1)*.1),count=gentle?4:7;
  if(segment){const direction=segment.tip.clone().sub(segment.base).normalize();
   const side=new T.Vector3().crossVectors(direction,new T.Vector3(0,0,1)).normalize();if(side.lengthSq()<.01)side.set(1,0,0);
   let last=segment.base.clone();
   for(let i=0;i<count;i++){const u=(i+1)/count,p=segment.base.clone().lerp(segment.tip,u),a=time*9+i*2.4,s=(active?.3:.12)*strength;
    if(element===0)this.put('wind',p,s*(1+u),s*.55,1,time*4,i, a);
    if(element===1){this.put('flame',p,s, s*(1.5+Math.sin(a)*.4),s,0,a,-.4);this.put('ember',p.clone().addScaledVector(side,Math.sin(a)*s*2),.035,.07,.035);}
    if(element===2){p.addScaledVector(side,Math.sin(Math.floor(time*(gentle?8:18))+i*7)*s);this.line(last,p,active?.065:.035);if(i%2===0)this.line(p,p.clone().addScaledVector(side,s*2).addScaledVector(direction,-.25),.024);last=p;}
    if(element===3){this.put('wave',p,s,s*.55,1,.3,a,a);this.put('foam',p.clone().addScaledVector(side,Math.sin(a)*s),.045,.08,.045);}
    if(element===4){p.addScaledVector(side,Math.sin(a)*s);this.put('stone',p,s*.55,s*1.7,s*.55,a,0,.5);}
   }
  }
  this.jobs=this.jobs.filter(j=>time-j.birth<j.life);
  for(const j of this.jobs){const u=(time-j.birth)/j.life,f=1-u,scale=Math.min(1.8,(1+(j.tier-1)*.1)*(j.combo===3?1.3:1)),center=new T.Vector3(j.x,game.walkHeight(j.x,j.z)+3.2,j.z),n=gentle?5:10;
   for(let i=0;i<n;i++){const a=i*2.4,r=(.3+u*3)*scale,p=center.clone().add(new T.Vector3(Math.sin(a)*r,Math.cos(a)*r*.65,Math.cos(i*7)*r*.5));
    if(j.element===0)this.put('wind',center,(.6+u*4)*scale,(.3+u*1.5)*scale,f,a*.1,i*.1,a);
    if(j.element===1){this.put('flame',p,.45*f*scale,(.7+u)*f*scale,.4,0,a,a*.2);this.put('ember',p,.06*f,.2*f,.06*f);}
    if(j.element===2){const mid=center.clone().lerp(p,.5).add(new T.Vector3(Math.cos(a)*.35,.3,Math.sin(a)*.35));this.line(center,mid,.075*f);this.line(mid,p,.055*f);}
    if(j.element===3){this.put('wave',center,(.4+u*3)*scale,(.4+u*2)*scale,f,.2,i*.08,a*.15);this.put('foam',p,.15*f,.3*f,.15*f);}
    if(j.element===4){p.y=game.walkHeight(j.x,j.z)+.15+Math.sin(u*Math.PI)*(1+i%3)*scale;this.put('stone',p,.35*f*scale,(.6+i%3*.2)*f*scale,.35*f,a,u*8,a);}
   }
  }
  for(const m of Object.values(this.meshes))m.instanceMatrix.needsUpdate=true;
 }
 reset(){this.jobs=[];for(const m of Object.values(this.meshes))m.count=0;}
 dispose(){this.root.removeFromParent();for(const m of Object.values(this.meshes)){m.geometry.dispose();m.material.dispose();}this.jobs=[];}
}
window.SwordElementFX=SwordElementFX;
})();
