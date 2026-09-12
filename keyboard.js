/* Physical key bindings, focus-safe holds and camera-relative movement. */
(function(root){
 'use strict';
 const codes=new Set(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyE','KeyC','Tab','KeyM','KeyR','KeyQ','KeyF','Digit1','Digit2','Digit3','Digit4','Digit5','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5']);
 function movement(mx,mz,yaw){const c=Math.cos(yaw),s=Math.sin(yaw);return {mx:-mx*c+mz*s,mz:mz*c+mx*s};}
 class KeyboardControls {
  constructor({host=root,doc=root.document,keys=new Set(),isPlaying,onAction,onEscape,onSuspend,onGesture=()=>{}}){
   this.keys=keys;this.pressed=new Set();this.host=host;this.doc=doc;
   this.down=e=>{
    if(e.isComposing)return;
    if(e.code==='Escape'){e.preventDefault();if(!e.repeat){this.reset();onEscape();}return;}
    if(e.ctrlKey||e.metaKey||e.altKey){this.reset();return;}
    const el=doc.activeElement;
    if(el&&(el.isContentEditable||['INPUT','SELECT','TEXTAREA'].includes(el.tagName)))return;
    if(!isPlaying()||!codes.has(e.code))return;
    e.preventDefault();onGesture();
    // Ignore repeats after an overlay or focus change until the key is pressed anew.
    if(e.repeat&&!keys.has(e.code))return;
    const fresh=!keys.has(e.code);keys.add(e.code);
    if(fresh&&!e.repeat){this.pressed.add(e.code);onAction(e.code);}
   };
   this.up=e=>{if(isPlaying()&&codes.has(e.code))e.preventDefault();keys.delete(e.code);};
   this.suspend=()=>{this.reset();onSuspend();};
   this.visibility=()=>{if(doc.hidden)this.suspend();};
   host.addEventListener('keydown',this.down);host.addEventListener('keyup',this.up);host.addEventListener('blur',this.suspend);doc.addEventListener('visibilitychange',this.visibility);
  }
  reset(){this.keys.clear();this.pressed.clear();}
  takePress(code){const value=this.pressed.has(code);this.pressed.delete(code);return value;}
  axes(){return {x:(this.keys.has('KeyD')||this.keys.has('ArrowRight')?1:0)-(this.keys.has('KeyA')||this.keys.has('ArrowLeft')?1:0),z:(this.keys.has('KeyW')||this.keys.has('ArrowUp')?1:0)-(this.keys.has('KeyS')||this.keys.has('ArrowDown')?1:0)};}
  dispose(){this.reset();this.host.removeEventListener('keydown',this.down);this.host.removeEventListener('keyup',this.up);this.host.removeEventListener('blur',this.suspend);this.doc.removeEventListener('visibilitychange',this.visibility);}
 }
 root.KeyboardControls=KeyboardControls;root.cameraMovement=movement;
 if(typeof module==='object'&&module.exports)module.exports={KeyboardControls,movement};
})(typeof window==='object'?window:globalThis);
