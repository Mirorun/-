
/*
 * PROJECT YANGYANG — X 게시글 데이터
 *
 * 수정 방법
 * 1. 계정 정보: storyXUsers
 * 2. 게시글 내용: storyXPosts의 text
 * 3. 게시글 날짜: timestamp
 * 4. 좋아요/리포스트/조회수: likes, reposts, views
 * 5. 댓글: replyText
 * 6. 이미지: image
 *
 * 새 게시글은 storyXPosts 배열 맨 아래에 추가하세요.
 * 기존 게시글 ID는 변경하지 않는 것이 좋습니다.
 *
 * 기존 social-data.js의 데이터는 건드리지 않습니다.
 */

// ============================================================
// 1. X 계정 정보
// ============================================================

export const storyXUsers = [
  {
    id: 'issue-now',
    name: '아이돌이슈',
    handle: 'idol_issue_now',
    bio: '문제시 삭제',
    followers: 1243
  },
  {
    id: 'culture-log',
    name: '일기장',
    handle: 'diaryFU',
    bio: '시비털거면 공계로 뜨러오셈 ㅄ들아',
    followers: 42
  },
  {
    id: 'daily-stage',
    name: '핫파',
    handle: 'HoTotPAPa_',
    bio: '',
    followers: 3004
  },
  {
    id: 'paper-day',
    name: '퓨랑이~',
    handle: 'p_u_a_411',
    bio: '연우 귀여운 거 축하해',
    followers: 867
  },
  {
    id: 'after-seat',
    name: '상면식',
    handle: 'after_seat',
    bio: '공연 좋아합니다.',
    followers: 243
  },
  {
    id: 'grey-hour',
    name: 'Yusuqme',
    handle: 'grey_hour',
    bio: 'always',
    followers: 117
  },
  {
    id: 'blue-ticket',
    name: '블루본',
    handle: 'blue_ticket',
    bio: '너희가 있어 한 층 더 밝아진 밤이야~',
    followers: 890
  },
  {
    id: 'slow-night',
    name: '늦밤',
    handle: 'slow_night_7',
    bio: '',
    followers: 438
  },
  {
    id: 'moon-page',
    name: '달페',
    handle: 'moon_page',
    bio: '퓨어의 다섯 목소리를 기억해',
    followers: 2130
  },
  {
    id: 'plain-water',
    name: '은잔',
    handle: 'plain_water',
    bio: '',
    followers: 1704
  },
  {
    id: 'summer-note',
    name: '여름아',
    handle: 'summer_note',
    bio: 'ㅇㅅㅇ',
    followers: 592
  },
  {
    id: 'small-light',
    name: '은교',
    handle: 'small_light',
    bio: '고삼이',
    followers: 328
  },
  {
    id: 'full-stage',
    name: '쑨장',
    handle: 'ddat1tg124',
    bio: '엥제가해요?',
    followers: 5240
  },
  {
    id: 'late-bus',
    name: '.',
    handle: 'kkkk145_414',
    bio: '',
    followers: 73
  }
].map((user, i) => ({
  ...user,
  following: 83 + i * 17,
  avatar: `assets/x-avatars/${user.id}.svg`,
  bannerColor: [
    '#dce8ee',
    '#eee3df',
    '#e1e8dc',
    '#e7e1ef'
  ][i % 4]
}));


// ============================================================
// 2. 게시글 데이터
//
// id        : 게시글 고유 ID (중복 금지)
// userId    : 위 storyXUsers의 id
// timestamp : 작성 시각
// text      : 게시글 본문
// stance    : 게시글 분류
// tags      : 관련 태그
// likes     : 좋아요 수
// reposts   : 리포스트 수
// views     : 조회수
// replyText : 기존 자동 생성 댓글 내용
//
// 선택 항목:
// quoteId   : 인용하는 게시글의 ID
// image     : 첨부 이미지 경로
// alt       : 이미지 설명
// ============================================================

const postData = [

  // -------------------- 01 --------------------
  {
    id: 'story-x-01',
    userId: 'issue-now',
    timestamp: '2028-06-18T12:10:00+09:00',
    text: `현재 거의 확정이라는 양이 탈퇴 썰 ㄷㄷ
    
    애초에 저번부터 표정 안 좋다고 말 나오더니,
    팬싸인회에서도 눈 안 마주쳤다고 함 ㅋㅋ
    
    몇 달간 잠적하더니 결국 잠수엔딩이네
    엑친들은 어떻게 생각하시나요 ㅋㅋ`,
    stance: 'critical',
    tags: ['양이', '무대영상'],
    likes: 26436,
    reposts: 6506,
    views: 9524392,
    replyText: '파딱 병신새끼야 지랄하지말고 글쳐내려',
    image: 'assets/news/news-02.svg',
    alt: '무대 조명과 영상 프레임을 표현한 자료 그래픽'
  },

  // -------------------- 02 --------------------
  {
    id: 'story-x-02',
    userId: 'daily-stage',
    timestamp: '2027-08-24T15:20:00+09:00',
    text: '애초에 컨디션 관리도 실력인데 억지로 한처먹는거 역겹다 ㅋㅋ 무대까지는 양보한다쳐도 팬싸에서 관리 못한건 개병크지 뭔 쉴드질임 팬들도 병신같음',
    stance: 'critical',
    tags: ['양이', '양이사과해'],
    likes: 16994,
    reposts: 3456,
    views: 352000,
    replyText: '애초에 팬싸 개날존데 언제까지 우려먹을거임?'
  },

  // -------------------- 03 --------------------
  {
    id: 'story-x-03',
    userId: 'culture-log',
    timestamp: '2028-06-24T18:00:00+09:00',
    text: '애초에 지가 탈퇴의사 밝힌건맞고? 민폐도 적당히부려야 넘어가주지 다른멤버들은 먼죄임 논란을떠나서ㅋㅋ',
    stance: 'speculation',
    tags: '',
    likes: 1608,
    reposts: 729,
    views: 62300,
    replyText: ''
  },

  // -------------------- 04 --------------------
  {
    id: 'story-x-04',
    userId: 'culture-log',
    timestamp: '2028-06-18T13:40:00+09:00',
    text: '애초에 잘생겼다고 빨아줄때부터 엥...? 했음 혼자 나이도 개 많은데',
    stance: 'critical',
    tags: '',
    likes: 864,
    reposts: 217,
    views: 29800,
    replyText: '일기장은 비계 쳐걸고 쓰라고 씨벌아~~',
    quoteId: 'story-x-01'
  },

  // -------------------- 05 --------------------
  {
    id: 'story-x-05',
    userId: 'daily-stage',
    timestamp: '2028-06-28T18:10:00+09:00',
    text: '광고도 줄취소 당하는거보면 단순히 하나만 한 게 아닌 거 빡인데 팬들 쉴드치는거애잔하노',
    stance: 'speculation',
    tags: '',
    likes: 702,
    reposts: 268,
    views: 27400,
    replyText: ''
  },

  // -------------------- 06 --------------------
  {
    id: 'story-x-06',
    userId: 'paper-day',
    timestamp: '2028-06-24T20:15:00+09:00',
    text: '하 걍 슬슬 우리도 존나 지쳐요 쉬는 거랑 팬들한테까지 입꾹닫하는 건 다른 문제임 고소공지라도 올리든지 씨발',
    stance: 'critical',
    tags: '',
    likes: 41,
    reposts: 2,
    views: 830,
    replyText: '애초에 해명없이 잠수탄다는 게 껀덕지가 있다는걸 인지를해 니들도 눈막귀막하면서'
  },

  // -------------------- 07 --------------------
  {
    id: 'story-x-07',
    userId: 'after-seat',
    timestamp: '2028-06-23T09:40:00+09:00',
    text: '열심히 한 척 서사팔이 부터가 별로. 결국은 진짜 바닥부터 뜬 리모럴만이 진짜 서사임.',
    stance: 'critical',
    tags: '',
    likes: 133,
    reposts: 19,
    views: 3610,
    replyText: '개저씨는 좀 빠져'
  },

  // -------------------- 08 --------------------
  {
    id: 'story-x-08',
    userId: 'grey-hour',
    timestamp: '2028-06-25T22:10:00+09:00',
    text: '왜 그들이 yang-yi를 비난하려 드는지 모르겠어. 그가 잘못한 건 없어.',
    stance: 'speculation',
    tags: ['양이', '활동공백'],
    likes: 58,
    reposts: 7,
    views: 1720,
    replyText: '',
    quoteId: 'story-x-03'
  },

  // -------------------- 09 --------------------
  {
    id: 'story-x-09',
    userId: 'grey-hour',
    timestamp: '2028-06-29T11:35:00+09:00',
    text: '사람들은 그가 뭘 했는지 거의 20% 조차 모르면서 비난하네. 그 다음에 yang-yi가 없어지게 되면 자위할테지. LOL',
    stance: 'speculation',
    tags: '',
    likes: 79,
    reposts: 12,
    views: 2240,
    replyText: '그가 민폐를 끼쳤다는 건 맞아요. bro.'
  },

  // -------------------- 10 --------------------
  {
    id: 'story-x-10',
    userId: 'blue-ticket',
    timestamp: '2028-06-24T19:30:00+09:00',
    text: '씨발 공식입장도 없이 언제까지 내 돌 욕먹는 걸 봐야하냐고요 26연말이후로 점점 과열되나 싶더니 억까판 열린 것도 좆같음 ',
    stance: 'critical',
    tags: '',
    likes: 2186,
    reposts: 387,
    views: 23490,
    replyText: '공식 입장 없는 이유가 뭔지를 생각해보던가 ㅋㅋ'
  },

  // -------------------- 11 --------------------
  {
    id: 'story-x-11',
    userId: 'after-seat',
    timestamp: '2028-06-25T12:20:00+09:00',
    text: '무대 즐기는 사람으로써. 점점 대충하는 게 보이긴 했음. 짧은 영상이라고 비판 하지 말라고 해야되는 건 억지같음.',
    stance: 'critical',
    tags: ['무대영상'],
    likes: 187,
    reposts: 24,
    views: 5210,
    replyText: ''
  },

  // -------------------- 12 --------------------
  {
    id: 'story-x-12',
    userId: 'paper-day',
    timestamp: '2028-06-29T18:45:00+09:00',
    text: '광고얘기도 기사를 읽어보면 걍 제목만 충격적이게 써놓고 본문은 뭐 있지도 않으면서 언제까지 플로우태움 ㅈㄴ역겹다',
    stance: 'critical',
    tags: '',
    likes: 63,
    reposts: 9,
    views: 1460,
    replyText: 'ㄹㅇ ㅆㅂ ㅋㅋ 애초에 미확인 표시 지우고 올리는 앰뒤련들은 뭐임?'
  },

  // -------------------- 13 --------------------
  {
    id: 'story-x-13',
    userId: 'blue-ticket',
    timestamp: '2028-06-26T10:05:00+09:00',
    text: '풀영상을 좀 봐 1-2초 안 좋았고 표정 바로 돌아왔는데 니는 길가다 어디 아파도 표정 찡그리지 마라',
    stance: 'critical',
    tags: '',
    likes: 301,
    reposts: 62,
    views: 8970,
    replyText: '그래서 쟤가 뭐 어디 찔리기라도 함?',
    quoteId: 'story-x-02',
    image: 'assets/news/news-03.svg',
    alt: '팬 소통 공간을 표현한 자료 그래픽'
  },

  // -------------------- 14 --------------------
  {
    id: 'story-x-14',
    userId: 'grey-hour',
    timestamp: '2028-06-26T21:10:00+09:00',
    text: '양이 없이 네 명으로 계속 되는거야? 소속사는 답답하게 굴기만 하고 불쾌해요.',
    stance: 'speculation',
    tags: '',
    likes: 106,
    reposts: 13,
    views: 3070,
    replyText: ''
  },

  // -------------------- 15 --------------------
  {
    id: 'story-x-15',
    userId: 'after-seat',
    timestamp: '2028-06-27T13:25:00+09:00',
    text: '기다리는 사람한테도 왜 기다려야 하는지 설명이 필요한 거 아닌가.',
    stance: 'critical',
    tags: ['양이'],
    likes: 152,
    reposts: 22,
    views: 4320,
    replyText: '아저씨 글 그만 싸고 일이나 하러가세요'
  },

  // -------------------- 16 --------------------
  {
    id: 'story-x-16',
    userId: 'paper-day',
    timestamp: '2028-06-27T23:05:00+09:00',
    text: '푸링이들아 우리가 더 아껴주자... 이럴 때일수록 우리가 더 정화해야돼',
    stance: 'critical',
    tags: ['양이_괜찮아', '양이_기다릴게', '소속사는_제대로된_해명을_가져와'],
    likes: 87,
    reposts: 6,
    views: 1860,
    replyText: ''
  },

  // -------------------- 17 --------------------
  {
    id: 'story-x-17',
    userId: 'summer-note',
    timestamp: '2028-07-03T08:20:00+09:00',
    text: '실망했다는 말을 이제는 해도 되지 않을까... 솔직히 너무 오래 기다리게 하긴 함',
    stance: 'critical',
    tags: '',
    likes: 276,
    reposts: 31,
    views: 7830,
    replyText: '뭔 말인지 알 긴해서 더 착잡하네 하...'
  },

  // -------------------- 18 --------------------
  {
    id: 'story-x-18',
    userId: 'culture-log',
    timestamp: '2028-07-03T08:50:00+09:00',
    text: '좆돌 특이지 지가 잘못해놓고 잠수타서 돌아오거나 뒤져서 튀거나 ㅋㅋ 아직까지 안 오는거면 견적 딱보임',
    stance: 'critical',
    tags: '',
    likes: 1132,
    reposts: 407,
    views: 45900,
    replyText: '대체 여기서 양이가 잘못했다고 확정난 게 뭐가있냐고 선 존나 넘네'
  },

  // -------------------- 19 --------------------
  {
    id: 'story-x-19',
    userId: 'blue-ticket',
    timestamp: '2028-07-03T09:05:00+09:00',
    text: '뒤져서 튄다는 플로우는 뭐임 이래놓고 나중에 진짜 부정적 기사 올라오면 계삭튀 할 새끼들 뻔히보인다',
    stance: 'critical',
    tags: ['양이', '기다림'],
    likes: 412,
    reposts: 81,
    views: 12400,
    replyText: '팩트임'
  },

  // -------------------- 20 --------------------
  {
    id: 'story-x-20',
    userId: 'grey-hour',
    timestamp: '2028-06-30T09:50:00+09:00',
    text: '그가 멀쩡하길 원해, 그러나 공백이 이대로 계속되면 어떻게 되는 건지 상상하게 되는 건 어쩔 수 없게 돼.',
    stance: 'speculation',
    tags: '',
    likes: 91,
    reposts: 8,
    views: 2730,
    replyText: ''
  },

  // -------------------- 21 --------------------
  {
    id: 'story-x-21',
    userId: 'after-seat',
    timestamp: '2028-07-01T15:15:00+09:00',
    text: '뭐가 됐든 무대를 제대로 못 한건 비판 대상이 맞다.',
    stance: 'critical',
    tags: ['양이', '퓨어'],
    likes: 244,
    reposts: 47,
    views: 7040,
    replyText: ''
  },

  // -------------------- 22 --------------------
  {
    id: 'story-x-22',
    userId: 'daily-stage',
    timestamp: '2028-07-03T09:22:00+09:00',
    text: '퓨어 전부터도 딱히 호감은 아니었음 ㅋㅋ 애초에 칠디? 걔네 다 아이돌 쪽으로는 아무도 안 왔는데 혼자 나대서 이지랄난거지 뭐 재능도 열정도 없는 애가',
    stance: 'critical',
    tags: '',
    likes: 1417,
    reposts: 492,
    views: 51800,
    replyText: '칠디를 여기서 왜 끌고옴 현직 가수랑 배우도 있고 나머지는 이제 일반인이에요'
  },

  // -------------------- 23 --------------------
  {
    id: 'story-x-23',
    userId: 'full-stage',
    timestamp: '2028-07-02T22:10:00+09:00',
    text: '전체를 봐야지 팬싸고 무대고 3초 클립 잘라와서 종일 패는 건 뭐 신빙성도 없고',
    stance: 'rebuttal',
    tags: '',
    likes: 932,
    reposts: 384,
    views: 23100,
    replyText: '',
    quoteId: 'story-x-01'
  },

  // -------------------- 24 --------------------
  {
    id: 'story-x-24',
    userId: 'plain-water',
    timestamp: '2028-07-02T23:40:00+09:00',
    text: '소속사는 빨리 고소 공지 올리고 기레기들이랑 도넘는새끼들 좀 쳐내길 바람~~~~ㅋㅋㅋㅋ;;',
    stance: 'rebuttal',
    tags: '',
    likes: 610,
    reposts: 271,
    views: 18200,
    replyText: ''
  },

  // -------------------- 25 --------------------
  {
    id: 'story-x-25',
    userId: 'small-light',
    timestamp: '2028-07-03T00:20:00+09:00',
    text: '차라리 칠디 때가 나았던 듯 막상 데뷔하고 보니까 힘들어서 초심 잃은 게 다 티남',
    stance: 'concern',
    tags: '',
    likes: 143,
    reposts: 11,
    views: 3070,
    replyText: '칠디는 그만 좀 끌고 와라'
  },

  // -------------------- 26 --------------------
  {
    id: 'story-x-26',
    userId: 'summer-note',
    timestamp: '2028-07-03T07:10:00+09:00',
    text: '한 마디만 써줘 힘들다 우리도...',
    stance: 'fan-fatigue',
    tags: '',
    likes: 359,
    reposts: 66,
    views: 9730,
    replyText: ''
  },

  // -------------------- 27 --------------------
  {
    id: 'story-x-27',
    userId: 'moon-page',
    timestamp: '2028-07-03T07:35:00+09:00',
    text: '수현이 오늘도 밥 잘 챙겨 먹어 ㅠㅠ 유연다도 무리하지말고 양이는 부디 무사하길',
    stance: 'member-support',
    tags: '',
    likes: 572,
    reposts: 93,
    views: 14680,
    replyText: '애들도 마음 힘들겠다...'
  },

  // -------------------- 28 --------------------
  {
    id: 'story-x-28',
    userId: 'late-bus',
    timestamp: '2028-07-03T08:05:00+09:00',
    text: '근데 궁금한 게 이은수는 왜 6월부터 활중함? 양양이도 이때쯤부터 탈퇴썰 올라오던데 뭐 있던 거 아니겠지?',
    stance: 'concern',
    tags: '',
    likes: 65367,
    reposts: 5623,
    views: 1294567,
    replyText: '씨발 소름 생각해보니까 윤콩이도 사고났다 그러지 않음? ㄹㅇ 칠디끼리 뭐 있었나?'
  },

  // -------------------- 29 --------------------
  {
    id: 'story-x-29',
    userId: 'plain-water',
    timestamp: '2028-07-03T08:40:00+09:00',
    text: '이딴 억측 올리면 재밌으세요?',
    stance: 'rebuttal',
    tags: '',
    likes: 1084,
    reposts: 516,
    views: 32800,
    replyText: '근데 존나 꼬롬하긴해',
    quoteId: 'story-x-28'
  },

  // -------------------- 30 --------------------
  {
    id: 'story-x-30',
    userId: 'slow-night',
    timestamp: '2028-07-03T09:10:00+09:00',
    text: '칠디 썰도 존나 소름이긴하다 짜라시라기엔 아다리 너무 잘 맞는데',
    stance: 'concern',
    tags: '',
    likes: 206,
    reposts: 18,
    views: 4810,
    replyText: '양이는 별개 문제고 걍 은수가 윤한이랑 얼마나 친했는데 윤한이 사고 때문에 잠깐 쉬나보지 지랄 좀 그만'
  }

  // ==========================================================
  // 새 게시글은 여기 아래에 추가하세요.
  //
  // 기존 마지막 게시글 뒤에 쉼표(,)를 추가한 후 작성합니다.
  //
  // 예시:
  //
  // {
  //   id: 'story-x-31',
  //   userId: 'blue-ticket',
  //   timestamp: '2028-07-03T09:30:00+09:00',
  //   text: '새로 작성할 게시글 내용',
  //   stance: 'concern',
  //   tags: ['양이', '퓨어'],
  //   likes: 12,
  //   reposts: 3,
  //   views: 450,
  //   replyText: '새 게시글의 첫 번째 댓글'
  // }
  // ==========================================================
];


// ============================================================
// 3. 댓글 자동 생성
//
// 기존 30개 게시글의 댓글 작성자, ID, 작성 시간,
// 좋아요 계산 방식을 그대로 유지합니다.
//
// replyText만 수정하면 댓글 내용이 변경됩니다.
// ============================================================

const replyAuthors = [
  'plain-water',
  'summer-note',
  'full-stage',
  'slow-night'
];

export const storyXPosts = postData.map((post) => {
  const postNumber = Number(post.id.slice(-2));

  const replyTimestamp = Number.isFinite(
    Date.parse(post.timestamp)
  )
    ? new Date(
        Date.parse(post.timestamp) + 8 * 60000
      ).toISOString()
    : null;

  return {
    ...post,

    // 기존 이미지 설명의 기본값 유지
    alt: post.alt ?? '팬 소통 공간을 표현한 자료 그래픽',

    replyCount: 1,

    replies: [
      {
        id: `${post.id}-reply-1`,
        userId: replyAuthors[postNumber % 4],
        text: post.replyText,
        timestamp: replyTimestamp,
        likes: 9 + (postNumber * 13) % 101
      }
    ]
  };
});


// ============================================================
// 4. X 실시간 트렌드
// ============================================================

export const storyXTrends = [
  {
    tag: '양이',
    description: '활동 공백과 이어지는 질문',
    query: '양이'
  },
  {
    tag: '퓨어',
    description: '다섯 멤버의 활동과 팬들의 이야기',
    query: '퓨어'
  },
  {
    tag: '확인부터',
    description: '확인된 사실과 추측의 경계',
    query: '#확인부터'
  },
  {
    tag: '무대영상',
    description: '짧은 클립과 전체 무대',
    query: '#무대영상'
  },
  {
    tag: '기다리는마음',
    description: '남겨 두는 안부',
    query: '#기다리는마음'
  }
];
