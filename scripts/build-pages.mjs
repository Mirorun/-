import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Publish runtime files only. Backups, audit reports and credentials stay local.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'_site');
if(path.dirname(target)!==root||path.basename(target)!=='_site')throw Error('Invalid output directory');
fs.rmSync(target,{recursive:true,force:true});
fs.mkdirSync(target,{recursive:true});
for(const name of ['index.html','css','js','assets']){
  fs.cpSync(path.join(root,name),path.join(target,name),{recursive:true});
}
fs.writeFileSync(path.join(target,'.nojekyll'),'');
console.log('Static Pages files prepared in '+target);
