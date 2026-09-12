const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
global.THREE=require('../three.min.js');global.window=global;global.SevenWorlds=require('../campaign.js');
const {CampaignGame,CampaignState}=SevenWorlds;
for(const file of ['world-detail.js','world.js'])vm.runInThisContext(fs.readFileSync(path.join(root,file),'utf8'));
// Exercise real authored geometry without requiring image loading or a GPU.
WorldView.prototype.makeTexture=function(){};WorldView.prototype.loadPBR=function(){this.pbr={};};
const originalAdd=WorldView.prototype.add;let solids=[];
WorldView.prototype.add=function(geometry,key,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){
 geometry.computeBoundingBox();const transform=new THREE.Object3D();transform.position.set(x,y,z);transform.scale.set(sx,sy,sz);transform.rotation.set(rx,ry,rz);transform.updateMatrix();const bounds=geometry.boundingBox.clone().applyMatrix4(transform.matrix);
 if(bounds.max.y>.8&&bounds.min.y<8)solids.push({key,bounds});
 return originalAdd.apply(this,arguments);
};
test('Western, cyberpunk and tomb guardians spawn clear of actual transformed scenery',()=>{
 for(const level of [1,2,3]){solids=[];const g=new CampaignGame(new CampaignState(),{demo:true,level}),world=new WorldView(new THREE.Scene(),g),p=g.boss;
  const overlaps=solids.filter(({bounds:b})=>p.x>b.min.x-3&&p.x<b.max.x+3&&p.z>b.min.z-3&&p.z<b.max.z+3);
  assert.equal(overlaps.length,0,g.level.name+' guardian intersects scenery');world.dispose();
 }
});
test('Rotated cliffs and dunes stay outside the entire curved road and optional shrine',()=>{
 for(const level of [1,3,4]){const g=new CampaignGame(new CampaignState(),{demo:true,level});for(const z of [60,180,300,420,540])for(const side of [-1,1]){
  let box;const view={game:g,add(geometry,key,x,y,z,sx,sy,sz,rx,ry,rz){geometry.computeBoundingBox();const m=new THREE.Object3D();m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.set(rx,ry,rz);m.updateMatrix();box=geometry.boundingBox.clone().applyMatrix4(m.matrix);geometry.dispose();}};
  WorldView.prototype.rock.call(view,'stone',side*55,12,z,25,24,65,1);
  for(let zz=box.min.z;zz<=box.max.z;zz+=2){const center=g.level.centerAt(zz);assert(side<0?box.max.x<=center-24.99:box.min.x>=center+24.99);}
  if(side>0&&box.min.z<g.level.shrine.z+24&&box.max.z>g.level.shrine.z-24)assert(box.min.x>=g.level.shrine.x+15.99);
 }}
});
test('Guardian spawn and charge landing reserve full body clearance around cover',()=>{
 const g=new CampaignGame(new CampaignState(),{demo:true,level:5});g.gates=[];g.encounters=[];g.shrine.done=true;const x=g.level.centerAt(550);g.obstacles=[{x,z:550,w:3.5,d:3.5,h:3}];
 const boss=g.makeEnemy(x,550,'boss');assert(Math.abs(boss.x-x)>=6.5||Math.abs(boss.z-550)>=6.5);
 g.player.x=x;g.player.z=550;g.telegraph(boss,'charge',6,1.2);g.enemyStep=()=>{};
 for(let i=0;i<74;i++)g.advance(1/60,{});
 assert(Math.abs(boss.x-x)>=6.5||Math.abs(boss.z-550)>=6.5,'charge embedded the guardian in cover');
});
