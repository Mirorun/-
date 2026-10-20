
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
    followers: 68000
  },
  {
    id: 'culture-log',
    name: '일기장',
    handle: 'popculture_log',
    bio: '시비털거면 공계로 뜨러오셈 ㅄ들아',
    followers: 41500
  },
  {
    id: 'daily-stage',
    name: '데일리 스테이지',
    handle: 'daily_stage_news',
    bio: '무대 위와 아래의 이야기.',
    followers: 52900
  },
  {
    id: 'paper-day',
    name: '종이요일',
    handle: 'paper_day',
    bio: '보고 듣고 남기는 짧은 생각.',
    followers: 86
  },
  {
    id: 'after-seat',
    name: '뒷자리',
    handle: 'after_seat',
    bio: '공연 좋아합니다. 생각은 자주 달라집니다.',
    followers: 243
  },
  {
    id: 'grey-hour',
    name: '회색시각',
    handle: 'grey_hour',
    bio: '결론보다 궁금한 게 많아요.',
    followers: 117
  },
  {
    id: 'blue-ticket',
    name: '파란티켓',
    handle: 'blue_ticket',
    bio: '좋아했던 무대를 잊고 싶지 않아서.',
    followers: 890
  },
  {
    id: 'slow-night',
    name: '느린밤',
    handle: 'slow_night_7',
    bio: '소식이 늦어도 확인은 먼저.',
    followers: 438
  },
  {
    id: 'moon-page',
    name: '달의페이지',
    handle: 'moon_page',
    bio: '퓨어의 다섯 목소리를 기억해요.',
    followers: 2130
  },
  {
    id: 'plain-water',
    name: '맑은물한잔',
    handle: 'plain_water',
    bio: '확인하지 않은 말은 옮기지 않기.',
    followers: 1704
  },
  {
    id: 'summer-note',
    name: '여름쪽지',
    handle: 'summer_note',
    bio: '응원도 실망도 내 마음입니다.',
    followers: 592
  },
  {
    id: 'small-light',
    name: '작은조명',
    handle: 'small_light',
    bio: '오늘의 평범한 안부.',
    followers: 328
  },
  {
    id: 'full-stage',
    name: '전체무대보기',
    handle: 'full_stage_view',
    bio: '클립보다 전후 맥락. 원문을 함께 봅니다.',
    followers: 5240
  },
  {
    id: 'late-bus',
    name: '막차창가',
    handle: 'late_bus_window',
    bio: '천천히 읽고 생각합니다.',
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
    timestamp: '2027-06-18T12:10:00+09:00',
    text: `현재 거의 확정이라는 양이 탈퇴 썰 ㄷㄷ
    
    애초에 저번부터 표정 안 좋다고 말 나오더니,
    팬싸인회에서도 눈 안 마주쳤다고 함 ㅋㅋ
    
    몇 달간 잠적하더니 결국 잠수엔딩이네
    엑친들은 어떻게 생각하시나요 ㅋㅋ`,
    stance: 'critical',
    tags: ['양이', '무대영상'],
    likes: 1240,
    reposts: 580,
    views: 48600,
    replyText: '파딱 병신새끼야 지랄하지말고 글쳐내려',
    image: 'assets/news/news-02.svg',
    alt: '무대 조명과 영상 프레임을 표현한 자료 그래픽'
  },

  // -------------------- 02 --------------------
  {
    id: 'story-x-02',
    userId: 'daily-stage',
    timestamp: '2027-08-24T15:20:00+09:00',
    text: '퓨어 양이, 이번엔 팬사인회 태도 논쟁? 눈을 잘 안 마주쳤다는 글과 피곤해 보였다는 반응이 함께 나옵니다. 전체 현장을 확인하기는 어렵습니다.',
    stance: 'critical',
    tags: ['양이', '퓨어'],
    likes: 980,
    reposts: 334,
    views: 35200,
    replyText: '짧은 영상으로 응대 전부를 알 수 없는데 제목은 너무 단정적으로 읽혀요.'
  },

  // -------------------- 03 --------------------
  {
    id: 'story-x-03',
    userId: 'culture-log',
    timestamp: '2028-06-24T18:00:00+09:00',
    text: '활동 중단 이후 양이 탈퇴설까지 나오는 상황. 공식적으로 확인된 탈퇴 발표는 없는데 소속사는 언제 후속 안내를 할까요?',
    stance: 'speculation',
    tags: ['양이', '퓨어'],
    likes: 1608,
    reposts: 729,
    views: 62300,
    replyText: '탈퇴 발표가 없다는 문장까지 같이 옮겨 주세요. 앞부분만 캡처되네요.'
  },

  // -------------------- 04 --------------------
  {
    id: 'story-x-04',
    userId: 'culture-log',
    timestamp: '2028-06-18T13:40:00+09:00',
    text: '양이 예전 인터뷰 조각이 또 돌아오네요. 현재 대응이 답답하니 예전 말까지 다르게 읽히는 건 알겠지만 원래 질문은 어디로 갔는지.',
    stance: 'critical',
    tags: ['양이', '확인부터'],
    likes: 864,
    reposts: 217,
    views: 29800,
    replyText: '질문을 빼면 같은 대답도 정반대로 보일 수 있어요.',
    quoteId: 'story-x-01'
  },

  // -------------------- 05 --------------------
  {
    id: 'story-x-05',
    userId: 'daily-stage',
    timestamp: '2028-06-28T18:10:00+09:00',
    text: '양이 광고 일정 관련 추측도 늘고 있습니다. 계약 종료를 확인한 발표는 없습니다. 일정 조정 가능성을 다룬 이야기가 확정처럼 옮겨지는 상황입니다.',
    stance: 'speculation',
    tags: ['양이', '활동공백'],
    likes: 702,
    reposts: 268,
    views: 27400,
    replyText: '확인된 건 없다는 부분보다 계약 얘기만 남을까 걱정돼요.'
  },

  // -------------------- 06 --------------------
  {
    id: 'story-x-06',
    userId: 'paper-day',
    timestamp: '2028-06-24T20:15:00+09:00',
    text: '양이 기다린다는 사람 이해하는데 아무 안내 없이 시간이 가는 건 솔직히 실망임. 쉬는 거랑 팬들한테 아무 말도 없는 건 다른 문제잖아.',
    stance: 'critical',
    tags: ['양이'],
    likes: 41,
    reposts: 2,
    views: 830,
    replyText: '나도 기다리는 쪽인데 안내가 부족했다는 말에는 동의해.'
  },

  // -------------------- 07 --------------------
  {
    id: 'story-x-07',
    userId: 'after-seat',
    timestamp: '2028-06-23T09:40:00+09:00',
    text: '나 퓨어 좋아했는데 양이 관련해서 소속사가 팬들끼리 설명하게 두는 느낌이 너무 싫다. 확인 가능한 부분은 정리해 줄 수 있는 거 아닌가.',
    stance: 'critical',
    tags: ['양이', '퓨어'],
    likes: 133,
    reposts: 19,
    views: 3610,
    replyText: '팬들이 서로 다른 자료 가져오면서 싸우는 일부터 줄었으면 해요.'
  },

  // -------------------- 08 --------------------
  {
    id: 'story-x-08',
    userId: 'grey-hour',
    timestamp: '2028-06-25T22:10:00+09:00',
    text: '양이 언급이 줄어든 것 같다는 글을 봤는데 그게 진짜 관계 때문인지 그냥 공개적으로 말할 수 없는 건지 모르겠다. 모를수록 의심만 쌓이는 느낌.',
    stance: 'speculation',
    tags: ['양이', '활동공백'],
    likes: 58,
    reposts: 7,
    views: 1720,
    replyText: '언급 빈도는 관계의 증거가 아니니 일단 그 부분은 남겨 두면 좋겠어요.',
    quoteId: 'story-x-03'
  },

  // -------------------- 09 --------------------
  {
    id: 'story-x-09',
    userId: 'grey-hour',
    timestamp: '2028-06-29T11:35:00+09:00',
    text: '양이 활동 중단 시점이랑 광고 얘기가 같이 나오는 건 왜지 싶긴 함. 연결된 일인지는 전혀 모르겠지만 설명이 없으니 괜히 계속 보게 된다.',
    stance: 'speculation',
    tags: ['양이'],
    likes: 79,
    reposts: 12,
    views: 2240,
    replyText: '같이 거론된다고 원인과 결과가 되는 건 아니에요.'
  },

  // -------------------- 10 --------------------
  {
    id: 'story-x-10',
    userId: 'blue-ticket',
    timestamp: '2028-06-24T19:30:00+09:00',
    text: '양이 소식 기다리는 팬도 생활이 있는데 언제까지 기다리라는 말만 해야 하는지. 무사했으면 하는 마음이랑 서운한 마음이 같이 있음.',
    stance: 'critical',
    tags: ['양이', '기다림'],
    likes: 218,
    reposts: 38,
    views: 6890,
    replyText: '서운하다는 말까지 나쁜 마음 취급하지 않았으면 좋겠어.'
  },

  // -------------------- 11 --------------------
  {
    id: 'story-x-11',
    userId: 'after-seat',
    timestamp: '2028-06-25T12:20:00+09:00',
    text: '무대 보는 사람으로서 양이 그 장면은 아쉬웠어. 짧은 영상이라고 모든 비판이 틀린 건 아니잖아. 다만 거기서 사생활 얘기로 넘어가는 건 반대.',
    stance: 'critical',
    tags: ['양이', '무대영상'],
    likes: 187,
    reposts: 24,
    views: 5210,
    replyText: '공연 평가와 사람 전체에 대한 평가는 나눌 수 있다고 생각해요.'
  },

  // -------------------- 12 --------------------
  {
    id: 'story-x-12',
    userId: 'paper-day',
    timestamp: '2028-06-29T18:45:00+09:00',
    text: '양이 광고 기사 제목은 큰일 난 것처럼 보이는데 본문엔 확인된 게 없다고 함. 이런 기사만 늘어나는 것도 대응 공백 때문 아닌가 싶네.',
    stance: 'critical',
    tags: ['양이', '확인부터'],
    likes: 63,
    reposts: 9,
    views: 1460,
    replyText: '본문의 미확인 표시를 지우고 공유하는 계정도 있더라고요.'
  },

  // -------------------- 13 --------------------
  {
    id: 'story-x-13',
    userId: 'blue-ticket',
    timestamp: '2028-06-26T10:05:00+09:00',
    text: '팬사인회라는 게 소통하려고 가는 자리잖아. 양이 영상에 서운하다는 팬의 마음을 전부 악플로 묶지는 않았으면. 전체 장면은 나도 보고 싶음.',
    stance: 'critical',
    tags: ['양이', '퓨어'],
    likes: 301,
    reposts: 62,
    views: 8970,
    replyText: '실제 현장 경험과 영상만 본 해석을 구분해서 이야기하면 좋겠어요.',
    quoteId: 'story-x-02',
    image: 'assets/news/news-03.svg',
    alt: '팬 소통 공간을 표현한 자료 그래픽'
  },

  // -------------------- 14 --------------------
  {
    id: 'story-x-14',
    userId: 'grey-hour',
    timestamp: '2028-06-26T21:10:00+09:00',
    text: '양이가 없는데 네 멤버 활동은 계속되고 앞으로 구성은 어떻게 되는 건지 모르겠음. 이걸 탈퇴라고 단정할 생각은 없지만 불안한 건 사실.',
    stance: 'speculation',
    tags: ['양이', '퓨어'],
    likes: 106,
    reposts: 13,
    views: 3070,
    replyText: '현재 공지와 미래 계획을 별도로 안내해 줬으면 좋겠네요.'
  },

  // -------------------- 15 --------------------
  {
    id: 'story-x-15',
    userId: 'after-seat',
    timestamp: '2028-06-27T13:25:00+09:00',
    text: '양이 관련 비판을 보면 무조건 기다리라는 답부터 달리는 게 피곤해. 기다리는 사람한테도 왜 기다려야 하는지 설명이 필요한 거 아닌가.',
    stance: 'critical',
    tags: ['양이'],
    likes: 152,
    reposts: 22,
    views: 4320,
    replyText: '사생활 공개 말고 활동 안내를 요청하는 거라고 읽었어요.'
  },

  // -------------------- 16 --------------------
  {
    id: 'story-x-16',
    userId: 'paper-day',
    timestamp: '2028-06-27T23:05:00+09:00',
    text: '소속사도 양이도 말이 없으니 팬들이 원문 찾아 헤매고 있네. 추측하지 말라는 말은 맞는데 그 말만 반복해도 상황은 안 바뀌지.',
    stance: 'critical',
    tags: ['양이', '활동공백'],
    likes: 87,
    reposts: 6,
    views: 1860,
    replyText: '확인 가능한 정보 창구가 하나라도 꾸준히 열려 있었으면 해요.'
  },

  // -------------------- 17 --------------------
  {
    id: 'story-x-17',
    userId: 'summer-note',
    timestamp: '2028-07-03T08:20:00+09:00',
    text: '양이 기다리는 타임라인 들어오는 게 요즘 버겁다. 무슨 일 있는지 모르는 상태가 너무 길어져서. 실망했다는 말을 이제는 해도 되지 않을까.',
    stance: 'critical',
    tags: ['양이', '기다림'],
    likes: 276,
    reposts: 31,
    views: 7830,
    replyText: '팬도 지칠 수 있죠. 그렇다고 모르는 이야기를 사실로 붙이지는 말아요.'
  },

  // -------------------- 18 --------------------
  {
    id: 'story-x-18',
    userId: 'culture-log',
    timestamp: '2028-07-03T08:50:00+09:00',
    text: '양이 계약 해지설은 확인되지 않았습니다. 다만 활동 공백을 둘러싼 질문에 공식 안내가 더 필요하다는 여론은 계속됩니다. 가능성과 결정은 다릅니다.',
    stance: 'critical',
    tags: ['양이', '확인부터'],
    likes: 1132,
    reposts: 407,
    views: 45900,
    replyText: '추측을 확인된 결정처럼 요약하는 글부터 바로잡아야겠어요.'
  },

  // -------------------- 19 --------------------
  {
    id: 'story-x-19',
    userId: 'blue-ticket',
    timestamp: '2028-07-03T09:05:00+09:00',
    text: '양이에게 긴 설명을 강제로 듣고 싶은 건 아니야. 지금은 이야기하기 어렵다는 한마디라도 있었다면 기다리는 마음이 덜 무거웠을 것 같아.',
    stance: 'critical',
    tags: ['양이', '기다림'],
    likes: 412,
    reposts: 81,
    views: 12400,
    replyText: '말을 못 하는 이유도 모르는 만큼 단정은 조심하고 싶어요.'
  },

  // -------------------- 20 --------------------
  {
    id: 'story-x-20',
    userId: 'grey-hour',
    timestamp: '2028-06-30T09:50:00+09:00',
    text: '양이 탈퇴 얘기가 자꾸 보이는데 결정된 게 없다는 건 알겠음. 그래도 공백이 이대로 계속되면 어떻게 되는 건지 상상하게 되는 건 어쩔 수 없네.',
    stance: 'speculation',
    tags: ['양이', '활동공백'],
    likes: 91,
    reposts: 8,
    views: 2730,
    replyText: '불안이 곧 사실은 아니라는 것만 같이 기억했으면 해요.'
  },

  // -------------------- 21 --------------------
  {
    id: 'story-x-21',
    userId: 'after-seat',
    timestamp: '2028-07-01T15:15:00+09:00',
    text: '양이 쪽 설명을 기다린다는 글에도 팬 아니라는 댓글이 붙네. 응원했기 때문에 아쉽다는 마음도 있을 수 있는데 왜 한쪽만 골라야 하지.',
    stance: 'critical',
    tags: ['양이', '퓨어'],
    likes: 244,
    reposts: 47,
    views: 7040,
    replyText: '기다리는 방식이 다르다고 서로를 몰아내진 않았으면 합니다.'
  },

  // -------------------- 22 --------------------
  {
    id: 'story-x-22',
    userId: 'daily-stage',
    timestamp: '2028-07-03T09:22:00+09:00',
    text: '양이 관련 제목이 점점 세지는데 사실 확인은 그 속도를 못 따라갑니다. 그렇다고 소속사 안내가 충분했다는 뜻도 아닙니다. 두 문제를 나눠 보아야 합니다.',
    stance: 'critical',
    tags: ['양이', '확인부터'],
    likes: 1417,
    reposts: 492,
    views: 51800,
    replyText: '제목을 읽고 느낀 것과 확인한 사실을 구별하는 게 시작 같아요.'
  },

  // -------------------- 23 --------------------
  {
    id: 'story-x-23',
    userId: 'full-stage',
    timestamp: '2028-07-02T22:10:00+09:00',
    text: '3초짜리 양이 영상만 보고 태도 전체를 확정하는 건 이제 그만했으면. 전체 무대에서 무슨 흐름이었는지 먼저 보자. 비판하더라도 같은 자료를 보고 했으면 해.',
    stance: 'rebuttal',
    tags: ['양이', '무대영상'],
    likes: 932,
    reposts: 384,
    views: 23100,
    replyText: '확대 화면에 붙은 자막을 사실로 받아들이는 사람이 너무 많아요.',
    quoteId: 'story-x-01'
  },

  // -------------------- 24 --------------------
  {
    id: 'story-x-24',
    userId: 'plain-water',
    timestamp: '2028-07-02T23:40:00+09:00',
    text: '양이 탈퇴는 공식적으로 확인되지 않았습니다. 휴식 안내와 탈퇴 발표는 다릅니다. 제목의 물음표를 지워서 확정 소식처럼 옮기지 마세요.',
    stance: 'rebuttal',
    tags: ['양이', '확인부터'],
    likes: 610,
    reposts: 271,
    views: 18200,
    replyText: '구성 변경 발표는 없다는 문장을 빼면 전혀 다른 소식이 되죠.'
  },

  // -------------------- 25 --------------------
  {
    id: 'story-x-25',
    userId: 'small-light',
    timestamp: '2028-07-03T00:20:00+09:00',
    text: '양이 지금 어디에 있든 무사했으면 좋겠다. 활동보다 밥 먹고 잠자는 평범한 하루가 먼저였으면. 새벽이라 괜히 더 마음이 쓰인다.',
    stance: 'concern',
    tags: ['양이', '기다리는마음'],
    likes: 143,
    reposts: 11,
    views: 3070,
    replyText: '상태를 안다고 말할 수는 없어도 그런 안부는 남기고 싶어요.'
  },

  // -------------------- 26 --------------------
  {
    id: 'story-x-26',
    userId: 'summer-note',
    timestamp: '2028-07-03T07:10:00+09:00',
    text: '양이 기다리겠다는 사람도 이해하고 지쳤다는 사람도 이해함. 퓨어를 좋아하는 마음이 꼭 한 가지 문장으로만 나오는 건 아니니까.',
    stance: 'fan-fatigue',
    tags: ['양이', '퓨어'],
    likes: 359,
    reposts: 66,
    views: 9730,
    replyText: '서로 마음을 검사하지 않는 타임라인이면 좋겠어요.'
  },

  // -------------------- 27 --------------------
  {
    id: 'story-x-27',
    userId: 'moon-page',
    timestamp: '2028-07-03T07:35:00+09:00',
    text: '수현아 오늘도 밥 잘 챙겨 먹어. 유진 연우 다온도 무리하지 않았으면. 다섯 명을 좋아했던 마음으로 각자의 하루를 응원하고 싶어.',
    stance: 'member-support',
    tags: ['퓨어', '양이'],
    likes: 572,
    reposts: 93,
    views: 14680,
    replyText: '양이의 공백과 별개로 다른 멤버의 소통도 소중하게 보고 있어요.'
  },

  // -------------------- 28 --------------------
  {
    id: 'story-x-28',
    userId: 'late-bus',
    timestamp: '2028-07-03T08:05:00+09:00',
    text: '양이 옛날 무대 보다가 그냥 껐음. 그때 좋았던 기억까지 논란의 증거처럼 바꾸고 싶지는 않아서. 지금은 서로 조금 덜 날카로웠으면 해.',
    stance: 'concern',
    tags: ['양이', '기다림'],
    likes: 38,
    reposts: 3,
    views: 920,
    replyText: '좋았던 순간을 기억하는 게 지금의 모든 대응을 옹호하는 건 아니니까요.'
  },

  // -------------------- 29 --------------------
  {
    id: 'story-x-29',
    userId: 'plain-water',
    timestamp: '2028-07-03T08:40:00+09:00',
    text: '양이에 관한 약물·연애 의혹은 근거 없는 루머입니다. 해명 요구와 별개로 확인되지 않은 사생활 이야기를 다시 올리지 맙시다. 같은 글이 많다고 증거가 되지는 않습니다.',
    stance: 'rebuttal',
    tags: ['양이', '확인부터'],
    likes: 1084,
    reposts: 516,
    views: 32800,
    replyText: '비판하고 싶은 부분이 있어도 사실이 아닌 말을 붙이면 안 되죠.',
    quoteId: 'story-x-12'
  },

  // -------------------- 30 --------------------
  {
    id: 'story-x-30',
    userId: 'slow-night',
    timestamp: '2028-07-03T09:10:00+09:00',
    text: '양이야, 오늘은 조용한 하루였으면 좋겠어. 돌아오라는 말 대신 무사하라는 말만 남길게. 답을 안 해도 여기에 남겨 둘 수는 있으니까.',
    stance: 'concern',
    tags: ['양이', '기다리는마음'],
    likes: 206,
    reposts: 18,
    views: 4810,
    replyText: '아무것도 확정해서 말하지 않고 안부만 남기는 날도 필요하네요.'
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
