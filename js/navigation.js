// Each app owns its route stack and scroll offsets, independent of other apps.
export class AppNavigation {
  constructor(){this.apps=new Map();}
  get(id){if(!this.apps.has(id))this.apps.set(id,{route:{detail:null,contact:null,tab:'recent'},stack:[],scrolls:new Map()});return this.apps.get(id).route;}
  key(id){return JSON.stringify(this.get(id));}
  saveScroll(id,element){if(id&&element){this.get(id);this.apps.get(id).scrolls.set(this.key(id),element.scrollTop);}}
  restoreScroll(id,element){if(element)element.scrollTop=this.apps.get(id)?.scrolls.get(this.key(id))||0;}
  push(id,patch){const previous=this.get(id);this.apps.get(id).stack.push({...previous});this.apps.get(id).route={...previous,...patch};}
  update(id,patch){this.get(id);Object.assign(this.apps.get(id).route,patch);}
  canBack(id){this.get(id);return this.apps.get(id).stack.length>0;}
  back(id){if(!this.canBack(id))return false;this.apps.get(id).route=this.apps.get(id).stack.pop();return true;}
  thread(id,threadId){this.get(id);this.apps.get(id).stack=[{detail:null,contact:null,tab:'recent'}];this.apps.get(id).route={detail:threadId,contact:null,tab:'recent'};}
}
