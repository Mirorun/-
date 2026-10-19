import {alarms,timerDefaults,cities} from './data.js';
import {storyClock} from '../story-clock.js';
export class ClockStore{
 constructor(notify){this.notify=notify;this.alarms=structuredClone(alarms);this.cities=structuredClone(cities);this.defaults=structuredClone(timerDefaults);this.stopwatch={elapsed:0,startedAt:null};this.timer={state:'idle',duration:0,remaining:0,endAt:null,id:0};this.alarmFired=new Set();this.lastCheck=storyClock.now();this.sequence=0;}
 stopwatchMs(){return this.stopwatch.elapsed+(this.stopwatch.startedAt===null?0:Math.max(0,performance.now()-this.stopwatch.startedAt));}
 startWatch(){if(this.stopwatch.startedAt===null)this.stopwatch.startedAt=performance.now();}
 pauseWatch(){if(this.stopwatch.startedAt!==null){this.stopwatch.elapsed=this.stopwatchMs();this.stopwatch.startedAt=null;}}
 resetWatch(){this.stopwatch={elapsed:0,startedAt:null};}
 timerMs(){return this.timer.state==='running'?Math.max(0,this.timer.endAt-Date.now()):this.timer.remaining;}
 startTimer(ms){if(!Number.isFinite(ms)||ms<1000||ms>86399000)return false;this.timer={state:'running',duration:ms,remaining:ms,endAt:Date.now()+ms,id:++this.sequence};return true;}
 pauseTimer(){if(this.timer.state==='running'){this.tick();if(this.timer.state!=='running')return;this.timer.remaining=this.timerMs();this.timer.endAt=null;this.timer.state='paused';}}
 resumeTimer(){if(this.timer.state==='paused'&&this.timer.remaining>0){this.timer.endAt=Date.now()+this.timer.remaining;this.timer.state='running';}}
 cancelTimer(){this.timer={state:'idle',duration:0,remaining:0,endAt:null,id:this.timer.id};}
 addAlarm(time,label){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return false;this.alarms.push({id:'visitor-alarm-'+(++this.sequence),time,label:(label||'알람').slice(0,100),enabled:true});this.alarms.sort((a,b)=>a.time.localeCompare(b.time));return true;}
 tick(){let changed=false;if(this.timer.state==='running'&&Date.now()>=this.timer.endAt){this.timer.state='finished';this.timer.remaining=0;this.timer.endAt=null;this.notify({id:'clock-timer-'+this.timer.id,senderName:'타이머',message:'설정한 시간이 끝났습니다.',clockTab:'timer'});changed=true;}
 const now=storyClock.now(),day=storyClock.day(now);for(const a of this.alarms){if(!a.enabled||!/^([01]\d|2[0-3]):[0-5]\d$/.test(a.time))continue;const key=a.id+'-'+day,target=Date.parse(day+'T'+a.time+':00+09:00');if(target>this.lastCheck&&target<=now&&!this.alarmFired.has(key)){this.alarmFired.add(key);this.notify({id:'clock-alarm-'+key,senderName:'알람',message:a.label||'알람',clockTab:'alarms'});changed=true;}}this.lastCheck=now;return changed;}
}
