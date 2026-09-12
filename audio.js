/* Procedural effects and an embedded licensed orchestral recording. See ASSET-CREDITS.md. */
(()=>{
 class ElementAudio{
  constructor(){this.context=null;this.voices=0;this.effectsVolume=.75;this.musicVolume=.55;this.decks=[];this.musicFile=null;this.desiredMusic=null;this.ambienceAt=0;this.enabled=true;this.last=Array(5).fill(-99);this.lastImpact=-99;this.musicEnabled=true;this.musicBuffer=null;this.musicError=null;this.musicPlaying=false;this.strings=new Map();}
  start(){
   if(!this.context){try{const c=this.context=new(window.AudioContext||window.webkitAudioContext)();
    this.master=c.createGain();this.master.gain.value=.62;
    const limiter=c.createDynamicsCompressor();limiter.threshold.value=-15;limiter.knee.value=12;limiter.ratio.value=8;limiter.attack.value=.003;limiter.release.value=.2;this.master.connect(limiter);limiter.connect(c.destination);
    this.effectsBus=c.createGain();this.effectsBus.gain.value=this.effectsVolume;this.effectsBus.connect(this.master);this.reverb=c.createConvolver();const impulse=c.createBuffer(2,c.sampleRate*1.3,c.sampleRate);for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/a.length,3)*.35;}this.reverb.buffer=impulse;const wet=c.createGain();wet.gain.value=.17;this.reverb.connect(wet);wet.connect(this.effectsBus);
    this.musicBus=c.createGain();this.musicBus.gain.value=0;this.musicBus.connect(this.master);
    this.noise=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const data=this.noise.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){brown=(brown+(Math.random()*2-1)*.08)/1.02;data[i]=brown*3;}
    this.white=c.createBuffer(1,c.sampleRate*2,c.sampleRate);const white=this.white.getChannelData(0);for(let i=0;i<white.length;i++)white[i]=Math.random()*2-1;
   }catch{return;}}
   if(this.context.state==='suspended')this.context.resume();
   if(this.desiredMusic&&this.musicFile!==this.desiredMusic)this.setTrack(this.desiredMusic);
  }
  setEnabled(enabled){this.enabled=enabled;if(this.master)this.master.gain.setTargetAtTime(enabled?.62:0,this.context.currentTime,.025);if(enabled)this.start();}
  layer({noise=false,white=false,type='sine',from=100,to=40,duration=.4,volume=.1,filter='lowpass',cutoff=1000,endCutoff=cutoff,q=.7,pan=0,delay=0,attack=.015,music=false,vibrato=0}){
   const c=this.context;if(!c||!this.enabled||c.state!=='running'||this.voices>=180)return;this.voices++;
   const t=c.currentTime+delay,src=noise?c.createBufferSource():c.createOscillator(),f=c.createBiquadFilter(),gain=c.createGain(),p=c.createStereoPanner();
   if(noise){src.buffer=white?this.white:this.noise;src.loop=true;}else{src.type=type;src.frequency.setValueAtTime(from,t);src.frequency.exponentialRampToValueAtTime(Math.max(15,to),t+duration);}
   f.type=filter;f.Q.value=q;f.frequency.setValueAtTime(cutoff,t);f.frequency.exponentialRampToValueAtTime(Math.max(30,endCutoff),t+duration);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(volume,t+attack);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);p.pan.value=pan;
   let lfo=null,depth=null;if(!noise&&vibrato){lfo=c.createOscillator();depth=c.createGain();lfo.frequency.value=5.2;depth.gain.value=vibrato;lfo.connect(depth);depth.connect(src.frequency);lfo.start(t);lfo.stop(t+duration+.01);}
   src.connect(f);f.connect(gain);gain.connect(p);if(music)p.connect(this.musicBus);else{p.connect(this.effectsBus);p.connect(this.reverb);}
   src.onended=()=>{this.voices--;src.disconnect();f.disconnect();gain.disconnect();p.disconnect();if(lfo){lfo.disconnect();depth.disconnect();}};src.start(t,noise?Math.random():undefined);src.stop(t+duration+.01);
  }
  setVolumes(music,effects){this.musicVolume=music;this.effectsVolume=effects;if(this.effectsBus)this.effectsBus.gain.setTargetAtTime(effects,this.context.currentTime,.06);}
  setTrack(file){this.desiredMusic=file;if(!this.context||this.musicFile===file)return;this.musicFile=file;const c=this.context;
   for(const deck of this.decks){deck.gain.gain.cancelScheduledValues(c.currentTime);deck.gain.gain.setTargetAtTime(0,c.currentTime,.55);if(deck.timer)clearTimeout(deck.timer);deck.timer=setTimeout(()=>this.releaseDeck(deck),2400);}
   while(this.decks.length>=2)this.releaseDeck(this.decks[0]);
   const audio=new Audio('assets/audio/'+file);audio.loop=true;audio.preload='auto';const source=c.createMediaElementSource(audio),gain=c.createGain();gain.gain.value=0;source.connect(gain);gain.connect(this.musicBus);const deck={audio,source,gain};this.decks.push(deck);
   audio.addEventListener('error',()=>{this.musicError='Could not load '+file;});audio.play().then(()=>{this.musicError=null;gain.gain.setTargetAtTime(1,c.currentTime,.65);}).catch(()=>{this.musicError='Tap Resume to enable audio.';});
  }
  releaseDeck(deck){if(deck.timer)clearTimeout(deck.timer);deck.audio.pause();deck.audio.removeAttribute('src');deck.audio.load();deck.source.disconnect();deck.gain.disconnect();this.decks=this.decks.filter(d=>d!==deck);}
  tickMusic(active,combat=false,theme='japan'){const c=this.context;if(!c)return;const playing=active&&this.enabled&&this.musicEnabled&&c.state==='running';this.musicBus.gain.setTargetAtTime(playing?this.musicVolume*(combat?.65:.42):0,c.currentTime,.2);
   if(playing&&c.currentTime>this.ambienceAt){this.ambienceAt=c.currentTime+2.3;this.layer({noise:true,white:['japan','cyber'].includes(theme),cutoff:theme==='ice'?1300:480,endCutoff:theme==='west'?190:600,duration:3,attack:.6,volume:combat?.025:.05});}
  }
  awaken(){
   // A rising major arpeggio with stable pitches and a warm sustained resolution.
   [261.63,329.63,392,523.25,659.25].forEach((f,i)=>{this.layer({from:f,to:f,duration:1.35,volume:.075,attack:.012,delay:i*.095,cutoff:4200,pan:(i-2)*.12});this.layer({from:f*2,to:f*2,duration:.8,volume:.019,attack:.004,delay:i*.095,cutoff:6000});});
   [261.63,392,523.25].forEach(f=>this.layer({type:'triangle',from:f,to:f,duration:1.6,volume:.035,attack:.12,delay:.4,cutoff:1600}));
   this.layer({noise:true,white:true,filter:'bandpass',cutoff:900,endCutoff:3200,q:.35,duration:.65,volume:.07,attack:.25});
  }
  cast(el,ultimate=false,pan=0){
   const c=this.context;if(!c||!this.enabled)return;const now=c.currentTime;if(now-this.last[el]<[.48,.32,.26,.72,.48][el])return;this.last[el]=now;const v=ultimate?1.2:1;
   const n=o=>this.layer({noise:true,volume:.25*v,pan,...o});
   if(el===0){
    // A broad rushing gust: turbulent air only, with no pitched whistle.
    n({white:true,filter:'bandpass',cutoff:320,endCutoff:1700,q:.35,duration:1.35,attack:.22,volume:.68*v});
    n({white:true,filter:'lowpass',cutoff:2400,endCutoff:450,duration:1.1,attack:.3,volume:.22*v,pan:-pan});
    n({cutoff:330,endCutoff:90,duration:1.25,attack:.18,volume:.38*v});
   }else if(el===1){
    // Heavy ignition, a rolling combustion roar, and irregular dry crackles.
    n({cutoff:260,endCutoff:85,duration:.65,attack:.012,volume:.68*v});
    n({white:true,filter:'bandpass',cutoff:420,endCutoff:1300,q:.4,duration:.5,attack:.025,volume:.37*v});
    n({filter:'lowpass',cutoff:1600,endCutoff:480,duration:1.05,attack:.055,volume:.6*v});
    for(let i=0;i<5;i++){const delay=.06+i*.09+Math.random()*.035;n({white:true,filter:'bandpass',cutoff:700+Math.random()*800,endCutoff:350,q:.45,duration:.15+Math.random()*.12,attack:.025,delay,volume:(.09+Math.random()*.09)*v});}
    for(let i=0;i<11;i++)n({white:true,filter:'highpass',cutoff:1700+Math.random()*1700,endCutoff:1100,duration:.012+Math.random()*.023,attack:.001,delay:Math.random()*.65,volume:(.035+Math.random()*.085)*v,pan:Math.max(-1,Math.min(1,pan+(Math.random()-.5)*.5))});
   }else if(el===2){
    // Sharp electrical snaps accompany the storm forks; low thunder follows.
    n({white:true,filter:'highpass',cutoff:2300,endCutoff:550,duration:.2,attack:.001,volume:.4*v});
    for(let i=0;i<7;i++)n({white:true,filter:'bandpass',cutoff:2000+Math.random()*4700,q:1.3,duration:.012+Math.random()*.03,delay:i*.026,attack:.001,volume:.18*v});
    this.layer({type:'sawtooth',from:95,to:58,duration:.16,volume:.065*v,cutoff:2100,attack:.002,pan});
    n({cutoff:200,endCutoff:65,duration:2.35,delay:.24,attack:.11,volume:.65*v});
   }else if(el===3){
    // A beach breaker: a slow body, a broad crash and a long receding hiss.
    n({cutoff:380,endCutoff:110,duration:2.1,attack:.35,volume:.68*v});
    n({white:true,cutoff:4300,endCutoff:600,duration:2.2,attack:.32,volume:.44*v});
    n({white:true,filter:'highpass',cutoff:1200,endCutoff:3000,duration:1.6,delay:.28,attack:.2,volume:.13*v,pan:-pan});
   }else{
    // Grinding stone and granular rockfall, with a heavy subterranean foundation.
    n({cutoff:230,endCutoff:55,duration:1.3,attack:.025,volume:.8*v});
    n({filter:'bandpass',cutoff:620,endCutoff:170,q:1,duration:.75,attack:.06,volume:.44*v});
    for(let i=0;i<10;i++)n({white:true,filter:'bandpass',cutoff:450+Math.random()*1600,q:2.5,duration:.035+Math.random()*.07,delay:i*.045,attack:.002,volume:(.07+Math.random()*.1)*v});
   }
  }
  impact(el){if(!this.context||this.context.currentTime-this.lastImpact<.12)return;this.lastImpact=this.context.currentTime;this.layer({noise:true,white:true,filter:'bandpass',cutoff:[1800,600,3200,1400,400][el],duration:.15,volume:.11,attack:.003});}
 }
 window.ElementAudio=ElementAudio;
})();

