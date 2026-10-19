
import {timeConfig} from '../time-config.js';

export const today = timeConfig.start.slice(0, 10);

// ==========================================
// PROJECT YANGYANG — 캘린더 일정
// 기준 날짜: 2028년 7월 3일
// ==========================================

export const events = [

  // ========================================
  // 2028년 5월
  // ========================================

  {
    id:'may-practice',
    title:'퓨어 안무 연습',
    date:'2028-05-24',
    startTime:'14:00',
    endTime:'18:00',
    location:'회사 연습실 B',
    description:'단체 안무 동선 점검 및 개인 파트 수정',
    status:'completed',
    category:'활동'
  },

  {
    id:'may-fitting',
    title:'무대 의상 피팅',
    date:'2028-05-29',
    startTime:'13:30',
    endTime:'15:00',
    location:'스타일리스트 작업실',
    description:'무대 의상 최종 피팅. 액세서리 확인.',
    status:'completed',
    category:'활동'
  },

  // ========================================
  // 2028년 6월 1일 ~ 12일
  // ========================================

  {
    id:'june-recording',
    title:'보컬 녹음',
    date:'2028-06-03',
    startTime:'13:00',
    endTime:'17:00',
    location:'회사 녹음실',
    description:'가이드 수정 및 코러스 녹음',
    status:'completed',
    category:'활동'
  },

  {
    id:'june-lesson',
    title:'보컬 레슨',
    date:'2028-06-05',
    startTime:'15:00',
    endTime:'16:30',
    location:'회사 레슨실',
    description:'발성 및 라이브 컨디션 점검',
    status:'completed',
    category:'활동'
  },

  {
    id:'june-shoot',
    title:'콘텐츠 촬영',
    date:'2028-06-07',
    startTime:'10:00',
    endTime:'16:00',
    location:'서울 스튜디오',
    description:'자체 콘텐츠 촬영. 오전 9시 30분까지 현장 도착.',
    status:'completed',
    category:'활동'
  },

  {
    id:'june-meeting',
    title:'매니저 형 미팅',
    date:'2028-06-09',
    startTime:'14:00',
    endTime:'15:00',
    location:'회사 회의실',
    description:'하반기 활동 및 개인 스케줄 관련',
    status:'completed',
    category:'업무'
  },

  {
    id:'june-practice',
    title:'안무 연습',
    date:'2028-06-11',
    startTime:'16:00',
    endTime:'19:00',
    location:'회사 연습실 A',
    description:'개인 파트 연습',
    status:'completed',
    category:'활동'
  },

  // ========================================
  // 2028년 6월 13일 — 칠병제 모임
  // ========================================

  {
    id:'chilbyeongje',
    title:'칠병제 모임 🍻',
    date:'2028-06-13',
    startTime:'18:30',
    endTime:'23:00',
    location:'서울 · 모임 장소',
    description:'칠병제 다 같이 모이는 날!!\n진우, 은수, 윤한, 시우, 광현, 지후, 민우, 재현, 덕춘, 아름.\n오랜만에 전원 집합 😊\n늦지 말기!',
    status:'completed',
    category:'개인'
  },

  // ========================================
  // 2028년 6월 14일 ~ 22일
  // ========================================

  {
    id:'june-rest',
    title:'휴식',
    date:'2028-06-14',
    startTime:'12:00',
    endTime:'18:00',
    location:'집',
    description:'스케줄 없는 날. 푹 쉬기.',
    status:'completed',
    category:'개인'
  },

  {
    id:'june-interview',
    title:'매거진 인터뷰',
    date:'2028-06-16',
    startTime:'13:00',
    endTime:'15:00',
    location:'서울 강남구',
    description:'개인 인터뷰 및 사진 촬영',
    status:'completed',
    category:'활동'
  },

  {
    id:'june-dance-check',
    title:'안무 영상 모니터링',
    date:'2028-06-18',
    startTime:'17:00',
    endTime:'18:30',
    location:'회사 연습실',
    description:'연습 영상 확인 및 수정 사항 정리',
    status:'completed',
    category:'활동'
  },

  {
    id:'june-team-meeting',
    title:'퓨어 팀 미팅',
    date:'2028-06-20',
    startTime:'15:00',
    endTime:'16:30',
    location:'회사 회의실',
    description:'멤버 전원 참석. 향후 활동 관련 논의.',
    status:'completed',
    category:'업무'
  },

  {
    id:'june-health',
    title:'병원 진료',
    date:'2028-06-22',
    startTime:'11:00',
    endTime:'12:00',
    location:'병원',
    description:'예약 진료',
    status:'completed',
    category:'개인'
  },

  // ========================================
  // 2028년 6월 23일 ~ 30일
  // ========================================

  {
    id:'june-schedule-cancel',
    title:'개인 콘텐츠 촬영',
    date:'2028-06-24',
    startTime:'10:00',
    endTime:'15:00',
    location:'촬영 스튜디오',
    description:'일정 취소',
    status:'cancelled',
    category:'활동'
  },

  {
    id:'june-manager-call',
    title:'매니저 형이랑 통화',
    date:'2028-06-26',
    startTime:'16:00',
    endTime:'16:30',
    location:'',
    description:'스케줄 관련 이야기',
    status:'cancelled',
    category:'업무'
  },

  {
    id:'june-rehearsal',
    title:'퓨어 합동 연습',
    date:'2028-06-28',
    startTime:'14:00',
    endTime:'18:00',
    location:'회사 연습실 A',
    description:'개인 사정으로 불참',
    status:'cancelled',
    category:'활동'
  },

  {
    id:'june-private',
    title:'수희 만나기',
    date:'2028-06-29',
    startTime:'19:00',
    endTime:'21:00',
    location:'서울',
    description:'저녁 약속',
    status:'cancelled',
    category:'개인'
  },

  {
    id:'june-checkup',
    title:'병원 재진',
    date:'2028-06-30',
    startTime:'11:30',
    endTime:'12:00',
    location:'병원',
    description:'예약 취소',
    status:'cancelled',
    category:'개인'
  },

  // ========================================
  // 2028년 7월
  // ========================================

  {
    id:'july-team',
    title:'퓨어 단체 미팅',
    date:'2028-07-01',
    startTime:'13:00',
    endTime:'15:00',
    location:'회사 회의실',
    description:'멤버 전원 참석 예정이었던 미팅',
    status:'cancelled',
    category:'업무'
  },

  {
    id:'july-appointment',
    title:'병원 예약',
    date:'2028-07-02',
    startTime:'11:00',
    endTime:'11:30',
    location:'병원',
    description:'예약 일정',
    status:'scheduled',
    category:'개인'
  },

  {
    id:'july-meeting',
    title:'회사 미팅',
    date:'2028-07-03',
    startTime:'15:00',
    endTime:'16:00',
    location:'회사',
    description:'활동 관련 미팅',
    status:'cancelled',
    category:'업무'
  }

];
