import {replyRules} from '../messages/replies.js';
// Existing SMS lines/delayMs are preserved. Channel overrides may differ.
const memberRule=id=>({enabled:true,rules:[{id:'hello-'+id,fallback:true,once:false,delayMs:2400,text:'연락 줘서 고마워. 천천히 이야기하자.'}]});
export const channelRules={
 sms:{...replyRules,yujin:memberRule('yujin'),yeonwoo:memberRule('yeonwoo'),daon:memberRule('daon')},
 kakao:{...structuredClone(replyRules),yujin:memberRule('yujin'),yeonwoo:memberRule('yeonwoo'),daon:memberRule('daon')}
};
export function replyDelay(rule={}){const min=rule.delayMinMs,max=rule.delayMaxMs;const range=Number.isFinite(min)&&Number.isFinite(max)&&min>=0&&max>=min;return Math.min(2147483647,range?Math.round(min+Math.random()*(max-min)):Number.isFinite(rule.delayMs)&&rule.delayMs>=0?rule.delayMs:2000);}
export function selectReply(config,thread,sent,used){if(!config?.enabled||!Array.isArray(config.rules))return null;const rules=config.rules.filter(r=>r&&typeof r.id==='string'&&typeof r.text==='string'&&(!r.once||!used.includes(r.id)));const text=sent.text.toLocaleLowerCase();return rules.find(r=>Array.isArray(r.keywords)&&r.keywords.some(k=>typeof k==='string'&&text.includes(k.toLocaleLowerCase())))||rules.find(r=>r.firstContact&&!thread.messages.some(m=>m.side==='out'))||rules.find(r=>r.fallback);}
