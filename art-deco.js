/* Original NYC-inspired setback towers, sunburst gates and elevated railway. */
(()=>{const T=THREE;
window.buildDecoTower=function(w,x,z,seed,landmark=false){
 if(!w.materials.has('decoStone')){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),im=ctx.createImageData(128,128);for(let i=0;i<128*128;i++){const x=i%128,y=Math.floor(i/128),v=185+Math.sin(i*17.13)*12-Math.pow(Math.max(0,Math.sin(x*.34)),14)*y*.15;im.data.set([v,v*.99,v*.94,255],i*4);}ctx.putImageData(im,0,0);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;w.textures.push(tex);w.materials.set('decoStone',new T.MeshStandardMaterial({color:'#889092',map:tex,roughness:.65,metalness:.12}));}

 const side=Math.sign(x)||1,h=landmark?76:28+(seed%5)*7,width=landmark?27:14,depth=landmark?21:15;
 w.colliders.push(new T.Box3(new T.Vector3(x-width/2,0,z-depth/2),new T.Vector3(x+width/2,h+12,z+depth/2)));w.box('decoStone',x,.6,z,width+4,1.2,depth+4);
 for(let tier=0;tier<4;tier++){const a=1-tier*.16,base=h*(tier===0?0:.5+(tier-1)*.14),height=h*(tier===0?.5:.14);
  w.box('decoStone',x,base+height/2,z,width*a,height,depth*a);
  w.box('accent',x,base+height-.3,z,width*a+.35,.28,depth*a+.35);
  for(let k=-2;k<=2;k++){const zz=z+k*depth*a/5,xx=x+k*width*a/5;
   w.box('metal',x-side*(width*a/2+.04),base+height/2,zz,.12,height-.7,.5);
   w.box('accent',xx,base+height/2,z-depth*a/2-.06,.18,height-.4,.16);
   for(let row=0;row<Math.floor(height/3);row++){
    w.box((row+k+seed)%4?'glow':'metal',x-side*(width*a/2+.08),base+1.6+row*3,zz,.1,1.2,.7);
    w.box((row+k+seed)%3?'glow':'metal',xx,base+1.6+row*3,z-depth*a/2-.12,.65,1.3,.1);
   }
  }
 }
 const crown=h*.94;for(let j=0;j<5;j++){w.box('metal',x,crown+j*.9,z,width*.38-j*.75,.9,depth*.38-j*.5);}
 w.cyl('accent',x,crown+7,z,.18,11,8);
 for(let k=-2;k<=2;k++){w.box('accent',x+k*.7,3.5,z-depth/2-.3,.15,5,.2);}
 w.box('metal',x,2.7,z-depth/2-.1,4,5.4,.25);
 for(let j=0;j<9;j++){const a=(j-4)*.19;w.box('accent',x+Math.sin(a)*2.1,5.5+Math.cos(a)*1.4,z-depth/2-.3,.12,2.6,.15,0,0,-a);}
 w.box('accent',x,5,z-depth/2-1.3,7,.22,3);
 if(landmark){for(const s of [-1,1]){w.box('decoStone',x+s*21,15,z,9,30,18);w.box('accent',x+s*21,30,z,10,.4,19);}w.add(new T.TorusGeometry(5,.15,6,48),'accent',x,13,z-depth/2-.3);for(let j=0;j<12;j++){const a=j*Math.PI/6;w.box('accent',x+Math.sin(a)*3.8,13+Math.cos(a)*3.8,z-depth/2-.5,.12,1,.1,0,0,-a);}}
};
window.buildDecoRail=function(w,g,z){const cx=g.level.centerAt(z);for(const s of [-1,1]){w.box('metal',cx+s*17,6,z,.8,12,2);w.box('accent',cx+s*17,1,z,2,2,3);}w.box('metal',cx,12,z,43,.9,8);for(const s of [-1,1])w.box('metal',cx,13,z+s*3.2,45,.18,.16);for(let x=-21;x<=21;x+=2){w.box('metal',cx+x,12.7,z, .3,.25,7);if(x%4===1)w.box('accent',cx+x,14,z+4,.1,2,.1);}w.box('decoStone',cx-29,7,z,13,14,18);w.box('accent',cx-29,14,z,15,.4,20);};
})();
