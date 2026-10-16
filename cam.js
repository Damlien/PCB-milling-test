/* One fresh local Mods frame per operation prevents stale results and settings. */
const cam={board:null,jobImages:null,results:null,busy:false,phase:'',error:'',revision:0,calculatedRevision:-1};
function invalidateJob() {
  cam.revision++;cam.results=null;cam.calculatedRevision=-1;cam.error='';cam.phase='';
  if(cam.jobImages?.extraPixels)Object.values(cam.jobImages.images).forEach(image=>URL.revokeObjectURL(image.url));
  cam.jobImages=null;
}
function calculateWithMods(png,settings,reference=false) {
  return new Promise((resolve,reject)=>{
    const frame=document.createElement('iframe'),id=crypto.randomUUID();
    frame.className='engine-frame';frame.title='Local Mods calculation engine';frame.setAttribute('aria-hidden','true');frame.tabIndex=-1;
    const timeout=setTimeout(()=>finish(new Error('Mods did not finish this operation within three minutes.')),180000);
    let done=false;
    function finish(error,result) {if(done)return;done=true;clearTimeout(timeout);window.removeEventListener('message',receive);frame.remove();error?reject(error):resolve(result);}
    async function receive(event) {
      if(event.source!==frame.contentWindow||event.origin!==location.origin)return;
      const message=event.data;
      if(message?.type==='ampoteket-ready') frame.contentWindow.postMessage({type:'ampoteket-calculate',id,png,settings},location.origin);
      if(message?.type==='ampoteket-host-error') finish(new Error(message.message));
      if(message?.id!==id)return;
      if(message.type==='ampoteket-error')finish(new Error(message.message));
      if(message.type==='ampoteket-result')finish(null,message);
    }
    window.addEventListener('message',receive);frame.src='engines/mods-host.html'+(reference?'?reference=1':'');document.body.appendChild(frame);
  });
}
function camSettings(op) {
  const trace=op==='traces',red=trace?state.tool==='vbit':isRedThrough(op);
  const vbit=red?{tip:trace?Number(state.tipDiameter):0.05,angle:trace?Number(state.angle):90}:{};
  return {vbit:red,...vbit,diameter:trace?Number(state.flatDiameter):op==='holes'||state.outlineSource==='shared'?Number(state.holeDiameter):Number(state.outlineDiameter),
    depth:Number(state[depthKey(op)]),passDepth:trace?Number(state.tracesDepth):Number(state[op+'PassDepth']),feed:Number(state[op+'Feed']),jog:Number(state.jog),offsets:trace?Number(state.offsets):1,stepover:trace?Number(state.stepover)/100:0.5};
}
async function calculateJob() {
  if(cam.busy||!cam.board||issues().length)return;
  cam.busy=true;cam.error='';cam.results=null;
  if(cam.jobImages?.extraPixels)Object.values(cam.jobImages.images).forEach(image=>URL.revokeObjectURL(image.url));
  cam.jobImages=null;cam.phase='Preparing aligned machining images…';render();
  const revision=cam.revision, snapshot=JSON.stringify(state), results={};
  try {
    let margin=0.82;
    for(const op of enabledOperations()) {
      const settings=camSettings(op);
      const width=settings.vbit?settings.tip+2*settings.passDepth*Math.tan(settings.angle*Math.PI/360):settings.diameter;
      const reach=width*(0.5+(op==='traces'?(settings.offsets-1)*settings.stepover:0));
      margin=Math.max(margin,reach+0.3);
    }
    cam.jobImages=await PCBConversion.withMargin(cam.board.images,margin);
    const canvas=cam.jobImages.images.traces;
    if(canvas.pixelsWide*25.4/1000>203.2||canvas.pixelsHigh*25.4/1000>152.4)throw new Error('The board plus cutter clearance exceeds the SRM-20 working area (203.2 × 152.4 mm).');
    for(const op of enabledOperations()) {
      cam.phase='Calculating '+opTitle(op).toLowerCase()+'…';render();
      const result=await calculateWithMods(await cam.jobImages.images[op].blob.arrayBuffer(),camSettings(op));
      if(!result.toolpath?.path?.length)throw new Error(opTitle(op)+': Mods returned no cutting paths. Check the cutter size and image.');
      if(!result.file?.contents?.startsWith('PA;PA;'))throw new Error('Mods did not produce the expected SRM-20 RML file.');
      const edgeClipped=result.toolpath.path.some(path=>path.some(point=>point[0]<=1||point[1]<=1||point[0]>=result.toolpath.width-2||point[1]>=result.toolpath.height-2));
      if(edgeClipped)throw new Error(opTitle(op)+': a cutting path touches the image boundary. The outline or clearing area may be incomplete.');
      results[op]=result;
    }
    if(cam.revision!==revision||JSON.stringify(state)!==snapshot)throw new Error('Settings changed during calculation. Calculate again for the current job.');
    cam.results=results;cam.calculatedRevision=revision;cam.phase='All selected operations calculated.';
  } catch(error) {cam.error=error.message;cam.phase='Calculation needs attention.';}
  finally {cam.busy=false;render();}
}
function downloadBlob(blob,name) {
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
}
async function createJobZip() {
  if(!cam.results||cam.calculatedRevision!==cam.revision)throw new Error('Calculate the current job before downloading or sending it.');
  const revision=cam.revision;
  const zip=new PCBConversion.JSZip();
  for(const [op,result] of Object.entries(cam.results))zip.file(({traces:'01-copper.rml',holes:'02-holes.rml',outline:'03-outline.rml'}[op]),result.file.contents);
  zip.file('job-settings.json',JSON.stringify({settings:state,sourceFiles:cam.board.files,conversionAliases:cam.board.conversionAliases,side:cam.board.side,dimensions:cam.board.dimensions,raster:{dpi:1000,basePaddingMm:0.82,extraBorderPixels:cam.jobImages.extraPixels,totalMarginMm:cam.jobImages.marginMm},origins:{x:0,y:0,z:0,homeX:0,homeY:0,homeZ:Number(state.jog)},engineVersions:{gerber2png:'80edc4061e4b2133e3d42f581d20445678fb50e6',mods:'682559896bbfc2a594d913beb45babe66b903245'},applied:Object.fromEntries(Object.entries(cam.results).map(([op,result])=>[op,result.applied]))},null,2));
  const blob=await zip.generateAsync({type:'blob'});
  if(cam.revision!==revision||cam.calculatedRevision!==revision)throw new Error('The job changed. Calculate it again before downloading or sending.');
  return blob;
}
async function downloadJob() {
  try {downloadBlob(await createJobZip(),'ampoteket-pcb-job.zip');}
  catch(error) {cam.error=error.message;render();}
}
