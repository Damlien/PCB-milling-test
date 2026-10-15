/* Same-origin adapter around the unmodified Mods runtime and module input events. */
const moduleIds={png:'0.566221118024989',distance:'0.47383876715576023',mill:'0.9557599338778935',vbit:'0.36353399738389447',writer:'0.26114261701202146'};
const referenceMode=new URLSearchParams(location.search).get('reference')==='1';
let pending=null;
function moduleInput(id,name,value) {
  const element=document.getElementById(JSON.stringify({id,type:'inputs',name}));
  if(!element) throw new Error('Missing Mods input: '+name);
  window.dispatchEvent(new CustomEvent(element.dataset.id,{detail:value}));
}
function moduleInterface(id) { return document.getElementById(JSON.stringify({id,type:'interface'})); }
function setInput(input,value) { input.value=value;input.dispatchEvent(new Event('input',{bubbles:true})); }
function applySettings(settings) {
  const writer=moduleInterface(moduleIds.writer).querySelectorAll('input[type="text"]');
  if(writer.length!==8) throw new Error('Unexpected SRM-20 control layout.');
  [settings.feed,0,0,0,settings.jog,0,0,settings.jog].forEach((value,i)=>setInput(writer[i],value));
  const mill=moduleInterface(moduleIds.mill), inputs=mill.querySelectorAll('input[type="text"]');
  if(referenceMode) {
    // Independent reference route: use the original metric UI controls and its
    // calculate button, rather than the adapter's settings input or V-bit sender.
    [[0,settings.diameter],[2,settings.passDepth],[4,settings.depth],[6,settings.offsets],[7,settings.stepover]].forEach(([index,value])=>setInput(inputs[index],value));
    return {diameter:Number(inputs[0].value),cutDepth:Number(inputs[2].value),maxDepth:Number(inputs[4].value),writerOrigin:[...writer].slice(1,4).map(input=>Number(input.value)),feed:Number(writer[0].value)};
  }
  const values={'tool diameter (mm)':settings.diameter,'cut depth (mm)':settings.passDepth,'max depth (mm)':settings.depth,'offset number':settings.offsets,'offset stepover':settings.stepover,'tool type':settings.vbit?'vbit':'flat'};
  if(settings.vbit) {
    const vbit=moduleInterface(moduleIds.vbit), toggle=vbit.querySelector('input[type="checkbox"]');
    toggle.checked=true;toggle.dispatchEvent(new Event('input',{bubbles:true}));
    const inputs=vbit.querySelectorAll('input[type="text"]');
    [settings.tip,settings.angle,settings.offsets,settings.stepover,settings.feed].forEach((value,i)=>setInput(inputs[i],value));
    setInput(inputs[6],settings.passDepth);
    [...vbit.querySelectorAll('button')].find(button=>button.textContent==='send calculated settings').click();
    // Match the original calculator's width at cut depth, with max depth
    // supplied separately for repeated passes. Taper warnings stay visible.
    values['tool diameter (mm)']=Number(inputs[5]._full);
    values['tool angle']=settings.angle;values['tool tip diameter (mm)']=settings.tip;
  }
  moduleInput(moduleIds.mill,'settings',values);
  return {diameter:Number(inputs[0].value),cutDepth:Number(inputs[2].value),maxDepth:Number(inputs[4].value),writerOrigin:[...writer].slice(1,4).map(input=>Number(input.value)),feed:Number(writer[0].value)};
}
function maybeCalculate() {
  if(pending?.imageInfo&&pending?.distances&&!pending.started) {
    pending.started=true;
    try{pending.applied=applySettings(pending.settings);if(referenceMode)[...moduleInterface(moduleIds.mill).querySelectorAll('button')].find(button=>button.textContent==='calculate').click();else moduleInput(moduleIds.mill,'settings',{calculate:true});}
    catch(error){finishError(error);}
  }
}
function finishError(error) {
  if(!pending)return;
  parent.postMessage({type:'ampoteket-error',id:pending.id,message:error.message},location.origin);pending=null;
}
window.addEventListener('error',event=>{if(pending)finishError(new Error(event.message));});
window.addEventListener('message',event=>{
  const message=event.data;
  if(event.source===window && message?.type==='moduleOutput' && pending) {
    if(message.module.id===moduleIds.png&&message.output==='imageInfo') pending.imageInfo=message.data;
    if(message.module.id===moduleIds.distance&&message.output==='distances') pending.distances=true;
    if(message.module.id===moduleIds.mill&&message.output==='toolpath') pending.path=message.data;
    if(message.module.id===moduleIds.writer&&message.output==='file'&&message.data?.type==='file') pending.file=message.data;
    maybeCalculate();
    if(pending?.file&&pending?.path) {
      parent.postMessage({type:'ampoteket-result',id:pending.id,file:pending.file,toolpath:pending.path,applied:pending.applied,imageInfo:pending.imageInfo},location.origin);pending=null;
    }
  }
  if(event.source===parent && event.origin===location.origin && message?.type==='ampoteket-calculate') {
    if(pending){parent.postMessage({type:'ampoteket-error',id:message.id,message:'The engine is already calculating.'},location.origin);return;}
    pending={id:message.id,settings:message.settings};
    window.postMessage({type:'png',data:message.png},location.origin);
  }
});
fetch('program.json').then(response=>{if(!response.ok)throw new Error('Mods program unavailable.');return response.json();}).then(program=>{
  window.mods_prog_load(program);
  parent.postMessage({type:'ampoteket-ready'},location.origin);
}).catch(error=>parent.postMessage({type:'ampoteket-host-error',message:error.message},location.origin));
