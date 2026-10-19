
// 기존 권진우 5초 문자 유지
import {notificationEvents} from '../notification-data.js';

export const realtimeEvents = [
  ...notificationEvents.map(e => ({
    id: e.id,
    channel: 'sms',
    senderId: e.senderId,
    text: e.message,
    triggerType: 'sessionElapsed',
    delayMs: e.delayMs,
    enabled: true,
    once: true,
    notificationEnabled: true,
    legacy: true
  })),

  // 매니저 — 15초
  {
    id: 'manager-kakao-45',
    channel: 'kakao',
    senderId: 'manager',
    text: '양이야. 너 진짜 어디로든 연락이 안 돼서 너무 걱정돼. 진짜로... 부탁할게. 연락 한 번만 해주라.',
    triggerType: 'sessionElapsed',
    delayMs: 15000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  // 수현 — 20초
  {
    id: 'suhyun-sms-120',
    channel: 'sms',
    senderId: 'member',
    text: '양이 형. 잘 지내고 있어? ...진짜 아니라고 해줘. 아니지?',
    triggerType: 'sessionElapsed',
    delayMs: 20000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  // ──────────────────────────────
  // 악성 연락 — 6초 간격으로 7통
  // ──────────────────────────────

  {
    id: 'hostile-live-001',
    channel: 'sms',
    senderId: 'hostile',
    text: '야.',
    triggerType: 'sessionElapsed',
    delayMs: 26000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-002',
    channel: 'sms',
    senderId: 'hostile',
    text: '너 지금 뭐 하고 있냐?',
    triggerType: 'sessionElapsed',
    delayMs: 28000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-003',
    channel: 'sms',
    senderId: 'hostile',
    text: '사람들이 다 너 기다리는 거 안 보여?',
    triggerType: 'sessionElapsed',
    delayMs: 30000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-004',
    channel: 'sms',
    senderId: 'hostile',
    text: '그렇게 입 닫고 있으면 없던 일이 되는 줄 알아? ㅋㅋ',
    triggerType: 'sessionElapsed',
    delayMs: 32000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-005',
    channel: 'sms',
    senderId: 'hostile',
    text: '진짜 뻔뻔하다. 그렇게 좋아해 주던 사람들한테 미안하지도 않냐?',
    triggerType: 'sessionElapsed',
    delayMs: 34000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-006',
    channel: 'sms',
    senderId: 'hostile',
    text: '평생 숨어 살 수 있을 것 같아?',
    triggerType: 'sessionElapsed',
    delayMs: 36000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile-live-007',
    channel: 'sms',
    senderId: 'hostile',
    text: '어차피 너 같은 애는 돌아와 봤자 아무도 안 반겨줘.',
    triggerType: 'sessionElapsed',
    delayMs: 38000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },

  {
    id: 'hostile2-live-001',
    channel: 'sms',
    senderId: 'hostile-2',
    text: '이거 양양이 번호 맞나요? ㅋㅋ',
    triggerType: 'sessionElapsed',
    delayMs: 40000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },
  
  {
    id: 'hostile2-live-002',
    channel: 'sms',
    senderId: 'hostile-2',
    text: '잠적하시는건가용? 아니면 뒤@지셨음?',
    triggerType: 'sessionElapsed',
    delayMs: 42000,
    enabled: true,
    once: true,
    notificationEnabled: true   
  },

  {
    id: 'hostile3-live-001',
    channel: 'sms',
    senderId: 'hostile-3',
    text: '양이야 보고 싶다... 이거 니 번호라고 뿌려졌는데 맞으면 좋겠어',
    triggerType: 'sessionElapsed',
    delayMs: 44000,
    enabled: true,
    once: true,
    notificationEnabled: true
  },
  // 아름 — 비활성화 유지
  {
    id: 'areum-future',
    channel: 'kakao',
    senderId: 'police',
    text: '[미정 대사]',
    triggerType: 'sessionElapsed',
    delayMs: 180000,
    enabled: false,
    once: true,
    notificationEnabled: true
  },

  // 덕춘 — 비활성화 유지
  {
    id: 'doctor-future',
    channel: 'sms',
    senderId: 'doctor',
    text: '[미정 대사]',
    triggerType: 'sessionElapsed',
    delayMs: 240000,
    enabled: false,
    once: true,
    notificationEnabled: true
  }
];
