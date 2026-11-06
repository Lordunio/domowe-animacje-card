const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function load(){
 const timers=new Map();let sequence=0;
 const clock=new Date('2026-11-06T12:00:00');
 class FixedDate extends Date{constructor(...args){super(...(args.length?args:[clock.getTime()]))}static now(){return clock.getTime()}}
 const context={Date:FixedDate,EventTarget,Event,Math,Symbol,console,customElements:{get:()=>false},window:{addEventListener(){}},document:{hidden:false,addEventListener(){}},localStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false,addEventListener(){}}),setTimeout:(fn,delay)=>{timers.set(++sequence,{fn,delay});return sequence},clearTimeout:id=>timers.delete(id)};
 const source=fs.readFileSync(path.join(__dirname,'../domowe-animacje-card.js'),'utf8').replace('  const runtimeKey =','  globalThis.exposed={normalize,inHours,nextAllowed,chooseCharacter,planScene,cleanerSVG,santaSVG,GhostRuntime};return;\n  const runtimeKey =');
 vm.runInNewContext(source,context);
 return {...context.exposed,context,timers};
}
test('old configuration migrates and new options reject invalid values',()=>{
 const {normalize}=load(),c=normalize({character:'leafrobot'});
 assert.equal(c.display_mode,'interval');assert.equal(c.lights_garland,false);assert.equal(c.cleaner_motion,true);
 for(const patch of [{display_mode:'bad'},{lights_layout:'bad'},{lights_garland:'true'},{cleaner_particles:1},{cleaner_motion:null}])assert.throws(()=>normalize(patch));
 assert.equal(normalize({display_mode:'continuous',lights_layout:'alternating',lights_garland:true}).lights_garland,true);
});
test('continuous passes always advance and reset beyond the viewport edges',()=>{
 const {normalize,planScene}=load();
 for(const width of [320,1280])for(const character of ['ghosts','robot2','santa','bunny','pumpkins','butterflies','cars','leafrobot','snowrobot'])for(const direction of ['left-to-right','right-to-left']){
  const items=planScene(normalize({character,direction,display_mode:'continuous',size:180}),width,740,false,()=>.5);
  for(const item of items){
   const xs=item.frames.map(frame=>{assert.equal(frame.opacity,1);return Number(frame.transform.match(/translate3d\(([^p]+)/)[1])});
   for(let i=1;i<xs.length;i++)assert.ok(direction==='left-to-right'?xs[i]>xs[i-1]:xs[i]<xs[i-1]);
   if(direction==='left-to-right'){assert.ok(xs[0]+item.width<0);assert.ok(xs.at(-1)>width)}
   else{assert.ok(xs[0]>width);assert.ok(xs.at(-1)+item.width<0)}
  }
 }
});
test('reduced-motion continuous scenes remain static; interval visits retain fading edges',()=>{
 const {normalize,planScene}=load();
 const fixed=planScene(normalize({character:'santa',display_mode:'continuous'}),360,740,true,()=>.5)[0];
 for(const frame of fixed.frames){assert.equal(frame.opacity,1);assert.equal(frame.transform,undefined)}
 const visit=planScene(normalize({character:'santa',display_mode:'interval'}),360,740,false,()=>.5)[0];
 assert.equal(visit.frames[0].opacity,0);assert.equal(visit.frames.at(-1).opacity,0);
});
test('continuous scheduler starts once, stops outside hours and resumes at next start',()=>{
 const {GhostRuntime,normalize,timers}=load(),rt=new GhostRuntime();let starts=0,stops=0;
 rt.syncLights=()=>{};rt.fly=()=>{starts++;rt.layer={remove(){}}};rt.stopFlight=()=>{stops++;rt.layer=null};
 rt.config=normalize({display_mode:'continuous'});rt.enabled=true;rt.schedule();rt.schedule();assert.equal(starts,1);
 rt.config=normalize({display_mode:'continuous',schedule_start:'18:00',schedule_end:'06:00'});rt.schedule();assert.equal(stops,1);assert.equal(rt.next.getHours(),18);
 assert.equal([...timers.values()].at(-1).delay,6*60*60*1000);
});
test('interval scheduler uses requested interval; continuous random recurs without added gap',()=>{
 const {GhostRuntime,normalize,timers}=load(),rt=new GhostRuntime();rt.syncLights=()=>{};rt.enabled=true;
 rt.config=normalize({interval_min:2,interval_max:2});rt.schedule();assert.equal([...timers.values()].at(-1).delay,120000);
 rt.config=normalize({display_mode:'continuous',character:'random'});let visits=0;rt.fly=()=>visits++;
 rt.finishVisit(5000,true);const timer=[...timers.values()].at(-1);assert.equal(timer.delay,5000);timer.fn();assert.equal(visits,1);
});
test('stopping a visit cancels animations and removes its overlay',()=>{
 const {GhostRuntime}=load(),rt=new GhostRuntime();let cancelled=0,removed=0;rt.animations=[{cancel(){cancelled++}}];rt.layer={remove(){removed++}};rt.stopFlight();assert.equal(cancelled,1);assert.equal(removed,1);assert.equal(rt.layer,null);
});
test('art has four moving reindeer legs, spinning robot parts and dense particles',()=>{
 const {santaSVG,cleanerSVG}=load();assert.equal((santaSVG().match(/class="real-reindeer-leg /g)||[]).length,4);
 assert.equal((cleanerSVG(false).match(/class="cleaner-particle leaf-particle"/g)||[]).length,42);
 assert.equal((cleanerSVG(true).match(/class="cleaner-particle snow-particle"/g)||[]).length,64);
 assert.ok(cleanerSVG(false).includes('cleaner-brush-spin'));
});
test('Santa dust stays under the sleigh and at four hoof positions in an expanded viewbox',()=>{
 const {santaSVG}=load(),svg=santaSVG();
 assert.equal((svg.match(/class="santa-dust-mote"/g)||[]).length,80);
 assert.ok(svg.includes('class="santa-dust"'));assert.ok(svg.includes('viewBox="-25 -12 2023 947"'));
});
