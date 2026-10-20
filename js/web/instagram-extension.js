import {instagramPosts,instagramUsers} from './social-data.js';
import {storyPhotos} from '../photos/story-photos.js';
// Supplements are keyed by stable IDs. Never assign into source records.
export const profileExtras={yangyang:{name:'양이',bio:'PURE · 오래 남겨 두고 싶은 장면들',avatar:storyPhotos[14].thumbnailSrc},official:{name:'PURE',bio:'퓨어(PURE) 공식 계정'}};
export const instagramFans=[
 {id:'ig-fan-lamp',name:'스탠드빛',handle:'little_lamp',followers:64},
 {id:'ig-fan-leaf',name:'초록책갈피',handle:'leaf_bookmark',followers:91},
 {id:'ig-fan-night',name:'밤산책',handle:'night_walk',followers:38},
 {id:'ig-fan-echo',name:'다섯의잔향',handle:'five_echoes',followers:142},
 {id:'ig-fan-day',name:'하루조각',handle:'pieces_of_day',followers:53}
];
const captions=['불 끄기 전에 한 장. 잘 자요.','고개 들었더니 구름이 예뻐서.','이어폰 챙기고, 출발.','편지 읽는 데 시간이 좀 걸렸어요. 고마워요.','오늘은 여기까지.','...'];
const newDates=['2028-06-07','2028-06-10','2028-06-13','2028-06-16','2028-06-20','2028-06-23'];
export const addedInstagramPosts=captions.map((text,i)=>({id:'story-ig-'+String(i+1).padStart(2,'0'),userId:'yangyang',text,image:storyPhotos[i+9].src,alt:storyPhotos[i+9].alt,timestamp:newDates[i]+'T21:10:00+09:00',likes:[1342,1803,1564,2411,1718,1397][i],comments:[]}));
// Each photo belongs to one Instagram post; gallery reuse is intentional.
export const instagramMedia=Object.fromEntries([...instagramPosts,...addedInstagramPosts].map((p,i)=>[p.id,[storyPhotos[[4,6,8,0,2,3,1,5,7,9,10,11,12,13,14][i]]?.src||p.image,...(i===11?[storyPhotos[25].src]:i===12?[storyPhotos[21].src]:[])]]));
const commentLines=[
 ['연습 끝나고 바로 찍었나 봐요. 수고했어요!','저 바닥만 봐도 연습실 생각나요.','운동화 오래 신은 티 난다ㅎㅎ','요즘은 잘 쉬고 있는지 궁금해요.','사진 보러 또 왔어요.'],
 ['녹음실 조명 포근하다.','무슨 노래였을까, 기다리는 재미가 있어요.','헤드폰 살짝 걸쳐 둔 거 귀엽네요.','멤버들 다 건강하게 지냈으면.','다섯 목소리 같이 듣고 싶은 밤.'],
 ['커피 마실 때는 잠깐이라도 여유 있기를.','창가 자리 저도 좋아해요.','케이크 한 입만 주세요ㅋㅋ','지금은 안부라도 듣고 싶어요.','설명 없이 기다리는 시간이 길긴 하네요.'],
 ['대기실은 항상 바쁘겠죠.','오늘 무대도 잘 봤어요!','옷걸이에 옷 가지런한 거 좋다.','준비하는 시간까지 응원할게요.','다음 소식도 기다릴게요.'],
 ['차창에 번진 불빛이 예쁘네요.','이런 사진은 흔들려도 좋아요.','수고한 하루였겠다.','아무 소식 없으니까 자꾸 예전 사진만 보게 돼요.','답답한 마음도 있지만 무사했으면.'],
 ['꽃 색 정말 잘 어울려요.','작은 카드까지 챙겨 둬서 고마워요.','꽃향기 날 것 같은 사진.','보내는 마음이 닿았으면 좋겠어요.','오늘도 밥 챙겨 먹어요.'],
 ['운동화만 봐도 다 같이 있는 기분.','연습하느라 밑창 닳았겠다.','각자 신발 취향 다른 거 재밌어요.','멤버들 오늘도 고생 많았어요.','말없이 기다리는 것도 쉽지는 않네요.'],
 ['리허설 때 빈 객석 보면 어떤 기분일까.','조명 켜진 무대 정말 좋아요.','다음에는 객석에서 응원할게요.','일정 잘 마치고 돌아와요.','오늘 하루도 모두 무탈하기를.'],
 ['밥상 사진 보니 저도 배고파요.','같이 먹는 밥이 제일 맛있죠.','반찬도 골고루 먹기!','그때는 이런 사진만 봐도 웃었는데.','지금도 밥은 잘 먹고 있기를 바라요.'],
 ['조명 낮추니까 방이 포근해 보여요.','충전기 선 정리하다 잠드는 거 아닌지ㅎㅎ','오늘도 잘 자요.','불 꺼진 뒤에도 편안했으면.','안부를 기다리는 사람들 잊지는 않았으면 해요.'],
 ['잠깐 하늘 보고 숨 돌렸어요.','구름 모양이 폭신하다.','이 사진 저장해 두고 종종 봐요.','좋아하던 풍경은 그대로인데 마음은 복잡하네요.','어디서든 하늘 볼 여유는 있기를.'],
 ['이동할 때 듣는 노래도 궁금해요.','이어폰 케이스 꼭 챙기기!','차 안에서는 조금이라도 쉬어요.','연락이 없어도 기다리게 되네요.','사실로 확인된 이야기만 믿으려고 해요.'],
 ['마음 담아서 보낸 편지, 잘 닿았네요.','천천히 읽어도 괜찮아요.','리본 색 조합 포근하다.','답을 바라며 쓴 건 아니지만 소식은 궁금해요.','고맙다는 이 말 오래 기억할게요.'],
 ['늦게까지 고생했어요. 얼른 쉬어요.','불 하나 남은 연습실은 좀 쓸쓸하네요.','연습 끝나고 따뜻한 것 먹었길.','이때부터 많이 피곤했던 걸까, 단정하지는 않을게요.','돌아오라는 말보다 잘 지내냐고 묻고 싶어요.'],
 ['커튼 틈 빛이 차분하네요.','말이 없는 사진이라 오래 보게 돼요.','아직 여기서 기다리는 사람도 있어요.','기다리는 팬들에게 설명은 필요하다고 생각해요.','오늘은 조금 편안했으면 좋겠어요.']
];
export const instagramCommentExtras=Object.fromEntries([...instagramPosts,...addedInstagramPosts].map((p,i)=>[p.id,(commentLines[i]||[]).map((text,j)=>({id:'story-ig-comment-'+i+'-'+j,userId:instagramFans[j].id,text,timestamp:Date.parse(p.timestamp)>Date.parse((j<3?'2028-06-24':'2028-07-02')+'T12:00:00+09:00')?new Date(Date.parse(p.timestamp)+(j+1)*60000).toISOString():(j<3?'2028-06-24':'2028-07-02')+'T'+(j<3?'12':'20')+':'+String(i+10).padStart(2,'0')+':00+09:00'}))]));
export function igPerson(id){const original=[...instagramUsers,...instagramFans].find(u=>u.id===id)||{id,name:'알 수 없는 계정',handle:'unknown',followers:0};return {...original,...profileExtras[id]};}
export function igMedia(post){const original=Array.isArray(post?.images)?post.images.filter(x=>typeof x==='string'&&x):[];if(original.length)return original;if(post?.image&&!post.image.includes('photo-placeholder')&&!post.id.startsWith('story-ig-'))return [post.image];return instagramMedia[post?.id]||[];}
export function igComments(post){return [...(Array.isArray(post?.comments)?post.comments:[]),...(instagramCommentExtras[post?.id]||[])];}



