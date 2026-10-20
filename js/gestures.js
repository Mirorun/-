// Internal navigation only. Safari's system back gesture may take precedence.
// Native vertical scrolling and multi-touch are never cancelled at touchstart.
export class PhoneGestures{
 constructor(phone,h){this.phone=phone;this.h=h;this.g=null;this.running=false;this.suppressUntil=0;this.touchEvents='ontouchstart' in window;
  this.down=e=>{if(e.pointerType==='touch'&&this.touchEvents)return;this.begin(e.clientX,e.clientY,e.target,e.pointerId);if(this.g&&e.cancelable)e.preventDefault();};
  this.move=e=>{if(e.pointerType==='touch'&&this.touchEvents)return;if(this.track(e.clientX,e.clientY,e)){try{phone.setPointerCapture(e.pointerId);}catch{}}};
  this.up=e=>{if(e.pointerType==='touch'&&this.touchEvents)return;this.finish(e.clientX,e.clientY,e);};
  this.start=e=>{if(e.touches.length!==1){this.cancel();return;}const t=e.touches[0];this.begin(t.clientX,t.clientY,e.target,t.identifier);};
  this.touchmove=e=>{if(e.touches.length!==1){this.cancel();return;}const t=e.touches[0];this.track(t.clientX,t.clientY,e);};
  this.end=e=>{if(!this.g)return;const t=[...e.changedTouches].find(t=>t.identifier===this.g.id);if(t)this.finish(t.clientX,t.clientY,e);};
  this.cancelled=()=>this.cancel();this.click=e=>{if(e.detail!==0&&performance.now()<this.suppressUntil){e.preventDefault();e.stopImmediatePropagation();}};
  phone.addEventListener('pointerdown',this.down);phone.addEventListener('pointermove',this.move);phone.addEventListener('pointerup',this.up);phone.addEventListener('pointercancel',this.cancelled);
  phone.addEventListener('touchstart',this.start,{passive:true});phone.addEventListener('touchmove',this.touchmove,{passive:false});phone.addEventListener('touchend',this.end,{passive:false});phone.addEventListener('touchcancel',this.cancelled);
  phone.addEventListener('click',this.click,true);
 }
 begin(x,y,target,id){this.cancel();if(this.running||!this.h.allowed()||!target.closest)return;
  if(target.closest('footer,.status,input,textarea,select,button,a,[contenteditable=true],[data-media-gesture],.ig-carousel,.web-media-view,.call-layer,[role=dialog]'))return;
  const focus=document.activeElement;if(this.phone.contains(focus)&&focus.matches('input,textarea,select,[contenteditable=true]'))return;
  const b=this.phone.getBoundingClientRect(),left=x-b.left,bottom=b.bottom-y;
  const kind=bottom>=0&&bottom<=48?'home':left>=0&&left<=26?'back':null;
  if(kind)this.g={x,y,id,kind,width:b.width,time:performance.now(),locked:false};
 }
 track(x,y,event){const g=this.g;if(!g)return false;if(!this.h.allowed()){this.cancel();return false;}const dx=x-g.x,dy=y-g.y;
  const valid=g.kind==='back'?dx>8&&dx>Math.abs(dy)*1.6:-dy>8&&-dy>Math.abs(dx)*1.6;
  if(!g.locked&&!valid&&Math.hypot(dx,dy)>20){this.cancel();return false;}
  if(valid){if(!event.cancelable){this.cancel();return false;}event.preventDefault();g.locked=true;this.phone.classList.add('gesture-active');return true;}return false;
 }
 async finish(x,y,event){const g=this.g;this.cancel();if(!g||!g.locked||this.running||!this.h.allowed()||performance.now()-g.time>1600)return;
  const dx=x-g.x,dy=y-g.y,commit=g.kind==='back'?dx>=Math.max(64,Math.min(90,g.width*.2))&&dx>Math.abs(dy)*1.6:-dy>=70&&-dy>Math.abs(dx)*1.6;
  if(!commit)return;if(event.cancelable)event.preventDefault();this.suppressUntil=performance.now()+350;this.running=true;
  try{await (g.kind==='back'?this.h.back():this.h.home());}finally{this.running=false;}
 }
 cancel(){this.g=null;this.phone.classList.remove('gesture-active');}
 destroy(){this.cancel();const p=this.phone;p.removeEventListener('pointerdown',this.down);p.removeEventListener('pointermove',this.move);p.removeEventListener('pointerup',this.up);p.removeEventListener('pointercancel',this.cancelled);p.removeEventListener('touchstart',this.start);p.removeEventListener('touchmove',this.touchmove);p.removeEventListener('touchend',this.end);p.removeEventListener('touchcancel',this.cancelled);p.removeEventListener('click',this.click,true);}
}
