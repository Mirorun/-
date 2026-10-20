import {PhoneGestures} from './gestures.js';
import {DeviceApps} from './device-apps.js';
import {SessionEffects} from './audio/effects.js';
import {storyClock} from './story-clock.js';
import {WebApps} from './web/view.js';
import {KakaoStore} from './kakao/store.js';
import {KakaoUI,renderKakao} from './kakao/view.js';
import {realtimeEvents} from './messaging/events.js';
import {SessionEvents} from './messaging/events-engine.js';
import {LibraryApps} from './library-apps.js';
import {PhoneStore} from './phone/store.js';
import {PhoneUI,renderPhoneScreen} from './phone/view.js';
import {CallUI} from './phone/call-ui.js';
import {clearLegacyProgress} from './session.js';
import {MessageStore} from './messages/store.js';
import {MessagesUI,renderMessagesScreen} from './messages/view.js';
import {appearance,apps,pages,lockScreen,pinScreen,homeScreen} from './display.js';
import {config} from './runtime-data.js';
import {esc} from './ui.js';
import {renderSettings} from './apps/personal.js';

import {AppNavigation} from './navigation.js';
import {ScreenTransitions} from './transitions.js';
import {notificationEvents} from './notification-data.js';
import {NotificationStore} from './notifications.js';
import {NotificationUI} from './notification-ui.js';
const screen=document.querySelector('#screen'),phone=document.querySelector('.phone'),home=document.querySelector('#home');
const navigation=new AppNavigation(),motion=new ScreenTransitions(screen),origins=new Map();
let state='lock',app=null,pin='',homePage=0,unlockTimer=null,quiet=true,pendingLink=null,queuedLink=null,needsRefresh=false,refreshQueued=false;
function announce(text){document.querySelector('#live').textContent=text;}
clearLegacyProgress();
// Reset query aliases remain compatible; every load is already a fresh run.
const params=new URLSearchParams(location.search);
if(params.has('resetMessages')||params.has('resetNotifications')){params.delete('resetMessages');params.delete('resetNotifications');history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);}
const messageStore=new MessageStore();
const kakaoStore=new KakaoStore();
const notifications=new NotificationStore(notificationEvents);
const noticeUI=new NotificationUI(phone,screen,notifications,{open:openNotification,reset:resetNotifications,announce,visibility:()=>queueMicrotask(flushNotifications)});
const messagesUI=new MessagesUI(screen,messageStore,{active:()=>state==='app'&&app==='messages'&&!callUI.isFull()?navigation.get(app).detail:undefined,busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull()});
const phoneStore=new PhoneStore();
const callUI=new CallUI(phone,screen,phoneStore,{changed:()=>syncOverlays(),busy:()=>motion.busy});
const effects=new SessionEffects(callUI.audio,phone);
const phoneUI=new PhoneUI(screen,phoneStore,{route:()=>navigation.get('phone'),navigate:detail=>navigate({detail}),tab:id=>{saveScroll();navigation.update('phone',{tab:id,detail:null,contact:null});navigation.apps.get('phone').stack=[];render();},refresh:()=>{saveScroll();render();},message:contact=>{if(contact){messageStore.ensureContact(contact);launchApp('messages',null,contact.messageThreadId||contact.id);}},busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull()});
const kakaoUI=new KakaoUI(screen,kakaoStore,{active:()=>state==='app'&&app==='kakao'&&!callUI.isFull()?navigation.get(app).detail:undefined,busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull(),navigate:id=>navigate({detail:id}),refresh:()=>{saveScroll();render();}});
const webApps=new WebApps(screen,{active:()=>state==='app'?app:null,busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull(),navigate:patch=>navigate(patch),refresh:()=>{navigation.saveScroll(app,screen.querySelector('.app-content'));render();}});
window.yangyangWeb=Object.freeze({getState:()=>structuredClone({tabs:webApps.browser.tabs,active:webApps.browser.active,history:webApps.browser.history,searches:webApps.browser.searches,favorites:webApps.browser.favorites,likes:[...webApps.likes],reposts:[...webApps.reposts],refreshes:webApps.refreshes})});
const libraryApps=new LibraryApps(screen,{active:()=>state==='app'?app:null,route:()=>navigation.get(app),busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull(),navigate:patch=>navigate(patch),replace:patch=>navigation.update(app,patch),refresh:()=>{saveScroll();render();},back});
const deviceApps=new DeviceApps(screen,{
 active:()=>state==='app'?app:null,route:()=>navigation.get(app),busy:()=>motion.busy||noticeUI.centerOpen||callUI.isFull(),canBack:()=>state==='app'&&navigation.canBack(app),
 navigate:patch=>navigate(patch),replace:patch=>navigation.update(app,patch),refresh:()=>{saveScroll();render();},
 root:patch=>{saveScroll();navigation.update(app,patch);navigation.apps.get(app).stack=[];render();},
 photos:()=>libraryApps.photos,capture:photo=>libraryApps.photos.unshift(photo),open:(id,detail)=>launchApp(id,null,detail),announce,
 notify:event=>notifications.publish({...event,type:'clock',appId:'clock',read:false})
});
window.yangyangDevice=Object.freeze({getState:()=>structuredClone({weverseLikes:[...deviceApps.weverse.likes],alarms:deviceApps.clock.store.alarms,stopwatch:{elapsed:deviceApps.clock.store.stopwatchMs(),running:deviceApps.clock.store.stopwatch.startedAt!==null},timer:{...deviceApps.clock.store.timer,remaining:deviceApps.clock.store.timerMs()},camera:{facing:deviceApps.camera.facing,zoom:deviceApps.camera.zoom,flash:deviceApps.camera.flash,captures:deviceApps.camera.sequence},photoCount:libraryApps.photos.length,storyNow:storyClock.now()})});
function syncOverlays(){callUI.sync(state,motion.busy,noticeUI.centerOpen);noticeUI.suspended=callUI.priority()||(state==='app'&&['messages','kakao'].includes(app)&&needsRefresh);noticeUI.sync(state,motion.busy);if(typeof centerButton!=='undefined')centerButton.disabled=state==='pin'||callUI.isFull();}
phoneStore.subscribe(({kind})=>{if(state==='app'&&app==='phone'&&!motion.busy&&['logs','contacts','ended','dismissed'].includes(kind)){saveScroll();render();}else syncOverlays();queueMicrotask(flushNotifications);});
window.yangyangPhone=Object.freeze({incoming:(id='kwon-jinwoo',options={})=>phoneStore.incoming(id,options),getState:()=>structuredClone({call:phoneStore.call,logs:phoneStore.logs,contacts:phoneStore.contacts,voicemails:phoneStore.voicemails})});
const centerButton=document.createElement('button');centerButton.className='center-handle';centerButton.setAttribute('aria-label','알림 센터 열기');document.querySelector('.status').append(centerButton);
centerButton.addEventListener('click',()=>{if(!motion.busy){if(noticeUI.centerOpen)noticeUI.closeCenter();else noticeUI.openCenter();}});
function visibleThread(appId,id){return state==='app'&&app===appId&&navigation.get(app).detail===id&&!noticeUI.centerOpen&&!motion.busy&&!callUI.isFull();}
function syncMessageData(){
 let changed=false;
 for(const event of notifications.records({includeDeleted:true}).filter(e=>e.type==='message')){
 const store=event.appId==='kakao'?kakaoStore:event.appId==='messages'?messageStore:null;if(!store)continue;
 const read=event.read||visibleThread(event.appId,event.threadId);if(read&&!event.read)notifications.markRead(event.id);
 changed=store.receiveEvent({...event,read})||changed;
 }
 for(const [appId,store] of [['messages',messageStore],['kakao',kakaoStore]])for(const {thread,message,read} of store.replies()){
 if(message.noticePublished)continue;notifications.publish({id:message.id,type:'message',channel:store.channel,senderId:thread.id,senderName:thread.name,message:message.text,appId,threadId:thread.id,sourceMessageId:message.id,read:read||visibleThread(appId,thread.id)},message.receivedAt);store.markNotified(message.id);
 }
 return changed;
}
const sessionEvents=new SessionEvents(realtimeEvents,event=>{
 const store=event.channel==='kakao'?kakaoStore:messageStore,appId=event.channel==='kakao'?'kakao':'messages';
 if(!store.base(event.senderId)){const contact=phoneStore.contacts.find(c=>c.id===event.senderId);if(contact)store.ensureContact(contact);}
 const thread=store.thread(event.senderId);if(!thread)return;
 notifications.publish({id:event.id,type:'message',channel:event.channel,senderId:event.senderId,senderName:thread.name,message:event.text,appId,threadId:event.senderId,read:visibleThread(appId,event.senderId),silent:!event.notificationEnabled},event.dueAt||Date.now());
});
window.yangyangRealtime=Object.freeze({cancel:id=>{sessionEvents.cancel(id);notifications.cancel(id);},getState:()=>({fired:[...sessionEvents.fired],cancelled:[...sessionEvents.cancelled]}),catchUp:()=>{sessionEvents.catchUp();notifications.catchUp();}});
window.yangyangKakao=Object.freeze({getState:()=>structuredClone({threads:kakaoStore.list(),jobs:kakaoStore.state.jobs}),reset:()=>location.reload()});
function saveScroll(){if(state==='app'){navigation.saveScroll(app,screen.querySelector('.app-content'));webApps.save();}}
function render(){
  messagesUI.viewport();kakaoUI.viewport();
  phone.dataset.state=state;phone.classList.toggle('wallpaper',state==='home');
  centerButton.disabled=state==='pin';
  if(state==='lock')screen.innerHTML=lockScreen(storyClock.date());
  else if(state==='pin')screen.innerHTML=pinScreen(pin);
  else if(state==='home')screen.innerHTML=homeScreen(homePage,messageStore.unread(),kakaoStore.unread());
  else {
    if(['music','weverse','clock','weather','camera'].includes(app)){screen.innerHTML=deviceApps.render(app,navigation.get(app));navigation.restoreScroll(app,screen.querySelector('.app-content'));updateStoryDisplay();syncOverlays();return;}
    if(app==='messages'){
      const id=navigation.get(app).detail;screen.innerHTML=renderMessagesScreen(messageStore,id,messagesUI.query);navigation.restoreScroll(app,screen.querySelector('.app-content'));messagesUI.afterRender();if(id&&!noticeUI.centerOpen&&!callUI.isFull())notifications.markThreadRead('messages',id);syncOverlays();return;
    }
    if(['safari','sns','instagram'].includes(app)){screen.innerHTML=webApps.render(app,navigation.get(app));if(app!=='safari')navigation.restoreScroll(app,screen.querySelector('.app-content'));webApps.afterRender();syncOverlays();return;}
    if(app==='kakao'){const id=navigation.get(app).detail;screen.innerHTML=renderKakao(kakaoStore,id,kakaoUI);navigation.restoreScroll(app,screen.querySelector('.app-content'));kakaoUI.afterRender();if(id&&!noticeUI.centerOpen&&!callUI.isFull())notifications.markThreadRead('kakao',id);syncOverlays();return;}
    if(app==='phone'){screen.innerHTML=renderPhoneScreen(phoneStore,navigation.get(app),phoneUI.query);navigation.restoreScroll(app,screen.querySelector('.app-content'));syncOverlays();return;}
    if(['photos','notes','calendar','kakao'].includes(app)){screen.innerHTML=libraryApps.render(app,navigation.get(app));navigation.restoreScroll(app,screen.querySelector('.app-content'));syncOverlays();return;}
    const route=navigation.get(app),{detail,contact,tab}=route,a=apps.find(x=>x[0]===app);let content='';
    switch(app){case'settings':content=renderSettings(detail,quiet);break;default:content='<h2>'+esc(a[1])+'</h2><p class="subtitle">이 앱은 이번 단계에서 아이콘과 배치만 준비했습니다.</p>';}
    screen.innerHTML=`<div class="app-shell"><nav class="toolbar"><button class="back" data-action="back">‹ ${navigation.canBack(app)?'목록':'홈'}</button><span class="app-title">${esc(a[1])}</span></nav><div class="app-content ${app==='notes'?'note-body':''}">${content}</div></div>`;
    navigation.restoreScroll(app,screen.querySelector('.app-content'));
    if(app==='messages'&&detail)notifications.markThreadRead('messages',detail);
    screen.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.parentElement.textContent=img.dataset.fallback;},{once:true}));
  }
  updateStoryDisplay();syncOverlays();
}
function iconOrigin(id,button){
  if(button){const area=button.closest('.dock')?'dock':button.classList.contains('widget')?'widget':'apps';return {page:homePage,area,rect:motion.rect(button.querySelector('.app-icon')||button)};}
  const wrapper=document.createElement('div');wrapper.className='origin-home-measure';screen.append(wrapper);
  for(const page of [homePage,...pages.map((_,i)=>i).filter(i=>i!==homePage)]){
    wrapper.innerHTML=homeScreen(page,0);
    const element=wrapper.querySelector(`.dock [data-action="open:${id}"] .app-icon`)||wrapper.querySelector(`[data-action="open:${id}"] .app-icon`);
    if(element){const origin={page,area:element.closest('.dock')?'dock':'apps',rect:motion.rect(element)};wrapper.remove();return origin;}
  }
  wrapper.remove();return {page:homePage,area:'apps',rect:null};
}
async function transition(kind,change,origin){
  if(motion.busy)return;
  await motion.run(kind,()=>{change();render();},origin);
  if(noticeUI.centerOpen)screen.inert=true;
  flushNotifications();
  if(state==='app'){const heading=screen.querySelector('h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
  if(queuedLink){const id=queuedLink;queuedLink=null;await openNotification(id);}
}
async function launchApp(id,button=null,threadId=null){
  if(motion.busy)return;
  saveScroll();const wasHome=state==='home',sameApp=state==='app'&&app===id;
  if(sameApp&&threadId&&navigation.get(app).detail===threadId){notifications.markThreadRead(id,threadId);render();return;}
  const origin=sameApp?origins.get(id):iconOrigin(id,button);if(!sameApp)origins.set(id,origin);
  await transition(wasHome?'open':'forward',()=>{app=id;state='app';if(threadId)navigation.thread(id,threadId);announce(apps.find(a=>a[0]===id)[1]+' 열림');},origin?.rect);
}
async function goHome(){
  if(motion.busy)return;if(callUI.isFull()){if(!callUI.minimize())return;}
  if(noticeUI.centerOpen){noticeUI.closeCenter();return;}
  if(state==='lock'){state='pin';pin='';render();return;}
  if(state==='pin'){state='lock';pin='';pendingLink=null;render();return;}
  if(state!=='app')return;
  saveScroll();const closingApp=app,origin=origins.get(app)||{page:homePage,area:'dock'};
  homePage=origin.page;
  // Re-measure the remembered source on the destination page, also after resize.
  const wrapper=document.createElement('div');wrapper.className='origin-home-measure';wrapper.innerHTML=homeScreen(homePage,0);screen.append(wrapper);
  const selector=origin.area==='widget'?'.widget':`.${origin.area} [data-action="open:${closingApp}"] .app-icon`;
  const target=wrapper.querySelector(selector);const rect=target?motion.rect(target):origin.rect;wrapper.remove();
  await transition('close',()=>{state='home';app=null;},rect);
  const focus=screen.querySelector(`.${origin.area} [data-action="open:${closingApp}"]`);focus?.focus({preventScroll:true});
}
async function navigate(patch,kind='forward'){
  if(motion.busy||state!=='app')return;saveScroll();if(app==='messages'){const area=screen.querySelector('.msg-timeline');const id=navigation.get(app).detail;if(area&&id)messagesUI.positions.set(id,area.scrollTop);}
  await transition(kind,()=>{if(kind==='back')navigation.back(app);else navigation.push(app,patch);});
}
async function back(){if(webApps.zoom){webApps.zoom=null;render();return;}if(state==='app'&&app==='photos'&&libraryApps.photoZoom){libraryApps.photoZoom=false;render();return;}if(callUI.isFull()){callUI.minimize();return;}if(state==='app'&&app==='safari'&&webApps.back())return;if(state==='app'&&navigation.canBack(app))await navigate(null,'back');else await goHome();}
function key(n){if(callUI.isFull())return;if(unlockTimer||motion.busy||noticeUI.centerOpen)return;if(n==='⌫')pin=pin.slice(0,-1);else if(pin.length<6)pin+=n;render();if(pin.length===6)unlockTimer=setTimeout(async()=>{unlockTimer=null;if(state!=='pin')return;state='home';pin='';render();announce('잠금 해제되었습니다.');if(pendingLink){const id=pendingLink;pendingLink=null;await openNotification(id);}else flushNotifications();},200);}
async function openNotification(id){
  const event=notifications.records().find(e=>e.id===id);if(!event)return;
  if(motion.busy){queuedLink=id;return;}
  if(state==='lock'||state==='pin'){pendingLink=id;state='pin';pin='';render();return;}
  if(event.appId==='clock'&&event.clockTab){navigation.update('clock',{tab:event.clockTab,detail:null});navigation.apps.get('clock').stack=[];}
  await launchApp(event.appId,null,['messages','kakao'].includes(event.appId)?event.threadId:null);
  notifications.markRead(id);syncOverlays();
}
function resetNotifications(){location.reload();}
function flushNotifications(){
 if(motion.busy)return;const changed=syncMessageData();if(state==='app'&&['messages','kakao'].includes(app)&&callUI.isFull()){needsRefresh=needsRefresh||changed;syncOverlays();return;}
 if(needsRefresh&&state==='home')render();
 if((needsRefresh||changed)&&state==='app'&&app==='kakao'&&!noticeUI.centerOpen){const id=navigation.get(app).detail;kakaoUI.update('received',id);if(id){kakaoStore.markRead(id);notifications.markThreadRead('kakao',id);}}
 else if((needsRefresh||changed)&&state==='app'&&app==='messages'&&!noticeUI.centerOpen){const id=navigation.get(app).detail;messagesUI.update('received',id);if(id){messageStore.markRead(id);notifications.markThreadRead('messages',id);}}
 needsRefresh=false;syncOverlays();
}
messageStore.subscribe(({kind,threadId})=>{
 needsRefresh=true;
 if(!motion.busy&&!noticeUI.centerOpen&&!callUI.isFull()&&state==='app'&&app==='messages'){messagesUI.update(kind,threadId);if(navigation.get(app).detail===threadId)notifications.markThreadRead('messages',threadId);}
 if(!refreshQueued){refreshQueued=true;queueMicrotask(()=>{refreshQueued=false;flushNotifications();});}
});
kakaoStore.subscribe(({kind,threadId})=>{needsRefresh=true;if(!motion.busy&&!noticeUI.centerOpen&&!callUI.isFull()&&state==='app'&&app==='kakao'){kakaoUI.update(kind,threadId);if(navigation.get(app).detail===threadId)notifications.markThreadRead('kakao',threadId);}if(!refreshQueued){refreshQueued=true;queueMicrotask(()=>{refreshQueued=false;flushNotifications();});}});
function resetMessages(){location.reload();}
window.yangyangMessages=Object.freeze({reset:resetMessages,getState:()=>JSON.parse(JSON.stringify(messageStore.state))});
notifications.subscribe(({reason,id})=>{
  if(reason==='arrival'){const event=notifications.records().find(e=>e.id===id);if(event)effects.receive(event);}
  needsRefresh=true;
  if(!refreshQueued){refreshQueued=true;queueMicrotask(()=>{refreshQueued=false;flushNotifications();});}
});
// A small, documented development API; no storage-wide clear is used.
window.yangyangNotifications=Object.freeze({reset:resetNotifications,getState:()=>JSON.parse(JSON.stringify(notifications.state))});
screen.addEventListener('click',async e=>{
  if(motion.busy||noticeUI.centerOpen)return;const button=e.target.closest('[data-action]');if(!button||button.closest('.motion-previous'))return;
  const [action,value]=button.dataset.action.split(':');
  switch(action){
    case'page':homePage=Number(value);render();return;
    case'pininfo':screen.querySelector('.pin-info').textContent='시뮬레이터에서는 긴급전화를 연결하지 않습니다.';return;
    case'unlock':state='pin';pin='';render();return;
    case'key':if(e.detail===0)key(value);return;
    case'lock':saveScroll();state='lock';pin='';render();return;
    case'open':await launchApp(value,button);return;
    case'back':await back();return;
    case'detail':await navigate({detail:['messages','settings'].includes(app)?value:Number(value)});return;
    case'contact':await navigate({contact:value});return;
    case'openmessage':await launchApp('messages',null,value);return;
    case'tab':saveScroll();navigation.update(app,{tab:value});render();return;
    case'quiet':quiet=!quiet;break;
    case'day':announce(`7월 ${value}일, 일정이 없습니다.`);screen.querySelector('#day-info')?.remove();screen.querySelector('.calendar').insertAdjacentHTML('afterend',`<p id="day-info" class="subtitle">7월 ${value}일 · 일정 없음</p>`);return;
  }
  saveScroll();render();
});
function updateStoryDisplay(){const status=phone.querySelector('.status>span:first-child');if(status)status.textContent=storyClock.time();screen.querySelectorAll('[data-story-time]').forEach(el=>{el.textContent=storyClock.time();el.setAttribute('aria-label',storyClock.time());});screen.querySelectorAll('[data-story-date]').forEach(el=>el.textContent=storyClock.date());const alarm=screen.querySelector('[data-alarm-summary]');if(alarm)alarm.textContent=deviceApps.clock.store.alarms.some(a=>a.enabled)?'알람 켜짐':'알람 없음';}
setInterval(()=>{deviceApps.tick();updateStoryDisplay();},100);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){deviceApps.tick();updateStoryDisplay();}});
/* Only the footer owns app home gestures; ordinary app scrolling is untouched. */
let gesture=null,suppressClick=false,lastPointerType='mouse';
phone.addEventListener('pointerdown',e=>{
  suppressClick=false;lastPointerType=e.pointerType;if(motion.busy)return;
  const bounds=phone.getBoundingClientRect();let kind=null;
  if(e.target.closest('footer'))kind=noticeUI.centerOpen?'center-close':state==='app'?'app-home':state==='lock'?'unlock':null;
  else if(e.target.closest('.status')&&state!=='pin')kind='center';
  else if(!noticeUI.centerOpen&&state==='lock'&&e.target.closest('.lock'))kind='unlock';
  else if(!noticeUI.centerOpen&&state==='home'&&e.target.closest('.home-screen'))kind='page';
  if(!kind)return;
  gesture={x:e.clientX,y:e.clientY,kind,pointerId:e.pointerId,height:bounds.height};
  // Capture only custom gesture areas; app content keeps native scrolling.
  e.target.setPointerCapture?.(e.pointerId);
});
phone.addEventListener('pointermove',e=>{if(gesture?.kind==='unlock')screen.style.setProperty('--drag-y',Math.min(Math.max(0,gesture.y-e.clientY)*.35,80)+'px');});
phone.addEventListener('pointerup',async e=>{
  if(motion.busy){gesture=null;return;}
  if(state==='pin'&&!noticeUI.centerOpen){const target=e.target.closest('[data-action^="key:"]');if(target){e.preventDefault();key(target.dataset.action.slice(4));}gesture=null;return;}
  if(!gesture)return;const g=gesture;gesture=null;const dx=e.clientX-g.x,dy=e.clientY-g.y;screen.style.removeProperty('--drag-y');const vertical=Math.abs(dy)>Math.abs(dx)*1.2;
  if(Math.hypot(dx,dy)>10)suppressClick=true;
  if(g.kind==='center'&&vertical&&dy>48)noticeUI.openCenter();
  else if(g.kind==='center-close'&&vertical&&dy<-48)noticeUI.closeCenter();
  else if(g.kind==='unlock'&&vertical&&dy<-48){state='pin';pin='';render();}
  else if(g.kind==='app-home'&&vertical&&dy<-Math.max(48,Math.min(72,g.height*.07)))await goHome();
  else if(g.kind==='page'&&Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.2){homePage=Math.max(0,Math.min(1,homePage+(dx<0?1:-1)));render();}
  if(suppressClick)setTimeout(()=>suppressClick=false,0);
});
phone.addEventListener('pointercancel',()=>{gesture=null;screen.style.removeProperty('--drag-y');});
phone.addEventListener('click',e=>{if(suppressClick){e.stopImmediatePropagation();e.preventDefault();}},true);
home.addEventListener('click',e=>{if(e.detail===0||(e.pointerType||lastPointerType)!=='touch')goHome();});
document.addEventListener('keydown',e=>{if(motion.busy)return;if(callUI.isFull()){if(e.key==='Escape'){e.preventDefault();callUI.minimize();}return;}if(e.key==='Escape'){e.preventDefault();if(noticeUI.centerOpen)noticeUI.closeCenter();else back();}else if(state==='pin'&&(/^\d$/.test(e.key)||e.key==='Backspace')){e.preventDefault();key(e.key==='Backspace'?'⌫':e.key);}});
window.addEventListener('resize',()=>{for(const animation of motion.animations)animation.cancel();});
phone.style.setProperty('--home-wallpaper','url("'+new URL(appearance.wallpaper,document.baseURI).href.replaceAll('"','%22')+'")');
const phoneGestures=new PhoneGestures(phone,{allowed:()=>state==='app'&&!motion.busy&&!noticeUI.centerOpen&&!callUI.isFull()&&!webApps.zoom,back,home:goHome});
syncMessageData();render();notifications.start();messageStore.start();kakaoStore.start();sessionEvents.start();phoneStore.startEvents();

// A BFCache restoration resumes a previous document; reload for a fresh visit.
window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
