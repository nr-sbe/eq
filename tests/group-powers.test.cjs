const {test}=require('node:test'),assert=require('node:assert/strict');
const {CampaignState,CampaignGame}=require('../campaign.js');
function arena(tier=1){const g=new CampaignGame(new CampaignState(),{demo:true,tier});g.gates=[];g.orbs=[];g.encounters=[];g.obstacles=[];g.shrine.done=true;g.player.x=0;g.player.z=0;g.player.dx=0;g.player.dz=1;return g;}
function enemy(g,x,z){const e=g.makeEnemy(x,z);e.hp=e.max=10000;e.weakness=-1;return e;}
test('one campaign run reaches all Tier 7 forms and maxes all thirty upgrade ranks before the finale',()=>{
 let c=new CampaignState();c.unlocked=[0,1,2,3,4];
 for(let level=0;level<6;level++){const g=new CampaignGame(c,{level});g.relays.forEach(r=>r.hp=0);g.boss.active=true;g.hit(g.boss,1e6,0);assert.equal(c.points,5);assert.equal(c.upgradeAll(),5);assert.equal(c.points,0);assert.ok(c.specializations.every(s=>s.impact+s.control===level+1));c=CampaignState.parse(c.serialize());}
 const finale=new CampaignGame(c,{level:6});assert.equal(finale.tier,7);assert.equal(finale.unlocks.size,5);assert.ok(finale.specs.every(s=>s.impact===3&&s.control===3));
 const before=c.earned;finale.complete();finale.complete();assert.equal(c.earned,before);c.refund();assert.equal(c.points,30);c.upgradeAll();assert.equal(c.spent,30);
});
test('previous saves receive the extra guardian points without replay or loss of chosen ranks',()=>{
 const c=new CampaignState();c.completed=[0,1,2];c.highest=3;c.specializations[1].impact=3;
 const loaded=CampaignState.parse(c.serialize());assert.equal(loaded.points,12);assert.equal(loaded.specializations[1].impact,3);loaded.upgradeAll();assert.equal(loaded.spent,15);assert.equal(loaded.specializations[1].impact,3);
});
test('crystals awaken across the walkable street, remain sequential and cannot be collected through closed gates',()=>{
 for(const side of [-18,0,18]){const g=new CampaignGame(new CampaignState());g.obstacles=[];g.encounters=[];
  for(let i=0;i<5;i++){const orb=g.currentOrb;g.player.x=g.level.centerAt(orb.z)+side;g.player.z=orb.z-5;g.advance(1/60,{});assert.ok(g.canUse(orb.type));assert.equal(g.unlocks.size,i+1);if(i<4){g.player.z=g.orbs[i+1].z;g.advance(1/60,{});assert.equal(g.unlocks.size,i+1,'next crystal stays behind its gate');}g.gates[i].open=true;}
 }
});
test('every regular power hits multiple enemies from Tier 1 through 7 without hitting behind or through cover',()=>{
 for(let tier=1;tier<=7;tier++)for(let el=0;el<5;el++){const g=arena(tier);g.element=el;const primary=enemy(g,0,20),near=enemy(g,2,20),near2=enemy(g,-2,21),behind=enemy(g,0,-10),far=enemy(g,0,40),inactive=enemy(g,0,21),blocked=enemy(g,5,20);inactive.active=false;g.obstacles=[{x:4,z:16,w:.8,d:.8}];
  g.cast(primary);for(const e of [primary,near,near2])assert.ok(e.hp<e.max,`element ${el}, tier ${tier} should hit group`);
  for(const e of [behind,far,inactive,blocked])assert.equal(e.hp,e.max,`element ${el}, tier ${tier} must respect bounds`);
  const event=g.events.find(e=>e.type==='cast');assert.ok(event.targets.length>=3);
 }
});
test('free aiming hits a group, tempest covers a wider area, and direct hits do not also receive a chain hit',()=>{
 for(let el=0;el<5;el++){const g=arena();g.element=el;const a=enemy(g,0,25),b=enemy(g,2,25);g.cast(null);assert.ok(a.hp<a.max&&b.hp<b.max);}
 const g=arena(2);g.element=2;const a=enemy(g,0,20),b=enemy(g,2,20),wide=enemy(g,10,20);g.cast(a);assert.ok(Math.abs(b.max-b.hp-8*1.2)<1e-8);g.events=[];const prior=wide.hp;g.cast(a,true);assert.ok(wide.hp<prior);
});
test('weakness grants fifty percent bonus to powers and infused sword, including guardians; shielding is preserved',()=>{
 for(let el=0;el<5;el++)for(const sword of [false,true]){const g=arena();g.element=el;const e=enemy(g,0,sword?3:20);e.weakness=el;g.random=()=>1;g.cast(e,false,sword);if(sword){g.enemyStep=()=>{};g.advance(.2,{});}assert.equal(e.max-e.hp,(sword?22:8)*1.5);assert.equal(g.events.find(e=>e.type==='damage').weak,true);}
 const g=arena(),shield=g.makeEnemy(0,20,'shield');assert.equal(shield.weakness,4);g.hit(shield,10,1,false);assert.equal(shield.max-shield.hp,4.5);const before=shield.hp;g.hit(shield,10,4,false);assert.equal(before-shield.hp,15);
 g.boss.active=true;const hp=g.boss.hp;g.hit(g.boss,10,g.boss.weakness,false);assert.equal(hp-g.boss.hp,15);
 const cyber=new CampaignGame(new CampaignState(),{demo:true,level:2});const protectedHp=cyber.boss.hp;cyber.hit(cyber.boss,10,cyber.boss.weakness);assert.equal(cyber.boss.hp,protectedHp);
});
test('each world contains readable enemy weaknesses covering all five elements across roles',()=>{
 const found=new Set();for(let level=0;level<7;level++){const g=new CampaignGame(new CampaignState(),{demo:true,level});for(let i=0;i<12;i++)for(const role of ['melee','ranged','shield','support']){const e=g.makeEnemy(i,20,role);assert.ok(Number.isInteger(e.weakness)&&e.weakness>=0&&e.weakness<5);found.add(e.weakness);}assert.ok(g.boss.weakness>=0);}
 assert.equal(found.size,5);
});
test('group damage and weakness multipliers remain identical at 30, 60 and 120 FPS',()=>{
 const results=[30,60,120].map(fps=>{const g=arena(7);g.enemyStep=()=>{};g.element=2;const foes=[enemy(g,0,20),enemy(g,2,20),enemy(g,-2,20)];foes[1].weakness=2;for(let i=0;i<fps*5;i++){g.advance(1/fps,{cast:true});g.events=[];}return foes.map(e=>e.max-e.hp);});assert.deepEqual(results[0],results[1]);assert.deepEqual(results[1],results[2]);
});
