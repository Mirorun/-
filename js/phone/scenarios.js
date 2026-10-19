// Only explicitly configured contacts connect. Other numbers use defaultOutcome.
export const defaultOutcome={result:'no-answer',canConnect:false};
export const outgoingOutcomes={
 'kwon-jinwoo':{result:'connected',canConnect:true,scenarioId:'jinwoo-out'},
 manager:{result:'connected',canConnect:true,scenarioId:'manager-out'},
 police:{result:'no-answer',canConnect:false},doctor:{result:'no-answer',canConnect:false},
 advert:{result:'unavailable',canConnect:false},hostile:{result:'declined',canConnect:false}
};
const jinwooNodes={
 hello:{text:'양양아, 전화 줬네. 지금 잠깐 이야기할 수 있어?',delayMs:1500,choices:[{id:'short',text:'응, 잠깐은 괜찮아.',next:'short'},{id:'listen',text:'형 목소리가 듣고 싶었어.',next:'listen'},{id:'later',text:'오늘은 짧게만 이야기하고 싶어.',next:'later'}]},
 short:{text:'그래. 밥은 챙겨 먹었어? 네 안부가 궁금했어.',delayMs:1400,choices:[{id:'yes',text:'응, 챙겨 먹었어.',next:'end'},{id:'try',text:'조금씩 챙겨 볼게.',next:'end'}]},
 listen:{text:'연락해 줘서 고마워. 편한 만큼만 이야기해도 돼.',delayMs:1400,choices:[{id:'thanks',text:'고마워, 형.',next:'end'},{id:'next',text:'다음에 또 연락할게.',next:'end'}]},
 later:{text:'알겠어. 오늘은 안부만 듣는 걸로 하자.',delayMs:1200,choices:[{id:'bye',text:'응, 다음에 연락할게.',next:'end'}]},
 end:{text:'응. 무리하지 말고, 편할 때 또 연락해.',end:true,endAfterMs:1800,result:'completed'}
};
const managerNodes={hello:{text:'양양아, 연락이 닿아서 다행이야. 잠깐 괜찮아?',delayMs:1500,choices:[{id:'yes',text:'응, 잠깐 괜찮아.',next:'plans'},{id:'later',text:'오늘은 안부만 전할게.',next:'end'}]},plans:{text:'활동 관련 이야기는 나중에 천천히 정리하자. 필요한 게 있으면 알려 줘.',delayMs:1600,choices:[{id:'ok',text:'알겠어. 고마워.',next:'end'},{id:'next',text:'다음에 이야기하자.',next:'end'}]},end:{text:'응, 연락 줘서 고마워. 오늘은 여기까지 하자.',end:true,endAfterMs:1600,result:'completed'}};
export const callScenarios=[
 {id:'jinwoo-out',contactId:'kwon-jinwoo',direction:'outgoing',canConnect:true,start:'hello',nodes:jinwooNodes,result:'completed'},
 {id:'jinwoo-in',contactId:'kwon-jinwoo',direction:'incoming',canConnect:true,start:'hello',nodes:jinwooNodes,result:'completed'},
 {id:'manager-out',contactId:'manager',direction:'outgoing',canConnect:true,start:'hello',nodes:managerNodes,result:'completed'},
 {id:'manager-in',contactId:'manager',direction:'incoming',canConnect:true,start:'hello',nodes:managerNodes,result:'completed'},
 {id:'areum-future',contactId:'police',direction:'outgoing',canConnect:false,start:null,nodes:{},result:'no-answer'},
 {id:'deokchun-future',contactId:'doctor',direction:'outgoing',canConnect:false,start:null,nodes:{},result:'no-answer'}
];
