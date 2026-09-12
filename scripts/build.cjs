/* Produce a deployment-only folder; relative URLs work under a GitHub project path. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
fs.mkdirSync(out,{recursive:true});
const files=['index.html','style.css','three.min.js','model-loader.js','hero-asset.js','campaign.js','sword-motion.js','character.js','effects.js','mastery-fx.js','impact-fx.js','audio.js','cinematic.js','keyboard.js','touch.js','world.js','damage-numbers.js','game.js','ASSET-CREDITS.md','THREE-LICENSE.txt','LICENSE'];
for(const file of files)fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});fs.writeFileSync(path.join(out,'.nojekyll'),'');console.log('Static game built in dist/');
