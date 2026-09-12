/* Independent pointer ownership permits movement, looking and casting together. */
(()=>{
 class TouchControls{
  constructor({canvas,onLook,onCycle}){
   this.x=0;this.y=0;this.casting=false;this.tempest=false;this.enabled=false;this.moveId=null;this.lookId=null;this.actions=new Map();this.root=document.querySelector('#touchControls');this.stick=document.querySelector('#moveStick');this.knob=document.querySelector('#stickKnob');
   const stickMove=e=>{if(e.pointerId!==this.moveId)return;const r=this.stick.getBoundingClientRect(),radius=r.width*.32,dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),scale=d>radius?radius/d:1;this.x=dx*scale/radius;this.y=-dy*scale/radius;if(d<6)this.x=this.y=0;this.knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;e.preventDefault();};
   this.stick.addEventListener('pointerdown',e=>{if(!this.enabled||this.moveId!==null)return;this.moveId=e.pointerId;this.stick.setPointerCapture(e.pointerId);stickMove(e);});this.stick.addEventListener('pointermove',stickMove);
   const endMove=e=>{if(e.pointerId!==this.moveId)return;this.moveId=null;this.x=this.y=0;this.knob.style.transform='';};for(const event of ['pointerup','pointercancel','lostpointercapture'])this.stick.addEventListener(event,endMove);
   for(const button of this.root.querySelectorAll('[data-touch]')){
    button.addEventListener('pointerdown',e=>{if(!this.enabled)return;e.preventDefault();button.setPointerCapture(e.pointerId);this.actions.set(e.pointerId,button.dataset.touch);button.classList.add('pressed');if(button.dataset.touch==='target')onCycle();this.sync();});
    const release=e=>{if(!this.actions.has(e.pointerId))return;this.actions.delete(e.pointerId);if(![...this.actions.values()].includes(button.dataset.touch))button.classList.remove('pressed');this.sync();};for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,release);
   }
   canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||!this.enabled||this.lookId!==null)return;this.lookId=e.pointerId;this.lookX=e.clientX;this.lookY=e.clientY;canvas.setPointerCapture(e.pointerId);e.preventDefault();});
   canvas.addEventListener('pointermove',e=>{if(e.pointerId!==this.lookId)return;onLook(e.clientX-this.lookX,e.clientY-this.lookY);this.lookX=e.clientX;this.lookY=e.clientY;e.preventDefault();});
   const endLook=e=>{if(this.lookId===e.pointerId)this.lookId=null;};for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,endLook);
   this.setEnabled(matchMedia('(pointer:coarse)').matches||(innerWidth<800&&navigator.maxTouchPoints>0));
  }
  sync(){this.casting=[...this.actions.values()].includes('cast');this.tempest=[...this.actions.values()].includes('tempest');this.sword=[...this.actions.values()].includes('sword');}
  reset(){this.x=this.y=0;this.moveId=this.lookId=null;this.actions.clear();this.sync();this.knob.style.transform='';this.root.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'));}
  setEnabled(v){this.enabled=Boolean(v);this.reset();document.querySelector('#game').classList.toggle('touch-mode',this.enabled);document.querySelector('#touchEnabled').checked=this.enabled;}
 }
 window.TouchControls=TouchControls;
})();
