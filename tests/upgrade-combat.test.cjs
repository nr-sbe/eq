const {test}=require('node:test'),assert=require('node:assert/strict');
const {CampaignGame,CampaignState}=require('../campaign.js');
function arena(){const g=new CampaignGame(new CampaignState(),{demo:true});g.gates=[];g.orbs=[];g.encounters=[];g.obstacles=[];g.shrine.done=true;g.enemyStep=()=>{};g.element=1;return g;}
test('Sword hits only during its active sweep, once per target; element and tier are captured',()=>{
 const g=arena(),e=g.makeEnemy(0,12);e.weakness=4;e.hp=e.max=1000;g.cast(e,false,true);assert.equal(e.hp,1000);g.advance(.05,{});assert.equal(e.hp,1000);g.select(2);g.demoTier=7;g.advance(.2,{});assert.equal(e.hp,978);g.advance(.2,{});assert.equal(e.hp,978);assert.equal(g.events.filter(x=>x.type==='swordcontact').length,1);assert.equal(g.events.find(x=>x.type==='damage').element,1);
});
test('Sword finisher primes exactly one critical air cast, with a three second expiry',()=>{
 const g=arena(),e=g.makeEnemy(0,12);e.hp=e.max=10000;g.combo=2;g.comboExpiry=10;g.random=()=>1;g.cast(e,false,true);g.advance(.2,{});assert(g.airPrimedUntil>g.time);g.select(0);g.cast(e);g.cast(e);assert.deepEqual(g.events.filter(x=>x.type==='cast').map(x=>x.critical),[true,false]);g.airPrimedUntil=g.time+.1;g.advance(.2,{});g.cast(e);assert.equal(g.events.at(-1).critical===true,false);
});
test('Water marks heal regardless of finisher, only once; control recovery blocks stun locking',()=>{
 const g=arena(),e=g.makeEnemy(0,12);g.player.hp=50;g.hit(e,1,3);g.hit(e,1000,4);assert.equal(g.player.hp,60);g.hit(e,1000,3);assert.equal(g.player.hp,60);const b=g.makeEnemy(0,14);assert(g.disableEnemy(b,.4));g.time=.5;assert(!g.disableEnemy(b,.4));g.time=1.41;assert(g.disableEnemy(b,.4));
});
test('Attack budgets, minimum warnings and committed aim survive a guardian windup',()=>{
 const g=arena(),a=g.makeEnemy(1,15),b=g.makeEnemy(2,15),c=g.makeEnemy(3,15);assert(g.telegraph(a,'strike',2,.1));assert(g.telegraph(b,'melee',2,.1));assert(!g.telegraph(c,'melee'));assert(g.telegraphs.every(t=>t.max>=.9));g.telegraph(g.boss,'beam',5,.1);assert.equal(g.telegraphs.filter(t=>t.owner!==g.boss.id).length,1);assert(g.telegraphs.find(t=>t.owner===g.boss.id).max>=1.2);const aim=g.telegraphs.find(t=>t.owner===a.id);const x=aim.x;g.player.x+=10;g.advance(.1,{});assert.equal(aim.x,x);
});
test('All three Grid pylons can be acquired and destroyed normally from entrance and either side',()=>{
 for(const x of [0,-15,15]){const g=new CampaignGame(new CampaignState(),{demo:true,level:2});g.gates.forEach(e=>e.open=true);g.boss.active=true;g.player.x=g.level.centerAt(g.level.bossZ)+x;g.player.z=g.level.bossTrigger+8;g.element=2;for(let i=0;i<100&&g.relays.some(r=>r.hp>0);i++){const t=g.acquireTarget();assert(t&&t.kind==='relay');assert(g.visibleTarget(t));g.cast(t);}assert(g.relays.every(r=>r.hp===0));assert.equal(g.acquireTarget().id,g.boss.id);}
});
test('Showcase upgrades, retries and completion never alter campaign state',()=>{
 const c=new CampaignState(),before=c.serialize(),g=new CampaignGame(c,{mode:'showcase'});assert.equal(g.tier,1);assert.equal(g.unlocks.size,5);g.enemyStep=()=>{};
 for(const n of [0,1]){g.player.z=g.encounters[n].z;g.advance(1/60,{});for(const e of g.enemies)if(e.role!=='boss')e.hp=0;g.advance(1/60,{});assert.equal(g.tier,[4,7][n]);g.respawn();assert.equal(g.tier,[4,7][n]);}
 assert(g.specs.every(s=>s.impact===3&&s.control===3));g.complete();assert.equal(c.serialize(),before);
});
test('Version one migration and signature checkpoint round trips retain earned progress',()=>{const c=new CampaignState();c.unlocked=[0,1,2,3,4];const g=new CampaignGame(c);g.signature.done=true;g.saveCheckpoint();const saved=JSON.parse(c.serialize());saved.version=1;const restored=CampaignState.parse(JSON.stringify(saved)),h=new CampaignGame(restored);assert.equal(restored.version,2);assert(h.signature.done);assert.equal(h.unlocks.size,5);});
test('Temporary earth cover blocks a beam without blocking movement, and expires',()=>{const g=arena();g.element=4;g.cast(null,true);assert.equal(g.covers.length,1);assert(g.coverBlocks({x:0,z:20},g.player,'beam'));assert.equal(g.validPosition(0,13,8).z,13);g.advance(.2,{});for(let i=0;i<15;i++)g.advance(.2,{});assert.equal(g.covers.length,0);});
