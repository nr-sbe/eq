const {test}=require('node:test'),assert=require('node:assert/strict');
const {CampaignGame,CampaignState}=require('../campaign.js');
function game(){const g=new CampaignGame(new CampaignState(),{demo:true});g.gates=[];g.orbs=[];g.encounters=[];g.obstacles=[];g.shrine.done=true;return g;}
test('Running covers the same distance at every supported frame rate',()=>{
 const results=[30,60,120].map(fps=>{const g=game(),z=g.player.z;for(let i=0;i<fps;i++)g.advance(1/fps,{mz:1});assert.ok(Math.abs(g.player.z-z-13)<1e-8);const h=game();h.advance(1/60,{mz:1});assert.ok(Math.abs(h.player.z-8-13/60)<1e-8);return g.player.z;});assert.equal(results[0],results[1]);assert.equal(results[1],results[2]);
});
test('Faster movement still stops at a closed gate during a long frame and permits casting while running',()=>{const g=game();g.gates=[{x:0,z:12,open:false,type:1,hp:100,max:100,kind:'gate'}];g.advance(.2,{mz:1});assert.ok(g.player.z<=9);g.gates=[];g.advance(.1,{mz:1,cast:true});assert.ok(g.player.z>9);assert.ok(g.events.some(e=>e.type==='cast'));});
