/* Keep guardians readable while relay targeting remains independent of framing. */
(function(root){
 const visible=(e,player)=>Math.abs(e.z-player.z)<=65&&(e.active||e.role==='boss'&&e.hp>0);
 function focus(game,target){const b=game.boss;return b?.active&&b.hp>0&&game.relays.some(r=>r.hp>0)?b:target;}
 function distance(base,aspect,boss){return base+(boss?(aspect<.8?23:5):0);}
 root.GuardianView={visible,focus,distance};if(typeof module==='object')module.exports=root.GuardianView;
})(typeof window==='object'?window:globalThis);
