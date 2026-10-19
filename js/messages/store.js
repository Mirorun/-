import {planStoryReply,normalizeMessage} from './story-rules.js';
import {storyClock} from '../story-clock.js';
import {cloneData} from '../session.js';
import {messageSeeds,messageSettings} from './data.js';
import {channelRules,replyDelay,selectReply} from '../messaging/rules.js';
export class MessageStore{
 constructor({seeds=messageSeeds,channel='sms',rules=channelRules[channel]}={}){this.channel=channel;this.rules=rules||{};this.listeners=new Set();this.timers=new Map();this.seeds=cloneData(Array.isArray(seeds)?seeds:[]).filter(t=>t&&typeof t.id==='string'&&typeof t.name==='string');for(const t of this.seeds){t.messages=(Array.isArray(t.messages)?t.messages:[]).filter(m=>m&&typeof m.text==='string').map(m=>({...m,at:m.at&&Number.isFinite(new Date(m.at).getTime())?m.at:null}));t.draft=typeof t.draft==='string'?t.draft:'';t.unread=Number.isFinite(t.unread)?t.unread:0;t.autoReply=!!this.rules[t.id]?.enabled;for(const m of t.messages)m.channel=channel;}this.state={version:3,startedAt:Date.now(),threads:{},jobs:{},usedRules:{},story:{}};this.onVisible=()=>{if(document.visibilityState==='visible')this.start();};document.addEventListener('visibilitychange',this.onVisible);}
 subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 emit(kind,threadId,message){for(const fn of this.listeners)fn({kind,threadId,message});}
 now(at=Date.now()){return storyClock.now(at);}
 ensureContact(contact){const id=contact.messageThreadId||contact.id;if(!this.base(id))this.seeds.push({id,name:contact.name,avatar:contact.avatar||null,category:contact.relation,autoReply:!!this.rules[id]?.enabled,draft:'',unread:0,sortOrder:0,messages:[]});}
 base(id){return this.seeds.find(t=>t.id===id);}
 overlay(id){return this.state.threads[id]||(this.state.threads[id]={messages:[],draft:undefined,readIds:[],baseRead:false,originalDraftIntact:true});}
 thread(id){const base=this.base(id);if(!base)return null;const o=this.state.threads[id]||{messages:[],readIds:[]};const all=[...base.messages,...o.messages];if(this.channel!=='sms'&&!this.preserveHistoryOrder)all.sort((a,b)=>{const x=a.at?new Date(a.at).getTime():0,y=b.at?new Date(b.at).getTime():0;return x-y;});const unread=(o.baseRead?0:base.unread)+o.messages.filter(m=>m.side==='in'&&!o.readIds.includes(m.id)).length;return {...base,messages:all,draft:o.draft===undefined?base.draft:o.draft,unread};}
 list(query=''){const q=query.trim().toLocaleLowerCase();return this.seeds.map(t=>this.thread(t.id)).filter(t=>!q||t.name.toLocaleLowerCase().includes(q)||t.messages.some(m=>m.text.toLocaleLowerCase().includes(q))).sort((a,b)=>{const at=t=>{const m=t.messages.at(-1);return m?.at?new Date(m.at).getTime():t.sortOrder;};return at(b)-at(a);});}
 unread(){return this.list().reduce((n,t)=>n+t.unread,0);}
 setDraft(id,text){if(!this.base(id))return;const o=this.overlay(id),value=String(text).slice(0,messageSettings.maxMessageLength);if(value!==this.base(id).draft)o.originalDraftIntact=false;o.draft=value;}
 markRead(id){const t=this.thread(id);if(!t||!t.unread)return;const o=this.overlay(id);o.baseRead=true;o.readIds=[...new Set([...o.readIds,...t.messages.filter(m=>m.side==='in').map(m=>m.id)])];this.emit('read',id);}
 send(id){const t=this.thread(id),text=this.channel==='sms'||this.preserveSentText?t?.draft:t?.draft.trim();if(!t||!text?.trim())return null;const o=this.overlay(id),message={id:'sent-'+(crypto.randomUUID?.()||Date.now()+'-'+Math.random().toString(36).slice(2)),side:'out',channel:this.channel,senderId:'yangyang',text,at:this.now(),source:'visitor'};if(this.channel==='sms'&&id==='police'&&o.originalDraftIntact&&text===this.base(id).draft&&text)message.originDraftId='seed-draft:'+id;o.originalDraftIntact=false;o.messages.push(message);o.draft='';this.scheduleReply(t,message);this.emit('sent',id,message);this.start();return message;}
 planReply(thread,sent,used){
  let rule=this.channel==='sms'?planStoryReply(thread,sent,this.state.story):undefined;
  if(rule===undefined){
   const matchingThread=this.channel==='sms'?{...thread,messages:thread.messages.filter(m=>m.source==='visitor')}:thread;
   const matchingSent=this.channel==='sms'?{...sent,text:normalizeMessage(sent.text)}:sent;
   const config=this.channel==='sms'?{...this.rules[thread.id],rules:this.rules[thread.id]?.rules?.map(r=>({...r,keywords:r.keywords?.map(normalizeMessage)}))}:this.rules[thread.id];
   rule=selectReply(config,matchingThread,matchingSent,used);
  }
  return rule;
 }
 scheduleReply(thread,sent){
  const used=this.state.usedRules[thread.id]||(this.state.usedRules[thread.id]=[]);
  const rule=this.planReply(thread,sent,used);
  if(!rule)return;
  if(rule.once)used.push(rule.id);
  const lines=(rule.lines||[rule.text]).filter(t=>typeof t==='string'&&t.trim());
  let dueAt=Date.now()+replyDelay(rule);
  const pending=Object.values(this.state.jobs).filter(j=>j.threadId===thread.id&&!j.done);
  if((this.channel==='sms'||rule.queue)&&pending.length)dueAt=Math.max(dueAt,Math.max(...pending.map(j=>j.dueAt))+(rule.queueGapMs??700));
  lines.forEach((text,index)=>{
   if(index)dueAt+=replyDelay({delayMinMs:rule.gapMinMs??700,delayMaxMs:rule.gapMaxMs??1400});
   const id='reply-'+sent.id+'-'+rule.id+'-'+index;
   this.state.jobs[id]={id,threadId:thread.id,ruleId:rule.id,text,dueAt,done:false};
  });
 }
 typing(id){return Object.values(this.state.jobs).some(j=>j.threadId===id&&!j.done);}
 start(){for(const job of Object.values(this.state.jobs)){if(job.done)continue;if(job.dueAt<=Date.now()){clearTimeout(this.timers.get(job.id));this.finish(job.id);}else if(!this.timers.has(job.id))this.timers.set(job.id,setTimeout(()=>this.finish(job.id),job.dueAt-Date.now()));}}
 finish(id){const job=this.state.jobs[id];if(!job||job.done)return;job.done=true;const o=this.overlay(job.threadId);const message={id,side:'in',channel:this.channel,senderId:job.threadId,text:job.text,at:this.now(job.dueAt),receivedAt:job.dueAt,source:'reply'};if(!o.messages.some(m=>m.id===id))o.messages.push(message);this.emit('received',job.threadId,message);this.timers.delete(id);}
 receiveEvent(event){if(!this.base(event.threadId))return false;const o=this.overlay(event.threadId),id=event.sourceMessageId||'event-'+event.id;let changed=false;if(!o.messages.some(m=>m.id===id)){o.messages.push({id,side:'in',channel:this.channel,senderId:event.senderId||event.threadId,text:event.message,at:this.now(event.firedAt),receivedAt:event.firedAt,source:'notification',eventId:event.id});changed=true;}if(event.read&&!o.readIds.includes(id)){o.readIds.push(id);changed=true;}if(changed)return changed;}
 markNotified(id){for(const o of Object.values(this.state.threads)){const m=o.messages.find(m=>m.id===id);if(m)m.noticePublished=true;}}
 replies(){return this.list().flatMap(t=>t.messages.filter(m=>m.source==='reply').map(m=>({thread:t,message:m,read:(this.state.threads[t.id]?.readIds||[]).includes(m.id)})));}
 clearNotificationEvents(){for(const o of Object.values(this.state.threads)){o.messages=o.messages.filter(m=>m.source!=='notification');o.readIds=o.readIds.filter(id=>!id.startsWith('event-'));}this.emit('reset-events');}
 reset(){for(const t of this.timers.values())clearTimeout(t);this.timers.clear();this.state={version:3,startedAt:Date.now(),threads:{},jobs:{},usedRules:{},story:{}};this.emit('reset');}
}
