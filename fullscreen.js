/* Fullscreen is requested directly from a user gesture; never on page load. */
(function(root){
 class FullscreenControls{
  constructor({document:doc=root.document,window:win=root,target=doc.documentElement,buttons=doc.querySelectorAll('[data-fullscreen]'),onChange=()=>{},onHelp=()=>{}}={}){
   Object.assign(this,{doc,win,target,buttons,onChange,onHelp});this.pending=false;
   this.changed=()=>{this.sync();this.onChange();};
   for(const event of ['fullscreenchange','webkitfullscreenchange'])doc.addEventListener(event,this.changed);
   for(const button of buttons)button.addEventListener('click',()=>this.toggle());
   this.sync();
  }
  get active(){return !!(this.doc.fullscreenElement||this.doc.webkitFullscreenElement);}
  get installed(){return !!(this.win.navigator?.standalone||this.win.matchMedia?.('(display-mode: standalone)').matches||this.win.matchMedia?.('(display-mode: fullscreen)').matches);}
  sync(){for(const button of this.buttons){button.textContent=this.active?'EXIT FULLSCREEN':this.installed?'APP VIEW':'FULLSCREEN';button.setAttribute('aria-label',this.active?'Exit fullscreen':this.installed?'App display information':'Enter fullscreen');button.setAttribute('aria-pressed',String(this.active));button.disabled=this.pending;}}
  help(failed=false){this.onHelp(this.installed?'You are already playing in the Home Screen app view. Rotate your phone for a wider view.':(failed?'Fullscreen could not open here. Try opening the game directly in your phone browser. ':'')+'On iPhone or iPad, use Safari’s Share menu → Add to Home Screen (enable Open as Web App if shown), then launch the game from its icon. On Android, use your browser’s Install app or Add to Home screen option. Export your save in Settings before switching to the Home Screen app, then import it there if needed.');}
  async toggle(){
   if(this.pending)return;
   if(this.installed&&!this.active){this.help();return;}
   const exit=this.doc.exitFullscreen||this.doc.webkitExitFullscreen;
   const enter=this.target.requestFullscreen||this.target.webkitRequestFullscreen;
   const leaving=this.active;
   if(!(leaving?exit:enter)){this.help();return;}
   this.pending=true;this.sync();
   try{
    // No await before the request: mobile browsers require transient activation.
    await (leaving?exit.call(this.doc):enter.call(this.target));
   }catch{this.help(true);}
   finally{this.pending=false;this.sync();this.onChange();}
  }
 }
 if(typeof module!=='undefined'&&module.exports)module.exports=FullscreenControls;
 else root.FullscreenControls=FullscreenControls;
})(typeof window!=='undefined'?window:globalThis);
