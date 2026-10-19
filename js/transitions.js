const ease='cubic-bezier(.22,.78,.18,1)';
export class ScreenTransitions {
  constructor(screen){this.screen=screen;this.busy=false;this.animations=[];}
  rect(element){const a=element.getBoundingClientRect(),b=this.screen.getBoundingClientRect();return {x:a.left-b.left,y:a.top-b.top,width:a.width,height:a.height};}
  snapshot(){const original=this.screen.firstElementChild;if(!original)return null;const node=original.cloneNode(true);node.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));node.removeAttribute('id');node.setAttribute('aria-hidden','true');node.inert=true;const sources=original.querySelectorAll('.app-content');node._motionScroll=[...sources].map(x=>x.scrollTop);return node;}
  async run(kind,render,origin){
    if(this.busy)return false;
    this.busy=true;this.screen.inert=true;this.screen.closest('.phone').dataset.transition=kind;
    let previous=null;
    try {
      previous=this.snapshot();render();const current=this.screen.firstElementChild;
      if(!current)return true;
      // Reduced motion commits the same state without scaling or sliding.
      if(matchMedia('(prefers-reduced-motion: reduce)').matches||!current.animate)return true;
      if(previous){previous.classList.add('motion-previous');this.screen.append(previous);previous.querySelectorAll('.app-content').forEach((el,i)=>el.scrollTop=previous._motionScroll?.[i]||0);if(previous.classList.contains('home-screen'))previous.classList.add('motion-home');}
      const play=(el,frames,options)=>{if(!el)return;const animation=el.animate(frames,{duration:380,easing:ease,fill:'both',...options});this.animations.push(animation);};
      const bounds=this.screen.getBoundingClientRect();
      const r=origin||{x:bounds.width*.45,y:bounds.height*.88,width:bounds.width*.15,height:bounds.width*.15};
      const small=`translate(${r.x}px,${r.y}px) scale(${r.width/bounds.width},${r.height/bounds.height})`;
      if(kind==='open'){
        current.classList.add('motion-current');current.style.transformOrigin='0 0';
        play(previous,[{transform:'scale(1)',filter:'brightness(1)'},{transform:'scale(.95)',filter:'brightness(.7)'}]);
        play(current,[{transform:small,borderRadius:'22%',opacity:.7},{opacity:1,offset:.2},{transform:'none',borderRadius:'0px',opacity:1}],{duration:410});
      }else if(kind==='close'){
        current.classList.add('motion-home');
        play(current,[{transform:'scale(.95)',filter:'brightness(.7)'},{transform:'none',filter:'brightness(1)'}]);
        if(previous){previous.style.zIndex='4';previous.style.transformOrigin='0 0';}
        play(previous,[{transform:'none',borderRadius:'0px',opacity:1},{opacity:1,offset:.7},{transform:small,borderRadius:'22%',opacity:0}],{duration:360});
      }else if(kind==='forward'){
        current.classList.add('motion-current');
        play(previous,[{transform:'translateX(0)',filter:'brightness(1)'},{transform:'translateX(-25%)',filter:'brightness(.85)'}],{duration:320});
        play(current,[{transform:'translateX(100%)'},{transform:'translateX(0)'}],{duration:320});
      }else if(kind==='back'){
        if(previous)previous.style.zIndex='4';
        play(current,[{transform:'translateX(-25%)',filter:'brightness(.85)'},{transform:'translateX(0)',filter:'brightness(1)'}],{duration:320});
        play(previous,[{transform:'translateX(0)'},{transform:'translateX(100%)'}],{duration:320});
      }
      await Promise.all(this.animations.map(x=>x.finished.catch(()=>{})));
      return true;
    }finally{
      for(const animation of this.animations)animation.cancel();this.animations=[];
      previous?.remove();const current=this.screen.firstElementChild;
      current?.classList.remove('motion-current','motion-home');if(current)current.style.transformOrigin='';
      this.screen.inert=false;this.busy=false;delete this.screen.closest('.phone').dataset.transition;
    }
  }
}
