import {articles as legacy} from '../data.js';
const comments=[{id:'reader-1',author:'독자 (샘플)',text:'확인된 정보만 보고 싶어요.'},{id:'reader-2',author:'독자 2 (샘플)',text:'충분히 쉴 수 있기를 바랍니다.'}];
const article=(id,title,body,category)=>({id,title,body,category,source:'가상 문화저널',author:'기자 (이름 미정)',publishedAt:'2028-07-03T09:00:00+09:00',sample:true,likes:12,comments:structuredClone(comments)});
export const newsArticles=[...legacy.map((a,i)=>({...article('archive-'+i,a.title,a.body,i?'소속사 입장':'무대 논쟁'),source:a.source,publishedAt:null,dateLabel:'작성일 미정 · 기존 샘플'})),
article('activity','다섯 멤버가 함께한 무대의 기록','[교체용 샘플 기사]\n5인조 그룹의 활동 기록을 돌아본다. 그룹명과 구체적인 활동 날짜는 아직 정하지 않았다. 무대 밖 충분한 휴식의 필요성도 함께 이야기한다.','활동'),
article('rumors','사실 확인 없는 루머의 확산, 멈춰야 할 추측','[가상 기사]\n양양에 대한 약물·연애·태도 관련 의혹은 사실관계 없는 악성 루머다. 무대의 짧은 장면만으로 개인의 삶을 단정할 수 없다. 이 작품은 해당 루머를 사실로 취급하지 않는다.','루머 반박'),
article('hiatus','활동 공백 속, 공개되지 않은 복귀 일정','[교체용 샘플 기사]\n양양은 연락을 피하며 자택에 머무르고 있다. 구체적인 복귀 일정은 정해지지 않았다. 사생활을 추측하기보다 시간을 존중해야 한다는 의견이 나온다.','활동 공백'),
article('fans','기다리는 팬들 “편안한 하루였으면”','[교체용 샘플 기사]\n팬들은 짧은 안부와 응원의 말을 남겼다. 활동 재개 시점을 요구하기보다 양양의 일상을 걱정하는 목소리도 이어진다.','팬들의 걱정')];
export const favorites=[{title:'문화저널',url:'news.example/'},{title:'X 아카이브',url:'x.example/'}];
