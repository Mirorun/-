// Added photographs only. Original photos/data.js is immutable.
const scenes=[
 '연습실 거울 앞','녹음실 마이크','창가의 커피','공연 대기실','차창 너머 서울 야경',
 '대기실의 꽃다발','나란히 놓인 운동화','빈 공연장 리허설','함께 먹은 저녁','침대 옆 작은 조명',
 '옥상 위 하늘','이동 중 창밖','편지와 선물','늦은 밤 연습실','커튼 사이의 빛',
 '냉장고 속 음료','편의점 도시락','연습실 출입문','의자에 놓인 연습복','이어폰과 휴대폰',
 '공연장 복도','사인용 펜','책상 위 스케줄 메모','비 오는 창문','늦은 밤 편의점',
 '택시 뒷좌석','연습 후 식사','손에 든 커피','침대 위 작은 인형','백스테이지 케이블'
];
const dates=['2028-05-07','2028-05-10','2028-05-14','2028-05-18','2028-05-22','2028-05-25','2028-05-28','2028-06-01','2028-06-03','2028-06-07','2028-06-10','2028-06-13','2028-06-16','2028-06-20','2028-06-23'];
export const storyPhotos=scenes.map((description,i)=>{
 const n=String(i+1).padStart(2,'0');return {id:'story-photo-'+n,src:'assets/story-photos/photo-'+n+'.webp',thumbnailSrc:'assets/story-photos/thumb-'+n+'.webp',date:dates[i%15],description,alt:description};
});
