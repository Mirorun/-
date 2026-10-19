// Only new session SMS responses. Historical records and Kakao rules are untouched.
export const normalizeMessage = text => String(text).normalize('NFKC').toLocaleLowerCase().replace(/[\p{P}\p{S}\s]/gu,'').replace(/괜찬/g,'괜찮').replace(/누구세여/g,'누구세요').replace(/미안헤/g,'미안해');
export const displayName = text => String(text ?? '').replace(/양양아/g,'양이야').replace(/양양(?!이)/g,'양이');
const situations = [
 ['profanity',['씨발','시발','ㅅㅂ','병신','개새끼','좆','꺼져']],
 ['identity',['누구','번호']], ['report',['신고','고소','경찰']],
 ['stop',['그만','하지마','연락하지마']], ['apology',['미안','죄송','사과']],
 ['protest',['왜','억울','아니야','사실']],
];
export const hostileResponses = {
 'unknown-1': {
  profanity:['욕도 할 줄 아네ㅋㅋ 이미지 관리는 끝났어?','왜 욕부터 해ㅋㅋ'],
  identity:['누군지 알면 뭐 하게ㅋㅋ','이제 와서 누구냐고?ㅋㅋ'],
  report:['신고한다는 말은 빠르네ㅋㅋ','그래, 해 봐ㅋㅋ'],
  stop:['그만하라는 답장은 또 하네ㅋㅋ','폰은 보고 있었네ㅋㅋ'],
  apology:['나한테 미안하다고?ㅋㅋ','이제 사과하면 다 끝이야?ㅋㅋ'],
  protest:['그렇게 억울하면 직접 해명하든가.','설명은 여기 말고 밖에서 해ㅋㅋ'],
  long:['길어서 안 읽음ㅋㅋ','말은 참 많네ㅋㅋ'],
  general:['아 이제야 답하네ㅋㅋ','답장은 할 수 있었네ㅋㅋ']
 },
 'unknown-2': {
  profanity:['씨발, 욕하면 네 말이 맞아지냐.','욕할 기운은 있나 보네.'],
  identity:['내가 누군지가 중요하냐.','이름 알면 뭐가 달라지는데.'],
  report:['고소 얘기 말고 해명이나 해.','신고한다고 겁먹을 줄 알았냐.'],
  stop:['이제 와서 그만하라고?','네가 듣기 싫으면 끝이냐.'],
  apology:['이제 와서 미안하면 뭐 어쩌라고.','사과 한마디면 끝이라고 생각해?'],
  protest:['니가 먼저 잘했어야지.','이제 와서 뭘 어쩌라고.'],
  long:['긴 변명은 됐고.','결국 네 얘기만 하네.'],
  general:['답장할 시간은 있나 보네.','할 말 있으면 똑바로 해.']
 },
 intrusive: {
  profanity:['그렇게 화내는 이유가 뭔데?','욕하는 것도 다 보고 있어.'],
  identity:['누구일 것 같은데?','네가 모르는 사람일까?'],
  report:['신고할 만큼 신경 쓰였어?','신고 전에 답부터 해 줘.'],
  stop:['답장하는 거 보니까 폰은 보고 있네.','이렇게까지 피하는 이유가 있어?'],
  apology:['뭐가 미안한 건데?','어떤 얘기에 사과하는 거야?'],
  protest:['그때 같이 있던 사람은 누구였는데?','다들 궁금해하는 거 알지?'],
  long:['다른 얘기로 돌리는 것 같은데.','내가 물은 건 그게 아닌데.'],
  general:['너 요즘 어디 있는지 다들 궁금해하더라.','요즘 어떻게 지내는지 궁금해서.']
 },
 hostile: {
  profanity:['욕한다고 달라지는 건 없어.','그런 말밖에 못 하겠어?'],
  identity:['누군지 알아야만 대답할 거야?','신원 확인으로 넘기지 마.'],
  report:['신고한다는 말로 입 막으려는 거야?','고소 얘기보다 네 입장을 말해.'],
  stop:['이제 그만 나와.','그만하라는 말은 우리가 하고 싶어.'],
  apology:['사과문 하나로 끝날 일이라고 생각해?','이제 네 사과도 못 믿겠어.'],
  protest:['네 말은 더 이상 안 믿어.','해명이라고 다 믿어야 해?'],
  long:['길게 쓴다고 믿음이 생기지는 않아.','결국 책임질 말은 없네.'],
  general:['기다리는 사람들 생각은 해 봤어?','침묵한다고 사라지는 일은 없어.']
 }
};
export const managerResponses = [
 {id:'stay-away',keywords:['오지마'],texts:['알겠어. 억지로 가지 않을게. 지금 안전한지만 알려 줘.','알았어. 그럼 연락이라도 끊지 말아 줘.']},
 {id:'stop',keywords:['그만','연락하지마'],texts:['네 마음은 알겠어. 안전한지만 한 번 알려 줄 수 있어?','다그치지 않을게. 괜찮은지만 확인하고 싶어.']},
 {id:'sorry',keywords:['미안','죄송'],texts:['사과하지 않아도 돼. 어디 있는지만 알려 줘.','미안하다는 말보다 네가 있는 곳을 알려 줘.']},
 {id:'okay',keywords:['괜찮'],texts:['괜찮다고 해도 걱정돼. 지금 어디야?','형은 네가 안전한지 확인하고 싶어. 어디 있는지만 알려 줘.']},
 {id:'alone',keywords:['혼자'],texts:['혼자 있다니 걱정돼. 곁에 있어 줄 수 있게 해 줄래?','지금 혼자야? 연락은 끊지 말아 줘.']},
 {id:'home',keywords:['집'],texts:['집에 있는 거야? 문 열어 줄 수 있어?','집이라는 거지? 형이 가도 괜찮을까?']},
 {id:'hospital',keywords:['병원'],texts:['어느 병원이야? 이름이랑 위치 알려 줘.','병원에 있어? 어디인지 알려 주면 갈게.']},
 {id:'distress',keywords:['무서워','힘들어'],texts:['지금 다 설명하지 않아도 돼. 괜찮다면 곁에 가고 싶어.','혼자 감당하지 않아도 돼. 형 여기 있어.']},
 {id:'unsure',keywords:['모르겠'],texts:['지금 당장 설명하지 않아도 돼. 천천히 말해 줘.','괜찮아. 먼저 숨 좀 돌리자. 형은 듣고 있어.']},
 {id:'where',keywords:['어디야'],texts:['지금 연락 보고 있어. 네가 있는 곳을 알려 주면 갈게.','네 연락 기다리고 있어. 지금 어디 있는지 알려 줄래?']},
 {id:'general',keywords:[],texts:['양이야, 일단 네가 괜찮은지만 알려 줘.','연락 줘서 고마워. 지금 안전한 곳에 있어?']}
];
export const smsStorySettings = {
 hostile:{delayMinMs:1000,delayMaxMs:6000},
 managerFirst:{delayMinMs:700,delayMaxMs:1200,lines:['양이야?','너 맞아?','지금 어디야?','형이 갈게.','위치만 알려 줘.'],gapMinMs:700,gapMaxMs:2000},
 manager:{delayMinMs:1000,delayMaxMs:2000},
 eunsu:{delayMinMs:2000,delayMaxMs:4000,text:'...형?'},
 police:{delayMinMs:25000,delayMaxMs:40000,lines:['야.','무슨 말이야.','양이야.','너 지금 어디야?','야, 대답해.'],gapMinMs:700,gapMaxMs:1400}
};
export function planStoryReply(thread,sent,state){
 const id=thread.id, flags=state[id]||(state[id]={turn:0,choices:{}}), text=normalizeMessage(sent.text);
 const pick=(key,items)=>{const n=flags.choices[key]||0;flags.choices[key]=n+1;return items[n%items.length];};
 if(id==='police'){
  if(!sent.originDraftId||flags.draftReplied)return null;
  flags.draftReplied=true;return {id:'original-draft',...smsStorySettings.police};
 }
 if(id==='doctor')return null;
 if(id==='eunsu'){
  if(flags.hasRepliedOnce)return null;flags.hasRepliedOnce=true;
  return {id:'only-once',...smsStorySettings.eunsu};
 }
 if(id==='manager'){
  if(!flags.turn++){return {id:'session-first',...smsStorySettings.managerFirst};}
  const rule=managerResponses.find(r=>r.keywords.some(k=>text.includes(normalizeMessage(k))))||managerResponses.at(-1);
  return {id:rule.id,text:pick(rule.id,rule.texts),...smsStorySettings.manager};
 }
 const persona=hostileResponses[id]||hostileResponses[{'hostile-2':'unknown-2','hostile-3':'intrusive'}[id]];
 if(persona){const kind=situations.find(([,keys])=>keys.some(k=>text.includes(normalizeMessage(k))))?.[0]||(sent.text.length>100?'long':'general');return {id:kind,text:pick(kind,persona[kind]),...smsStorySettings.hostile};}
 return undefined; // Existing engine handles all other contacts.
}
