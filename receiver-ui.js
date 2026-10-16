/* Receiving UI owns the completed Blob; it never writes or runs machine files automatically. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  let session=null,job=null,code='';
  const show=(id,visible)=>{$(id).hidden=!visible;};
  const status=message=>{$('receive-status').textContent=message;};
  function start() {
    session?.close();job=null;code='';
    for(const id of ['receive-code-panel','receive-offer','receive-result','receive-progress-panel','receive-again'])show(id,false);
    $('receive-progress').value=0;$('copy-receive-code').textContent='Copy code';
    session=PCBTransfer.receive({
      onState:status,
      onReady:value=>{code=value;$('receive-code').textContent=value;show('receive-code-panel',true);},
      onOffer:offer=>{$('receive-job-name').textContent=offer.label;$('receive-job-size').textContent=offer.name+' · '+Math.ceil(offer.size/1024)+' KB';show('receive-offer',true);},
      onProgress:(received,total)=>{$('receive-progress').value=Math.round(received/total*100);$('receive-progress-text').textContent=Math.round(received/total*100)+'% received';},
      onComplete:(blob,offer)=>{job=blob;show('receive-code-panel',false);show('receive-progress-panel',false);show('receive-result',true);show('receive-again',true);$('received-job-label').textContent=offer.label;},
      onError:message=>{status(message);show('receive-code-panel',false);show('receive-offer',false);show('receive-progress-panel',false);show('receive-again',true);}
    });
  }
  $('accept-job').addEventListener('click',()=>{show('receive-offer',false);show('receive-code-panel',false);show('receive-progress-panel',true);session.accept();});
  $('decline-job').addEventListener('click',()=>{show('receive-offer',false);show('receive-code-panel',false);show('receive-again',true);session.reject();});
  $('save-received-job').addEventListener('click',()=>{
    if(!job)return;
    const url=URL.createObjectURL(job),link=document.createElement('a');link.href=url;link.download='ampoteket-pcb-job.zip';link.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
  });
  $('copy-receive-code').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(code);$('copy-receive-code').textContent='Code copied';}catch{status('Select the code above and copy it, or type it on your laptop.');}});
  $('receive-again').addEventListener('click',start);
  window.addEventListener('pagehide',()=>session?.close());
  start();
})();
