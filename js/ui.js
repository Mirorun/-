export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const row=(title,sub,action,extra='')=>`<button class="row" data-action="${esc(action)}">${extra}<span class="row-main"><strong>${esc(title)}</strong><p>${esc(sub)}</p></span><span class="chevron">›</span></button>`;
export const prose=s=>`<div class="prose">${esc(s)}</div>`;
