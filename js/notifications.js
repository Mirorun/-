import {cloneData} from './session.js';
// Run-local event ledger. No localStorage reads, writes, or storage listeners.
export class NotificationStore {
  constructor(events){this.events=cloneData(events);this.listeners=new Set();this.timers=[];this.cancelled=new Set();this.eventTimers=new Map();this.started=false;this.state={version:1,startedAt:null,records:{}};}
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
  emit(reason,id){for(const fn of this.listeners)fn({reason,id});}
  records({includeDeleted=false}={}){const definitions=new Map(this.events.map(e=>[e.id,e]));for(const [id,record] of Object.entries(this.state.records)){if(record.event&&!definitions.has(id))definitions.set(id,record.event);}return [...definitions.values()].map(e=>({...e,...this.state.records[e.id]})).filter(e=>e.firedAt&&(includeDeleted||!e.deleted)).sort((a,b)=>b.firedAt-a.firedAt);}
  start(){
    // Navigation, unlock, and repeated calls cannot restart or duplicate this clock.
    if(this.started)return;
    this.started=true;this.state.startedAt=Date.now();
    if(!this.visibility){this.visibility=()=>{if(document.visibilityState==='visible')this.catchUp();};document.addEventListener('visibilitychange',this.visibility);}
    for(const event of this.events){const timer=setTimeout(()=>{this.timers=this.timers.filter(t=>t!==timer);this.eventTimers.delete(event.id);this.deliver(event);},Math.max(0,event.delayMs));this.timers.push(timer);this.eventTimers.set(event.id,timer);}
  }
  catchUp(){if(!this.started)return;for(const event of this.events)if(Date.now()>=this.state.startedAt+event.delayMs)this.deliver(event);}
  deliver(event){if(this.cancelled.has(event.id)||this.state.records[event.id]?.firedAt)return false;this.state.records[event.id]={firedAt:Date.now(),read:!!event.read,deleted:false,pending:!event.read};this.emit('arrival',event.id);return true;}
  publish(event,firedAt=Date.now()){if(this.state.records[event.id]?.firedAt)return false;this.state.records[event.id]={event:cloneData(event),firedAt,read:!!event.read,deleted:false,pending:!event.read};this.emit('arrival',event.id);return true;}
  cancel(id){this.cancelled.add(id);const timer=this.eventTimers.get(id);clearTimeout(timer);this.timers=this.timers.filter(t=>t!==timer);this.eventTimers.delete(id);}
  change(id,patch){if(!this.state.records[id])return;Object.assign(this.state.records[id],patch);this.emit('change',id);}
  markRead(id){this.change(id,{read:true,pending:false});}
  markThreadRead(appId,threadId){for(const e of this.records({includeDeleted:true})){if(e.appId===appId&&e.threadId===threadId&&!e.read)this.markRead(e.id);}}
  presented(id){if(this.state.records[id]?.pending)this.change(id,{pending:false});}
  remove(id){this.change(id,{deleted:true,pending:false});}
  clearTimers(){for(const timer of this.timers)clearTimeout(timer);this.timers=[];this.eventTimers.clear();}
  reset(){this.clearTimers();this.cancelled.clear();this.started=false;this.state={version:1,startedAt:null,records:{}};this.emit('reset');this.start();}
  destroy(){this.clearTimers();this.listeners.clear();if(this.visibility)document.removeEventListener('visibilitychange',this.visibility);}
}
