/* Health-loss events only; pooled screen labels never determine combat results. */
(function(root){'use strict';
 class DamageNumbers{
  constructor(container,doc=root.document){this.container=container;this.labels=[];this.sequence=0;this.point=new root.THREE.Vector3();for(let i=0;i<48;i++){const el=doc.createElement('span');el.className='damage-number';el.hidden=true;container.appendChild(el);this.labels.push({el,active:false});}}
  event(e,time){if(e.type!=='damage'||!(e.amount>0)||!Number.isFinite(e.amount))return;
   let label=this.labels.find(l=>l.active&&l.id===e.id&&l.element===e.element&&time-l.birth<.18);
   if(label)label.amount+=e.amount;
   else{const sameEnemy=this.labels.filter(l=>l.active&&l.id===e.id);label=sameEnemy.length>=2?sameEnemy.reduce((a,b)=>a.birth<b.birth?a:b):this.labels.find(l=>!l.active)||this.labels.reduce((a,b)=>a.birth<b.birth?a:b);Object.assign(label,{active:true,id:e.id,element:e.element,amount:e.amount,birth:time,drift:(this.sequence++%2?1:-1)*18});}
   Object.assign(label,{x:e.x,y:e.y??3.2,z:e.z});label.el.textContent=String(Math.max(1,Math.round(label.amount)));label.el.style.color=['#d9f1e7','#ffc491','#dfc2ff','#b1edff','#ecd4ab'][e.element]||'#fff0d8';label.el.className='damage-number'+(label.amount>=60?' heavy':'');
  }
  update(time,camera,width,height,paused=false,gentle=false){for(const l of this.labels){if(!l.active)continue;const age=time-l.birth;if(age>.85){l.active=false;l.el.hidden=true;continue;}this.point.set(l.x,l.y,l.z).project(camera);const visible=!paused&&this.point.z>-1&&this.point.z<1&&Math.abs(this.point.x)<1.1&&Math.abs(this.point.y)<1.1;l.el.hidden=!visible;if(!visible)continue;l.el.style.left=((this.point.x*.5+.5)*width+l.drift)+'px';l.el.style.top=((-this.point.y*.5+.5)*height-(gentle?0:age*75))+'px';l.el.style.opacity=String(Math.min(1,(.85-age)/.25));l.el.style.transform=`translate(-50%,-50%) scale(${gentle?1:1+Math.max(0,1-age/.15)*.18})`;}}
  reset(){for(const l of this.labels){l.active=false;l.el.hidden=true;}}
 }
 root.DamageNumbers=DamageNumbers;if(typeof module==='object'&&module.exports)module.exports=DamageNumbers;
})(typeof window==='object'?window:globalThis);
