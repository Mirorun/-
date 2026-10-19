// Keyword rules win, then first-contact rules, then the general fallback.
// once:true reserves the rule when scheduled, preventing duplicate reply events.
export const replyRules={
 'kwon-jinwoo':{enabled:true,rules:[
  {id:'apology',keywords:['미안','사과'],once:true,delayMs:1800,text:'답장해 줘서 고마워. 서두르지 않아도 괜찮아.'},
  {id:'first-contact',firstContact:true,once:true,delayMs:2200,text:'양양아, 연락 줘서 고마워. 지금은 좀 괜찮아?'},
  {id:'general',fallback:true,once:false,delayMs:2500,text:'응, 듣고 있어. 편한 만큼 이야기해 줘.'}]},
 member:{enabled:true,rules:[
  {id:'first-contact',firstContact:true,once:true,delayMs:1800,text:'연락 와서 다행이야. 밥은 챙겨 먹었어?'},
  {id:'general',fallback:true,once:false,delayMs:2400,text:'응, 여기 있어. 천천히 이야기하자.'}]},
 manager:{enabled:true,rules:[
  {id:'first-contact',firstContact:true,once:true,delayMs:1600,text:'연락 확인했어. 답장 줘서 고마워.'},
  {id:'general',fallback:true,once:false,delayMs:2100,text:'확인했어. 필요한 게 있으면 알려 줘.'}]},
 police:{enabled:false,rules:[]},
 doctor:{enabled:false,rules:[]}
};
