import {callScenarios} from './scenarios.js';
// New session flows; the original scenarios, contacts and call history stay intact.
const jinwoo=callScenarios.find(s=>s.id==='jinwoo-out')?.nodes||{};
const choices=(texts,next)=>texts.map((text,i)=>({id:'choice-'+i,text,next}));
function monologue(id,contactId,texts){return {id,contactId,direction:'incoming',canConnect:true,start:'line-0',nodes:Object.fromEntries(texts.map((text,i)=>['line-'+i,{text,...(i===texts.length-1?{end:true,endAfterMs:1400,endedBy:'remote'}:{next:'line-'+(i+1),afterMs:1600})}]))};}
export const phoneStorySettings={normalMinMs:8000,normalMaxMs:15000,blockedDelayMs:300};
export const storyOutcomes={
 suhi:{canConnect:true,result:'connected',scenarioId:'story-suhi'},
 'kwon-jinwoo':{canConnect:true,result:'connected',scenarioId:'story-jinwoo'},
 manager:{canConnect:true,result:'connected',scenarioId:'story-manager'},
 doctor:{canConnect:false,result:'blocked'}
};
export const storyIncomingEvents=[
 {id:'story-unknown-first',enabled:true,contactId:'unknown-1',delayMs:85000,ringTimeoutMs:20000,scenarioId:'story-unknown-first-call'},
 {id:'story-unknown-second',enabled:true,contactId:'unknown-2',delayMs:210000,ringTimeoutMs:20000,scenarioId:'story-unknown-second-call'}
];
export const storyCallScenarios=[
 {id:'story-suhi',contactId:'suhi',direction:'outgoing',canConnect:true,start:'hello',openingDelayMs:900,nodes:{
  hello:{text:'...오빠?',next:'confirm',afterMs:1500},
  confirm:{text:'오빠, 맞아?',next:'where',afterMs:1000},
  where:{text:'지금 어디야.',next:'why',afterMs:1400},
  why:{text:'왜 이렇게 연락이 안 됐어.',next:'later',afterMs:1200},
  later:{text:'...아니, 됐어.',next:'talk',afterMs:900},
  talk:{text:'그건 나중에 얘기해도 되니까.',next:'okay',afterMs:1100},
  okay:{text:'괜찮아? 어디 아픈 건 아니지?',delayMs:1500,choices:['미안해.','...미안.','정말 미안해.'].map((text,i)=>({id:'sorry-'+i,text,spokenText:'...미안해.',next:'wait'}))},
  wait:{text:'오빠, 잠깐만.',next:'cutoff',afterMs:1000},
  cutoff:{text:'나 아직—',end:true,endAfterMs:450,result:'ended',endedBy:'local'}
 }},
 {id:'story-jinwoo',contactId:'kwon-jinwoo',direction:'outgoing',canConnect:true,start:'hello',nodes:{
  hello:{text:jinwoo.hello?.text||'전화 줬네. 지금 잠깐 이야기할 수 있어?',delayMs:1500,choices:choices(['별일 없어.','그냥 좀 피곤해.','형, 잠깐만 이야기하자.'],'meal')},
  meal:{text:jinwoo.short?.text||'밥은 챙겨 먹었어?',delayMs:1400,choices:choices(['괜찮다니까.','그냥 쉬고 있어.','형, 나중에 얘기하면 안 돼?'],'listen')},
  listen:{text:jinwoo.listen?.text||'편한 만큼만 이야기해도 돼.',delayMs:1400,choices:choices(['지금은 할 말 없어.','걱정 안 해도 돼.','오늘은 길게 말하기 싫어.'],'later')},
  later:{text:jinwoo.later?.text||'오늘은 안부만 듣는 걸로 하자.',delayMs:1200,choices:choices(['이제 끊을게.','나중에 연락할게.','형, 오늘은 그만할게.'],'end')},
  end:{text:jinwoo.end?.text||'편할 때 또 연락해.',end:true,endAfterMs:1200,result:'ended',endedBy:'local'}
 }},
 {id:'story-manager',contactId:'manager',direction:'outgoing',canConnect:true,start:'hello',nodes:{
  hello:{text:'양이야?',next:'where',afterMs:800},
  where:{text:'야, 너 지금 어디야?',next:'worried',afterMs:1000},
  worried:{text:'형이 얼마나 찾았는지 알아?',next:'soften',afterMs:1100},
  soften:{text:'...아니다.',next:'okay',afterMs:900},
  okay:{text:'일단 괜찮아?',next:'locate',afterMs:1000},
  locate:{text:'어디 있는지만 말해 줘.',next:'come',afterMs:900},
  come:{text:'형이 갈게.',delayMs:1400,choices:choices(['나 괜찮아.','그냥 혼자 있고 싶어.','미안해.'],'concern')},
  concern:{text:'다그치려는 게 아니야. 네가 안전한지만 알고 싶어.',delayMs:1400,choices:choices(['형, 나중에 전화할게.','지금은 혼자 있고 싶어.','미안해.'],'stay')},
  stay:{text:'알겠어. 그래도 연락은 끊지 말아 줘.',delayMs:1200,choices:choices(['끊을게.','나중에 연락할게.'],'end')},
  end:{silent:true,end:true,endAfterMs:50,result:'ended',endedBy:'local'}
 }},
 monologue('story-unknown-first-call','unknown-1',['여보세요?','아, 진짜 받네.','너 양이지?','요즘 인터넷 난리 난 거 봤냐?','사람들이 괜히 그러는 줄 알아?','...아, 됐다.','말해 봐야 뭐 하겠냐.']),
 monologue('story-unknown-second-call','unknown-2',['야, 양이.','전화는 받네?','활동은 안 하면서 폰은 잘 보고 있나 봐.','해명도 안 하고 숨어 있으면 끝이냐?','진짜 뻔뻔하다.','...됐어. 끊는다.'])
];
