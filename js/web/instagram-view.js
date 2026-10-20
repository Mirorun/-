import {esc} from '../ui.js';
import {avatar,glyph} from '../messages/view.js';
import {instagramUsers,instagramDMs} from './social-data.js';
import {igPerson,igMedia,igComments} from './instagram-extension.js';
const btn=(label,action,id='',extra='')=>`<button data-ig="${action}" data-id="${esc(id)}" ${extra}>${label}</button>`;
const date=v=>{try{return v?new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(v)):'날짜 미정';}catch{return '날짜 미정';}};
const photo=(src,alt,extra='')=>`<img class="web-photo" src="${esc(src)}" alt="${esc(alt||'게시물 사진')}" loading="lazy" ${extra}>`;
export function installInstagram(state,screen){
 state.igPositions=new Map();state.igSaved=new Set();let swipe=null;
 const move=(id,delta)=>{const post=state.ig.find(p=>p.id===id),media=igMedia(post);const i=Math.max(0,Math.min(media.length-1,(state.igPositions.get(id)||0)+delta));state.igPositions.set(id,i);state.h.refresh();};
 screen.addEventListener('click',e=>{const b=e.target.closest('[data-ig]');if(!b||b.closest('.motion-previous')||state.h.active()!=='instagram'||state.h.busy())return;const id=b.dataset.id;switch(b.dataset.ig){
 case'route':state.h.navigate({detail:id});return;
 case'save':state.igSaved.has(id)?state.igSaved.delete(id):state.igSaved.add(id);break;
 case'prev':move(id,-1);return;case'next':move(id,1);return;
 case'zoom':state.zoom={src:b.dataset.src,alt:b.dataset.alt||'사진 확대'};break;
 default:return;}state.h.refresh();});
 screen.addEventListener('pointerdown',e=>{if(state.h.active()!=='instagram'||state.h.busy()||state.zoom)return;const el=e.target.closest('[data-ig-carousel]');if(!el||e.target.closest('button'))return;swipe={id:el.dataset.igCarousel,x:e.clientX,y:e.clientY,pointerId:e.pointerId};el.setPointerCapture?.(e.pointerId);});
 screen.addEventListener('pointerup',e=>{if(!swipe||e.pointerId!==swipe.pointerId)return;const g=swipe;swipe=null;const dx=e.clientX-g.x,dy=e.clientY-g.y;if(Math.abs(dx)>=50&&Math.abs(dx)>Math.abs(dy)*1.4)move(g.id,dx<0?1:-1);});
 screen.addEventListener('pointercancel',()=>swipe=null);
}
export function instagramCard(state,p,detail=false){
 const u=igPerson(p.userId),key='ig-'+p.id,media=igMedia(p),index=Math.min(state.igPositions.get(p.id)||0,Math.max(0,media.length-1)),comments=igComments(p);
 return `<article class="ig-post" data-ig-post="${esc(p.id)}"><header>${btn(avatar(u)+'<strong>'+esc(u.handle)+'</strong>','route','profile/'+u.id)}</header><section class="ig-carousel" data-ig-carousel="${esc(p.id)}" aria-label="게시물 사진">${media[index]?photo(media[index],p.alt||p.text,'draggable="false"'):'<p>사진 없음</p>'}${media.length>1?`<span class="ig-media-count">${index+1} / ${media.length}</span><div class="ig-carousel-controls">${btn('‹','prev',p.id,'aria-label="이전 이미지" '+(index===0?'disabled':''))}${btn('›','next',p.id,'aria-label="다음 이미지" '+(index===media.length-1?'disabled':''))}</div>`:''}${media[index]?btn('⤢','zoom',p.id,`class="ig-zoom" data-src="${esc(media[index])}" data-alt="${esc(p.alt||'게시물 사진')}" aria-label="이미지 확대"`):''}</section><div class="ig-post-body"><button data-web="like" data-id="${esc(key)}" class="ig-like" aria-label="좋아요" aria-pressed="${state.likes.has(key)}">${state.likes.has(key)?'♥':'♡'}</button>${btn('댓글','route','post/'+p.id,'class="ig-comment-link"')}${btn(state.igSaved.has(p.id)?'▣':'▢','save',p.id,`class="ig-save" aria-label="게시물 저장" aria-pressed="${state.igSaved.has(p.id)}"`)}<strong>좋아요 ${Number(p.likes||0)+(state.likes.has(key)?1:0)}개</strong><p><b>${esc(u.handle)}</b> ${esc(p.text)}</p><small>${esc(p.timestamp?date(p.timestamp):p.dateLabel||'날짜 미정')}</small>${detail?`<section class="ig-comments"><h3>댓글 ${comments.length}</h3>${comments.map(c=>`<article class="web-comment" data-ig-comment="${esc(c.id)}"><b>${esc(igPerson(c.userId).name)}</b><p>${esc(c.text)}</p><time>${esc(date(c.timestamp))}</time></article>`).join('')}</section>`:btn('댓글 '+comments.length+'개 보기','route','post/'+p.id,'class="ig-comment-link"')}</div></article>`;
}
export function renderInstagram(state,route){
 let body='';
 if(route==='dms')body=`<h2 class="ig-page-title">메시지</h2>${instagramDMs.map(dm=>{const u=igPerson(dm.userId);return btn(avatar(u)+'<span><strong>'+esc(u.name)+'</strong><small>'+esc(dm.messages.at(-1)?.text||'')+'</small></span>','route','dm/'+dm.id,'class="ig-dm-row"');}).join('')}`;
 else if(route.startsWith('dm/')){const dm=instagramDMs.find(d=>d.id===route.slice(3));body=dm?`<h2 class="ig-page-title">${esc(igPerson(dm.userId).name)}</h2>${dm.messages.map(m=>`<div class="ig-dm-message ${m.senderId==='yangyang'?'mine':''}"><p>${esc(m.text)}</p><time>${esc(date(m.timestamp))}</time></div>`).join('')}`:state.notFound();}
 else if(route.startsWith('profile/')){const id=route.slice(8),u=igPerson(id),posts=state.ig.filter(p=>p.userId===id);body=`<section class="ig-profile">${u.avatar?btn(avatar(u),'zoom',id,`data-src="${esc(u.avatar)}" data-alt="프로필 이미지" aria-label="프로필 사진 확대"`):avatar(u)}<div><strong>${posts.length}</strong><span>게시물</span></div><div><strong>${Number(u.followers||0)}</strong><span>팔로워</span></div><div><strong>${u.following===undefined?'—':Number(u.following)}</strong><span>팔로잉</span></div></section><section class="ig-bio"><h2>${esc(u.name)}</h2><p>@${esc(u.handle)}</p><p>${esc(u.bio||'')}</p></section><div class="ig-profile-label">게시물</div><div class="ig-grid">${posts.map(p=>btn(photo(igMedia(p)[0]||'assets/photo-placeholder.svg',p.alt||p.text),'route','post/'+p.id,`data-ig-grid-id="${esc(p.id)}" aria-label="${esc(p.text)}"`)).join('')}</div>`;}
 else if(route==='saved')body=`<h2 class="ig-page-title">저장됨</h2>${state.ig.filter(p=>state.igSaved.has(p.id)).map(p=>instagramCard(state,p)).join('')||'<p class="web-empty">저장한 게시물이 없습니다.</p>'}`;
 else if(route.startsWith('post/')){const p=state.ig.find(p=>p.id===route.slice(5));body=p?instagramCard(state,p,true):state.notFound();}
 else body=`<div class="ig-stories">${instagramUsers.map(u=>btn(avatar(igPerson(u.id))+'<span>'+esc(igPerson(u.id).name)+'</span>','route','profile/'+u.id)).join('')}</div>${state.ig.map(p=>instagramCard(state,p)).join('')}`;
 const zoom=state.zoom?`<section class="web-media-view ig-media-view" role="dialog" aria-modal="true" aria-label="사진 확대"><button data-web="zoom-close" aria-label="확대 사진 닫기">×</button><img src="${esc(state.zoom.src)}" alt="${esc(state.zoom.alt)}"><p>${esc(state.zoom.alt)}</p></section>`:'';
 return `<div class="app-shell web-social instagram-shell"><nav class="ig-header"><button data-action="back" aria-label="뒤로">${glyph.back}</button><strong>Instagram</strong>${btn('♧','route','dms','aria-label="DM 목록"')}</nav><div class="app-content web-page">${body}</div><nav class="ig-tabs">${btn('⌂<span>홈</span>','route','feed')}${btn('▦<span>프로필</span>','route','profile/yangyang')}${btn('▢<span>저장</span>','route','saved')}</nav>${zoom}</div>`;
}
