/* Protocol fault checks, without browsers or a network. Real PeerJS transfer is
   checked separately through the sender/receiver pages and actual ZIP downloads. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {EventEmitter}=require('node:events');
const {webcrypto}=require('node:crypto');
const source=fs.readFileSync(require('node:path').join(__dirname,'../transfer.js'),'utf8');
const tick=()=>new Promise(resolve=>setTimeout(resolve,5));
async function until(check){for(let i=0;i<500;i++){if(check())return;await tick();}throw Error('Test did not settle');}
function environment(transform=x=>x){
  const peers=new Map(),messages=[];let serial=0;
  class Connection extends EventEmitter{
    constructor(label){super();this.label=label;this.open=false;}
    send(data){assert(this.open);messages.push(data.type);const copy=transform(structuredClone(data));queueMicrotask(()=>{if(this.other.open)this.other.emit('data',copy);});}
    close(){if(!this.open)return;this.open=false;const other=this.other;queueMicrotask(()=>this.emit('close'));if(other.open){other.open=false;queueMicrotask(()=>other.emit('close'));}}
  }
  class Peer extends EventEmitter{
    constructor(id){super();this.id=typeof id==='string'?id:'sender-'+(++serial);this.connections=[];peers.set(this.id,this);queueMicrotask(()=>this.emit('open',this.id));}
    connect(id,options){
      const local=new Connection(options.label);this.connections.push(local);
      queueMicrotask(()=>{
        const dest=peers.get(id);if(!dest){this.emit('error',{type:'peer-unavailable'});return;}
        const remote=new Connection(options.label);dest.connections.push(remote);local.other=remote;remote.other=local;dest.emit('connection',remote);
        queueMicrotask(()=>{local.open=remote.open=true;remote.emit('open');local.emit('open');});
      });return local;
    }
    destroy(){peers.delete(this.id);for(const conn of this.connections)conn.close();}
  }
  const window={Peer,RTCPeerConnection:function(){}};
  const context=vm.createContext({window,crypto:webcrypto,Blob,ArrayBuffer,Uint8Array,setTimeout,clearTimeout,console});vm.runInContext(source,context);
  const api=window.PCBTransfer;
  async function receiver(){const out={};out.session=api.receive({onReady:code=>out.code=code,onOffer:offer=>out.offer=offer,onComplete:blob=>out.blob=blob,onError:error=>out.error=error});await until(()=>out.code||out.error);assert(out.code,out.error);return out;}
  function sender(code,blob){const out={};out.session=api.send({code,blob,label:'Public sample board',onComplete:()=>out.complete=true,onError:error=>out.error=error});return out;}
  function close(){for(const p of [...peers.values()])p.destroy();}
  return{api,receiver,sender,messages,close,peers,Peer};
}
const results=[];
async function test(name,run){try{await run();results.push({name,passed:true});}catch(error){results.push({name,passed:false,error:error.message});}}
(async()=>{
  await test('Codes accept lowercase/spacing but reject ambiguous characters',async()=>{const e=environment();assert(e.api.validCode('abcd-efgh'));assert(e.api.validCode('ABCD EFGH'));assert(!e.api.validCode('ABCD0000'));assert(!e.api.validCode('ABCD'));assert.equal(e.api.displayCode('abcdefgh'),'ABCD-EFGH');});
  await test('No file bytes leave the sender before acceptance',async()=>{const e=environment(),r=await e.receiver(),s=e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);assert(!e.messages.includes('chunk'));r.session.reject();await until(()=>s.error);e.close();});
  await test('Multiple chunks arrive byte-for-byte and the sender gets confirmation',async()=>{const e=environment(),r=await e.receiver(),bytes=webcrypto.getRandomValues(new Uint8Array(50000)),s=e.sender(r.code,new Blob([bytes]));await until(()=>r.offer);r.session.accept();await until(()=>s.complete||s.error);assert(s.complete,s.error);assert.deepEqual(new Uint8Array(await r.blob.arrayBuffer()),bytes);assert(e.messages.filter(x=>x==='chunk').length===4);e.close();});
  await test('Binary byte views preserve their offsets and decode correctly',async()=>{const e=environment(data=>{if(data.type==='chunk'){const wrapped=new Uint8Array(data.bytes.byteLength+6);wrapped.set(new Uint8Array(data.bytes),3);data.bytes=wrapped.subarray(3,wrapped.length-3);}return data;}),r=await e.receiver(),s=e.sender(r.code,new Blob(['sample bytes']));await until(()=>r.offer);r.session.accept();await until(()=>s.complete||s.error);assert(s.complete,s.error);assert.equal(await r.blob.text(),'sample bytes');e.close();});
  await test('Declining a job prevents delivery and tells the sender',async()=>{const e=environment(),r=await e.receiver(),s=e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);r.session.reject();await until(()=>s.error);assert.match(s.error,/declined/);assert(!r.blob&&!e.messages.includes('chunk'));e.close();});
  await test('Cancellation releases the pending receiver without a saved file',async()=>{const e=environment(),r=await e.receiver(),s=e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);s.session.cancel();await until(()=>r.error);assert(!r.blob);e.close();});
  await test('Altered bytes fail the end-to-end checksum',async()=>{let changed=false;const e=environment(data=>{if(data.type==='chunk'&&!changed){new Uint8Array(data.bytes)[0]^=1;changed=true;}return data;}),r=await e.receiver(),s=e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);r.session.accept();await until(()=>r.error);assert.match(r.error,/did not match/);assert(!r.blob&&!s.complete);e.close();});
  await test('Out-of-order chunks are rejected',async()=>{const e=environment(data=>{if(data.type==='chunk')data.sequence++;return data;}),r=await e.receiver();e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);r.session.accept();await until(()=>r.error);assert(!r.blob);e.close();});
  await test('Payload exceeding its declared length is rejected',async()=>{const e=environment(data=>{if(data.type==='offer')data.size=1;return data;}),r=await e.receiver();e.sender(r.code,new Blob(['sample']));await until(()=>r.offer);r.session.accept();await until(()=>r.error);assert(!r.blob);e.close();});
  await test('Unknown receiver code produces an actionable error',async()=>{const e=environment(),s=e.sender('ABCDEFGH',new Blob(['sample']));await until(()=>s.error);assert.match(s.error,/code is not available/);e.close();});
  await test('Empty and over-limit jobs are rejected before connecting',async()=>{const e=environment(),empty=e.sender('ABCDEFGH',new Blob([])),large=e.sender('ABCDEFGH',new Blob([new Uint8Array(e.api.MAX_BYTES+1)]));await until(()=>empty.error&&large.error);assert.equal(e.peers.size,0);});
  await test('Cancellation during preparation does not start a connection',async()=>{const e=environment(),s=e.sender('ABCDEFGH',new Blob(['sample']));s.session.cancel();await tick();assert.equal(e.peers.size,0);assert(!s.complete);});
  console.log(JSON.stringify({passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,cases:results},null,2));
  if(results.some(x=>!x.passed))process.exitCode=1;
})();
