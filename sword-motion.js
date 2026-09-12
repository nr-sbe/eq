/* Authored three-strike choreography and a bounded blade-following trail. */
(function(root){'use strict';
 const clamp=v=>Math.max(0,Math.min(1,v)),smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
 const ready={hand:[-.5,1.35,.45],tip:[-.9,2.9,1],left:[.55,1.6,.4],twist:0,lean:0,sink:0};
 const cuts=[
  [{hand:[-.9,2.0,.05],tip:[-1.65,3.45,-.4],left:[.5,1.7,.35],twist:-.48,lean:-.07,sink:.05},
   {hand:[.75,1.15,.8],tip:[2.4,.55,1.1],left:[.3,1.45,.8],twist:.6,lean:.14,sink:.13}],
  [{hand:[.7,1.05,.8],tip:[2.2,.2,.9],left:[.45,1.5,.6],twist:.5,lean:.1,sink:.14},
   {hand:[-.8,1.95,.7],tip:[-1.8,3.35,1.25],left:[.4,1.9,.5],twist:-.65,lean:-.05,sink:.03}],
  [{hand:[-.05,2.4,.05],tip:[-.1,4.3,-.55],left:[.08,2.25,.12],twist:-.18,lean:-.15,sink:.02},
   {hand:[.05,.95,1.15],tip:[.15,.05,2.9],left:[.12,1.05,1.0],twist:.12,lean:.27,sink:.24}]
 ];
 function blend(a,b,u){const out={};for(const key of Object.keys(ready))out[key]=Array.isArray(a[key])?a[key].map((v,i)=>v+(b[key][i]-v)*u):a[key]+(b[key]-a[key])*u;return out;}
 function pose(combo,progress){const t=clamp(progress),[wind,follow]=cuts[Math.max(0,Math.min(2,combo-1))];let p;
  if(t<.18)p=blend(ready,wind,smooth(t/.18));
  else if(t<.62)p=blend(wind,follow,smooth((t-.18)/.44));
  else p=blend(follow,ready,smooth((t-.62)/.38));
  p.trail=t>.19&&t<.76;p.phase=t<.18?'windup':t<.62?'strike':'recover';return p;
 }
 class SwordTrail{
  constructor(scene){const T=root.THREE;this.T=T;this.samples=[];this.capacity=24;this.positions=new Float32Array(24*2*3);this.colors=new Float32Array(24*2*3);this.geometry=new T.BufferGeometry();this.geometry.setAttribute('position',new T.BufferAttribute(this.positions,3).setUsage(T.DynamicDrawUsage));this.geometry.setAttribute('color',new T.BufferAttribute(this.colors,3).setUsage(T.DynamicDrawUsage));const indices=[];for(let i=0;i<23;i++){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}this.geometry.setIndex(indices);this.material=new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.82,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});this.mesh=new T.Mesh(this.geometry,this.material);this.mesh.frustumCulled=false;this.mesh.visible=false;scene.add(this.mesh);}
  update(time,segment,active,element,combo,gentle){const T=this.T;if(combo!==this.combo&&active){this.samples=[];this.combo=combo;}const life=combo===3?.22:.16;this.samples=this.samples.filter(s=>time-s.time<life);
   if(active&&segment){this.samples.push({time,base:segment.base.clone(),tip:segment.tip.clone(),element});if(this.samples.length>this.capacity)this.samples.shift();}
   const palette=['#cdeee0','#ff9134','#b58aff','#79dced','#dbb477'];
   this.samples.forEach((s,i)=>{const color=new T.Color(palette[s.element]||'#bdd9e0'),fade=1-(time-s.time)/life;for(let j=0;j<2;j++){const v=j?s.tip:s.base,k=(i*2+j)*3;this.positions[k]=v.x;this.positions[k+1]=v.y;this.positions[k+2]=v.z;const c=color.clone().lerp(new T.Color('#ffffff'),j?.18:0).multiplyScalar(fade*(j?1:.14));this.colors[k]=c.r;this.colors[k+1]=c.g;this.colors[k+2]=c.b;}});
   this.geometry.setDrawRange(0,Math.max(0,this.samples.length-1)*6);this.geometry.attributes.position.needsUpdate=true;this.geometry.attributes.color.needsUpdate=true;this.material.opacity=gentle?.34:.6;this.mesh.visible=this.samples.length>1;
  }
  reset(){this.samples=[];this.mesh.visible=false;this.geometry.setDrawRange(0,0);}
  dispose(){this.mesh.removeFromParent();this.geometry.dispose();this.material.dispose();}
 }
 root.SwordMotion={pose,SwordTrail};if(typeof module==='object'&&module.exports)module.exports={pose,SwordTrail};
})(typeof window==='object'?window:globalThis);
