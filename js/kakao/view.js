import {displayName} from '../messages/story-rules.js';
import {storyClock} from '../story-clock.js';
import {esc} from '../ui.js';
import {avatar,glyph,dateLabel,clockLabel} from '../messages/view.js';
import {people} from './data.js';
const svg=body=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons={search:glyph.search,add:svg('<path d="M20 11V5H4v13h6l3 3v-3h2M17 15v7m-3-3h6"/>'),settings:svg('<circle cx="12" cy="12" r="4"/><path d="m9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1Z"/>'),friends:svg('<circle cx="12" cy="8" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>'),chat:svg('<path d="M3 3h18v14H9l-5 4v-4H3Z"/>'),open:svg('<path d="M2 5h16v12H9l-5 4v-4H2Zm17 4h3v12h-5"/>'),shop:svg('<path d="M4 8h16l1 14H3ZM8 8V5a4 4 0 0 1 8 0v3"/>'),more:svg('<circle cx="4" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="20" cy="12" r="1"/>')};

export function kakaoListDate(message) {
 if(!message)return '';
 const timestamp=message.timestamp??message.at;
 if(timestamp===null||timestamp===undefined||timestamp==='')return clockLabel(message);
 const date=new Date(timestamp);if(!Number.isFinite(date.getTime()))return clockLabel(message);
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 const get=type=>parts.find(p=>p.type===type)?.value,year=get('year'),month=get('month'),day=get('day');
 const key=`${year}-${month}-${day}`,today=storyClock.day(),yesterday=new Date(Date.parse(today+'T00:00:00Z')-86400000).toISOString().slice(0,10);
 if(key===today)return clockLabel({...message,at:timestamp});
 if(key===yesterday)return '어제';
 return year===today.slice(0,4)?`${Number(month)}월 ${Number(day)}일`:`${year}.${month}.${day}`;
}

export function kakaoRows(store, query, filter) {

  // 채팅 목록에서 숨길 개인 대화방 ID
  // 퓨어 단체방(members-group)은 숨기지 않습니다.
  const hiddenChats = [
    'member',    // 수현
    'yujin',     // 유진
    'yeonwoo',   // 연우
    'daon'       // 다온
  ];

  return store.list(query)

    // 지정한 개인 대화방만 숨기기
    .filter(c => !hiddenChats.includes(c.id))

    // 기존 채팅 필터 유지
    .filter(c =>
      filter === 'unread'
        ? c.unread
        : filter === 'group'
          ? c.members?.length > 2 || c.pendingMembers
          : true
    )

    // 채팅 목록 HTML 생성
    .map(c => {
      const last = c.messages.at(-1);

      return `
        <button
          class="kk-row"
          data-kk="thread"
          data-id="${esc(c.id)}"
        >
          ${avatar(c)}

          <span class="kk-row-copy">
            <strong>
              ${esc(displayName(c.name))}
              ${c.members?.length > 2
                ? `<small>${c.members.length}</small>`
                : ''}
            </strong>

            <span>
              ${c.draft
                ? `임시 작성: ${esc(c.draft)}`
                : esc(displayName(last?.text || '대화 없음'))}
            </span>
          </span>

          <span class="kk-row-meta">
            <time>
              ${last ? esc(kakaoListDate(last)) : ''}
            </time>

            ${c.unread
              ? `<b>${c.unread}</b>`
              : ''}
          </span>
        </button>
      `;
    })

    .join('') || '<p class="kk-empty">검색 결과가 없습니다.</p>';
}


export function kakaoTimeline(store, id) {
  const t = store.thread(id);
  if (!t) return '';

  let day = '';
  let html = '';

  t.messages.forEach((m, i) => {
    const d = dateLabel(m);
    const prev = t.messages[i - 1];
    const next = t.messages[i + 1];

    const mine = m.side === 'out';

    const sender = people[m.senderId] || {
      name: t.name,
      avatar: t.avatar
    };

    const start =
      !prev ||
      prev.type === 'system' ||
      prev.senderId !== m.senderId ||
      dateLabel(prev) !== d;

    const end =
      !next ||
      next.type === 'system' ||
      next.senderId !== m.senderId ||
      clockLabel(next) !== clockLabel(m) ||
      dateLabel(next) !== d;

    // 날짜가 바뀌면 날짜 구분선 표시
    if (d !== day) {
      html += `<div class="kk-date">${esc(d)}</div>`;
      day = d;
    }

    // ======================================
    // 시스템 메시지 (초대, 퇴장 등)
    // ======================================
    if (m.type === 'system') {
    html += `<div class="kk-system" data-message-id="${esc(m.id)}" role="note">${esc(displayName(m.text))}</div>`;
    return;
    }

    // ======================================
    // 일반 카카오톡 메시지
    // ======================================

    html += `
      <div
        class="kk-line ${mine ? 'mine' : ''} ${start ? 'start' : ''}"
        data-message-id="${esc(m.id)}"
      >

        ${!mine
          ? (start
              ? avatar(sender)
              : '<span class="kk-avatar-gap"></span>')
          : ''}

        <div class="kk-message">

          ${!mine && start
            ? `<small>${esc(displayName(sender.name))}</small>`
            : ''}

          <div class="kk-bubble">${esc(displayName(m.text))}</div>

        </div>

        ${end
          ? `
            <span class="kk-message-meta">

              ${mine &&
                m.source === 'visitor' &&
                !t.messages.slice(i + 1).some(x => x.side === 'in' && x.type !== 'system')
                  ? '<b aria-label="읽지 않음">1</b>'
                  : ''}

              <time>${esc(clockLabel(m))}</time>

            </span>
          `
          : ''}

      </div>
    `;
  });

  // 입력 중 표시
  if (store.typing(id)) {
    html += `
      <div class="kk-typing" role="status">
        입력 중<span>•••</span>
      </div>
    `;
  }

  return html;
}

export function renderKakao(store,id,ui){const t=store.thread(id);if(t)return `<div class="app-shell kk-shell kk-thread" data-thread-id="${esc(id)}"><nav class="kk-thread-nav"><button data-action="back" aria-label="채팅 목록으로">${glyph.back}</button>${avatar(t)}<h2>${esc(displayName(t.name))}</h2></nav><div class="app-content kk-timeline" aria-label="대화 기록">${kakaoTimeline(store,id)}</div><form class="kk-composer"><div class="kk-input-pill"><textarea id="kakao-input" rows="1" maxlength="5000" placeholder="메시지 입력" aria-label="${esc(displayName(t.name))}에게 카카오톡 작성">${esc(t.draft)}</textarea><button type="submit" class="kk-send" aria-label="카카오톡 전송" ${t.draft.trim()?'':'disabled'}>${glyph.send}</button></div></form></div>`;
return `<div class="app-shell kk-shell"><div class="kk-header"><button class="kk-home" data-action="back" aria-label="홈으로">‹ 홈</button><div class="kk-title"><h2>채팅</h2><div><button data-kk="search" aria-label="채팅 검색">${icons.search}</button><button disabled aria-label="새 채팅">${icons.add}</button><button disabled aria-label="설정">${icons.settings}</button></div></div><div class="kk-chips">${[['all','전체'],['unread','안 읽은 채팅'],['group','단체 채팅']].map(([id,name])=>`<button data-kk="filter" data-id="${id}" aria-pressed="${id===ui.filter}">${name}</button>`).join('')}</div><label class="kk-search" ${ui.searchOpen?'':'hidden'}>${glyph.search}<input id="kakao-search" type="search" aria-label="채팅방 또는 본문 검색" placeholder="검색" value="${esc(ui.query)}"></label></div><div class="app-content kk-list-scroll"><aside class="kk-ad"><span>오늘의 한 장면</span><strong>잠깐의 여유, 작은 안부</strong><p>바쁜 하루에도 잠시 쉬어 가요</p><i aria-hidden="true">☀</i></aside><div class="kk-rows">${kakaoRows(store,ui.query,ui.filter)}</div></div><nav class="kk-tabs" aria-label="카카오톡 하단 메뉴">${[['friends','친구'],['chat','채팅'],['open','오픈채팅'],['shop','쇼핑'],['more','더보기']].map(([id,name])=>`<button ${id==='chat'?'data-kk="chat-tab" aria-current="page"':'disabled'}>${icons[id]}<span>${name}</span></button>`).join('')}</nav></div>`;}
export class KakaoUI{
 constructor(screen,store,hooks){this.screen=screen;this.store=store;this.h=hooks;this.query='';this.filter='all';this.searchOpen=false;this.positions=new Map();this.composing=false;
 screen.addEventListener('click',e=>{const b=e.target.closest('[data-kk]');if(!b||b.closest('.motion-previous')||this.h.busy()||this.h.active()===undefined)return;const action=b.dataset.kk;if(action==='thread')this.h.navigate(b.dataset.id);if(action==='search'){this.searchOpen=!this.searchOpen;this.h.refresh();if(this.searchOpen)screen.querySelector('#kakao-search')?.focus();}if(action==='filter'){this.filter=b.dataset.id;this.h.refresh();}if(action==='chat-tab'){this.filter='all';this.h.refresh();}});
 screen.addEventListener('input',e=>{if(this.h.active()===undefined||e.target.closest('.motion-previous'))return;if(e.target.id==='kakao-input'){this.store.setDraft(this.h.active(),e.target.value);this.fit();}if(e.target.id==='kakao-search'){this.query=e.target.value;const rows=screen.querySelector('.kk-rows');if(rows)rows.innerHTML=kakaoRows(store,this.query,this.filter);}});
 screen.addEventListener('compositionstart',()=>this.composing=true);screen.addEventListener('compositionend',()=>this.composing=false);
 screen.addEventListener('keydown',e=>{if(e.target.id==='kakao-input'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&!this.composing&&e.keyCode!==229){e.preventDefault();this.send();}});
 screen.addEventListener('submit',e=>{if(e.target.matches('.kk-composer')){e.preventDefault();this.send();}});
 screen.addEventListener('scroll',e=>{if(e.target.matches('.kk-timeline')&&!e.target.closest('.motion-previous')){const id=this.h.active();if(id)this.positions.set(id,e.target.scrollTop);}},true);
 this.viewport=()=>{const p=screen.closest('.phone'),v=window.visualViewport,focus=document.activeElement?.matches('#kakao-input,#kakao-search');if(v&&innerWidth<=640&&focus&&this.h.active()!==undefined&&v.height<innerHeight-80){p.dataset.kakaoKeyboard='true';p.style.setProperty('--kakao-visible-height',Math.max(200,v.height)+'px');}else{delete p.dataset.kakaoKeyboard;p.style.removeProperty('--kakao-visible-height');}};window.visualViewport?.addEventListener('resize',this.viewport);screen.addEventListener('focusin',this.viewport);screen.addEventListener('focusout',()=>queueMicrotask(this.viewport));
 }
 fit(){const input=this.screen.querySelector('#kakao-input'),b=this.screen.querySelector('.kk-send');if(input){input.style.height='auto';input.style.height=Math.min(110,input.scrollHeight)+'px';if(b)b.disabled=!input.value.trim();}}
 afterRender(){this.viewport();const id=this.h.active(),area=this.screen.querySelector('.kk-timeline');if(id&&area){area.scrollTop=this.positions.has(id)?this.positions.get(id):area.scrollHeight;this.store.markRead(id);}this.fit();}
 update(kind,id){const current=this.h.active();if(current===null){const rows=this.screen.querySelector('.kk-rows');if(rows)rows.innerHTML=kakaoRows(this.store,this.query,this.filter);return;}if(current!==id||kind==='read')return;const area=this.screen.querySelector('.kk-timeline');if(!area)return;const remaining=area.scrollHeight-area.clientHeight-area.scrollTop,near=remaining<=1||(area.scrollTop>1&&remaining<90),top=area.scrollTop;area.innerHTML=kakaoTimeline(this.store,id);area.scrollTop=kind==='sent'||near?area.scrollHeight:top;this.positions.set(id,area.scrollTop);if(kind==='sent'){const input=this.screen.querySelector('#kakao-input');if(input)input.value='';this.fit();}this.store.markRead(id);}
 send(){if(this.h.busy())return;const id=this.h.active();if(!id)return;const input=this.screen.querySelector('#kakao-input');if(input)this.store.setDraft(id,input.value);this.store.send(id);}
}
