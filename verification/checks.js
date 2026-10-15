const status=document.getElementById('status'),report=document.getElementById('report');
function assert(condition,message){if(!condition)throw new Error(message);}
async function sample(which){const names=await fetch('samples/'+which+'/files.json').then(response=>response.json());return Promise.all(names.map(async name=>new File([await fetch('samples/'+which+'/'+name).then(response=>response.blob())],name)));}
async function pixels(blob){const image=await createImageBitmap(blob),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return {width:canvas.width,height:canvas.height,data:ctx.getImageData(0,0,canvas.width,canvas.height).data};}
async function sha(value){const bytes=typeof value==='string'?new TextEncoder().encode(value):value;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function originalGenerateAll(files) {
  const engine=PCBConversion.reference;let topstack,bottomstack;
  await engine.convertToSvg(files,value=>topstack=value,value=>bottomstack=value,()=>{},()=>{},()=>{});
  const setups=engine.setUpConfig(topstack,bottomstack),images={};
  for(const option in setups) {
    if(option.startsWith('top'))continue;
    const setup=setups[option],svg=setup.stack.svg.cloneNode(true);
    engine.updateSvg(svg,option,setup,'general',topstack,false);
    engine.handleColorChange({color:setup.color,id:topstack.id,svgs:[svg]});
    images[{trace:'traces',drill:'holes',outline:'outline'}[setup.button]]=await engine.generatePNG(svg,false,setup.id,setup.canvas,setup.color);
  }
  return images;
}
function rmlSummary(text){const xyz=[...text.matchAll(/(?:^|[;\n])Z(-?\d+),(-?\d+),(-?\d+);/g)].map(match=>match.slice(1).map(Number));return {moves:xyz.length,x:[Math.min(...xyz.map(p=>p[0]))/100,Math.max(...xyz.map(p=>p[0]))/100],y:[Math.min(...xyz.map(p=>p[1]))/100,Math.max(...xyz.map(p=>p[1]))/100],z:[...new Set(xyz.map(p=>p[2]/100))].sort((a,b)=>a-b),header:text.split('\n')[0],tail:text.slice(-40)};}
document.getElementById('run-checks').addEventListener('click',async()=>{
  document.getElementById('run-checks').disabled=true;const result={started:new Date().toISOString(),png:{},operations:{}};
  try {
    status.textContent='Comparing the converter with stored original PNGs…';
    const smallFiles=await sample('small'),small=await PCBConversion.convert(smallFiles,'bottom'),freshOriginal=await originalGenerateAll(smallFiles);
    for(const [op,name] of [['traces','traces_bottomlayer_0.png'],['holes','drills_bottomlayer_1.png'],['outline','outline_bottomlayer_2.png']]) {
      const actual=await pixels(small.images[op].blob),expected=await pixels(await fetch('verification/reference-small/'+name).then(response=>response.blob()));
      let different=0;if(actual.width===expected.width&&actual.height===expected.height){for(let i=0;i<actual.data.length;i+=4)if(actual.data[i]!==expected.data[i]||actual.data[i+1]!==expected.data[i+1]||actual.data[i+2]!==expected.data[i+2]||actual.data[i+3]!==expected.data[i+3])different++;}else different=-1;
      const direct=await pixels(await fetch(freshOriginal[op].url).then(response=>response.blob()));
      const directMatch=actual.width===direct.width&&actual.height===direct.height&&await sha(actual.data)===await sha(direct.data);
      result.png[op]={width:actual.width,height:actual.height,historicalReferenceWidth:expected.width,historicalReferenceHeight:expected.height,historicalDifferentPixels:different,matchesCurrentOriginalGenerateAll:directMatch,pixelSha256:await sha(actual.data)};
      assert(directMatch,op+': generated PNG differs from the current unmodified upstream Generate All route.');
    }
    const board=await PCBConversion.convert(await sample('lab'),'bottom');
    const prepared=await PCBConversion.withMargin(board.images,1.3);
    result.alignedMargin={extraPixels:prepared.extraPixels,marginMm:prepared.marginMm,canvases:Object.values(prepared.images).map(image=>[image.pixelsWide,image.pixelsHigh])};
    assert(new Set(Object.values(prepared.images).map(image=>image.pixelsWide+'x'+image.pixelsHigh)).size===1,'Padded canvases do not match.');
    for(const op of ['traces','holes','outline']) {
      const original=await pixels(board.images[op].blob),padded=await pixels(prepared.images[op].blob),inner=new Uint8ClampedArray(original.data.length),border=prepared.extraPixels;
      for(let row=0;row<original.height;row++)inner.set(padded.data.subarray(((row+border)*padded.width+border)*4,((row+border)*padded.width+border+original.width)*4),row*original.width*4);
      assert(await sha(inner)===await sha(original.data),op+': margin changed original pixels.');
    }
    result.alignedMargin.originalPixelsPreserved=true;
    const archive=new PCBConversion.JSZip();
    for(const op of ['traces','holes','outline']) {
      status.textContent='Comparing '+op+' against the original Mods metric controls…';
      const settings={diameter:op==='traces'?0.15:2,depth:op==='traces'?0.05:1.65,passDepth:op==='traces'?0.05:0.25,offsets:op==='traces'?4:1,stepover:0.5,feed:op==='traces'?2:0.5,jog:5,vbit:op==='traces',tip:0.05,angle:90};
      const actual=await calculateWithMods(await prepared.images[op].blob.arrayBuffer(),settings),reference=await calculateWithMods(await prepared.images[op].blob.arrayBuffer(),{...settings,vbit:false},true);
      const sameRml=actual.file.contents===reference.file.contents,samePaths=JSON.stringify(actual.toolpath.path)===JSON.stringify(reference.toolpath.path),summary=rmlSummary(actual.file.contents);
      assert(sameRml&&samePaths,op+': adapter output differs from original controls.');
      assert(Math.abs(actual.applied.diameter-settings.diameter)<1e-8,op+': tool diameter unit mismatch.');
      assert(actual.applied.cutDepth===settings.passDepth&&actual.applied.maxDepth===settings.depth,op+': depth mapping mismatch.');
      assert(actual.applied.writerOrigin.every(value=>value===0),op+': nonzero origin offset.');
      assert(summary.z[0]===-settings.depth,op+': unexpected final RML depth.');
      assert(summary.header.includes('VS'+settings.feed+';!VZ'+settings.feed+';!PZ0,500;'),op+': unexpected feed or travel height.');
      assert(actual.toolpath.path.length>0,op+': no paths.');
      assert(!actual.toolpath.path.some(path=>path.some(p=>p[0]<=1||p[1]<=1||p[0]>=actual.toolpath.width-2||p[1]>=actual.toolpath.height-2)),op+': paths clipped by the canvas.');
      if(op==='outline')assert(actual.toolpath.path.length===1,'Expected one complete rectangular outline contour.');
      result.operations[op]={sameRml,samePaths,applied:actual.applied,paths:actual.toolpath.path.length,rmlSha256:await sha(actual.file.contents),...summary};
      archive.file(op+'.rml',actual.file.contents);
    }
    const zipped=await archive.generateAsync({type:'arraybuffer'}),opened=await PCBConversion.JSZip.loadAsync(zipped);
    result.zip={bytes:zipped.byteLength,files:Object.keys(opened.files)};
    for(const op of ['traces','holes','outline'])assert(await sha(await opened.file(op+'.rml').async('string'))===result.operations[op].rmlSha256,'ZIP content mismatch.');
    result.passed=true;status.textContent='All engine checks passed.';
    archive.file('verification-report.json',JSON.stringify(result,null,2));
    const link=document.createElement('a');link.className='button';link.textContent='Download checked example outputs';link.download='verified-example-outputs.zip';link.href=URL.createObjectURL(await archive.generateAsync({type:'blob'}));document.getElementById('files').appendChild(link);
  }catch(error){result.passed=false;result.error=error.message;status.textContent='Verification failed.';}
  report.textContent=JSON.stringify(result,null,2);document.getElementById('run-checks').disabled=false;
});
