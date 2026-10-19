// Only these exact, obsolete progress keys belong to this project's old versions.
export const LEGACY_PROGRESS_KEYS=['yangyang.notifications.v1','yangyang.messages.v3'];
export function clearLegacyProgress(){for(const key of LEGACY_PROGRESS_KEYS){try{localStorage.removeItem(key);}catch{/* Storage can be blocked; run state never depends on it. */}}}
export function cloneData(value){return typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));}
