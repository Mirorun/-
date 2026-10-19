// Original synthesized call cues, never service recordings. No audio permission prompt.
export class PhoneAudio{
 constructor(){this.context=null;this.phase=null;this.loop=null;this.voices=new Set();this.call=null;this.key='';
  this.unlock=()=>{try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;this.context||=new Context();this.context.resume().then(()=>this.apply()).catch(()=>{});}catch{}};
  document.addEventListener('pointerdown',this.unlock);document.addEventListener('keydown',this.unlock);
 }
 tone(frequency,delay=0,duration=.14){const ctx=this.context;if(!ctx||ctx.state!=='running')return;
  try{const oscillator=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime+delay;oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.035,at+.015);gain.gain.setValueAtTime(.035,at+Math.max(.02,duration-.03));gain.gain.linearRampToValueAtTime(0,at+duration);oscillator.connect(gain);gain.connect(ctx.destination);this.voices.add(oscillator);oscillator.onended=()=>{this.voices.delete(oscillator);oscillator.disconnect();gain.disconnect();};oscillator.start(at);oscillator.stop(at+duration+.01);}catch{}
 }
 stop(){clearInterval(this.loop);this.loop=null;for(const voice of this.voices){try{voice.stop();}catch{}}this.voices.clear();}
 pattern(phase){if(phase==='ringing'){this.tone(660,0,.18);this.tone(880,.24,.18);this.tone(660,.48,.18);}else if(phase==='connecting'){this.tone(440,0,.65);this.tone(480,0,.65);}else if(phase==='connected'){this.tone(700,0,.09);}else if(phase==='ended'){const fail=['blocked','no-answer','unavailable','invalid-scenario','missed','declined'].includes(this.call?.result);this.tone(fail?240:440,0,.12);this.tone(fail?240:330,.2,.12);}}
 sync(call){this.call=call;const key=call?call.id+':'+call.phase:'';if(key===this.key)return;this.key=key;this.phase=call?.phase||null;this.stop();this.apply();}
 apply(){if(!this.context||this.context.state!=='running'||this.applied===this.key)return;this.applied=this.key;if(!this.phase)return;this.pattern(this.phase);if(['ringing','connecting'].includes(this.phase))this.loop=setInterval(()=>this.pattern(this.phase),this.phase==='ringing'?2400:3000);}
 destroy(){this.stop();document.removeEventListener('pointerdown',this.unlock);document.removeEventListener('keydown',this.unlock);this.context?.close().catch(()=>{});}
}
