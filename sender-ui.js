/* Optional transfer leaves the ordinary ZIP download and machining calculations intact. */
(() => {
  'use strict';
  const dialog=document.getElementById('send-job-dialog');
  const status=document.getElementById('send-job-status'),form=document.getElementById('send-job-form');
  const input=document.getElementById('receiver-code'),submit=document.getElementById('send-job-start');
  const progress=document.getElementById('send-job-progress');
  let session=null,attempt=0;
  const receiverUrl=location.hostname==='127.0.0.1'||location.hostname==='localhost'
    ?'https://damlien.github.io/PCB-milling-test/receive.html':new URL('receive.html',location.href).href;
  document.getElementById('receiver-page-link').href=receiverUrl;
  document.getElementById('receiver-page-address').textContent=receiverUrl;
  function stop() {attempt++;session?.cancel();session=null;submit.disabled=false;input.disabled=false;}
  dialog.addEventListener('cancel',stop);
  dialog.addEventListener('close',stop);
  document.getElementById('close-send-job').addEventListener('click',()=>dialog.close());
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action="send-job"]');
    if(!button||button.disabled||cam.busy||!cam.results||cam.calculatedRevision!==cam.revision)return;
    stop();status.textContent='';progress.hidden=true;progress.value=0;dialog.showModal();input.focus();
  });
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!PCBTransfer.validCode(input.value)) {status.textContent='Enter the eight-character code shown on the receiving computer.';input.focus();return;}
    const current=++attempt;submit.disabled=true;input.disabled=true;status.textContent='Preparing the current job…';progress.hidden=true;
    try {
      const blob=await createJobZip();
      if(current!==attempt||!dialog.open)return;
      session=PCBTransfer.send({code:input.value,blob,label:cam.board.name,
        onState:message=>{if(current===attempt)status.textContent=message;},
        onProgress:(sent,total)=>{if(current===attempt){progress.hidden=false;progress.value=Math.round(sent/total*100);}},
        onComplete:()=>{if(current===attempt){progress.value=100;submit.disabled=false;input.disabled=false;status.textContent='Job received. On the other computer, choose Save job ZIP, then extract it for VPanel.';}},
        onError:message=>{if(current===attempt){status.textContent=message;submit.disabled=false;input.disabled=false;}}
      });
    } catch(error) {if(current===attempt){status.textContent=error.message;submit.disabled=false;input.disabled=false;}}
  });
  window.addEventListener('pagehide',stop);
})();
