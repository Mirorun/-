import {esc} from './ui.js';
import {MusicApp} from './music/view.js';
import {CommunityApp} from './weverse/view.js';
import {ClockApp} from './clock/view.js';
import {WeatherApp} from './weather/view.js';
import {CameraApp} from './camera/view.js';
export class DeviceApps{
 constructor(screen,hooks){this.h=hooks;const h={...hooks,shell:(app,title,body,bottom='')=>`<div class="app-shell utility-shell utility-${app}"><nav class="utility-nav"><button data-action="back">‹ ${hooks.canBack()?'뒤로':'홈'}</button><strong>${esc(title)}</strong><span></span></nav><div class="app-content utility-content">${body}</div>${bottom}</div>`};this.music=new MusicApp(screen,h);this.weverse=new CommunityApp(screen,h);this.clock=new ClockApp(screen,h);this.weather=new WeatherApp(h);this.camera=new CameraApp(screen,h);}
 render(app,route){try{return this[app].render(route);}catch{return `<div class="app-shell utility-shell"><nav class="utility-nav"><button data-action="back">‹ 홈</button></nav><div class="app-content utility-content"><h2>데이터를 확인해 주세요.</h2><p>항목의 ID·날짜·시간대와 필수 필드를 확인해 주세요.</p></div></div>`;}}
 tick(){this.clock.tick();}
}
