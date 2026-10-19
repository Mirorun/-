// Original Web Audio cues. Reuse the phone's gesture-unlocked context and cleanup.
export class SessionEffects {
  constructor(engine,host=document){
    this.engine=engine;this.seen=new Set();this.nextAt=0;this.lastTouch=-Infinity;this.played=0;
    this.touch=e=>{if(!e.target.closest?.('button,a')||e.target.closest('.motion-previous')||engine.phase)return;
      const ctx=engine.context;if(!ctx||ctx.state!=='running'||ctx.currentTime-this.lastTouch<.1)return;
      this.lastTouch=ctx.currentTime;engine.tone(420,0,.035,.006);
    };
    host.addEventListener('click',this.touch);this.host=host;
  }
  receive(event){
    if(!event?.id||this.seen.has(event.id))return false;
    this.seen.add(event.id);
    if(event.type!=='message'||event.silent||event.read)return false;
    const engine=this.engine,ctx=engine.context;
    // Never replay old alerts after unlocking audio, or mask a ringing phone.
    if(!ctx||ctx.state!=='running'||['ringing','connecting'].includes(engine.phase))return false;
    const at=Math.max(ctx.currentTime,this.nextAt);
    if(at-ctx.currentTime>2)return false;
    const delay=at-ctx.currentTime;
    const notes=event.channel==='kakao'?[[640,0,.09],[800,.13,.12],[640,.29,.08]]:[[880,0,.1],[1174,.13,.18]];
    for(const [hz,start,length] of notes)engine.tone(hz,delay+start,length,.023);
    this.nextAt=at+.65;this.played++;return true;
  }
  destroy(){this.host.removeEventListener('click',this.touch);this.seen.clear();}
}
