/* Input checks and summaries only. Gerber2PNG still parses and renders geometry. */
function validateGerber({file,text},role) {
  if(!/%FS[LT][AI]X\d{2}Y\d{2}\*%/i.test(text)||!/(?:%MO(?:MM|IN)\*%|G7[01]\*)/i.test(text)||!/%ADD\d+/i.test(text)||!/D0?[13]\*/i.test(text)||!/M0?2\*/i.test(text))
    throw new Error(file.name+': no valid '+role+' artwork was found. Export a fresh RS-274X Gerber from KiCad.');
}
function copperSide({file,text}) {
  const declared=text.match(/FileFunction,Copper,[^,*\r\n]+,([^,*\r\n]+)/i)?.[1];
  if(declared){
    if(/^Top$/i.test(declared))return 'top';
    if(/^(Bot|Bottom)$/i.test(declared))return 'bottom';
    throw new Error('Choose an outer copper layer: F.Cu or B.Cu. Inner copper layers are not supported.');
  }
  if(/(?:B[_.-]?Cu\.gbr$|\.gbl$)/i.test(file.name))return 'bottom';
  if(/(?:F[_.-]?Cu\.gbr$|\.gtl$)/i.test(file.name))return 'top';
  throw new Error('The copper side could not be identified. Export F.Cu or B.Cu with KiCad layer metadata.');
}
function roundHoleSummary(drillFiles) {
  const sizes=[];let count=0;
  for(const {file,text} of drillFiles) {
    if(!/^\s*M48\s*$/m.test(text)||!/^\s*M30\s*$/m.test(text))throw new Error(file.name+': no valid Excellon header and end marker were found. Export a fresh Excellon drill file from KiCad.');
    const tools=new Map();let active=null,scale=1;
    for(const raw of text.split(/\r?\n/)) {
      const line=raw.split(';')[0].trim().toUpperCase();if(!line)continue;
      if(/G(?:0?[0-3]|85)(?=[^\d]|$)|M1[56]/.test(line))throw new Error(file.name+': slotted holes and routed drill paths are not supported. Export a board with round holes for this workflow.');
      if(/G91|^R\d/.test(line))throw new Error(file.name+': incremental or repeated drill coordinates are not supported. Export absolute Excellon coordinates from KiCad.');
      if(/^(?:INCH|M72)/.test(line))scale=25.4;
      if(/^(?:METRIC|M71)/.test(line))scale=1;
      const definition=line.match(/^T(\d+)[^\r\n]*?C([\d.]+)/);
      if(definition){const size=Number(definition[2])*scale;if(!Number.isFinite(size)||size<=0)throw new Error(file.name+': invalid drill tool diameter.');tools.set(Number(definition[1]),size);continue;}
      const selection=line.match(/^T(\d+)/);if(selection)active=Number(selection[1]);
      const coordinates=line.replace(/^T\d+/,'').replace(/^(?:G90|G0?5)+/,'');
      if(/^[XY]/.test(coordinates)){
        if(!/^(?:[XY][+-]?(?:\d+(?:\.\d*)?|\.\d+))+$/.test(coordinates))throw new Error(file.name+': invalid drill coordinates. Export absolute Excellon coordinates from KiCad.');
        if(!tools.has(active))throw new Error(file.name+': a hole refers to an undefined drill tool. Export the Excellon tool table and absolute coordinates.');
        count++;sizes.push(tools.get(active));
      }
    }
  }
  return {count,sizes};
}
