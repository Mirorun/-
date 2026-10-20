# PHASE 6 · 7 · 9 유지 관리

사이트: https://mirorun.github.io/-/  
저장소: https://github.com/Mirorun/-

## 원본 보존

로컬과 원격의 시작 커밋은 `e3474995d918a0d0fe252c8d9f3b5aae334d93c6`으로 같았습니다. 수정 전 실행 파일은 `_phase679/before-runtime.zip`, 해시 기준은 `_phase679/baseline.json`입니다. 원본 메시지·카카오톡·SNS·Weverse·사진·연락처·통화·메모·캘린더·음악 데이터 파일은 수정하지 않았습니다.

원본 Instagram 9개 게시물의 ID·작성자·문구·날짜·좋아요·기존 댓글을 그대로 유지하며, 비어 있던 이미지와 추가 댓글은 별도 보충 모듈에서 연결합니다. 이미 존재하는 실제 이미지나 `images` 배열이 있다면 우선합니다. 원문 속 기존 호칭/샘플 문구와 날짜 미정 항목은 임의로 고치지 않았습니다. 프로필의 표시 이름만 양이로 보정합니다. 기존 핸들 `artist_sample_0`도 보존합니다. 팔로잉 수가 없으므로 임의 숫자 대신 `—`를 표시합니다.

## 콘텐츠 수량

- Instagram: 기존 9 + 신규 6 = 15개. 게시물마다 서로 겹치지 않는 실제 이미지, 총 5~6개 댓글. 기존 댓글은 보존하고 새 댓글에는 작성자·시각이 있습니다. 기존 댓글의 미정 시각은 그대로 표시합니다.
- Instagram 이미지 17장을 15개 게시물에 연결하며, 이동/팬레터 게시물은 2장 캐러셀입니다. 확대·프로필·3열 그리드·좋아요·저장·댓글·DM 읽기 전용을 지원합니다.
- 사진: 생성한 서로 다른 사진 30장. 원본의 미등록 슬롯 4개도 삭제하지 않아 앱 전체 항목은 34개입니다. 실제 사진 수량에 미등록 슬롯은 포함하지 않았습니다.
- Weverse 팬 글: 기존 3 + 신규 22 = 25개.
- 수현·유진·연우·다온: 기존 각 1 + 신규 각 4 = 각 5개, 총 20개. 양이의 기존 글 1개를 합치면 아티스트 글은 21개입니다. 양이의 새 글은 추가하지 않았습니다.
- Weverse 기존 글·댓글·공지를 그대로 보존하고 새 공지/댓글을 별도로 추가했습니다. PURE 홈, 아티스트/팬/공지 탭, 프로필, 상세, 댓글, 좋아요 및 새 글 표시를 지원합니다.

## 수정할 데이터 파일

### 사진

`js/photos/story-photos.js`에 추가 사진 목록이 있습니다. 파일은 `assets/story-photos/photo-01.webp`~`photo-30.webp`, 썸네일은 `thumb-01.webp`~`thumb-30.webp`입니다. 새로운 항목은 다음 형태로 `storyPhotos` 배열에 추가할 수 있습니다.

```js
storyPhotos.push({
  id:'my-photo-01', src:'assets/my-photo.webp', thumbnailSrc:'assets/my-thumb.webp',
  date:'2028-06-15', description:'사진 설명', alt:'사진의 시각적 설명'
});
```

원본 `js/photos/data.js`의 기존 항목은 수정하지 않습니다. 새 경로의 실제 파일을 함께 추가해야 합니다. 사진 전체 보기의 좌우 스와이프/버튼과 키보드 화살표가 사진을 넘깁니다. 확대 버튼은 2배 보기로 전환하며 확대 상태에서는 사진 이동 제스처를 멈춥니다. 뒤로 버튼은 확대를 먼저 해제합니다. 기본 브라우저 핀치 확대도 허용합니다.

### Instagram

`js/web/instagram-extension.js`의 `addedInstagramPosts`, `instagramMedia`, `instagramCommentExtras` 및 `profileExtras`를 편집합니다. 기존 `js/web/social-data.js`는 보호 원본입니다. 새 게시물은 `addedInstagramPosts.push(...)`로 다음 형태의 독립 레코드를 추가하면 됩니다.

```js
addedInstagramPosts.push({
  id:'my-ig-01', userId:'yangyang', text:'새 캡션',
  image:'assets/my-photo.webp', images:['assets/my-photo.webp','assets/my-other-photo.webp'],
  alt:'사진 설명', timestamp:'2028-06-15T18:00:00+09:00', likes:100,
  comments:[{id:'my-comment-01',userId:'daily',text:'댓글',timestamp:'2028-06-16T10:00:00+09:00'}]
});
```

댓글은 게시물 시각 이후, 작품 시작 시각 이전으로 지정합니다. 새 게시물 ID/댓글 ID는 다른 항목과 겹치면 안 됩니다. `images` 배열이 있으면 캐러셀로 표시합니다. 동일 이미지를 여러 Instagram 게시물에 재사용하지 않습니다. `image` 단일 경로도 지원합니다. 완성된 게시물은 댓글 5~12개를 등록합니다. 원본의 이미지/댓글이 없던 부분에 대한 현재 보충 데이터는 ID 기준으로 연결됩니다.

### Weverse

`js/weverse/extension-data.js`의 `extraFans`, `extraFanPosts`, `extraArtistPosts`, `extraComments`, `extraNotices`를 편집합니다. 기존 `js/weverse/data.js`의 모든 레코드는 보존합니다. 게시물 형식은 `{id,authorId,type:'artist' 또는 'fan',text,date,image,likes}`이며 댓글은 `{id,postId,authorId,text,date,likes}`입니다. 멤버 ID는 `yangyang`, `member`(수현), `yujin`, `yeonwoo`, `daon`을 유지합니다.

## 이미지 제작

내장 image_gen으로 장면별 독립 사진 30개를 생성했습니다. 콜라주 분할이나 같은 사진 변형으로 수량을 채우지 않았습니다. 얼굴 레퍼런스가 없으므로 얼굴이 식별되지 않는 공간/물건/손 중심이며 첫 거울 사진도 휴대폰으로 얼굴을 가렸습니다. Pillow는 생성 후 리사이즈·WebP 압축·검수용 연락판 작성에만 사용했습니다. 원본 생성물은 기존 파일을 덮어쓰지 않고 별도 경로에 남겼습니다.

본 이미지 최대 1200px, 썸네일 최대 360px이며 총 60개 WebP 파일의 합계는 약 3.66MB입니다. 최종 생성 프롬프트 및 장면 목록은 `_phase679/image-prompts.json`, 생성 파일 경로 대응표는 `image-paths.json`, 치수/용량 결과는 `image-report.json`, 전체 시각 검수는 `contact-sheet.jpg`에 있습니다.

## 모바일 제스처

`js/gestures.js`가 기존 `back()`/`goHome()`만 호출합니다. 새 라우터나 브라우저 history 항목을 만들지 않습니다.

- 왼쪽 26px 내에서 시작해 수평 우세 1.6배, 약 64~90px 이상 이동하면 내부 뒤로 가기.
- 기존 홈 인디케이터 제스처 유지. 인디케이터 밖의 화면 하단 48px에서 위로 70px 이상 이동해도 홈 이동.
- 8px 이동 후 방향이 확실할 때만 진행 중인 Touch Event를 취소합니다. touchstart는 passive이며 취소하지 않습니다. 일반 세로 스크롤과 다중 터치는 그대로 둡니다.
- 입력창/버튼/링크, 사진 표면, Instagram 캐러셀, 모달, 전체 통화 화면은 우선권을 가집니다. 입력창에 포커스가 있을 때 내부 뒤로 가기를 억제합니다.
- 마우스 드래그도 지원하며, 빠른 중복 처리·클릭 재실행을 막고 기존 transform 애니메이션과 reduced-motion 설정을 재사용합니다.
- iOS Safari의 시스템 뒤로 가기는 브라우저가 선점할 수 있습니다. 취소 불가능한 이벤트에서는 내부 이동을 추가 실행하지 않습니다. 뒤로/홈 버튼은 계속 사용할 수 있습니다. 실제 iPhone의 OS 제스처를 완전히 통제한다고 가정하지 않습니다.

## 변경 파일

기존 UI 5개: `index.html`, `js/main.js`, `js/library-apps.js`, `js/web/view.js`, `js/weverse/view.js`.

추가: `js/gestures.js`, `js/photos/story-photos.js`, `js/web/instagram-extension.js`, `js/web/instagram-view.js`, `js/weverse/extension-data.js`, `css/phase679.css`, `assets/story-photos/*.webp`, 본 문서.

새로고침하면 좋아요/저장/사진 위치/확대/현재 앱 등 사용자 상태가 초기화됩니다. 예약 메시지와 통화/음악 기능은 기존 구조를 유지합니다. `_phase679` 백업·인증·검수 파일은 Git 및 웹 배포에서 제외합니다.

## 검증 범위

Chrome의 PC 1280×950 및 모바일 크기 390×844에서 콘텐츠·상세·이미지·날짜·보존·엣지/홈·캐러셀/갤러리·입력 포커스·모달 우선권·스크롤·알림/초기화를 검사합니다. 모바일 스와이프는 Chrome DevTools의 실제 터치 입력 전달 방식으로 실행합니다. 실제 iPhone Safari의 시스템 제스처/가상 키보드/핀치 감각은 실기기 추가 확인이 필요합니다. 이전부터 날짜가 미정인 원본 항목은 그대로 남겨 두었습니다.
