import {posts as legacyPosts} from '../data.js';
export const xUsers=[{id:'fan',name:'기다리는 마음',handle:'waiting_sample',bio:'가상 팬 계정 · 짧은 안부를 남깁니다.',followers:124},
{id:'clip',name:'무대 기록',handle:'stage_sample',bio:'가상의 영상 논쟁 기록 계정',followers:310},
{id:'rumor',name:'익명의 글 (샘플)',handle:'unknown_sample',bio:'근거 없는 주장 유통을 표현한 가상 계정',followers:18},
{id:'check',name:'확인부터',handle:'check_sample',bio:'추측보다 사실 확인',followers:842}];
const post=(id,userId,text,extra={})=>({id,userId,text,timestamp:'2028-07-03T09:00:00+09:00',sample:true,likes:24,reposts:3,views:512,replies:[],...extra});
export const xPosts=[
post('waiting','fan','양양아, 오늘은 편안한 하루였으면 좋겠다.',{replies:[{id:'r1',userId:'check',text:'조용히 기다리고 있어요.'}]}),
post('stage','clip','짧게 잘린 무대 영상만으로 모든 상황을 판단할 수 있을까. 과도한 일정의 맥락도 봐야 한다.',{replies:[{id:'r2',userId:'fan',text:'장면 하나로 사람을 단정하지 않았으면.'}]}),
post('unfounded','rumor','약물·연애·태도 의혹이라는 글이 돌고 있다. [미확인 루머를 옮기는 가상 게시물]',{label:'근거 없는 루머 · 가상 샘플',replies:[{id:'r3',userId:'check',text:'모두 사실관계 없는 루머입니다. 확인되지 않은 주장을 퍼뜨리지 말아 주세요.'}]}),
post('rebuttal','check','양양을 둘러싼 약물·연애·태도 루머는 사실관계가 없다. 확인 없는 반복은 괴롭힘이 된다.',{likes:173,reposts:68}),
post('return','fan','다시 무대를 볼 날을 기다리지만, 지금은 쉬어도 괜찮아.',{likes:302,reposts:21})];
export const trends=[{tag:'양양',description:'팬들이 남기는 안부',query:'양양'},{tag:'사실 확인',description:'추측보다 맥락',query:'루머'},{tag:'무대 기록',description:'온라인 이야기',query:'무대'}];
export const instagramUsers=[
{id:'official',name:'그룹 공식 (그룹명 미정)',handle:'group_official_sample',bio:'5인조 그룹 · 가상 공식 계정',followers:10800},
...['양양','수현','유진','연우','다온','은수'].map((name,i)=>({id:['yangyang','member','yujin','yeonwoo','daon','eunsu'][i],name,handle:'artist_sample_'+i,bio:'작품 속 가상 계정',followers:1800+i*100})),
{id:'daily',name:'일상 기록 (샘플)',handle:'daily_sample',bio:'가상 일상 계정',followers:70},
{id:'legacy-member',name:'멤버 A (샘플)',handle:'member_archive_sample',bio:'기존 게시물 보존용 계정 · 인물 미정',followers:0}];
export const instagramPosts=[...legacyPosts.map((p,i)=>({id:'legacy-ig-'+i,userId:i?'legacy-member':'yangyang',text:p.text,image:'assets/photo-placeholder.svg',alt:'기존 게시물 이미지 미등록',timestamp:null,dateLabel:p.date,likes:p.likes,comments:[]})),
...['official','member','yujin','yeonwoo','daon','eunsu','daily'].map((userId,i)=>({id:'ig-'+userId,userId,text:['함께한 일상의 기록. (교체용 샘플)','짧은 안부를 남겨요.','오늘도 밥 잘 챙겨 먹기.','잠시 쉬어 가는 하루.','조용한 오후.','형, 잘 지내고 있어요?','작은 일상 기록.'][i],image:'assets/photo-placeholder.svg',alt:'이미지 미등록 플레이스홀더',timestamp:'2028-07-03T08:00:00+09:00',sample:true,likes:30+i,comments:[{id:'ig-comment-'+i,userId:'daily',text:'편안한 하루 보내요.'}]}))];
export const instagramDMs=[{id:'dm-eunsu',userId:'eunsu',messages:[{id:'dm1',senderId:'eunsu',text:'형, 안부 남겨요.',timestamp:'2028-07-03T08:00:00+09:00'},{id:'dm2',senderId:'yangyang',text:'고마워.',timestamp:'2028-07-03T08:01:00+09:00'}]},{id:'dm-member',userId:'member',messages:[{id:'dm3',senderId:'member',text:'밥 잘 챙겨 먹어.',timestamp:'2028-07-03T08:30:00+09:00'}]}];
