/* Real file import and processing controls, kept separate from layout and upstream engines. */
const illustrationFilesScreen=filesScreen, illustrationReviewScreen=reviewScreen;
const originalRenderSupport=renderSupport, originalUpdateValidation=updateValidation;
const originalBoardExample=example;
let selectedPreview='traces';
function publicBoard() { return cam.board?.summary; }
async function readFiles(selected,name='Imported board') {
  if(cam.busy)return;
  invalidateJob();cam.busy=true;cam.error='';cam.phase='Reading Gerber and drill files…';render();
  let prepared;
  try {
    const files=await PCBConversion.unpack(Array.from(selected));
    const source=await Promise.all(files.map(async file=>({file,text:await file.text()})));
    const copper=source.filter(({file,text})=>/FileFunction,Copper,/i.test(text)||/(?:[FB][_.-]?Cu\.gbr$|\.g[bt]l$)/i.test(file.name));
    if(copper.length!==1)throw new Error('Add exactly one copper Gerber (B.Cu or F.Cu), with the matching board edge and drill files.');
    validateGerber(copper[0],'copper');
    const side=copperSide(copper[0]);
    const edge=source.find(({file,text})=>/FileFunction,Profile,/i.test(text)||/Edge[_.-]?Cuts|\.gko$|\.gm1$/i.test(file.name));
    if(!edge)throw new Error('Include the Edge.Cuts Gerber to establish the shared board boundary and image alignment, even if you leave out the outside cut.');
    validateGerber(edge,'board edge');
    const drill=source.filter(({file,text})=>/\.drl$/i.test(file.name)||/^M48/m.test(text));
    const {sizes,count:holes}=roundHoleSummary(drill);
    cam.phase='Converting the board with Gerber2PNG…';render();
    // pcb-stackup also identifies layers by filename. Give it an unambiguous
    // copper alias for the side declared in the file; keep original bytes/hashes.
    const copperAlias='selected-'+(side==='top'?'F':'B')+'_Cu.gbr';
    const conversionFiles=files.map(file=>file===copper[0].file?new File([file],copperAlias,{type:file.type}):file);
    prepared=await PCBConversion.convert(conversionFiles,side);
    const manifest=await Promise.all(files.map(async file=>({name:file.name,bytes:file.size,sha256:[...new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))].map(value=>value.toString(16).padStart(2,'0')).join('')})));
    if(cam.board)Object.values(cam.board.images).forEach(image=>URL.revokeObjectURL(image.url));
    cam.board={...prepared,files:manifest,conversionAliases:[{sourceName:copper[0].file.name,converterName:copperAlias,role:'copper'}],side,name,summary:{name,file:name,minHole:sizes.length?Math.min(...sizes):Infinity,holeText:holes?holes+' openings · smallest specified drill '+fmt(Math.min(...sizes))+' mm':drill.length?'No holes in the drill files':'No drill file',width:prepared.dimensions.width,height:prepared.dimensions.height,side:side==='bottom'?'B.Cu':'F.Cu'}};
    state.loaded=true;state.holes=holes>0;if(!state.holes&&state.outlineSource==='shared')state.outlineSource='lab';invalidateJob();cam.phase='Board images ready.';selectedPreview='traces';
  } catch(error) {cam.error=error.message;cam.phase='Could not import the board.';if(prepared)Object.values(prepared.images).forEach(image=>URL.revokeObjectURL(image.url));}
  finally {cam.busy=false;render();}
}
async function importExample(which) {
  try {
    const names=await fetch('samples/'+which+'/files.json').then(response=>response.json());
    const files=await Promise.all(names.map(async name=>new File([await fetch('samples/'+which+'/'+name).then(response=>response.blob())],name)));
    state.example=which;state.holeSource=which==='lab'?'lab-outline':'custom';state.holeDiameter=which==='lab'?'2':'';state.outlineSource=which==='lab'?'shared':'lab';
    await readFiles(files,examples[which].name);
  } catch(error){cam.error=error.message;render();}
}
example=()=>publicBoard()||originalBoardExample();
filesScreen=function() {
  const error=cam.error?'<div class="notice" role="alert">'+escapeHtml(cam.error)+'</div>':'';
  const chooser='<label class="button" for="board-files">Choose Gerber / drill files</label><input class="sr-only" id="board-files" type="file" multiple accept=".zip,.gbr,.drl,.gbl,.gtl,.gko,.gm1,.txt" aria-label="Board manufacturing files">';
  if(!cam.board)return screen('Add board files','Export the finished board from KiCad, then add the copper, board edge and any drill files.',
    '<div class="upload-area"><h2>One matching set from KiCad</h2><p>Choose a ZIP or individual files. Processing takes place in this browser.</p>'+chooser+'<p class="hint">One B.Cu or F.Cu Gerber, Edge.Cuts, and Excellon drill files for any holes. The board edge keeps all images aligned.</p></div>'+error+
    details('export','How to export from KiCad',exportInstructions())+
    '<section class="example-section"><h2>Or load real example files</h2><p class="hint">These examples pass through the same converter as your own exports.</p><div class="example-options"><article><h3>Battery + LED · 3 mm holes</h3><p>The larger holes fit the purple 2 mm cutter.</p><button class="button primary" data-example="lab">Load lab cutter example →</button></article><article><h3>Battery + LED · small holes</h3><p>Holes down to 0.8 mm. Choose a smaller hole cutter.</p><button class="button" data-example="small">Load small-hole example →</button></article></div></section>');
  const board=example(),image=cam.board.images.traces;
  return screen('Check your board files','The board has been read and converted. Choose which operations to prepare.',
    '<h2>'+escapeHtml(board.name)+'</h2>'+resultList([['Copper side',board.side],['Gerber bounds',board.width+' × '+board.height+' mm'],['Holes',board.holeText],['Image canvas',image.pixelsWide+' × '+image.pixelsHigh+' pixels · 1000 DPI']])+
    '<p class="hint">Artwork bounds can include the outline stroke. The PNG canvas also includes Gerber2PNG’s 0.82 mm margin on each side.</p>'+
    '<ul class="file-list">'+cam.board.files.map(file=>'<li class="file-row"><code>'+escapeHtml(file.name)+'</code></li>').join('')+'</ul>'+
    '<fieldset class="operation-list"><legend>Cuts to prepare</legend><label class="operation-choice"><input type="checkbox" checked disabled>Separate the copper tracks</label><label class="operation-choice"><input id="include-holes" type="checkbox" data-include="holes" '+(state.holes?'checked':'')+' '+(!Number.isFinite(board.minHole)?'disabled':'')+'>Make the holes</label><label class="operation-choice"><input id="include-outline" type="checkbox" data-include="outline" '+(state.outline?'checked':'')+'>Cut the board free</label></fieldset>'+error+
    '<div class="actions-row section-rule"><button class="text-button" data-action="clear">Choose different files</button>'+chooser+'</div>');
};
function toolpathArtwork(op) {
  const image=(cam.jobImages?.images||cam.board.images)[op],result=cam.results?.[op];
  const paths=result?.toolpath.path||[];
  return '<svg class="calculated-preview" viewBox="0 0 '+image.pixelsWide+' '+image.pixelsHigh+'" role="img" aria-label="'+escapeHtml(opTitle(op))+' image'+(result?' with calculated cutter centre paths':'')+'"><image href="'+image.url+'" width="'+image.pixelsWide+'" height="'+image.pixelsHigh+'"/><g transform="translate(0 '+(image.pixelsHigh-1)+') scale(1 -1)" fill="none" stroke="#ff775f" stroke-width="2.5">'+paths.map(path=>'<path d="'+path.map((point,index)=>(index?'L':'M')+point[0]+','+point[1]).join(' ')+'"/>').join('')+'</g></svg>';
}
renderSupport=function() {
  if(!cam.board){originalRenderSupport();return;}
  const board=example(),op=selectedPreview;
  $('support').innerHTML='<section class="support-panel"><div class="panel-heading"><p class="eyebrow">IMPORTED BOARD</p><h2>'+escapeHtml(board.name)+'</h2><p>'+board.side+' · '+board.width+' × '+board.height+' mm artwork</p></div><div class="preview-tabs" role="group" aria-label="Preview operation">'+['traces','holes','outline'].map(key=>'<button class="button" data-preview="'+key+'" aria-pressed="'+(key===op)+'">'+({traces:'Copper',holes:'Holes',outline:'Outline'}[key])+'</button>').join('')+'</div><div class="board-view">'+toolpathArtwork(op)+'</div><div class="preview-caption"><p>'+(cam.results?.[op]?'Orange lines: calculated cutter centres. Line thickness is not cutter width.':'Converted machining image · no cutter paths yet.')+'</p><button class="text-button" data-png="'+op+'">Download machining image (PNG)</button><p class="hint">The PNG contains the black-and-white image. Coloured cutter paths appear only in the preview.</p></div></section>';
};
reviewScreen=function() {
  // Keep the run-sheet structure while replacing the mock export area and wording.
  const old=illustrationReviewScreen();
  const start=old.indexOf('<div class="download-block">'),end=old.indexOf('<section class="machine-run-sheet">');
  const complete=cam.results&&cam.calculatedRevision===cam.revision;
  const margin=cam.jobImages?'<p class="hint">This job uses a '+fmt(cam.jobImages.marginMm)+' mm image margin on every side, including '+cam.jobImages.extraPixels+' extra pixels for cutter clearance. All operations share the same canvas; the board is not scaled.</p>':'';
  const controls='<div class="download-block"><h2>Calculate the machine files</h2><p>Use Mods to calculate the selected operations from the converted board images.</p><button class="button primary" data-action="calculate" '+(cam.busy||issues().length?'disabled':'')+'>'+(complete?'Recalculate cutter paths':'Calculate cutter paths')+'</button>'+
    (cam.phase?'<p class="hint" role="status">'+escapeHtml(cam.phase)+'</p>':'')+(cam.error?'<div class="notice" role="alert">'+escapeHtml(cam.error)+'</div>':'')+
    (complete?'<p><strong>'+Object.keys(cam.results).length+' operation files ready.</strong> '+Object.values(cam.results).reduce((sum,result)=>sum+result.toolpath.path.length,0)+' cutting paths calculated.</p><button class="button primary" data-action="download-job">Download RML files (.zip)</button>':'<p class="hint">Calculate again after changing a cutter, cutting setting or board file.</p>')+
    margin+'<p class="hint">RML coordinates use the image’s lower-left corner as X/Y zero and the copper surface as Z zero. Origin offsets are 0, 0, 0 mm. The end-of-file return is X/Y 0, Z at the travel height.</p><button id="save-settings" class="text-button" data-action="save">Save current settings (.json)</button></div>';
  return (old.slice(0,start)+controls+old.slice(end)).replaceAll('EXAMPLE BOARD','BOARD FILES').replaceAll('36 × 20 mm · B.Cu',escapeHtml(example().width+' × '+example().height+' mm · '+example().side)).replace('These are example settings. No cutter paths have been calculated.',complete?'These settings match the current calculated files.':'Review the settings, then calculate the cutter paths below.').replace('Prototype 2 · example plan only · no machine files generated',complete?'Calculated with the local Gerber2PNG and Mods engines.':'No current machine files calculated.').replace('The image margin and board edge can differ; use the same placement for every file.','The file origin is the PNG canvas corner; the board edge is inset by the conversion margin. Use the same placement for every file.').replace('this prototype does not supply an RPM profile','no tested RPM profile is supplied').replace('<h3>Before the first file</h3>',margin+'<h3>Before the first file</h3>');
};
updateValidation=function() {
  originalUpdateValidation();
  $('previous').disabled=cam.busy;
  if(cam.busy) for(const element of document.querySelectorAll('#screen button,#screen input,#screen select,#next,#previous,#steps button'))element.disabled=true;
};
document.addEventListener('change',event=>{if(event.target.id==='board-files')readFiles(event.target.files,event.target.files.length===1?event.target.files[0].name:'Imported PCB');});
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled||cam.busy)return;
  if(button.dataset.preview){selectedPreview=button.dataset.preview;renderSupport();}
  if(button.dataset.png){const op=button.dataset.png;downloadBlob((cam.jobImages?.images||cam.board.images)[op].blob,op+'.png');}
  if(button.dataset.action==='calculate')calculateJob();
  if(button.dataset.action==='download-job')downloadJob();
});
render();
