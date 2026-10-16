/* Operation-based preparation; conversion and CAM integration live in separate files. */
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const preferenceKey = 'ampoteket-pcb-v2-guidance';
let showGuidance = true;
try { showGuidance = localStorage.getItem(preferenceKey) !== 'false'; } catch {}
const helpState = {}, editors = {}, touched = new Set(), stockDrafts = {};
const defaults = {
  tracesDepth:'0.05', tracesFeed:'2', offsets:'4', stepover:'50',
  holesDepth:'1.65', holesPassDepth:'0.25', holesFeed:'0.5',
  outlineDepth:'1.65', outlinePassDepth:'0.25', outlineFeed:'0.5', jog:'5'
};
const examples = {
  lab:{name:'Battery + LED · 3 mm holes', file:'Basic_LED_Test_2mm_Cutter', minHole:3, holeText:'6 holes · all 3 mm'},
  small:{name:'Battery + LED · small holes', file:'Basic_LED_Test', minHole:0.8, holeText:'6 holes · smallest 0.8 mm'}
};
const state = {
  step:0, loaded:false, example:'lab', parts:false, holes:true, outline:true,
  stock:'lab', material:'FR2', boardThickness:'1.64', copperThickness:'35',
  traceSource:'lab', tool:'vbit', tipDiameter:'0.05', angle:'90', flatDiameter:'0.4',
  holeSource:'lab-outline', holeDiameter:'2', customHoleDiameter:'',
  outlineSource:'shared', outlineDiameter:'2', ...defaults
};
const steps = ['Board files','Plan the cuts','Review & mill'];
let example = () => examples[state.example];
const enabledOperations = () => ['traces', ...(state.holes?['holes']:[]), ...(state.outline?['outline']:[])];
const opTitle = op => ({traces:'Separate the tracks', holes:'Make the holes', outline:'Cut the board free'}[op]);
const depthKey = op => op === 'traces' ? 'tracesDepth' : op+'Depth';
const groupKeys = op => op === 'stock' ? ['boardThickness','copperThickness'] : op === 'travel' ? ['jog'] : op === 'traces' ? ['tracesDepth','tracesFeed','offsets','stepover'] : [op+'Depth',op+'PassDepth',op+'Feed'];
const toolKeys = op => op === 'traces' ? (state.tool==='vbit'?['tipDiameter','angle']:['flatDiameter']) : op==='holes' ? (state.holeSource==='lab-isolation'?[]:['holeDiameter']) : state.outlineSource==='shared' ? (state.holeSource==='lab-isolation'?[]:['holeDiameter']) : ['outlineDiameter'];
const labels = {boardThickness:'total board thickness', copperThickness:'copper thickness',tipDiameter:'tip diameter',angle:'included angle',flatDiameter:'cutting diameter',holeDiameter:'hole cutter diameter',outlineDiameter:'outline cutter diameter',tracesDepth:'copper cut depth',tracesFeed:'cutting speed',offsets:'clearing passes',stepover:'pass spacing',holesDepth:'holes total depth',holesPassDepth:'holes depth per pass',holesFeed:'holes cutting speed',outlineDepth:'outline total depth',outlinePassDepth:'outline depth per pass',outlineFeed:'outline cutting speed',jog:'travel height'};

function fieldError(key) {
  if (key==='holeDiameter' && state.holeSource==='lab-isolation') return '';
  if (key==='copperThickness' && state.copperThickness==='') return '';
  if (key==='boardThickness' && !state.holes && !state.outline && state[key]==='') return '';
  const value=Number(state[key]);
  if (state[key]==='' || !Number.isFinite(value) || value<=0) return 'Enter '+labels[key]+' greater than zero.';
  if (key==='angle' && value>=180) return 'Enter an included angle smaller than 180°.';
  if (key==='offsets' && !Number.isInteger(value)) return 'Enter a whole number of clearing passes.';
  if (key==='stepover' && value>100) return 'Pass spacing must be 100% or less.';
  if (key==='holeDiameter' && state.loaded && state.holes && value>=example().minHole) return value+' mm is too large for this board’s '+example().minHole+' mm holes. Choose a smaller cutter, or use the 3 mm-hole example.';
  if (['holesDepth','outlineDepth'].includes(key) && Number(state.boardThickness)>value) return 'This cut stops above the bottom of the '+state.boardThickness+' mm board. Increase the total depth.';
  if (key==='tracesDepth' && Number(state.boardThickness)>0 && value>=Number(state.boardThickness)) return 'This reaches through the board. Enter a shallow copper cut depth.';
  if (key==='tracesDepth' && Number(state.copperThickness)>0 && value<Number(state.copperThickness)/1000) return 'This stops inside the copper coating. Increase the depth to reach through it.';
  return '';
}
function issues() {
  const entries=[...groupKeys('stock').map(key=>({key,group:'stock'})),{key:'jog',group:'travel'}];
  for (const op of enabledOperations()) for (const key of [...toolKeys(op),...groupKeys(op)]) entries.push({key,group:op});
  return entries.filter((entry,i,a)=>a.findIndex(item=>item.key===entry.key)===i).map(entry=>({...entry,message:fieldError(entry.key)})).filter(entry=>entry.message);
}
function groupStatus(group) {
  const keys=groupKeys(group);
  if (issues().some(issue=>issue.group===group)) return 'Needs attention';
  if (group==='stock') return state.stock==='lab'?'Saved lab stock':'Other stock';
  return keys.every(key=>Number(state[key])===Number(defaults[key]))?'Example defaults':'Modified';
}
function toolName(op) {
  if (op==='traces') return state.traceSource==='lab'?'Red VHF RS-ISO-090-3-30':state.tool==='vbit'?'Other V-bit · '+state.angle+'° · '+state.tipDiameter+' mm tip':'Other flat end mill · '+(state.flatDiameter||'—')+' mm';
  if (op==='holes' || state.outlineSource==='shared') return state.holeSource==='lab-outline'?'Purple VHF LK-SV-0200-3-090-38 · 2 mm':state.holeSource==='lab-isolation'?'Red VHF RS-ISO-090-3-30':'Other end mill · '+(state.holeDiameter||'—')+' mm';
  return state.outlineSource==='lab'?'Purple VHF LK-SV-0200-3-090-38 · 2 mm':'Other outline cutter · '+(state.outlineDiameter||'—')+' mm';
}
function toolIdentity(op) {
  if (op==='traces') return state.traceSource==='lab'?'red':state.tool+':'+state.flatDiameter+':'+state.tipDiameter+':'+state.angle;
  if (op==='holes' || state.outlineSource==='shared') return state.holeSource==='lab-outline'?'purple':state.holeSource==='lab-isolation'?'red':'custom-hole:'+state.holeDiameter;
  return state.outlineSource==='lab'?'purple':'custom-outline:'+state.outlineDiameter;
}
function isRedThrough(op) { return op==='holes'?state.holeSource==='lab-isolation':op==='outline' && state.outlineSource==='shared' && state.holeSource==='lab-isolation'; }
function grooveWidth() {
  if (toolKeys('traces').some(fieldError) || fieldError('tracesDepth')) return null;
  return state.tool==='flat'?Number(state.flatDiameter):Number(state.tipDiameter)+2*Number(state.tracesDepth)*Math.tan(Number(state.angle)*Math.PI/360);
}
const fmt = value => Number(value.toFixed(4)).toString();
function effectRows(op) {
  if (op==='traces') {
    const width=grooveWidth();
    return [
      ['Cut depth',state.tracesDepth?state.tracesDepth+' mm below the copper surface':'Not entered'],
      ['Nominal groove',width?fmt(width)+' mm wide'+(state.tool==='vbit'?' · wider with a deeper cut':''):'Enter cutter dimensions and depth'],
      ['Copper clearing',state.offsets+' '+(Number(state.offsets)===1?'pass · a single groove':'passes · a wider margin around tracks')],
      ['Cutting speed',state.tracesFeed+' mm/s']
    ];
  }
  const depth=Number(state[op+'Depth']), thickness=Number(state.boardThickness), pass=Number(state[op+'PassDepth']);
  const reach=thickness>0 && depth>0 ? depth>=thickness?fmt(depth-thickness)+' mm past the bottom of the '+state.boardThickness+' mm board':fmt(thickness-depth)+' mm short of the bottom' : 'Enter the board thickness and total depth';
  return [['Total depth',state[op+'Depth']+' mm · '+reach],['Repeated cuts',pass>0&&depth>0?Math.ceil(depth/pass)+' depth passes · up to '+state[op+'PassDepth']+' mm deeper each time':'Enter depth per pass'],['Cutting speed',state[op+'Feed']+' mm/s']];
}
function numberField(label,key,unit,hint,options={}) {
  return '<label class="field" for="field-'+key+'"><span>'+label+'</span><div class="unit-input"><input id="field-'+key+'" type="number" data-field="'+key+'" value="'+escapeHtml(state[key])+'" min="0.001" step="'+(options.integer?'1':'any')+'" '+(options.readonly?'readonly ':'')+'aria-label="'+label+(unit?' ('+unit+')':'')+'" aria-describedby="hint-'+key+' error-'+key+'"><em>'+unit+'</em></div><small id="hint-'+key+'">'+hint+'</small><small id="error-'+key+'" class="form-error" hidden></small></label>';
}
function details(id,title,body,guide=false) {
  const open=Object.hasOwn(helpState,id)?helpState[id]:guide&&showGuidance;
  return '<details class="help '+(guide?'guide':'')+'" data-help="'+id+'" '+(open?'open':'')+'><summary id="help-title-'+id+'">'+title+'</summary><div class="help-body">'+body+'</div></details>';
}
function screen(title,intro,body) { return '<div class="screen-body"><p class="eyebrow">STEP '+(state.step+1)+' OF 3</p><h1 id="stage-title" tabindex="-1">'+title+'</h1><p class="intro">'+intro+'</p>'+body+'</div>'; }
function updateValidation() {
  for (const input of document.querySelectorAll('#screen input[data-field]')) {
    const key=input.dataset.field, error=fieldError(key), visible=error && touched.has(key);
    input.setAttribute('aria-invalid',String(Boolean(visible)));
    if ($('error-'+key)) { $('error-'+key).textContent=visible?error:''; $('error-'+key).hidden=!visible; }
  }
  for (const el of document.querySelectorAll('[data-status]')) { const status=groupStatus(el.dataset.status); el.textContent=status; el.classList.toggle('needs-attention',status==='Needs attention'); }
  for (const el of document.querySelectorAll('[data-effects]')) el.innerHTML=resultList(effectRows(el.dataset.effects));
  for (const el of document.querySelectorAll('[data-value]')) el.textContent=state[el.dataset.value]||'—';
  const problems=issues();
  if ($('plan-issues')) { $('plan-issues').innerHTML=issueList(problems); $('plan-issues').hidden=!problems.length; }
  $('next').disabled=state.step===1 && problems.length>0;
  $('next-reason').textContent=state.step===1&&problems.length?'Complete the highlighted settings to continue.':'';
  for (const button of document.querySelectorAll('[data-reset]')) button.disabled=groupKeys(button.dataset.reset).every(key=>state[key]===defaults[key]);
  if ($('save-settings')) $('save-settings').disabled=problems.length>0;
  document.querySelectorAll('[data-action=download-job],[data-action=send-job]').forEach(button=>button.disabled=!cam.results||cam.calculatedRevision!==cam.revision);
}
function render(focusId='') {
  $('guidance-toggle').setAttribute('aria-checked',String(showGuidance)); $('guidance-status').textContent=showGuidance?'On':'Off';
  $('steps').innerHTML=steps.map((title,i)=>'<button class="step" data-step="'+i+'" '+(i===state.step?'aria-current="step" ':'')+'><span class="step-number">0'+(i+1)+'</span><span>'+title+'</span></button>').join('');
  $('screen').innerHTML=[filesScreen,planScreen,reviewScreen][state.step]();
  $('previous').hidden=state.step===0; $('next').hidden=state.step===2;
  $('next').textContent=state.step===0?'Plan the cuts →':'Review & mill →'; $('progress').textContent=(state.step+1)+' of 3';
  renderSupport(); updateValidation(); if(focusId) $(focusId)?.focus();
}
function navigate(step,group='',key='') {
  state.step=step;
  if(group) editors[group]=true;
  if(key) touched.add(key);
  render(key?'field-'+key:group==='stock'?'stock-title':group?'op-'+group:'stage-title');
  if (!group&&!key) window.scrollTo({top:0,behavior:'instant'});
}
function loadExample(which) { importExample(which); }
document.addEventListener('click',event=>{
  const button=event.target.closest('button'); if(!button || button.disabled || cam.busy) return;
  if(button.dataset.reset||button.dataset.tool||button.dataset.stock)invalidateJob();
  if(button.dataset.step) { navigate(Number(button.dataset.step)); return; }
  if(button.dataset.example) { loadExample(button.dataset.example); return; }
  if(button.dataset.editor) { const group=button.dataset.editor; editors[group]=!editors[group]; render(editors[group]?'editor-'+group:'edit-'+group); return; }
  if(button.dataset.reset) { const group=button.dataset.reset; for(const key of groupKeys(group)) {state[key]=defaults[key]; touched.delete(key);} render('editor-'+group); return; }
  if(button.dataset.fix) { navigate(1,button.dataset.group,button.dataset.fix); return; }
  if(button.dataset.edit) { navigate(1,button.dataset.edit); return; }
  if(button.dataset.tool) { state.tool=button.dataset.tool; render('tool-'+state.tool); return; }
  const stock=button.dataset.stock;
  if(stock) {
    stockDrafts[state.stock]={material:state.material,boardThickness:state.boardThickness,copperThickness:state.copperThickness};
    state.stock=stock; Object.assign(state,stockDrafts[stock]||(stock==='lab'?{material:'FR2',boardThickness:'1.64',copperThickness:'35'}:{material:'Other',boardThickness:'',copperThickness:''}));
    render('stock-'+stock); return;
  }
  const action=button.dataset.action;
  if(action==='clear') {if(cam.board)Object.values(cam.board.images).forEach(image=>URL.revokeObjectURL(image.url));cam.board=null;invalidateJob();state.loaded=false;state.step=0;render('stage-title');}
  if(action==='parts') {state.parts=!state.parts;render('parts-toggle');}
  if(action==='export-help') {helpState.export=true;render('help-title-export');}
  if(action==='print') window.print();
  if(action==='save') {
    const data={kind:'ampoteket-pcb-settings',machine:'Roland SRM-20',calculated:Boolean(cam.results&&cam.calculatedRevision===cam.revision),sourceFiles:cam.board?.files,settings:{...state}};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='ampoteket-pcb-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
});
document.addEventListener('input',event=>{
  const key=event.target.dataset.field; if(!key) return;
  state[key]=event.target.value; invalidateJob(); updateValidation(); renderSupport();
});
document.addEventListener('focusout',event=>{if(event.target.dataset.field){touched.add(event.target.dataset.field);updateValidation();}});
document.addEventListener('change',event=>{
  const target=event.target, source=target.dataset.source;
  if(target.dataset.field||target.dataset.include||source)invalidateJob();
  if(target.dataset.field){state[target.dataset.field]=target.value;updateValidation();}
  if(target.dataset.include) {state[target.dataset.include]=target.checked;if(!state.holes&&state.outlineSource==='shared')state.outlineSource='lab';render(target.id);}
  if(source==='trace') {state.traceSource=target.value;if(target.value==='lab'){state.tool='vbit';state.tipDiameter='0.05';state.angle='90';}render('trace-source');}
  if(source==='hole') {if(state.holeSource==='custom')state.customHoleDiameter=state.holeDiameter;state.holeSource=target.value;state.holeDiameter=target.value==='lab-outline'?'2':target.value==='lab-isolation'?'':state.customHoleDiameter; touched.add('holeDiameter'); render('hole-source');}
  if(source==='outline') {state.outlineSource=target.value;if(target.value==='lab')state.outlineDiameter='2';render('outline-source');}
});
document.addEventListener('toggle',event=>{if(event.target.isConnected&&event.target.matches('details[data-help]'))helpState[event.target.dataset.help]=event.target.open;},true);
$('previous').addEventListener('click',()=>navigate(Math.max(0,state.step-1)));
$('next').addEventListener('click',()=>navigate(Math.min(2,state.step+1)));
$('guidance-toggle').addEventListener('click',()=>{
  showGuidance=!showGuidance; for(const key of Object.keys(helpState))delete helpState[key];
  try{localStorage.setItem(preferenceKey,String(showGuidance));}catch{}
  render('guidance-toggle');
});
