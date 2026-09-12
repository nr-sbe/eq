/* Fixed-tick combat choreography and authored encounter interactions. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.SevenWorlds);})(typeof window==='object'?window:this,function(api){
 'use strict';const {CampaignGame,damageScale,clamp,dist}=api,P=CampaignGame.prototype;
 const titles=['Flood the courtyard','Scatter the railway ambush','Restore district power','Raise the sun shield','Open the fire shelter','Vent the furnace','Restore the fractured court'];
 const required=[3,0,2,4,1,0,4];
 for(const level of api.levels){level.signature={title:titles[level.id],element:required[level.id]};level.encounterBeats=level.encounters.map((z,id)=>({id,z,kind:id===1?'signature':'combat'}));level.environmentInteractions=[{...level.signature,z:level.id===0?480:290}];level.exclusionZones=level.id===2?[{z:level.bossTrigger-12,end:level.length}]:[];level.combat=['japan-battle.mp3','west-battle.mp3','ai-fight.ogg','egypt-battle.mp3','legionnaire.mp3','gothic-battle.mp3','heavens-battle.mp3'][level.id];level.soundtrack={exploration:level.music,combat:level.combat};}
 P.disableEnemy=function(e,duration){if(e.role==='boss'||this.time<(e.status.controlReady||0))return false;e.status.stun=this.time+duration;e.status.controlReady=e.status.stun+1;e.cooldown=Math.max(e.cooldown,.7);this.telegraphs=this.telegraphs.filter(t=>t.owner!==e.id);e.attackUntil=0;this.event('interrupt',{id:e.id,x:e.x,z:e.z});return true;};
 P.beginSword=function(target){if(this.pendingSword)return false;const p=this.player,el=this.element,tier=this.tier,spec={...this.specs[el]};if(this.time>this.comboExpiry)this.combo=0;this.combo=this.combo%3+1;this.comboExpiry=this.time+.9;this.swordDuration=[0,.34,.36,.48][this.combo];this.swordAnim=this.swordDuration;
  let dx=target?target.x-p.x:p.dx,dz=target?target.z-p.z:p.dz,d=Math.hypot(dx,dz)||1;dx/=d;dz/=d;p.dx=dx;p.dz=dz;
  const a=this.pendingSword={id:++this.attackId,start:this.time,duration:this.swordDuration,combo:this.combo,element:el,tier,spec,dx,dz,critical:this.rollCritical(),hit:new Set(),lastProgress:.18};this.swordElement=el;this.swordTier=tier;
  this.event('sword',{attackId:a.id,combo:a.combo,element:el,tier,dx,dz,x:p.x,y:p.y,z:p.z});return true;
 };
 P.swordStep=function(){const a=this.pendingSword;if(!a)return;const u=(this.time-a.start)/a.duration;if(u<.18)return;const p=this.player,end=Math.min(.66,u),begin=a.lastProgress;
  for(const e of [...this.enemies,...this.relays]){if(e.hp<=0||e.active===false||a.hit.has(e.id)||e.kind==='relay'&&!this.boss.active||!this.visibleTarget(e)||dist(e,p)>6.5+(e.radius||1))continue;
   const x=e.x-p.x,z=e.z-p.z,forward=x*a.dx+z*a.dz,side=x*a.dz-z*a.dx;let contact=false;
   // Sweep a capsule along the blade arc between previous and current simulation ticks.
   for(let k=0;k<=5;k++){const t=clamp((begin+(end-begin)*k/5-.18)/.48,0,1),angle=a.combo===3?0:(a.combo===1?-1:1)*(1.15-2.3*t),sx=Math.sin(angle),sz=Math.cos(angle),projection=clamp(side*sx+forward*sz,0,6.5);if(Math.hypot(side-sx*projection,forward-sz*projection)<(a.combo===3?1.6:1.15)+(e.radius||0)){contact=true;break;}}
   if(!contact)continue;a.hit.add(e.id);this.resolvingAttack=a.id;const before=e.hp;this.hit(e,[0,22,28,45][a.combo]*damageScale[a.tier-1]*(1+a.spec.impact*.15)*(a.critical?2:1),a.element,true,this.canUse(a.element),a.critical,a);this.resolvingAttack=null;if(e.hp===before)continue;if(a.combo===3)this.airPrimedUntil=this.time+3;
   this.event('swordcontact',{attackId:a.id,id:e.id,x:e.x,z:e.z,element:a.element,tier:a.tier,combo:a.combo,strength:a.combo===3?1:.5});
  }
  a.lastProgress=end;if(u>=.66)this.pendingSword=null;
 };
 P.coverBlocks=function(a,b,kind){if(!['strike','beam','fan'].includes(kind))return false;const shields=[...this.covers];if(this.level.id===1&&this.signature?.rail)shields.push(this.signature.rail);if(this.level.id===3&&this.signature?.done)shields.push({x:this.level.centerAt(this.signature.z),z:this.signature.z-5,r:5});for(const c of shields){const dx=b.x-a.x,dz=b.z-a.z,q=dx*dx+dz*dz,u=((c.x-a.x)*dx+(c.z-a.z)*dz)/(q||1);if(u>0&&u<1&&Math.hypot(a.x+u*dx-c.x,a.z+u*dz-c.z)<c.r)return true;}return false;};
 P.interactWorld=function(el,point){const s=this.signature;if(!s||Math.abs(this.player.z-s.z)>32)return;const kind=this.level.id,need=kind===5&&s.phase===1?3:required[kind];if(el!==need)return;
  if(kind===5&&s.phase===0){s.phase=1;this.event('worldchange',{name:'Pressure vented · Water quenches the furnace',element:0,x:this.level.centerAt(s.z),z:s.z});return;}
  if(!s.done){s.done=true;s.charge=1;this.event('worldchange',{name:titles[kind]+' · restored',element:el,x:this.level.centerAt(s.z),z:s.z});this.saveCheckpoint();}
 };
 P.worldStep=function(dt){if(this.endingAt&&this.time>=this.endingAt){this.endingAt=0;this.complete();}this.covers=this.covers.filter(c=>(c.life-=dt)>0);const s=this.signature;if(!s)return;const id=this.level.id,p=this.player;if(!s.hint&&!s.done&&Math.abs(p.z-s.z)<55&&this.canUse(required[id])){s.hint=true;this.event('notice',{text:['Ahead: Water floods the courtyard. Lightning conducts through wet enemies.','Ahead: Air clears the ambush. Freight cars provide moving cover.','Ahead: Cast Lightning to restore power and expose shielded units.','Ahead: Earth raises a designated shield against the sun beam.','Ahead: Fire opens shelter from the blizzard.','Ahead: Air vents the furnace; Water quenches its eruptions.','Ahead: Earth stabilizes the broken avenue. Keep clear of marked fractures.'][id]});}s.phaseTime=(s.phaseTime||0)+dt;
  if(id===1)s.rail={x:this.level.centerAt(s.z)+Math.sin(this.time*.4)*13,z:s.z+9,r:3.8};
  if(this.showcase&&this.tier>=4)s.done=true;
  if((id===0||this.showcase)&&s.done){for(const e of this.enemies)if(e.hp>0&&e.active&&Math.abs(e.z-s.z)<23){e.status.wet=Math.max(e.status.wet||0,this.time+.2);}}
  if(id===2&&s.done){for(const e of this.enemies)if(e.role==='shield'&&Math.abs(e.z-s.z)<28)e.status.broken=this.time+.2;}
  // Slow environmental pressure has a visible warning phase and an open safe flank.
  s.hazard=(id===3||(id===5||id===6)&&!s.done)&&Math.abs(p.z-s.z)<25;s.hazardZ=s.z;
  s.cycle=this.time%6;s.beamX=this.level.centerAt(s.z)+(id===3?0:Math.sin(Math.floor(this.time/6)*2)*9);if(id===6&&this.boss.active&&this.boss.hp>0){s.phase=Math.floor(this.time/9)%3;s.hazard=s.phase===1;s.hazardZ=this.boss.z-8;s.beamX=this.boss.x+Math.sin(Math.floor(this.time/6)*2)*8;if(s.phase===2&&!this.covers.length)this.covers.push({x:this.boss.x,z:this.boss.z-6,dx:0,dz:1,r:3.5,life:2.5});}
  if(s.hazard&&s.cycle>1.5&&s.cycle<1.55&&Math.abs(p.x-s.beamX)<2.2&&!this.coverBlocks({x:s.beamX,z:s.hazardZ+25},p,'beam'))this.damage(8);
  if(id===6&&this.boss.active){s.phase=Math.floor(this.time/9)%3;if(s.phase===0)for(const e of this.enemies)if(e.active&&e.hp>0&&e.role!=='boss')e.status.wet=this.time+.2;}
 };
});
