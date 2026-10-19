import {favorites} from './news-data.js';
export class BrowserStore{
 constructor(){this.serial=0;this.tabs=[];this.active=null;this.history=[];this.searches=[];this.favorites=structuredClone(favorites);this.panel=null;this.newTab();}
 tab(){return this.tabs.find(t=>t.id===this.active);}
 entry(){const t=this.tab();return t.entries[t.index];}
 normalize(value){let s=String(value||'').trim();if(!s)return 'about:start';if(s==='about:start'||s.startsWith('search:'))return s;if(s.startsWith('http://')||s.startsWith('https://')){try{const u=new URL(s);return u.host+u.pathname+u.search;}catch{return s;}}if(/^(news|x)\.example\/?$/.test(s))return s.replace(/\/$/,'')+'/';if(s.includes('.')||s.includes(':')||s.includes('/'))return s;this.searches.unshift(s);this.searches=[...new Set(this.searches)].slice(0,100);return 'search:'+encodeURIComponent(s);}
 visit(value){const url=this.normalize(value),t=this.tab();t.entries=t.entries.slice(0,t.index+1);t.entries.push({url,scroll:0});t.index++;this.panel=null;this.history.unshift({id:'visit-'+(++this.serial),url});this.history=this.history.slice(0,200);return url;}
 newTab(url='about:start'){const id='tab-'+(++this.serial);this.tabs.push({id,index:0,entries:[{url,scroll:0}]});this.active=id;this.panel=null;return id;}
 close(id){const i=this.tabs.findIndex(t=>t.id===id);if(i<0)return;this.tabs.splice(i,1);if(!this.tabs.length)this.newTab();else if(this.active===id)this.active=this.tabs[Math.min(i,this.tabs.length-1)].id;}
 select(id){if(this.tabs.some(t=>t.id===id)){this.active=id;this.panel=null;}}
 go(delta){const t=this.tab();if(t.index+delta<0||t.index+delta>=t.entries.length)return false;t.index+=delta;this.panel=null;return true;}
 favorite(){const url=this.entry().url;if(url==='about:start')return;if(this.favorites.some(f=>f.url===url))this.favorites=this.favorites.filter(f=>f.url!==url);else this.favorites.push({title:url,url});}
}
