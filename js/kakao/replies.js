import {normalizeMessage} from '../messages/story-rules.js';
// Session-only new replies. Historical Kakao messages are never edited here.
export const kakaoReplySettings={
 first:{id:'manager-first',delayMinMs:1000,delayMaxMs:2000,gapMinMs:1000,gapMaxMs:2000,queue:true,queueGapMs:1000,
  lines:['양이야?','너 맞아?','지금 어디야?','형이 갈게.','제발 답 좀 해 줘.']},
 followup:{delayMinMs:1000,delayMaxMs:4000,queue:true,queueGapMs:1000}
};
export const managerKakaoBranches=[
 {id:'stay-away',keywords:['오지 마'],texts:['알겠어. 그럼 연락이라도 끊지 마.','알겠어. 억지로 가지 않을게. 괜찮은지만 알려 줘.']},
 {id:'sorry',keywords:['미안','죄송'],texts:['미안하다는 말 하지 말고 어디 있는지만 알려 줘.','사과하지 않아도 돼. 지금 있는 곳만 알려 줄래?']},
 {id:'okay',keywords:['괜찮아','괜찮아요'],texts:['네가 괜찮다고 해도 형은 직접 봐야 안심하겠어.','알겠어. 그래도 어디 있는지 알려 주면 좋겠어.']},
 {id:'home',keywords:['집'],texts:['집이야? 지금 갈게.','집에 있는 거야? 형이 가도 될까?']},
 {id:'distress',keywords:['힘들어','무서워'],texts:['알겠어. 지금 다 설명 안 해도 돼.','천천히 얘기해도 돼. 형은 듣고 있어.']},
 {id:'general',keywords:[],texts:['양이야, 지금 안전한 곳에 있는지만 알려 줘.','연락 줘서 고마워. 어디 있는지 말해 줄 수 있어?','다그치려는 게 아니야. 네가 괜찮은지 확인하고 싶어.']}
];
export function planKakaoReply(thread,sent,state){
 if(thread.id!=='manager')return null;
 const flags=state.manager||(state.manager={contacted:false,variants:{}});
 if(!flags.contacted){flags.contacted=true;return {...kakaoReplySettings.first,lines:[...kakaoReplySettings.first.lines]};}
 const text=normalizeMessage(sent.text);
 const rule=managerKakaoBranches.find(r=>r.keywords.some(k=>text.includes(normalizeMessage(k))))||managerKakaoBranches.at(-1);
 const turn=flags.variants[rule.id]||0;flags.variants[rule.id]=turn+1;
 return {id:'manager-'+rule.id,text:rule.texts[turn%rule.texts.length],...kakaoReplySettings.followup};
}
