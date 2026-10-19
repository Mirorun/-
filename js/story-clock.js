import {timeConfig} from './time-config.js';
const startedAt=Date.now(),cache=new Map();
const formatter=(kind,zone)=>{const key=kind+'|'+zone;if(!cache.has(key))cache.set(key,new Intl.DateTimeFormat(kind==='time'?'en-GB':kind==='day'?'en-CA':'ko-KR',{timeZone:zone,...(kind==='time'?{hour:'2-digit',minute:'2-digit',hourCycle:'h23'}:kind==='day'?{year:'numeric',month:'2-digit',day:'2-digit'}:{year:'numeric',month:'long',day:'numeric',weekday:'long'})}));return cache.get(key);};
export const storyClock={
 now(at=Date.now()){return Math.min(Date.parse(timeConfig.end),Date.parse(timeConfig.start)+Math.max(0,at-startedAt)*timeConfig.flowRate);},
 time(at=this.now(),zone=timeConfig.timeZone){return formatter('time',zone).format(new Date(at)).replace(/^0/,'');},
 date(at=this.now(),zone=timeConfig.timeZone){return formatter('date',zone).format(new Date(at));},
 day(at=this.now(),zone=timeConfig.timeZone){const p=formatter('day',zone).formatToParts(new Date(at));return ['year','month','day'].map(k=>p.find(v=>v.type===k).value).join('-');},
 iso(){return new Date(this.now()).toISOString();}
};
