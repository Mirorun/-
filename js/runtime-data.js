import * as originals from './data.js';
import {cloneData} from './session.js';
// One new copy per document load; app mutations never modify the source module.
export const {config,messages,calls,notes,articles,photos,tracks,posts,events}=cloneData({...originals});
