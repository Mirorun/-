import {planKakaoReply} from './replies.js';
import {MessageStore} from '../messages/store.js';
import {chats,people} from './data.js';
export class KakaoStore extends MessageStore{
 constructor(){super({channel:'kakao',rules:{manager:{enabled:true}},seeds:chats.filter(c=>c&&typeof c.id==='string'&&typeof c.name==='string').map(c=>({...c,avatar:people[(c.members||[]).find(x=>x!=='yangyang')]?.avatar||null,draft:typeof c.draft==='string'?c.draft:'',autoReply:false,sortOrder:0,messages:(Array.isArray(c.messages)?c.messages:[]).filter(m=>m&&typeof m.text==='string').map(m=>({...m,side:m.senderId==='yangyang'?'out':'in',at:m.timestamp,channel:'kakao'}))}))});this.preserveHistoryOrder=true;this.preserveSentText=true;for(const id of ['member','yujin','yeonwoo','daon'])this.ensureSender(id);}
 planReply(thread,sent){return planKakaoReply(thread,sent,this.state.story);}
 ensureSender(id){if(this.base(id))return true;const p=people[id];if(!p)return false;this.ensureContact({id,name:p.name,avatar:p.avatar});this.base(id).autoReply=!!this.rules[id]?.enabled;return true;}
}
