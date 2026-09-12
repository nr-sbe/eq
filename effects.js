/* Original procedural elemental effects. Rendering cadence never limits gameplay casting. */
(()=>{
 const T=THREE,TAU=Math.PI*2;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const hash=n=>{const x=Math.sin(n*127.1+47.7)*43758.5453;return x-Math.floor(x);};
 class ElementEffects{
  constructor(scene){
   this.scene=scene;this.time=0;this.gentle=false;this.states=Array.from({length:5},()=>({last:-99,lastSpawn:-99,x:0,z:0,dx:0,dz:1,power:1}));this.jobs=[];this.pool=[[],[],[],[],[]];this.materials=[];this.geometries=[];
   this.ink=this.material('#382e30');this.light=new T.PointLight('#ff8b33',0,12,2);scene.add(this.light);
   this.fire=this.makeFire();this.wind=this.makeWind();this.electric=this.makeElectric();this.debris=this.makeDebris();
  }
  material(color,opacity=1){const m=new T.MeshBasicMaterial({color,side:T.DoubleSide,transparent:opacity<1,opacity,depthWrite:opacity>=1});this.materials.push(m);return m;}
  geometry(g){this.geometries.push(g);return g;}
  mesh(geo,mat,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m;}
  group(){const g=new T.Group();this.scene.add(g);return g;}
  curve(points,radius,material,parent){const g=this.geometry(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),Math.max(12,points.length*8),radius,5,false));return this.mesh(g,material,parent);}
  rootAt(root,s){root.position.set(s.x,s.y||0,s.z);root.rotation.y=Math.atan2(s.dx,s.dz);}
  ribbon(count,material,parent){const g=this.geometry(new T.BufferGeometry()),pos=new Float32Array((count+1)*6),idx=[];for(let i=0;i<count;i++){let n=i*2;idx.push(n,n+1,n+2,n+1,n+3,n+2);}g.setAttribute('position',new T.BufferAttribute(pos,3).setUsage(T.DynamicDrawUsage));g.setIndex(idx);const m=this.mesh(g,material,parent);m.frustumCulled=false;return {mesh:m,positions:pos,count};}
  makeFire(){
   const root=this.group(),ribbons=[],tongues=[],fireMats=[this.material('#b62d20'),this.material('#f25320'),this.material('#ff992f'),this.material('#ffe286'),this.material('#fff3b4')];
   for(let i=0;i<7;i++)ribbons.push(this.ribbon(64,fireMats[Math.min(4,i)],root));
   const sh=new T.Shape();sh.moveTo(-.32,0);sh.bezierCurveTo(-.92,.72,-.08,1.45,-.48,2.5);sh.bezierCurveTo(.72,1.68,.14,1.2,.64,.78);sh.bezierCurveTo(.78,.35,.4,-.14,-.32,0);
   const geo=this.geometry(new T.ShapeGeometry(sh,16));
   for(let i=0;i<28;i++){const g=new T.Group();root.add(g);const outer=this.mesh(geo,fireMats[1],g);const middle=this.mesh(geo,fireMats[2],g,0,.05,.015);middle.scale.set(.68,.82,1);const inner=this.mesh(geo,fireMats[3],g,0,.02,.03);inner.scale.set(.32,.55,1);g.rotation.y=i*.82;tongues.push(g);}
   root.visible=false;return {root,ribbons,tongues};
  }
  makeWind(){
   const root=this.group(),ribbons=[],ivory=this.material('#edf3dc',.88),faint=this.material('#c7d9c9',.4),leaves=[];
   for(let i=0;i<14;i++)ribbons.push(this.ribbon(70,i%3?ivory:faint,root));
   const leafShape=new T.Shape();leafShape.moveTo(-.16,0);leafShape.quadraticCurveTo(.05,.18,.4,0);leafShape.quadraticCurveTo(.05,-.12,-.16,0);
   const leafGeo=this.geometry(new T.ShapeGeometry(leafShape)),leafMat=this.material('#637d55'),paperMat=this.material('#f4e9c7');
   for(let i=0;i<45;i++)leaves.push(this.mesh(leafGeo,i%3?leafMat:paperMat,root));root.visible=false;return {root,ribbons,leaves};
  }
  makeElectric(){
   const root=this.group(),geo=this.geometry(new T.CylinderGeometry(1,1,1,5)),mats=[this.material('#763dff',.2),this.material('#bd9bff',.78),this.material('#f2f5ff',.99)],meshes=[];mats[0].blending=T.AdditiveBlending;
   for(let i=0;i<3;i++){const m=new T.InstancedMesh(geo,mats[i],620);m.renderOrder=20+i;m.instanceMatrix.setUsage(T.DynamicDrawUsage);m.frustumCulled=false;m.count=0;root.add(m);meshes.push(m);}
   const ringGeo=this.geometry(new T.TorusGeometry(1,.035,4,48)),ring=this.mesh(ringGeo,this.material('#c463ff',.6),root);ring.rotation.x=Math.PI/2;root.visible=false;
   const shockwaves=[];for(let i=0;i<3;i++){const material=this.material(i===0?'#d0beff':'#7652d2',.5);material.blending=T.AdditiveBlending;const m=this.mesh(this.geometry(new T.RingGeometry(.975,1,96)),material,root);m.rotation.x=-Math.PI/2;shockwaves.push(m);}
   const columnMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,uniforms:{time:{value:0},fade:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;uniform float time,fade;void main(){float twist=vUv.x*31.416+sin(vUv.y*22.-time*12.)*1.3;float streak=pow(abs(sin(twist)),16.);float fine=pow(abs(sin(vUv.x*87.96-vUv.y*16.+time*8.)),30.);float edge=smoothstep(0.,.08,vUv.y)*(1.-smoothstep(.9,1.,vUv.y));vec3 color=mix(vec3(.20,.07,.6),vec3(.67,.52,1.4),streak);gl_FragColor=vec4(color,(.045+streak*.32+fine*.17)*fade*edge);}'});this.materials.push(columnMaterial);
   const column=this.mesh(this.geometry(new T.CylinderGeometry(1.5,.7,1,32,1,true)),columnMaterial,root);
   return {root,meshes,ring,shockwaves,column,columnMaterial,dummy:new T.Object3D(),from:new T.Vector3(),to:new T.Vector3(),direction:new T.Vector3(),up:new T.Vector3(0,1,0)};
  }
  makeDebris(){const geo=this.geometry(new T.DodecahedronGeometry(.3)),m=new T.InstancedMesh(geo,this.material('#8e795a'),160);m.instanceMatrix.setUsage(T.DynamicDrawUsage);m.frustumCulled=false;m.count=0;this.scene.add(m);return {mesh:m,dummy:new T.Object3D()};}
  makeWave(){
   const root=this.group(),body=new T.Group();root.add(body);
   // A sculpted 3D crest whose silhouette reads from behind the protagonist:
   // tall left shoulder, open curling hollow, branching ivory foam, low right swell.
   const sh=new T.Shape();sh.moveTo(-7.8,0);sh.bezierCurveTo(-6.6,.5,-6.2,3.3,-4.5,6.25);sh.bezierCurveTo(-2.8,9.1,.7,9.4,2.8,7.35);sh.bezierCurveTo(4.15,6.1,3.5,4.65,2.55,4.55);sh.bezierCurveTo(3.1,5.6,2.25,6.9,.65,6.4);sh.bezierCurveTo(-1.25,5.85,-1.45,3.65,.7,1.75);sh.bezierCurveTo(2.65,.35,4.9,1.45,7.25,0);sh.closePath();
   const bow=(x,y)=>x*x*.024+y*.06;
   const geo=this.geometry(new T.ExtrudeGeometry(sh,{depth:2.3,bevelEnabled:true,bevelThickness:.12,bevelSize:.12,bevelSegments:2,curveSegments:32,steps:5}));
   const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,pos.getZ(i)-1.15+bow(x,y));}geo.computeVertexNormals();
   const indigo=this.material('#133958'),blue=this.material('#286483'),pale=this.material('#6fa4b3'),foam=this.material('#dce7e5'),white=this.material('#eff3ef'),ink=this.material('#142f42');
   const waterSkin=new T.MeshStandardMaterial({color:'#16485e',roughness:.27,metalness:.22,side:T.DoubleSide});this.materials.push(waterSkin);this.mesh(geo,waterSkin,body);
   // Merge the carved bands and foam fingers by material: a handful of draws per wave.
   const batches=new Map();const add=(g,m)=>{if(!batches.has(m))batches.set(m,[]);batches.get(m).push(g.index?g.toNonIndexed():g);};
   const curve=(pts,r,m)=>{const c=new T.CatmullRomCurve3(pts.map(([x,y,z])=>new T.Vector3(x,y,z+bow(x,y))));add(new T.TubeGeometry(c,Math.max(18,pts.length*7),r,5,false),m);return c;};
   for(const face of [-1.29,1.29]){
    // Flow lines climb the face and turn over the hollow, in layered Prussian blues.
    for(let i=0;i<16;i++){const k=i/15;curve([[-7.45+k*2,.12,face],[-6.0+k*1.65,1.9,face],[-5.35+k*2.35,4.4,face],[-3.7+k*2.6,6.8-k*.95,face],[-1.5+k*2.8,7.85-k*1.2,face],[1.3+k*.7,7.55-k*.9,face]],i%4===0?.1:.038,i%4===0?pale:blue);}
    const edge=sh.getPoints(120).map(p=>[p.x,p.y,face]);curve(edge,.037,ink);
    const crest=curve([[-6.8,1.9,face],[-5.3,4.9,face],[-4.1,6.9,face],[-2.25,8.35,face],[-.05,8.55,face],[2.05,7.95,face],[3.1,6.65,face],[2.8,5.05,face]],.19,foam);
    for(let i=0;i<30;i++){const u=.16+i/29*.82,v=crest.getPoint(u),tangent=crest.getTangent(u),out=new T.Vector3(-tangent.y,tangent.x,0).normalize(),length=.32+hash(i*7)*.7;
     const x=v.x,y=v.y;const tipx=x+out.x*length+.22,tipy=y+out.y*length-.15;
     curve([[x,y,face-.045],[x+out.x*length*.8,y+out.y*length*.85,face-.08],[tipx,tipy,face-.13],[tipx+.18,tipy-.32,face-.16]],.085,white);
     if(i%2===0)curve([[x+out.x*.15,y+out.y*.15,face-.055],[tipx-.25,tipy+.13,face-.09],[tipx-.2,tipy-.09,face-.12]],.055,foam);
    }
    // A smaller hooked swell echoes the great crest at the foot of the surge.
    for(let j=0;j<4;j++)curve([[-1+j*.2,.15,face],[1.8,1.15+j*.13,face],[4.7,2.3+j*.05,face],[5.35,1.8,face],[5.05,1.15,face]],j===3?.12:.055,j===3?foam:pale);
   }
   // Flow bands span the full width, rising away from the caster and over the lip.
   for(let i=0;i<22;i++){const z=-1.14+i/21*2.28;curve([[-7.65,.08,z],[-6.6,1.15,z],[-5.65,3.9,z],[-4.4,6.5,z],[-2.25,8.42,z],[-.1,8.75,z],[2,8.06,z],[3.07,6.8,z],[2.8,5.08,z]],i%4===0?.065:.028,i%4===0?pale:blue);}
   // Whitewater ribs run over the volume, connecting its two decorated faces.
   for(let i=0;i<24;i++){const a=i/23*Math.PI,x=-.4+3.15*Math.cos(a),y=6.75+1.6*Math.sin(a);curve([[x,y,-1.3],[x-.12,y+.1,0],[x,y,1.3]],.055,foam);}
   for(const [material,geos] of batches){let count=0;for(const g of geos)count+=g.attributes.position.count;const p=new Float32Array(count*3),n=new Float32Array(count*3);let offset=0;for(const g of geos){p.set(g.attributes.position.array,offset);n.set(g.attributes.normal.array,offset);offset+=g.attributes.position.array.length;g.dispose();}const merged=this.geometry(new T.BufferGeometry());merged.setAttribute('position',new T.BufferAttribute(p,3));merged.setAttribute('normal',new T.BufferAttribute(n,3));this.mesh(merged,material,body);}
   const spray=new T.InstancedMesh(this.geometry(new T.SphereGeometry(.1,6,4)),foam,90);spray.instanceMatrix.setUsage(T.DynamicDrawUsage);spray.frustumCulled=false;body.add(spray);
   const wash=this.mesh(this.geometry(new T.CircleGeometry(1,48)),this.material('#b5d4cb',.3),body,0,.035,0);wash.rotation.x=-Math.PI/2;wash.scale.set(8.5,3.2,1);
   body.rotation.y=-Math.PI/2;body.scale.set(.72,1,3.1);body.position.z=5.75;root.visible=false;return {root,body,spray,sprayDummy:new T.Object3D(),el:3};
  }
  makeEarth(){
   const root=this.group(),columns=[],seams=this.material('#e6bd6a'),stone=this.material('#63584b'),side=this.material('#a08a67'),dust=this.material('#a78d69',.22);
   const spireGeo=this.geometry(new T.CylinderGeometry(.16,.78,3.4,5));
   const p=spireGeo.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>0){p.setX(i,p.getX(i)+.42);p.setZ(i,p.getZ(i)+.16);}spireGeo.computeVertexNormals();
   for(let i=0;i<9;i++){const g=new T.Group();root.add(g);const m=this.mesh(spireGeo,i%2?stone:side,g,0,1.65,0);m.rotation.y=hash(i)*TAU;
    const sliver=this.mesh(spireGeo,side,g,.65,.65,.2);sliver.scale.set(.43,.5,.43);sliver.rotation.z=-.35;
    this.curve([[.1,.05,-.72],[-.05,1,-.53],[.22,1.7,-.4],[.11,2.6,-.24],[.39,3.24,-.04]],.026,seams,g);
    const dustRing=this.mesh(this.geometry(new T.RingGeometry(.7,1.5,18)),dust,g,0,.045,0);dustRing.rotation.x=-Math.PI/2;columns.push(g);
   }
   const crackMat=this.material('#3e342c');for(let j=-1;j<=1;j++){const pts=[];for(let i=0;i<21;i++)pts.push([j*.9+Math.sin(i*3+j)*.32,.034,i*.95]);this.curve(pts,j===0?.065:.03,crackMat,root);}
   root.visible=false;return {root,columns,el:4};
  }
  spawn(el,s,time){let job=this.pool[el].pop();if(!job)job=el===3?this.makeWave():this.makeEarth();Object.assign(job,{birth:time,life:el===3?1.5:1.4,x:s.x,z:s.z,dx:s.dx,dz:s.dz,power:s.power,range:s.range,tier:s.tier,y:s.y});job.root.visible=true;this.rootAt(job.root,s);this.jobs.push(job);const same=this.jobs.filter(j=>j.el===el);if(same.length>(el===3?7:3))this.release(same[0]);}
  release(j){j.root.visible=false;const i=this.jobs.indexOf(j);if(i>=0)this.jobs.splice(i,1);this.pool[j.el].push(j);}
  cast(e,time,range=27){const s=this.states[e.element],wasCold=time-s.last>.25;if(e.element===2&&wasCold)s.burstStart=time;Object.assign(s,{last:time,x:e.x-e.dx*.35,z:e.z-e.dz*.35,dx:e.dx,dz:e.dz,y:e.y||0,tier:e.tier||1,targets:(e.targets||[]).slice(0,8),power:Math.min(1.8,(e.ultimate?1.45:1)*(1+((e.tier||1)-1)*.075)*(1+(e.specialization?.control||0)*.15)),range:clamp(range,e.element===3?14:2,32)});if(e.element===3||e.element===4){const interval=e.element===3?.4-((e.tier||1)-1)*.025:.43;if(wasCold||time-s.lastSpawn>interval){s.lastSpawn=time;this.spawn(e.element,s,time);}}}
  updateFire(s,t,fade){
   const f=this.fire;f.root.visible=fade>0;if(fade<=0)return;this.rootAt(f.root,s);const power=s.power*2.7,range=s.range;
   for(let j=0;j<f.ribbons.length;j++){const r=f.ribbons[j],p=r.positions;r.mesh.visible=j<Math.min(7,4+(s.tier||1));const layer=1-j*.1,angle=j*1.17;
    for(let i=0;i<=r.count;i++){const u=i/r.count,z=.6+u*range,taper=Math.pow(Math.max(0,1-u),.3),pulse=.82+Math.sin(z*2.8-t*13+j)*.18,w=(.32+u*1.9)*layer*power*taper*pulse*fade;
     const drift=Math.sin(z*.85-t*6+j)*u*.55,cy=1.35+u*2.6+Math.sin(z*1.8-t*10+j)*u*.7;
     for(let k=0;k<2;k++){const sign=k?1:-1,n=(i*2+k)*3;p[n]=drift+sign*w*Math.cos(angle);p[n+1]=cy+sign*w*Math.sin(angle);p[n+2]=z;}}
    r.mesh.geometry.attributes.position.needsUpdate=true;
   }
   for(let i=0;i<f.tongues.length;i++){const m=f.tongues[i];m.visible=i<Math.min(28,14+(s.tier||1)*2);const u=(i/f.tongues.length+t*.8)%1,z=1+u*range,w=(.3+u*1.1)*power; m.position.set(Math.sin(i*9+t*4)*w*.6,.45+Math.sin(i+t*5)*.12,z);const end=Math.sin(u*Math.PI);m.scale.set(w*end*fade,(.65+u*.85)*power*end*fade,w*end*fade);m.rotation.y=i*.82+Math.sin(t*3+i)*.2;m.rotation.z=Math.sin(t*9+i)*.25;}
  }
  updateWind(s,t,fade){const f=this.wind;f.root.visible=fade>0;if(fade<=0)return;this.rootAt(f.root,s);const range=s.range,size=s.power*2.8;
   for(let j=0;j<f.ribbons.length;j++){const r=f.ribbons[j],p=r.positions;r.mesh.visible=j<Math.min(14,7+(s.tier||1));for(let i=0;i<=r.count;i++){const u=i/r.count,angle=u*TAU*(j%2?1.25:.55)-t*7+j*.59,envelope=Math.pow(Math.sin(Math.PI*u),.4),radius=(.3+u*2)*size*envelope,x=Math.sin(angle)*radius,y=2.9+Math.cos(angle)*radius*.72,z=.7+u*range,w=(j%3?.09:.20)*size*fade*envelope;
     for(let k=0;k<2;k++){const sign=k?1:-1,n=(i*2+k)*3;p[n]=x+sign*w;p[n+1]=y+sign*w*.65;p[n+2]=z;}}
    r.mesh.geometry.attributes.position.needsUpdate=true;
   }
   for(let i=0;i<f.leaves.length;i++){const m=f.leaves[i],u=(t*.85+i/f.leaves.length)%1,a=i*2.4-t*8,r=(.5+u*2)*size;m.position.set(Math.sin(a)*r,2.9+Math.cos(a)*r*.72,.8+u*range);m.rotation.set(t*7+i,t*9+i,Math.sin(a));m.scale.setScalar(fade*(1.3+u*1.8));}
  }
  electricSegment(a,b,index,radius){const e=this.electric,d=e.dummy;e.from.set(...a);e.to.set(...b);e.direction.copy(e.to).sub(e.from);const len=e.direction.length();if(len<.001)return;d.position.copy(e.from).add(e.to).multiplyScalar(.5);d.quaternion.setFromUnitVectors(e.up,e.direction.normalize());for(let j=0;j<3;j++){const r=radius*[4,1.6,.52][j];d.scale.set(r,len,r);d.updateMatrix();e.meshes[j].setMatrixAt(index,d.matrix);}}
  updateElectric(s,t,fade){const e=this.electric;e.root.visible=fade>0;if(fade<=0)return;this.rootAt(e.root,s);let index=0;const age=Math.max(0,t-(s.burstStart??t)),phase=(age%.8)/.8,strike=Math.floor(age/.8)*17+Math.floor(t*13),intensity=.3+.7*Math.exp(-phase*4),length=Math.max(3,s.range),count=this.gentle?2:Math.min(6,3+Math.floor((s.tier||1)/2));
   for(let b=0;b<count;b++){const bx=(b-(count-1)/2)*3.8,bz=length+hash(strike+b)*2-1,height=27+hash(strike*9+b)*10;let previous=[bx+hash(strike+b)*3,height,bz-1];
    for(let j=1;j<=23;j++){const u=j/23,next=[bx+(hash(strike*37+b*71+j*3)-.5)*2.4*Math.sin(u*Math.PI),height*(1-u),bz+(hash(strike*23+b*29+j)-.5)*1.4];this.electricSegment(previous,next,index++,.04*fade*intensity*s.power);
     if(j===6||j===11||j===16){let branch=next;const side=(j+b)%2?1:-1;for(let k=1;k<=5;k++){const fork=[next[0]+side*k*(.7+hash(strike+j+b)*.35),next[1]-k*.9,next[2]+Math.sin(k+b)*.7];this.electricSegment(branch,fork,index++,.017*fade*intensity);branch=fork;}}
     previous=next;
    }
   }
   // A concentrated, immense levinbolt: white core, violet corona and ground rupture.
   const height=34*(1+((s.tier||1)-1)*.045),power=s.power*(this.gentle?.75:1);let core=[0,height,length];
   for(let j=1;j<=40;j++){const u=j/40,bend=Math.sin(u*Math.PI),next=[(hash(strike*29+j*7)-.5)*1.6*bend,height*(1-u),length+(hash(strike*23+j*11)-.5)*1.1*bend];this.electricSegment(core,next,index++,(.18+hash(j+strike)*.11)*fade*intensity*power);core=next;}
   for(let b=0;b<(this.gentle?5:10);b++){const angle=b/10*TAU+.2*Math.sin(strike+b);let previous=[0,.12,length];for(let j=1;j<=8;j++){const r=j*(.8+phase*.5)*power,next=[Math.sin(angle)*r+(hash(strike+j+b)-.5)*.7,.08+hash(j+b)*.12,length+Math.cos(angle)*r];this.electricSegment(previous,next,index++,.022*fade*intensity);previous=next;}}
   for(let b=0;b<(this.gentle?4:8);b++){let previous=[0,.3,length];for(let j=1;j<=12;j++){const u=j/12,a=b/8*TAU+u*2.5+t*2,r=Math.sin(u*Math.PI)*3*power,next=[Math.sin(a)*r,u*height*.7,length+Math.cos(a)*r];this.electricSegment(previous,next,index++,.026*fade*intensity);previous=next;}}
   e.column.position.set(0,height/2,length);e.column.scale.set(1.5*power,height,1.5*power);e.columnMaterial.uniforms.time.value=t;e.columnMaterial.uniforms.fade.value=fade*intensity;
   for(let i=0;i<e.shockwaves.length;i++){const ring=e.shockwaves[i],u=(phase+i*.26)%1,r=(.9+u*12)*power;ring.position.set(0,.06+i*.014,length);ring.scale.setScalar(r);ring.material.opacity=fade*(1-u)*(.35+intensity*.25);}
   // Continuous hand-to-target conduction beneath the intermittent sky strikes.
   e.root.updateMatrixWorld(true);
   const origins=this.handOrigins?.length?this.handOrigins.map(p=>e.root.worldToLocal(p.clone()).toArray()):[[-.4,1.7,.4],[.4,1.6,.4]];
   for(let h=0;h<origins.length;h++){const origin=origins[h];let previous=origin;
    for(let j=1;j<=28;j++){const u=j/28,w=Math.sin(u*Math.PI),next=[origin[0]*(1-u)+(hash(strike*131+j*7+h*43)-.5)*1.4*w,origin[1]*(1-u)+.45*u+Math.sin(u*Math.PI)*1.4+(hash(strike*57+j*5+h)-.5)*.7*w,origin[2]+(length-origin[2])*u];
     this.electricSegment(previous,next,index++,.025*fade*(.7+intensity*.3)*s.power);
     if(j%7===0&&j<28){let branch=next;for(let k=1;k<=3;k++){const fork=[next[0]+(h?1:-1)*k*.4,next[1]+(hash(strike+j+k)-.5)*k*.6,next[2]+k*.7];this.electricSegment(branch,fork,index++,.01*fade);branch=fork;}}
     previous=next;
    }
   }
   for(const target of (s.targets||[])){const point=e.root.worldToLocal(new T.Vector3(target.x,target.y||2,target.z));let previous=[0,.6,length];
    for(let j=1;j<=8&&index<620;j++){const u=j/8,w=Math.sin(u*Math.PI),next=[point.x*u+(hash(strike+j)-.5)*w, .6+(point.y-.6)*u+Math.sin(u*Math.PI)*1.3, length+(point.z-length)*u+(hash(strike+j*7)-.5)*w];this.electricSegment(previous,next,index++,.035*fade);previous=next;}
   }
   e.meshes.forEach(m=>{m.count=index;m.instanceMatrix.needsUpdate=true;});e.ring.visible=true;e.ring.position.set(0,.15,length);e.ring.scale.setScalar((1.3+phase*3)*s.power);e.ring.material.opacity=.6*fade*intensity;
  }
  updateJobs(t){const debris=this.debris,d=debris.dummy;let count=0;
   for(const j of [...this.jobs]){const age=(t-j.birth)/j.life;if(age>=1){this.release(j);continue;}const fade=clamp((1-age)*5,0,1);
    if(j.el===3){const z=Math.min(j.range,.35+age*j.range),grow=clamp(age*7+.45,.45,1);j.root.position.set(j.x+j.dx*z,j.y||0,j.z+j.dz*z);j.root.scale.set(j.power*fade,j.power*grow*fade,j.power*fade);j.body.rotation.z=Math.sin(age*8)*.025;for(let i=0;i<90;i++){const u=(age*1.7+i/90)%1,a=i*2.4,d=j.sprayDummy;d.position.set(-1+Math.cos(a)*(2.5+u*4),6.8+Math.sin(u*Math.PI)*(1.2+hash(i)*2.2)-u*3,Math.sin(a)*(1+u*2));d.scale.set(.5+hash(i),1+u*1.3,.6);d.updateMatrix();j.spray.setMatrixAt(i,d.matrix);}j.spray.instanceMatrix.needsUpdate=true;}
    else{j.root.scale.set(j.power,1+((j.tier||1)-1)*.09,j.range/20);for(let i=0;i<j.columns.length;i++){const localAge=age-i*.055,rise=clamp(localAge*12,0,1),sink=clamp((localAge-.62)*4,0,1),g=j.columns[i];g.visible=localAge>0;g.position.set(Math.sin(i*4)*.5,(1-rise)*-3.6-sink*3.5,1+i*2.1);g.scale.set(1,1+hash(i)*.7,1);}
     for(let i=0;i<36&&count<160;i++){const a=age-i*.006;if(a<0||a>.8)continue;const lane=(i%9)*j.range/10,z=1+lane+a*3,side=Math.sin(i*9)*(a*3+.4),y=.3+Math.sin(a/.8*Math.PI)*(1.5+hash(i)*2.5);d.position.set(j.x+j.dx*z+j.dz*side,y,j.z+j.dz*z-j.dx*side);d.rotation.set(a*7+i,a*8,a*3);d.scale.setScalar((.35+hash(i)*.75)*j.power*fade);d.updateMatrix();debris.mesh.setMatrixAt(count++,d.matrix);}
    }
   }debris.mesh.count=count;debris.mesh.instanceMatrix.needsUpdate=true;
  }
  update(time,gentle=false){this.time=time;this.gentle=gentle;let lit=null;for(let i=0;i<5;i++){const s=this.states[i],fade=clamp(1-(time-s.last)/.32,0,1);if(i===1)this.updateFire(s,time,fade);if(i===0)this.updateWind(s,time,fade);if(i===2)this.updateElectric(s,time,fade);if(fade>.1&&(i===1||i===2))lit={s,i,fade};}this.updateJobs(time);if(lit){this.light.color.set(lit.i===1?'#ff862b':'#a12bff');this.light.intensity=lit.fade*(lit.i===2?(gentle?1.2:Math.sin(time*55)>.2?5:.4):3);this.light.position.set(lit.s.x+lit.s.dx*(lit.i===2?lit.s.range:0),lit.i===2?8:2,lit.s.z+lit.s.dz*(lit.i===2?lit.s.range:0));}else this.light.intensity=0;}
  reset(){for(const j of [...this.jobs])this.release(j);for(const s of this.states){s.last=-99;s.lastSpawn=-99;}this.update(this.time);}
 }
 window.ElementEffects=ElementEffects;
})();
