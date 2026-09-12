/* Embedded Vanguard rig integration. Third-party rights: ASSET-CREDITS.md. */
(()=>{
 const T=THREE;
 function cloneRig(source){const clone=source.clone(true),map=new Map();function pair(a,b){map.set(a,b);for(let i=0;i<a.children.length;i++)pair(a.children[i],b.children[i]);}pair(source,clone);source.traverse(o=>{if(o.isSkinnedMesh){const c=map.get(o);c.skeleton=o.skeleton.clone();c.skeleton.bones=o.skeleton.bones.map(b=>map.get(b));c.bind(c.skeleton,o.bindMatrix);}});return clone;}
 function weapon(){const root=new T.Group(),steel=new T.MeshStandardMaterial({color:'#a2bac8',metalness:.72,roughness:.28}),dark=new T.MeshStandardMaterial({color:'#17252e',metalness:.5,roughness:.4}),energy=new T.MeshBasicMaterial({color:'#83bdd1'});
  const sh=new T.Shape();sh.moveTo(-.065,.13);sh.lineTo(-.085,1.48);sh.lineTo(.025,1.94);sh.lineTo(.11,1.55);sh.lineTo(.085,.13);sh.closePath();const blade=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.045,bevelEnabled:true,bevelThickness:.01,bevelSize:.012,bevelSegments:2}),steel);root.add(blade);
  const grip=new T.Mesh(new T.CylinderGeometry(.05,.06,.28,12),dark);grip.position.y=-.05;root.add(grip);const guard=new T.Mesh(new T.BoxGeometry(.34,.045,.11),steel);guard.position.y=.115;root.add(guard);const channel=new T.Mesh(new T.BoxGeometry(.014,1.22,.01),energy);channel.position.set(.015,.79,.058);root.add(channel);const reverseChannel=channel.clone();reverseChannel.position.z=-.014;root.add(reverseChannel);for(const side of [-1,1]){const prong=new T.Mesh(new T.BoxGeometry(.18,.035,.085),dark);prong.position.set(side*.2,.14,.015);prong.rotation.z=side*.35;root.add(prong);}for(let i=0;i<6;i++){const ring=new T.Mesh(new T.TorusGeometry(.053,.006,4,12),steel);ring.rotation.x=Math.PI/2;ring.position.y=-.15+i*.038;root.add(ring);}root.traverse(o=>{if(o.isMesh)o.castShadow=true;});return {root,energy};
 }

 // Wardens retain a skinned underlayer but have their own head, mantle and polearm silhouette.
 function createWarden(template,clips,scale,index,theme='japan',role='melee',weaknessColor=null){
  const r=new T.Group(),pivot=new T.Group();pivot.rotation.y=Math.PI;r.add(pivot);const m=cloneRig(template);pivot.add(m);const size=index===10?1.22:1.08;m.scale.set(scale*1.17*size,scale*size,scale*1.12*size);const bones={};
  m.traverse(o=>{if(o.isBone)bones[o.name.replace(/[^a-zA-Z0-9]/g,'')]=o;if(o.isSkinnedMesh){o.castShadow=o.receiveShadow=true;o.frustumCulled=false;
   if(o.name.includes('visor')){o.visible=false;return;}
   o.material=o.material.clone();o.material.color.set({japan:'#40363b',west:'#625343',cyber:'#263944',egypt:'#948767',ice:'#788994',gothic:'#3b3539',celestial:'#777080'}[theme]);if(weaknessColor)o.material.color.lerp(new T.Color(weaknessColor),.3);o.material.roughness=.8;o.material.metalness=.3;
   // Remove the player's helmet from this private geometry copy.
   const geo=o.geometry.clone(),ids=geo.attributes.skinIndex,weights=geo.attributes.skinWeight,original=geo.index,indices=[];
   const head=new Set(o.skeleton.bones.map((b,i)=>/Head|Neck/.test(b.name)?i:-1));
   function isHead(v){let weight=0;for(const read of ['getX','getY','getZ','getW'])if(head.has(ids[read](v)))weight+=weights[read](v);return weight>.45;}
   for(let i=0;i<(original?original.count:geo.attributes.position.count);i+=3){const tri=[0,1,2].map(k=>original?original.getX(i+k):i+k);if(!tri.some(isHead))indices.push(...tri);}geo.setIndex(indices);o.geometry=geo;
  }});
  const iron=new T.MeshStandardMaterial({color:'#28262c',metalness:.68,roughness:.48}),edge=new T.MeshStandardMaterial({color:'#62585a',metalness:.65,roughness:.54}),red=new T.MeshStandardMaterial({color:{japan:'#691e25',west:'#654a35',cyber:'#17495a',egypt:'#566f69',ice:'#839ba4',gothic:'#492527',celestial:'#686080'}[theme],roughness:.96,side:T.DoubleSide}),glow=new T.MeshBasicMaterial({color:new T.Color(role==='support'?'#74d6ad':{japan:'#ff6536',west:'#dca879',cyber:'#eb378a',egypt:'#e7cb79',ice:'#9bdbef',gothic:'#f7954b',celestial:'#d4acff'}[theme]).multiplyScalar(1.7)});
  if(weaknessColor){const tint=new T.Color(weaknessColor);edge.color.copy(tint).multiplyScalar(.72);edge.emissive.copy(tint).multiplyScalar(.14);red.color.copy(tint).multiplyScalar(.45);glow.color.copy(tint).multiplyScalar(1.5);}
  const gear=new T.Group();gear.scale.setScalar(size);r.add(gear);
  function mesh(geo,mat,parent=gear){const o=new T.Mesh(geo,mat);o.castShadow=o.receiveShadow=true;parent.add(o);return o;}
  function plate(points,depth,mat,parent){const sh=new T.Shape();points.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();const g=new T.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2});g.translate(0,0,-depth/2);return mesh(g,mat,parent);}
  const head=new T.Group();head.scale.setScalar(.62);gear.add(head);
  plate([[-.27,-.31],[-.36,.05],[-.3,.42],[0,.58],[.3,.42],[.36,.05],[.22,-.31],[0,-.4]],.55,iron,head);
  for(const side of [-1,1]){const brow=plate([[0,.14],[side*.28,.21],[side*.25,.11],[side*.04,.06]],.03,edge,head);brow.position.z=.3;
   const slit=mesh(new T.BoxGeometry(.2,.024,.025),glow,head);slit.position.set(side*.135,.09,.328);slit.rotation.z=side*.15;
   const crown=plate([[side*.22,.27],[side*.4,.91],[side*.5,1.04],[side*.48,.38]],.095,iron,head);crown.position.z=-.1;crown.visible=!['west','cyber'].includes(theme);
   const cheek=plate([[side*.03,.04],[side*.28,-.02],[side*.2,-.29],[side*.03,-.33]],.045,edge,head);cheek.position.z=.31;
  }
  if(theme==='west'){const brim=mesh(new T.CylinderGeometry(.72,.78,.08,20),iron,head);brim.position.y=.37;const hat=mesh(new T.CylinderGeometry(.38,.43,.5,12),red,head);hat.position.y=.58;}if(theme==='cyber'){const antenna=mesh(new T.CylinderGeometry(.025,.025,1,6),glow,head);antenna.position.set(.36,.5,0);}
  const crest=plate([[-.055,.3],[0,.76],[.055,.3]],.16,edge,head);crest.position.z=.03;
  const mantle=new T.Group();mantle.scale.set(.82,.9,.85);gear.add(mantle);for(const side of [-1,1])for(let j=0;j<3;j++){const shoulder=plate([[-.32,.12],[-.2,.32],[.25,.25],[.43,-.03],[.15,-.2],[-.28,-.14]],.58,j===0?edge:iron,mantle);shoulder.position.set(side*(.52+j*.08),.01-j*.14,-.02+j*.035);shoulder.rotation.z=side*-.16;shoulder.scale.x=side;}
  const chest=plate([[-.38,.16],[0,.3],[.38,.16],[.28,-.62],[0,-.85],[-.28,-.62]],.15,edge,mantle);chest.position.z=.34;
  for(let j=0;j<3;j++){const vent=mesh(new T.BoxGeometry(.028,.18,.02),glow,mantle);vent.position.set((j-1)*.08,-.25,.43);}
  const clothGeo=new T.PlaneGeometry(1,1,16,22),cloth=mesh(clothGeo,red,mantle),cp=clothGeo.attributes.position;
  const pole=new T.Group();gear.add(pole);mesh(new T.CylinderGeometry(.038,.045,2.7,10),iron,pole);for(let j=0;j<5;j++){const band=mesh(new T.CylinderGeometry(.053,.053,.035,10),edge,pole);band.position.y=-.35+j*.12;}
  const blade=plate([[0,1.13],[-.19,1.5],[0,2.16],[.19,1.5]],.065,edge,pole);const inset=plate([[0,1.43],[-.04,1.58],[0,1.99],[.04,1.58]],.07,glow,pole);inset.position.z=.01;
  if(role==='shield'){const shield=mesh(new T.BoxGeometry(.8,1.4,.16),edge,mantle);shield.position.set(-.8,-.25,.6);const strip=mesh(new T.BoxGeometry(.06,1,.18),glow,shield);}
  if(role==='ranged'){pole.scale.set(.55,.48,.8);pole.rotation.x=1.1;}if(role==='support'){pole.scale.set(.8,.8,.8);mesh(new T.IcosahedronGeometry(.27,1),glow,pole).position.y=1.8;}
  if(theme==='west'&&(role==='ranged'||role==='boss')){pole.children.forEach(o=>o.visible=false);const stock=mesh(new T.BoxGeometry(.16,.23,.8),red,pole);stock.position.set(0,0,.1);const barrel=mesh(new T.CylinderGeometry(.043,.043,1.45,9),iron,pole);barrel.rotation.x=Math.PI/2;barrel.position.set(0,.06,.95);const grip=mesh(new T.BoxGeometry(.12,.3,.18),iron,pole);grip.position.set(0,-.17,.15);pole.scale.setScalar(1);pole.rotation.x=0;}
  if(role==='boss'&&theme==='gothic'){for(const side of [-1,1]){const exhaust=mesh(new T.CylinderGeometry(.15,.2,1.3,10),iron,mantle);exhaust.position.set(side*.5,.65,-.25);}const gearWheel=mesh(new T.TorusGeometry(.65,.12,7,12),edge,mantle);gearWheel.position.set(0,-.2,-.5);}
  if(role==='boss'&&theme==='celestial'){const halo=mesh(new T.TorusGeometry(.85,.035,5,48),glow,head);halo.position.set(0,.5,-.3);}
  const mx=new T.AnimationMixer(m),idle=mx.clipAction(clips.find(c=>c.name==='Idle')).play(),run=mx.clipAction(clips.find(c=>c.name==='Run')).play();let tick=0;const world=new T.Vector3();
  function place(object,name,dy=0){const bone=bones['mixamorig'+name];if(!bone)return;bone.getWorldPosition(world);gear.worldToLocal(world);object.position.copy(world);object.position.y+=dy;}
  return {root:r,update(t,moving){mx.update(Math.min(.05,Math.max(0,t-tick)));tick=t;idle.setEffectiveWeight(moving?.1:1);run.setEffectiveWeight(moving?.9:0);r.updateMatrixWorld(true);place(head,'Head',.15);place(mantle,'Spine2',-.12);place(pole,'RightHand',.35);pole.rotation.z=.16;
   for(let i=0;i<cp.count;i++){const x=(i%17)/16*2-1,u=Math.floor(i/17)/22,width=.77+u*.18,y=-u*2.04+Math.pow(u,12)*Math.sin(x*19+index)*.13,z=-.31-Math.pow(u,.7)*(.23+(moving?.28:.05))+.055*Math.cos(x*15)+Math.sin(t*(moving?8:3)+u*8+x*2+index)*.09*u;cp.setXYZ(i,x*width,y,z);}cp.needsUpdate=true;clothGeo.computeVertexNormals();
  }};
 }


 function createDrone(index,weaknessColor=null){const root=new T.Group(),body=new T.Group();root.add(body);const iron=new T.MeshStandardMaterial({color:'#243540',metalness:.8,roughness:.3}),light=new T.MeshBasicMaterial({color:weaknessColor||'#ee54b0'});if(weaknessColor){iron.color.lerp(new T.Color(weaknessColor),.6);iron.emissive.set(weaknessColor).multiplyScalar(.12);}const add=(g,m,x,y,z)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;body.add(o);return o;};add(new T.IcosahedronGeometry(.8,1),iron,0,0,0).scale.set(1,.5,1);add(new T.SphereGeometry(.2,12,8),light,0,0,.7);const rotors=[];for(const side of [-1,1]){add(new T.BoxGeometry(2,.13,.35),iron,side,0,0);for(const front of [-1,1]){const r=add(new T.TorusGeometry(.5,.09,7,24),iron,side*1.3,0,front*.65);r.rotation.x=Math.PI/2;const blade=add(new T.BoxGeometry(.9,.035,.09),light,side*1.3,.02,front*.65);rotors.push(blade);}}return{root,update(t){body.position.y=2.9+Math.sin(t*2+index)*.2;body.rotation.z=Math.sin(t+index)*.08;rotors.forEach(r=>r.rotation.y=t*35);}};}
 function createActionHero(){
  const root=new T.Group(),sword=weapon();root.add(sword.root);sword.root.visible=false;let template=null,clips=null,model=null,mixer=null,current=null,actions={},last=0,bones={},scale=1;const aimY=new T.Vector3(0,1,0),v=new T.Vector3(),q=new T.Quaternion(),parentQ=new T.Quaternion();
  const ready=new Promise((resolve,reject)=>{try{const binary=atob(window.FivefoldHeroData),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);new window.GLTFLoader().parse(bytes.buffer,'',gltf=>{
   template=gltf.scene;clips=gltf.animations;model=cloneRig(template);const pivot=new T.Group();pivot.rotation.y=Math.PI;root.add(pivot);pivot.add(model);model.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(model);scale=2.72/(bounds.max.y-bounds.min.y);model.scale.setScalar(scale);model.position.y=-bounds.min.y*scale;
   model.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;o.frustumCulled=false;o.material=o.material.clone();o.material.roughness=Math.max(.4,o.material.roughness||.5);o.material.color.set('#718896');if(o.name.includes('visor')){o.material.transparent=false;o.material.opacity=1;o.material.color.set('#263c49');o.material.metalness=.8;o.material.roughness=.22;}}if(o.isBone)bones[o.name.replace(/[^a-zA-Z0-9]/g,'')]=o;});
   mixer=new T.AnimationMixer(model);for(const clip of clips)actions[clip.name]=mixer.clipAction(clip);current=actions.Idle;current.play();mixer.update(.01);root.updateMatrixWorld(true);sword.root.visible=true;resolve();
  },reject);}catch(e){reject(e);}});
  function bone(name){return bones['mixamorig'+name];}
  function aim(name,point){const b=bone(name);if(!b)return;b.getWorldPosition(v);const target=root.localToWorld(point.clone());target.sub(v).normalize();q.setFromUnitVectors(aimY,target);b.parent.getWorldQuaternion(parentQ);q.premultiply(parentQ.invert());b.quaternion.slerp(q,.9);b.updateMatrixWorld(true);}
  return {root,ready,swordSegment(){sword.root.updateWorldMatrix(true,false);return {base:sword.root.localToWorld(new T.Vector3(0,.2,0)),tip:sword.root.localToWorld(new T.Vector3(0,1.94,0))};},hands(){return ['LeftHand','RightHand'].map(name=>{const b=bone(name);return b?b.getWorldPosition(new T.Vector3()):null;}).filter(Boolean);},update(t,p,casting,element){if(!mixer)return;const dt=Math.min(.05,Math.max(0,t-last));last=t;const next=p.moving>.1?actions.Run:actions.Idle;if(current!==next){next.reset().play();current.crossFadeTo(next,.18,false);current=next;}mixer.update(dt*(p.moving?1.65:1));root.updateMatrixWorld(true);
   const striking=p.swordAnim>0,pose=striking?SwordMotion.pose(p.combo,1-p.swordAnim/(p.swordDuration||.34)):null;
   root.position.y=pose?-pose.sink*.18:0;
   if(pose){const spine=bone('Spine'),chest=bone('Spine2');if(spine){spine.rotation.y+=pose.twist*.45;spine.rotation.x+=pose.lean*.5;}if(chest){chest.rotation.y+=pose.twist*.55;chest.rotation.x+=pose.lean*.5;}root.updateMatrixWorld(true);
    const h=new T.Vector3(...pose.hand),elbow=h.clone().lerp(new T.Vector3(-.7,1.8,.2),.4);elbow.x-=.2;
    aim('RightArm',elbow);aim('RightForeArm',h);
    const left=new T.Vector3(...pose.left);aim('LeftArm',left.clone().lerp(new T.Vector3(.6,1.7,.1),.35));aim('LeftForeArm',left);
   }else if(casting){aim('LeftArm',new T.Vector3(-.35,1.8,2.2));aim('LeftForeArm',new T.Vector3(-.3,1.75,3));aim('RightArm',new T.Vector3(.6,1.6,1.2));aim('RightForeArm',new T.Vector3(.6,1.55,2));}
   const hand=bone('RightHand');if(hand){hand.getWorldPosition(v);root.worldToLocal(v);sword.root.position.copy(v);if(pose){const direction=new T.Vector3(...pose.tip).sub(v).normalize();sword.root.quaternion.setFromUnitVectors(aimY,direction);}else sword.root.rotation.set(casting?1.35:-.25,0,casting?.35:.48);}sword.energy.color.set(casting||striking?Fivefold3D.elements[element].color:'#82b8ce');if(casting||striking)sword.energy.color.multiplyScalar(striking?2.6:2);
  },makeEnemy(index,theme,role,weaknessColor=null){if(theme==='cyber'&&role==='ranged')return createDrone(index,weaknessColor);return createWarden(template,clips,scale,index,theme,role,weaknessColor);}};
 }
 window.createActionHero=createActionHero;
})();
