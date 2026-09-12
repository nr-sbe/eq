/* Two-cue, resumable encounter music. Only the audio clock controls gain envelopes. */
(function(root){'use strict';
class MusicDirector{
 constructor(owner,createMedia=path=>new Audio(path)){this.owner=owner;this.createMedia=createMedia;this.generation=0;this.decks=[];this.angle=0;this.target=0;this.clear=0;this.clock=0;this.pauseTime=0;this.active=false;this.error=null;this.duck=0;}
 deck(file,generation){const c=this.owner.context,a=this.createMedia('assets/audio/'+file),gain=c.createGain(),source=c.createMediaElementSource(a);a.loop=true;a.preload='auto';gain.gain.value=0;source.connect(gain);gain.connect(this.owner.musicBus);const d={file,a,gain,source,generation,playing:false,pending:false,disposed:false,retry:0,value:0};a.addEventListener('error',()=>{if(!d.disposed){this.error='Music unavailable: '+file;d.retry=this.clock+5;d.playing=false;}});return d;}
 setWorld(pair){if(!this.owner.context)return;this.pair=pair;this.generation++;const old=[...this.decks,...(this.retiring?[this.retiring]:[])].filter(d=>!d.disposed).sort((a,b)=>b.value-a.value);this.retiring=old.shift()||null;this.retiringGain=this.retiring?.value||0;for(const d of old)this.release(d);this.decks=[this.deck(pair.exploration,this.generation),this.deck(pair.combat,this.generation)];this.owner.decks=this.decks;this.angle=0;this.target=0;this.clear=0;this.worldFade=0;}
 play(d){if(!d||d.disposed||d.playing||d.pending||this.clock<d.retry)return;if(d.a.readyState<2){if(this.clock>=d.retry){d.a.load();d.retry=this.clock+5;}return;}d.pending=true;const generation=d.generation;Promise.resolve(d.a.play()).then(()=>{d.pending=false;if(d.disposed||generation!==this.generation||!this.active){d.a.pause();return;}d.playing=true;this.error=null;this.duck=0;}).catch(()=>{d.pending=false;if(!d.disposed){d.retry=this.clock+3;this.error='Tap Resume to enable music.';}});}
 gain(d,value){if(!d||d.disposed)return;d.value=value;d.gain.gain.setTargetAtTime(value*({"asian-drums.mp3": 1, "western.mp3": 0.54, "machina.mp3": 0.56, "scarab.mp3": 0.64, "long-dark.mp3": 0.8, "old-ones.ogg": 1, "ascension.mp3": 0.95, "japan-battle.mp3": 0.54, "west-battle.mp3": 0.316, "ai-fight.ogg": 0.21, "egypt-battle.mp3": 0.387, "legionnaire.mp3": 0.34, "gothic-battle.mp3": 0.54, "heavens-battle.mp3": 0.3}[d.file]||1),this.owner.context.currentTime,.025);}
 pause(d){if(d&&!d.disposed){d.a.pause();d.playing=false;}}
 update(dt,active,combat){dt=Math.min(.1,Math.max(0,dt));this.clock+=dt;this.duck=Math.max(0,this.duck-dt);this.active=active;const c=this.owner.context;if(!c||!this.decks.length)return;this.owner.musicError=this.error;this.owner.musicBus.gain.setTargetAtTime(active?this.owner.musicVolume*.48*(this.duck>0?.65:1):0,c.currentTime,.08);
  if(!active){this.pauseTime+=dt;if(this.pauseTime>.4){this.decks.forEach(d=>this.pause(d));this.pause(this.retiring);}return;}this.pauseTime=0;
  if(combat){this.clear=0;this.target=Math.PI/2;}else{this.clear+=dt;if(this.clear>=6)this.target=0;}
  if(this.retiring)this.target=0;const destination=this.decks[this.target===0?0:1];this.play(destination);const current=this.decks[this.angle<Math.PI/4?0:1];if(current!==destination)this.play(current);
  if(!destination.playing){this.play(this.retiring);if(!this.retiring&&current.playing&&current.value===0)this.gain(current,1);return;}
  if(this.retiring){this.worldFade=Math.min(1,this.worldFade+dt/2.5);this.gain(this.retiring,this.retiringGain*Math.cos(this.worldFade*Math.PI/2));if(this.worldFade>=1){this.release(this.retiring);this.retiring=null;}}
  const duration=this.target===0?4:2.5,step=dt*(Math.PI/2)/duration;this.angle=this.target>this.angle?Math.min(this.target,this.angle+step):Math.max(this.target,this.angle-step);
  const worldGain=this.retiring?Math.sin(this.worldFade*Math.PI/2):1;
  // A departed world and the new destination share the two audible slots.
  this.decks.forEach((d,i)=>{const value=this.retiring?(d===destination?worldGain:0):(i?Math.sin(this.angle):Math.cos(this.angle));this.gain(d,value);if(value<.0001&&d!==destination)this.pause(d);});
 }
 release(d){if(!d||d.disposed)return;d.disposed=true;d.a.pause();d.a.removeAttribute('src');d.a.load();d.source.disconnect();d.gain.disconnect();}
 dispose(){this.generation++;this.decks.forEach(d=>this.release(d));this.release(this.retiring);this.decks=[];this.retiring=null;}
}
root.MusicDirector=MusicDirector;if(typeof module==='object'&&module.exports)module.exports=MusicDirector;
})(typeof window==='object'?window:globalThis);
