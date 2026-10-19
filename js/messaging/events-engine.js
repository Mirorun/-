export class SessionEvents{
 constructor(events,receive){this.events=events.filter(e=>e&&typeof e.id==='string');this.receive=receive;this.timers=new Map();this.fired=new Set();this.cancelled=new Set();this.startedAt=null;this.visibility=()=>{if(document.visibilityState==='visible')this.catchUp();};document.addEventListener('visibilitychange',this.visibility);}
 valid(e){return e.enabled&&!e.legacy&&['sms','kakao'].includes(e.channel)&&typeof e.text==='string'&&typeof e.senderId==='string'&&Number.isFinite(e.delayMs)&&e.delayMs>=0;}
 start(){if(this.startedAt!==null)return;this.startedAt=Date.now();this.catchUp();}
 catchUp(){if(this.startedAt===null)return;for(const e of this.events){if(!this.valid(e)||e.triggerType!=='sessionElapsed'||this.cancelled.has(e.id)||this.fired.has(e.id))continue;const remaining=this.startedAt+e.delayMs-Date.now();if(remaining<=0)this.fire(e);else if(!this.timers.has(e.id))this.timers.set(e.id,setTimeout(()=>this.fire(e),Math.min(remaining,2147483647)));}}
 fire(e){clearTimeout(this.timers.get(e.id));this.timers.delete(e.id);if(this.fired.has(e.id)||this.cancelled.has(e.id)||!this.valid(e))return false;this.fired.add(e.id);this.receive({...e,dueAt:this.startedAt+e.delayMs});return true;}
 cancel(id){this.cancelled.add(id);clearTimeout(this.timers.get(id));this.timers.delete(id);}
 destroy(){for(const timer of this.timers.values())clearTimeout(timer);this.timers.clear();document.removeEventListener('visibilitychange',this.visibility);}
 // Future trigger adapters call signal without creating new UI-specific timers.
 signal(type,context={}){for(const e of this.events){if(!this.valid(e)||e.triggerType!==type||this.fired.has(e.id)||this.cancelled.has(e.id)||this.timers.has(e.id))continue;if(e.targetId&&e.targetId!==context.id)continue;this.timers.set(e.id,setTimeout(()=>this.fire(e),e.delayMs));}}
}
