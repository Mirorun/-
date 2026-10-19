import {esc} from '../ui.js';
import {songs,albums,playlists} from './data.js';
import {jpopSongs,jpopAlbums,jpopPlaylists} from './jpop-data.js';
const cover=(art,cls='')=>`<img class="music-art ${cls}" src="${esc(art||'assets/music-artwork.svg')}" alt="음악 보관함 커버">`;
const duration=n=>Number.isFinite(n)&&n>=0?Math.floor(n/60)+':'+String(Math.floor(n%60)).padStart(2,'0'):'—';
export function youtubeLink(value){try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password)return null;if(u.hostname==='youtu.be'&&/^\/[\w-]{11}$/.test(u.pathname))return u.href;if(['www.youtube.com','youtube.com','m.youtube.com'].includes(u.hostname)&&((u.pathname==='/watch'&&/^[\w-]{11}$/.test(u.searchParams.get('v')||''))||/^\/(shorts|embed)\/[\w-]{11}$/.test(u.pathname)))return u.href;}catch{}return null;}
export function officialLink(song){const video=youtubeLink(song?.youtubeUrl);if(video)return video;try{const u=new URL(song?.officialUrl);if(u.protocol==='https:'&&!u.username&&!u.password&&u.hostname==='nex-tone.link'&&/^\/A\d+$/.test(u.pathname))return u.href;}catch{}return null;}
export class MusicApp{
 constructor(screen,h){this.screen=screen;this.h=h;this.query='';this.recent=[];this.songs=structuredClone([...jpopSongs,...songs]);this.albums=structuredClone([...jpopAlbums,...albums]);this.playlists=structuredClone([...jpopPlaylists,...playlists]);
 screen.addEventListener('submit',e=>{if(!e.target.matches('.music-search')||this.h.active()!=='music')return;e.preventDefault();if(this.h.busy())return;this.query=new FormData(e.target).get('q').toString().trim();this.h.refresh();});
 screen.addEventListener('click',e=>{const b=e.target.closest('[data-music]');if(!b||b.closest('.motion-previous')||this.h.active()!=='music'||this.h.busy())return;const id=b.dataset.id,action=b.dataset.music;
 if(action==='route')this.h.navigate({detail:id});
 if(action==='listen'){const song=this.songs.find(s=>s.id===id);if(officialLink(song))this.remember(id);}
 if(action==='song'){const route=this.h.route(),list=route.detail?.startsWith('playlist/')?this.songs.filter(s=>s.playlistIds.includes(route.detail.slice(9))):route.detail?.startsWith('album/')?this.songs.filter(s=>s.albumId===route.detail.slice(6)):this.filtered();
  const song=this.songs.find(s=>s.id===id),url=officialLink(song);
  // A direct user click opens the official page, before any async transition.
  if(url){window.open(url,'_blank','noopener,noreferrer');this.remember(id);}
  this.h.navigate({detail:'now/'+id,queue:list.map(s=>s.id)});
 }
 if(action==='step'){const r=this.h.route(),q=r.queue||this.songs.map(s=>s.id),i=q.indexOf(r.detail.slice(4)),next=q[(i+Number(id)+q.length)%q.length];if(next){this.h.replace({detail:'now/'+next});this.h.refresh();}}
 });screen.addEventListener('error',e=>{if(e.target.matches('.music-art')&&e.target.getAttribute('src')!=='assets/music-artwork.svg')e.target.src='assets/music-artwork.svg';},true);}
 remember(id){this.recent=[id,...this.recent.filter(x=>x!==id)].slice(0,20);}
 filtered(){const q=this.query.toLocaleLowerCase();return this.songs.filter(s=>[s.title,s.artist,s.album].some(t=>String(t).toLocaleLowerCase().includes(q)));}
 list(list){return `<div class="music-songs">${list.map((s,i)=>`<button data-music="song" data-id="${esc(s.id)}">${cover(s.artwork)}<span><strong>${esc(s.title)}</strong><small>${esc(s.artist)}</small></span><time>${duration(s.duration)}</time><b>›</b></button>`).join('')||'<p>곡이 없습니다.</p>'}</div>`;}
 render(route){const detail=route.detail||'',isNow=detail.startsWith('now/');let body='';if(isNow){const s=this.songs.find(s=>s.id===detail.slice(4));if(!s)return this.h.shell('music','음악','<p>곡을 찾을 수 없습니다.</p>');const url=officialLink(s);body=`<div class="music-now">${cover(s.artwork,'music-large')}<h2>${esc(s.title)}</h2><p>${esc(s.artist)}</p><small>${esc(s.album)}</small><div class="music-transport"><button data-music="step" data-id="-1" aria-label="이전 곡">◀◀</button>${url?`<a class="music-play" data-music="listen" data-id="${esc(s.id)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="공식 페이지에서 듣기">▶</a>`:'<button disabled aria-label="재생 링크 없음">▶</button>'}<button data-music="step" data-id="1" aria-label="다음 곡">▶▶</button></div>${url?`<a class="music-youtube" data-music="listen" data-id="${esc(s.id)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${youtubeLink(s.youtubeUrl)?'YouTube에서 듣기':'공식 음원 페이지'} ↗</a>`:'<button class="music-youtube" disabled>등록된 링크 없음</button>'}</div>`;}
else if(detail==='playlists')body=`<h2>플레이리스트</h2><div class="music-grid">${this.playlists.map(p=>`<button data-music="route" data-id="playlist/${esc(p.id)}">${cover(p.artwork)}<strong>${esc(p.title)}</strong><small>${esc(p.description)}</small></button>`).join('')}</div>`;
else if(detail==='albums')body=`<h2>앨범</h2><div class="music-grid">${this.albums.map(a=>`<button data-music="route" data-id="album/${esc(a.id)}">${cover(a.artwork)}<strong>${esc(a.title)}</strong><small>${esc(a.artist)}</small></button>`).join('')}</div>`;
else if(detail.startsWith('playlist/')||detail.startsWith('album/')){const playlist=detail.startsWith('playlist/'),item=(playlist?this.playlists:this.albums).find(x=>x.id===detail.slice(playlist?9:6));body=item?`<div class="music-collection">${cover(item.artwork)}<h2>${esc(item.title)}</h2><p>${esc(item.description||item.artist)}</p></div>${this.list(this.songs.filter(s=>playlist?s.playlistIds.includes(item.id):s.albumId===item.id))}`:'<p>보관함 항목이 없습니다.</p>';}
else if(detail==='songs')body=`<h2>노래</h2>${this.search()}${this.list(this.filtered())}`;
else if(detail==='recent')body=`<h2>최근 재생</h2>${this.list(this.recent.map(id=>this.songs.find(s=>s.id===id)).filter(Boolean))}`;
else body=`<h2>보관함</h2>${this.search()}${this.query?this.list(this.filtered()):`<nav class="music-library-nav">${[['playlists','플레이리스트'],['albums','앨범 및 아티스트'],['songs','노래'],['recent','최근 재생']].map(([id,name])=>`<button data-music="route" data-id="${id}"><span>♫</span>${name}<b>›</b></button>`).join('')}</nav><h3>자주 찾는 플레이리스트</h3><div class="music-grid">${this.playlists.slice(0,4).map(a=>`<button data-music="route" data-id="playlist/${esc(a.id)}">${cover(a.artwork)}<strong>${esc(a.title)}</strong><small>${esc(a.description)}</small></button>`).join('')}</div>`}`;
return this.h.shell('music',isNow?'지금 재생 중':'음악',body);}
 search(){return `<form class="music-search" role="search"><label class="sr-only" for="music-query">노래·아티스트·앨범 검색</label><input id="music-query" name="q" value="${esc(this.query)}" placeholder="노래, 아티스트, 앨범" type="search"><button>검색</button></form>`;}
}
