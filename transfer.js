/* Direct job transfer. PeerJS handles WebRTC; only connection metadata goes to
   PeerJS Cloud. No file-storage endpoint or machine-control connection is used. */
(() => {
  'use strict';
  const VERSION=1, LABEL='ampoteket-pcb-job-v1', PREFIX='ampoteket-pcb-v1-';
  const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789', CHUNK=16384, MAX_BYTES=25*1024*1024;
  const OPTIONS={host:'0.peerjs.com',port:443,path:'/',secure:true,debug:0,
    config:{iceServers:[{urls:'stun:stun.l.google.com:19302'}]}};
  const normalize=value=>String(value||'').toUpperCase().replace(/[\s-]/g,'');
  const validCode=value=>new RegExp('^['+ALPHABET+']{8}$').test(normalize(value));
  const displayCode=value=>normalize(value).replace(/^(.{4})(.{4})$/,'$1-$2');
  const randomCode=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),n=>ALPHABET[n%32]).join('');
  // PeerJS versions can decode binary payloads as either ArrayBuffers or byte views.
  const bufferOf=value=>value instanceof ArrayBuffer?value:ArrayBuffer.isView(value)?value.buffer.slice(value.byteOffset,value.byteOffset+value.byteLength):null;
  const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');
  const errorText=error=>({
    'peer-unavailable':'That receiver code is not available. Check the code and keep the receiving page open.',
    'browser-incompatible':'This browser cannot transfer files directly. Use an up-to-date Chrome, Edge or Firefox browser.',
    'unavailable-id':'That receiver code could not be registered. Create a new code.',
    'network':'Could not reach the connection service. Check the internet connection and try again.',
    'server-error':'The connection service is unavailable. Try again later.',
    'socket-error':'The connection service could not be reached. Check the internet connection.',
    'webrtc':'The browsers could not connect directly. The lab or VM network may block this connection.'
  }[error?.type]||'The transfer connection failed. Keep both pages open and try again.');

  class Session {
    constructor(callbacks={}) {this.callbacks=callbacks;this.done=false;this.timer=null;this.peer=null;this.connection=null;}
    emit(name,...args) {this.callbacks[name]?.(...args);}
    arm(ms,message) {clearTimeout(this.timer);this.timer=setTimeout(()=>this.fail(message),ms);}
    clear() {clearTimeout(this.timer);this.timer=null;}
    send(message) {if(!this.done&&this.connection?.open)this.connection.send(message);}
    fail(message) {if(this.done)return;this.close();this.emit('onError',message);}
    close() {this.done=true;this.clear();this.connection?.close();this.peer?.destroy();this.parts=[];this.bytes=null;}
    connectPeer(id) {
      if(typeof window.Peer!=='function')throw new Error('The transfer library did not load. Reload the page and try again.');
      if(!window.RTCPeerConnection||!crypto.subtle)throw new Error('Use an up-to-date browser over HTTPS or localhost for direct transfer.');
      this.peer=id?new window.Peer(id,OPTIONS):new window.Peer(OPTIONS);
      this.peer.on('error',error=>this.fail(errorText(error)));
      this.peer.on('disconnected',()=>{if(!this.done&&!this.connection?.open)this.fail('Connection to the transfer service was lost. Try again.');});
      this.peer.on('call',call=>call.close());
      return this.peer;
    }
  }

  class Sender extends Session {
    constructor(options) {super(options);this.offset=0;this.sequence=0;this.pending=null;this.phase='preparing';this.start(options);}
    async start({code,blob,label}) {
      try {
        if(!validCode(code))throw new Error('Enter the eight-character code shown on the receiving computer.');
        if(!(blob instanceof Blob)||blob.size===0||blob.size>MAX_BYTES)throw new Error('Direct transfer supports job ZIPs up to 25 MB. Use the normal download for larger jobs.');
        this.emit('onState','Preparing the job…');
        const bytes=await blob.arrayBuffer(),sha256=await digest(bytes);if(this.done)return;this.bytes=bytes;
        this.offer={type:'offer',version:VERSION,name:'ampoteket-pcb-job.zip',label:String(label||'PCB job').slice(0,200),size:this.bytes.byteLength,sha256};
        this.emit('onState','Connecting to the receiving computer…');
        this.arm(25000,'The browsers could not connect. Check the code and internet connection. The lab or VM network may block direct transfers.');
        this.connectPeer().on('open',()=>{
          if(this.done)return;
          const conn=this.connection=this.peer.connect(PREFIX+normalize(code),{label:LABEL,reliable:true,serialization:'binary'});
          conn.on('open',()=>{
            if(this.done)return;
            this.phase='offered';this.send(this.offer);
            this.emit('onState','Waiting for the other computer to accept the job…');
            this.arm(120000,'The job was not accepted in time. Send again when the receiving computer is ready.');
          });
          conn.on('data',data=>this.receive(data));
          conn.on('error',()=>this.fail('The transfer connection failed. Try sending the job again.'));
          conn.on('close',()=>{if(!this.done)this.fail('The receiving page disconnected before the transfer finished.');});
        });
      } catch(error) {this.fail(error.message);}
    }
    receive(data) {
      if(this.done||!data||typeof data!=='object')return;
      if(data.type==='reject'||data.type==='error') {this.fail(data.type==='reject'?'The receiving computer declined the job.':String(data.message||'The receiving computer could not accept the job.'));return;}
      if(data.type==='accept'&&this.phase==='offered') {this.phase='sending';this.emit('onState','Sending the job…');this.next();return;}
      if(data.type==='ack'&&this.phase==='sending'&&this.pending!==null) {
        if(data.sequence!==this.sequence||data.received!==this.offset+this.pending) {this.fail('The transfer could not be verified. Send the job again.');return;}
        this.offset+=this.pending;this.pending=null;this.sequence++;
        this.emit('onProgress',this.offset,this.bytes.byteLength);this.next();return;
      }
      if(data.type==='complete'&&this.phase==='verifying') {
        if(data.sha256!==this.offer.sha256||data.size!==this.offer.size) {this.fail('The received file did not match the sent job.');return;}
        this.close();this.emit('onState','The other computer received the complete job.');this.emit('onComplete');
      }
    }
    next() {
      if(this.done)return;
      this.arm(30000,'The transfer stopped before it finished. Keep both pages open and send the job again.');
      if(this.offset===this.bytes.byteLength) {this.phase='verifying';this.send({type:'end'});this.emit('onState','Checking that the received file matches…');return;}
      const end=Math.min(this.offset+CHUNK,this.bytes.byteLength);
      this.pending=end-this.offset;this.send({type:'chunk',sequence:this.sequence,bytes:this.bytes.slice(this.offset,end)});
    }
    cancel() {this.send({type:'cancel'});this.close();}
  }

  class Receiver extends Session {
    constructor(callbacks) {super(callbacks);this.accepted=false;this.completed=false;this.offer=null;this.parts=[];this.received=0;this.sequence=0;this.start();}
    start() {
      try {
        const code=randomCode();this.emit('onState','Connecting to the transfer service…');
        this.arm(20000,'Could not reach the connection service. Check the internet connection, then create a new code.');
        this.connectPeer(PREFIX+code).on('open',()=>{if(!this.done){this.clear();this.emit('onReady',displayCode(code));this.emit('onState','Ready to receive. Keep this page open.');}});
        this.peer.on('connection',conn=>{
          if(this.done||this.connection||this.completed||conn.label!==LABEL) {
            conn.on('open',()=>{conn.send({type:'reject'});setTimeout(()=>conn.close(),200);});return;
          }
          this.connection=conn;
          this.arm(15000,'No job details arrived. Create a new code and try again.');
          conn.on('data',data=>this.receive(data));
          conn.on('error',()=>{if(!this.completed)this.fail('The sender disconnected. Create a new code and try again.');});
          conn.on('close',()=>{if(this.completed)this.close();else if(!this.done)this.fail('The sender disconnected before the job finished. Create a new code to try again.');});
        });
      } catch(error) {this.fail(error.message);}
    }
    async receive(data) {
      if(this.done||this.completed||!data||typeof data!=='object')return;
      if(data.type==='cancel') {this.fail('The sender cancelled this transfer. Create a new code to receive another job.');return;}
      if(data.type==='offer'&&!this.offer) {
        if(data.version!==VERSION||data.name!=='ampoteket-pcb-job.zip'||!Number.isSafeInteger(data.size)||data.size<=0||data.size>MAX_BYTES||!/^[a-f0-9]{64}$/.test(data.sha256)||typeof data.label!=='string'||data.label.length>200) {
          this.send({type:'error',message:'This is not a supported PCB job transfer.'});this.fail('The incoming job details were invalid. Create a new code to try again.');return;
        }
        this.offer={name:data.name,label:data.label,size:data.size,sha256:data.sha256};
        this.arm(120000,'This transfer request expired. Create a new code to try again.');
        this.emit('onState','A PCB job is waiting for your approval.');this.emit('onOffer',this.offer);return;
      }
      if(data.type==='chunk') {
        const bytes=bufferOf(data.bytes);
        if(!this.accepted||this.verifying||!bytes||bytes.byteLength===0||bytes.byteLength>CHUNK||data.sequence!==this.sequence||this.received+bytes.byteLength>this.offer.size) {
          this.send({type:'error',message:'The received file was incomplete or invalid.'});this.fail('The received file was incomplete or invalid. Nothing has been saved.');return;
        }
        this.parts.push(bytes);this.received+=bytes.byteLength;this.sequence++;
        this.arm(30000,'The transfer stopped. No complete job was received. Create a new code and try again.');
        this.emit('onProgress',this.received,this.offer.size);this.send({type:'ack',sequence:data.sequence,received:this.received});return;
      }
      if(data.type==='end'&&this.accepted&&!this.verifying) {
        if(this.received!==this.offer.size) {this.fail('The received job is incomplete. Nothing has been saved.');return;}
        this.verifying=true;this.emit('onState','Checking the received job…');
        try {
          const blob=new Blob(this.parts,{type:'application/zip'});this.parts=[];
          const sha256=await digest(await blob.arrayBuffer());if(this.done)return;
          if(sha256!==this.offer.sha256) {this.send({type:'error',message:'The received file did not match the sent job.'});this.fail('The received file did not match the sent job. Nothing has been saved.');return;}
          this.completed=true;this.clear();this.send({type:'complete',size:this.offer.size,sha256});
          this.emit('onState','Job received and checked. Save the ZIP below.');this.emit('onComplete',blob,this.offer);
        } catch(error) {this.fail('The received file could not be checked. Create a new code and try again.');}
      }
    }
    accept() {if(this.done||!this.offer||this.accepted)return;this.accepted=true;this.arm(30000,'No file data arrived. Create a new code and try again.');this.emit('onState','Receiving the job…');this.send({type:'accept'});}
    reject() {if(this.done||this.accepted)return;this.send({type:'reject'});this.emit('onState','Job declined. Create a new code to receive another job.');this.completed=true;this.clear();setTimeout(()=>this.close(),300);}
  }
  window.PCBTransfer={send:options=>new Sender(options),receive:callbacks=>new Receiver(callbacks),validCode,displayCode,MAX_BYTES};
})();
