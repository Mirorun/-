import {storyCallScenarios,storyOutcomes,storyIncomingEvents,phoneStorySettings} from './story-calls.js';
import {storyClock} from '../story-clock.js';
import {contacts,recentCalls,voicemails,phoneSettings} from './data.js';
import {callScenarios,defaultOutcome} from './scenarios.js';
import {incomingEvents} from './events.js';
import {cloneData} from '../session.js';
export const normalizeNumber=value=>String(value).replace(/[^\d+*#]/g,'');
export const initials=value=>Array.from(String(value)).map(c=>{const n=c.charCodeAt(0)-44032;return n>=0&&n<=11171?'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[Math.floor(n/588)]:c;}).join('');
export class PhoneStore{
 constructor(){this.contacts=cloneData(contacts);this.logs=cloneData(recentCalls).map(r=>{const c=this.contacts.find(c=>c.id===r.contactId);return {...r,callerName:c?.name||'알 수 없는 번호',number:c?.number||'',contact:c?cloneData(c):null};});this.voicemails=cloneData(voicemails);this.scenarios=cloneData(Array.isArray(callScenarios)?callScenarios.filter(s=>s&&typeof s.id==='string'):[]);this.scenarios.push(...cloneData(storyCallScenarios));this.outcomes=cloneData(storyOutcomes);this.events=cloneData([...incomingEvents,...storyIncomingEvents]);this.listeners=new Set();this.call=null;this.sequence=0;this.timers=new Set();this.eventTimers=new Set();this.firedEvents=new Set();this.eventsStarted=false;this.startedAt=Date.now();this.dialValue='';this.filter='all';}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 emit(kind){for(const fn of this.listeners)fn({kind});}
 contact(id){return this.contacts.find(c=>c.id===id);}
 search(query=''){const q=query.trim().toLocaleLowerCase();return this.contacts.filter(c=>!q||c.name.toLocaleLowerCase().includes(q)||initials(c.name).includes(q)||normalizeNumber(c.number).includes(normalizeNumber(q))&&/\d/.test(q)).sort((a,b)=>a.name.localeCompare(b.name,'ko',{numeric:true}));}
 now(){return storyClock.now();}
 duration(){return this.call?.connectedAt?Math.max(0,Math.floor((this.call.endedAt||Date.now())-this.call.connectedAt)/1000):0;}
 active(){return this.call&&!['ended'].includes(this.call.phase);}
 later(fn,ms,allowEnded=false){const id=this.call?.id;const timer=setTimeout(()=>{this.timers.delete(timer);if(this.call?.id===id&&(allowEnded||this.call.phase!=='ended'))fn();},Math.max(0,ms));this.timers.add(timer);}
 clearTimers(){for(const t of this.timers)clearTimeout(t);this.timers.clear();}
 favorite(id){const c=this.contact(id);if(c){c.favorite=!c.favorite;this.emit('contacts');}}
 record(call,result){const type=result==='missed'||(result==='declined'&&call.direction==='incoming')?'missed':result==='declined'?'rejected':['unavailable','invalid-scenario','blocked','no-answer'].includes(result)?'failed':call.direction;this.logs.unshift({id:'run-log-'+call.id,contactId:call.contact.id,contact:cloneData(call.contact),callerName:call.contact.name,number:call.contact.number,at:this.now(),dateLabel:null,timeLabel:null,type,missed:result==='missed'||(result==='declined'&&call.direction==='incoming'),duration:Math.floor(this.duration()),connected:call.connectedAt!==null,attemptDuration:Math.max(0,Math.floor((call.endedAt-call.startedAt)/1000)),endedBy:call.endedBy,result});}
 outgoing(idOrNumber){if(this.active())return false;if(this.call)this.dismiss();let c=this.contact(idOrNumber)||this.contacts.find(c=>normalizeNumber(c.number)===normalizeNumber(idOrNumber));const number=normalizeNumber(idOrNumber);if(!c){if(!number)return false;c={id:'dial-'+number,name:number,number,relation:'키패드 입력',avatar:null};}const outcome=this.outcomes[c.id]||defaultOutcome;this.begin(c,'outgoing','connecting',outcome.scenarioId);this.emit('call');this.later(()=>{if(outcome.canConnect&&outcome.result==='connected')this.connect();else this.finish(outcome.result||'no-answer');},outcome.canConnect?phoneSettings.connectDelayMs:outcome.result==='blocked'?phoneStorySettings.blockedDelayMs:phoneStorySettings.normalMinMs+Math.random()*(phoneStorySettings.normalMaxMs-phoneStorySettings.normalMinMs));return true;}
 begin(contact,direction,phase,scenarioId){this.clearTimers();this.call={id:'call-'+(++this.sequence),contact:cloneData(contact),direction,phase,scenarioId,startedAt:Date.now(),connectedAt:null,endedAt:null,result:null,expanded:direction==='outgoing',muted:false,speaker:false,panel:null,dtmf:'',transcript:[],choices:[],nodeId:null,error:null};}
 incoming(contactId='kwon-jinwoo',options={}){const c=this.contact(contactId);if(!c)return false;if(options.eventId&&this.firedEvents.has(options.eventId))return false;if(this.active()){if(options.eventId)return false;this.logs.unshift({id:'busy-'+(++this.sequence),contactId:c.id,contact:cloneData(c),callerName:c.name,number:c.number,at:this.now(),type:'missed',missed:true,duration:0,result:'busy'});this.emit('logs');return false;}if(options.eventId)this.firedEvents.add(options.eventId);if(this.call)this.dismiss();const scenario=options.scenarioId||this.scenarios.find(s=>s?.contactId===contactId&&s.direction==='incoming'&&s.canConnect)?.id;this.begin(c,'incoming','ringing',scenario);this.emit('call');this.later(()=>this.finish('missed'),options.ringTimeoutMs||phoneSettings.ringTimeoutMs);return true;}
 accept(){if(this.call?.phase!=='ringing')return;this.clearTimers();this.call.expanded=true;this.connect();}
 decline(){if(this.call?.phase==='ringing')this.finish('declined');}
 connect(){const c=this.call,s=this.scenarios.find(s=>s?.id===c?.scenarioId);if(!s||!s.canConnect||s.contactId!==c.contact.id||s.direction!==c.direction||!s.nodes||!s.nodes[s.start]){if(c)c.error='통화를 연결할 수 없습니다.';this.finish('invalid-scenario');return;}c.phase='connected';c.connectedAt=Date.now();c.expanded=true;if(Number.isFinite(s.openingDelayMs)&&s.openingDelayMs>0){c.waiting=true;this.emit('dialogue');this.later(()=>this.enterNode(s.start),Math.min(3000,s.openingDelayMs));}else this.enterNode(s.start);}
 enterNode(id){try{
  const c=this.call,s=this.scenarios.find(s=>s.id===c.scenarioId),node=s?.nodes?.[id];
  if(!node||(!node.silent&&typeof node.text!=='string'))throw Error('node');
  if(!node.end&&!node.next&&(!Array.isArray(node.choices)||!node.choices.length))throw Error('flow');
  if(node.next&&!s.nodes[node.next])throw Error('next');
  if(Array.isArray(node.choices)&&node.choices.some(x=>!x||typeof x.id!=='string'||typeof x.text!=='string'||!s.nodes[x.next]))throw Error('choice');
  c.nodeVisits=(c.nodeVisits||0)+1;if(c.nodeVisits>100)throw Error('cycle');c.nodeId=id;if(!node.silent)c.transcript.push({side:node.side||'in',text:node.text});c.choices=[];c.waiting=!node.end;this.emit('dialogue');
  if(node.end)this.later(()=>{c.endedBy=node.endedBy||'remote';this.finish(node.result||s.result||'completed');},node.endAfterMs??1800);
  else if(node.next)this.later(()=>this.enterNode(node.next),Math.max(100,Math.min(10000,node.afterMs??1500)));
  else this.later(()=>{c.waiting=false;c.choices=cloneData(node.choices);this.emit('dialogue');},Math.max(1000,Math.min(3000,node.delayMs||1500)));
 }catch{if(this.call)this.call.error='통화를 계속할 수 없습니다.';this.finish('invalid-scenario');}}
 choose(id){const c=this.call;if(c?.phase!=='connected'||c.waiting)return;const choice=c.choices.find(x=>x.id===id);if(!choice)return;c.transcript.push({side:'out',text:choice.spokenText||choice.text});c.choices=[];c.waiting=true;this.emit('dialogue');this.later(()=>this.enterNode(choice.next),1500);}
 finish(result='ended'){const c=this.call;if(!c||c.phase==='ended')return;this.clearTimers();c.endedAt=Date.now();c.endedBy||=result==='ended'?'local':'system';c.result=result;c.phase='ended';c.choices=[];c.waiting=false;this.record(c,result);this.emit('ended');this.later(()=>this.dismiss(),phoneSettings.endDisplayMs,true);}
 dismiss(){if(this.active())return;this.clearTimers();this.call=null;this.emit('dismissed');if(this.eventsStarted)queueMicrotask(()=>this.checkEvents());}
 toggle(key){if(this.call?.phase==='connected'&&['muted','speaker'].includes(key)){this.call[key]=!this.call[key];this.emit('controls');}}
 panel(panel){if(this.call?.phase!=='connected')return;this.call.panel=this.call.panel===panel?null:panel;this.emit('controls');}
 dtmf(value){if(this.call?.phase==='connected'){this.call.dtmf=(this.call.dtmf+value).slice(-24);this.emit('controls');}}
 startEvents(){if(this.eventsStarted)return;this.eventsStarted=true;
  this.onVisible=()=>{if(document.visibilityState==='visible')this.checkEvents();};document.addEventListener('visibilitychange',this.onVisible);
  for(const event of this.events.filter(e=>e.enabled&&Number.isFinite(e.delayMs)&&e.delayMs>=0)){
   const timer=setTimeout(()=>{this.eventTimers.delete(timer);this.checkEvents();},Math.max(0,this.startedAt+event.delayMs-Date.now()));this.eventTimers.add(timer);
  }this.checkEvents();
 }
 checkEvents(){if(!this.eventsStarted||this.active()||this.call)return;
  for(const event of this.events.filter(e=>e.enabled&&!this.firedEvents.has(e.id)&&Number.isFinite(e.delayMs)&&Date.now()>=this.startedAt+e.delayMs).sort((a,b)=>a.delayMs-b.delayMs)){
   if(this.incoming(event.contactId,{...event,eventId:event.id}))break;
  }
 }
 destroy(){this.clearTimers();for(const t of this.eventTimers)clearTimeout(t);this.eventTimers.clear();this.eventsStarted=false;if(this.onVisible)document.removeEventListener('visibilitychange',this.onVisible);this.listeners.clear();}
}
