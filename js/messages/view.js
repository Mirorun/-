import {displayName} from './story-rules.js';
import {esc} from '../ui.js';
const svg=(body,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
export const glyph={back:svg('<path d="m15 4-8 8 8 8"/>'),search:svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>'),write:svg('<path d="M12 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M10 14l1-5L19 1l4 4-8 8-5 1Z"/>'),send:svg('<path d="M12 19V5m-6 6 6-6 6 6"/>')};
export function avatar(t){return `<span class="msg-avatar">${t.avatar?`<img src="${esc(t.avatar)}" alt="${esc(t.name)} 프로필">`:''}<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="17" r="9" fill="white"/><path d="M7 44v-4a17 15 0 0 1 34 0v4Z" fill="white"/></svg></span>`;}
export function dateLabel(m){return m.at?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',weekday:'short'}).format(new Date(m.at)):m.dateLabel||'날짜 미정';}
export function clockLabel(m){return m.at?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',hour:'numeric',minute:'2-digit'}).format(new Date(m.at)):m.timeLabel||'시간 미정';}
export function rows(store, query) {
  const storyToday = '2028-07-03';

  function listDateLabel(message, thread) {
    if (!message?.at) {
      return thread.legacyTime || '미정';
    }

    const date = new Date(message.at);

    if (Number.isNaN(date.getTime())) {
      return '미정';
    }

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);

    const get = type => parts.find(p => p.type === type)?.value;

    const year = get('year');
    const month = get('month');
    const day = get('day');

    const dateKey = `${year}-${month}-${day}`;

    // 작품 속 오늘이면 시간 표시
    if (dateKey === storyToday) {
      return clockLabel(message);
    }

    // 과거 메시지는 날짜 표시
    return `${year}. ${Number(month)}. ${Number(day)}.`;
  }

  return store.list(query).map(t => {
    const last = t.messages.at(-1);

    return `
      <button class="msg-row" data-action="detail:${esc(t.id)}">
        <span class="msg-unread">
          ${t.unread ? '<i aria-label="읽지 않음"></i>' : ''}
        </span>

        ${avatar(t)}

        <span class="msg-row-copy">
          <span class="msg-row-top">
            <strong>${esc(displayName(t.name))}</strong>

            <time>${esc(listDateLabel(last, t))}</time>

            <span class="msg-row-chevron">›</span>
          </span>

          <span class="msg-preview">
            ${
              t.draft
                ? `<span class="draft-tag">임시 작성: </span>${esc(t.draft)}`
                : esc(displayName(last?.text || '대화 기록 없음'))
            }
          </span>

          <span class="sr-only">
            ${t.unread}개의 읽지 않은 메시지
          </span>
        </span>
      </button>
    `;
  }).join('') || '<p class="msg-empty">검색 결과가 없습니다.</p>';
}
export function timeline(store, id) {
  const t = store.thread(id);
  if (!t) return '';

  let lastDate = '';
  let html = '';

  const messages = t.messages;

  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    const next = messages[i + 1];

    const date = dateLabel(m).replace(/\s*·\s*기존 샘플/g,'');

    if (date !== lastDate) {
      html += `<div class="msg-date">${esc(date)}</div>`;
      lastDate = date;
    }

    // 다음 메시지가 같은 발신자이고 같은 분에 전송됐는지 확인
    const sameMinute =
      next &&
      m.at &&
      next.at &&
      m.side === next.side &&
      dateLabel(m) === dateLabel(next) &&
      clockLabel(m) === clockLabel(next);

    // 연속 메시지의 마지막에만 시간 표시
    const showTime = !sameMinute;

    html += `
      <div class="msg-message ${m.side === 'out' ? 'outgoing' : 'incoming'}"
           data-message-id="${esc(m.id)}">
        <div class="msg-bubble">${esc(displayName(m.text))}</div>
        ${showTime ? `<time>${esc(clockLabel(m))}${m.source === 'visitor' ? ` · ${messages.slice(i+1).some(next=>next.source==='reply') ? '읽음' : '전송됨'}` : ''}</time>` : ''}
      </div>
    `;
  }

  if (!messages.length) {
    html += '<p class="msg-empty">아직 주고받은 메시지가 없습니다.</p>';
  }

  if (store.typing(id)) {
    html += `
      <div class="typing-indicator"
           role="status"
           aria-label="상대방이 입력 중">
        <i></i><i></i><i></i>
      </div>
    `;
  }

  return html;
}
export function renderMessagesScreen(store,id,query=''){
 if(!id)return `<div class="app-shell messages-shell"><nav class="msg-list-nav"><button data-action="back" class="msg-glass msg-home" aria-label="홈으로">${glyph.back}<span>홈</span></button><span class="msg-compact-title">메시지</span><button class="msg-glass msg-compose-shortcut" aria-label="대화 검색">${glyph.write}</button></nav><div class="app-content msg-list-scroll"><h2>메시지</h2><div class="msg-rows">${rows(store,query)}</div></div><div class="msg-search-wrap"><label class="msg-search">${glyph.search}<input id="message-search" type="search" placeholder="검색" aria-label="이름 또는 메시지 검색" value="${esc(query)}" autocomplete="off"></label></div></div>`;
 const t=store.thread(id);if(!t)return renderMessagesScreen(store,null,query);
 return `<div class="app-shell messages-shell msg-thread-shell" data-thread-id="${esc(id)}"><nav class="msg-thread-nav"><button data-action="back" class="msg-glass msg-thread-back" aria-label="메시지 목록으로">${glyph.back}<span>${store.unread()||''}</span></button><div class="msg-person">${avatar(t)}<h2>${esc(displayName(t.name))} <span>›</span></h2></div></nav><div class="app-content msg-timeline" aria-label="${esc(displayName(t.name))} 대화 기록">${timeline(store,id)}</div><form class="msg-composer" aria-label="메시지 작성"><span class="msg-plus" aria-hidden="true">+</span><div class="msg-input-pill"><textarea id="message-input" rows="1" maxlength="5000" placeholder="iMessage" aria-label="${esc(displayName(t.name))}에게 메시지 작성">${esc(t.draft)}</textarea><button type="submit" class="msg-send" aria-label="메시지 전송" ${t.draft.trim()?'':'disabled'}>${glyph.send}</button></div></form></div>`;
}
export class MessagesUI{
 constructor(screen,store,{active,busy}){this.screen=screen;this.store=store;this.active=active;this.busy=busy;this.query='';this.positions=new Map();this.compose=false;
 screen.addEventListener('input',e=>{if(e.target.id==='message-search'){this.query=e.target.value;const rowsNode=screen.querySelector('.msg-rows');if(rowsNode)rowsNode.innerHTML=rows(store,this.query);}else if(e.target.id==='message-input'){const id=this.active();if(id){store.setDraft(id,e.target.value);this.fit(e.target);this.button();}}});
 screen.addEventListener('compositionstart',()=>this.compose=true);screen.addEventListener('compositionend',()=>this.compose=false);
 screen.addEventListener('keydown',e=>{if(e.target.id==='message-input'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&!this.compose&&e.keyCode!==229){e.preventDefault();this.send();}});
 screen.addEventListener('pointerup',e=>{if(e.pointerType==='touch'&&e.target.closest('.msg-send:not(:disabled)')){e.preventDefault();this.send();}});
 screen.addEventListener('submit',e=>{if(e.target.matches('.msg-composer')){e.preventDefault();this.send();}});
 screen.addEventListener('click',e=>{if(e.target.closest('.msg-compose-shortcut'))screen.querySelector('#message-search')?.focus();});
 screen.addEventListener('scroll',e=>{if(e.target.closest('.motion-previous'))return;if(e.target.matches('.msg-list-scroll'))screen.querySelector('.messages-shell')?.classList.toggle('list-scrolled',e.target.scrollTop>35);if(e.target.matches('.msg-timeline')){const id=this.active();if(id)this.positions.set(id,e.target.scrollTop);}},true);
 const viewport=()=>{const phone=screen.closest('.phone'),v=window.visualViewport,focused=document.activeElement?.matches('#message-input,#message-search');if(v&&innerWidth<=640&&focused&&this.active()!==undefined&&v.height<innerHeight-80){phone.dataset.messageKeyboard='true';phone.style.setProperty('--message-visible-height',Math.max(200,v.height)+'px');}else{delete phone.dataset.messageKeyboard;phone.style.removeProperty('--message-visible-height');}};
 this.viewport=viewport;window.visualViewport?.addEventListener('resize',viewport);screen.addEventListener('focusin',viewport);screen.addEventListener('focusout',()=>queueMicrotask(viewport));window.addEventListener('resize',viewport);
 screen.addEventListener('error',e=>{if(e.target.matches('.msg-avatar img'))e.target.remove();},true);
 }
 fit(input){input.style.height='auto';input.style.height=Math.min(input.scrollHeight,110)+'px';}
 button(){const input=this.screen.querySelector('#message-input'),button=this.screen.querySelector('.msg-send');if(button&&input)button.disabled=!input.value.trim();}
 afterRender(){this.viewport();const id=this.active(),area=this.screen.querySelector('.msg-timeline');if(id&&area){area.scrollTop=this.positions.has(id)?this.positions.get(id):area.scrollHeight;this.store.markRead(id);const input=this.screen.querySelector('#message-input');if(input)this.fit(input);}this.button();}
 update(kind,threadId){const current=this.active();if(current===null){const node=this.screen.querySelector('.msg-rows');if(node)node.innerHTML=rows(this.store,this.query);return;}if(current!==threadId)return;if(kind==='read'){const count=this.screen.querySelector('.msg-thread-back span');if(count)count.textContent=this.store.unread()||'';return;}const area=this.screen.querySelector('.msg-timeline');if(!area)return;const nearBottom=area.scrollHeight-area.clientHeight-area.scrollTop<90,top=area.scrollTop;area.innerHTML=timeline(this.store,current);area.scrollTop=kind==='sent'||nearBottom?area.scrollHeight:top;this.positions.set(current,area.scrollTop);if(kind==='sent'&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const nodes=area.querySelectorAll('.msg-message.outgoing');nodes[nodes.length-1]?.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:180,easing:'ease-out'});}const input=this.screen.querySelector('#message-input');if(kind==='sent'&&input){input.value=this.store.thread(current).draft;this.fit(input);this.button();}this.store.markRead(current);}
 send(){if(this.busy())return;const id=this.active();if(!id)return;const input=this.screen.querySelector('#message-input');if(input)this.store.setDraft(id,input.value);this.store.send(id);}
}
