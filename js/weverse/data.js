export const community={name:'[그룹명 미정]',description:'5인조 그룹의 가상 팬 커뮤니티',disclaimer:'가상 커뮤니티 · 실제 Weverse와 연결되지 않습니다.'};
export const artists=['양양','수현','유진','연우','다온'].map((name,i)=>({id:['yangyang','member','yujin','yeonwoo','daon'][i],name,avatar:null,bio:'5인조 그룹 멤버 · 교체용 프로필'}));
export const fans=[{id:'fan-1',name:'기다리는 마음',avatar:null},{id:'fan-2',name:'작은 안부',avatar:null}];
export const comments=[{id:'comment-1',postId:'artist-yangyang',authorId:'fan-1',text:'오늘도 응원해요.',date:null,dateLabel:'날짜 미정',likes:3},{id:'comment-2',postId:'fan-wait',authorId:'fan-2',text:'편안한 하루이기를.',date:null,dateLabel:'날짜 미정',likes:2}];
export const posts=[
{id:'artist-yangyang',authorId:'yangyang',type:'artist',text:'오늘도 함께해 줘서 고마워요. 밥 잘 챙겨 먹어요.',date:null,dateLabel:'과거 기록 · 날짜 미정',image:null,likes:120},
{id:'artist-member',authorId:'member',type:'artist',text:'잠깐의 안부. 오늘도 잘 보내요.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:80},
{id:'artist-yujin',authorId:'yujin',type:'artist',text:'작은 일상도 소중하게.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:74},
{id:'artist-yeonwoo',authorId:'yeonwoo',type:'artist',text:'오늘도 고마워요.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:67},
{id:'artist-daon',authorId:'daon',type:'artist',text:'따뜻한 말 남겨 줘서 고마워요.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:65},
{id:'fan-cheer',authorId:'fan-1',type:'fan',text:'다섯 명을 응원하는 마음은 그대로예요.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:16},
{id:'fan-wait',authorId:'fan-2',type:'fan',text:'소식이 뜸해서 걱정되지만, 양양이 편안한 시간을 보내기를 바라요.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:24},
{id:'fan-today',authorId:'fan-1',type:'fan',text:'오늘도 짧은 안부를 남깁니다.',date:null,dateLabel:'날짜 미정 · 샘플',image:null,likes:9}];
export const notices=[{id:'notice-1',title:'활동 안내 게시판 (샘플)',author:'운영자 (샘플)',date:null,dateLabel:'날짜 미정',text:'확정된 활동 일정은 이 게시판에서 안내할 수 있도록 준비했습니다. 현재는 교체용 공지이며 실제 일정이나 활동 중단 사유를 발표하는 내용이 아닙니다.',image:null,likes:0}];
