import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import ts from 'typescript';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('src/data/newCollections.ts');
const moduleUrl='data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText).toString('base64');
const {AURORA_SEEDS,NOBLESSE_SEEDS}=await import(moduleUrl);
const manifest=JSON.parse(read('src/data/newCollectionImages.json'));
test('approved CSV inventory: 11 Aurora, 40 Noblesse, exact public codes and unique image paths',()=>{
 assert.equal(AURORA_SEEDS.length,11); assert.equal(NOBLESSE_SEEDS.length,40);
 assert.deepEqual(NOBLESSE_SEEDS.map(x=>x.name),Array.from({length:40},(_,i)=>`FYA${2801+i}`));
 assert.deepEqual(AURORA_SEEDS.map(x=>x.name),['CARA','EMMA','MEGAN','ELSA','EMILY','ESMERALDA','KAMILA','MIA','QUEEN','ROSALIE','SAKURA']);
 assert.equal(manifest.length,152); assert.equal(manifest.filter(x=>x.colectie==='Aurora').length,33);
 assert.equal(manifest.filter(x=>x.colectie==='Noblesse').length,119);
 assert.equal(new Set(manifest.map(x=>x.path)).size,152);
 for(const s of [...AURORA_SEEDS,...NOBLESSE_SEEDS]) {
  assert.ok(s.price>0&&Number.isInteger(s.price));
  assert.equal(s.images.length,manifest.filter(x=>x.cod===s.name).length);
  assert.ok(manifest.filter(x=>x.cod===s.name).every(x=>x.pret_vanzare_lei===s.price));
 }
 assert.doesNotMatch(source,/INW|Innocentia|Beatrice|With Love/i);
});
test('all 152 exact supplied image paths exist as valid JPEGs, max1920 both axes',async()=>{
 for(const x of manifest){const m=await sharp(path.join(root,'public',x.path)).metadata();assert.equal(m.format,'jpeg',x.path);assert.ok(m.width<=1920&&m.height<=1920,x.path);}
});
test('proposed SQL only inserts 51 new dresses, no updates/deletes or old collection rows',()=>{
 const sql=read('supabase/proposed/colectii_noi.sql');
 assert.equal((sql.match(/INSERT INTO public.dresses/g)||[]).length,51);
 assert.doesNotMatch(sql,/\b(?:UPDATE|DELETE|ALTER|DROP|CREATE)\b|INW|Innocentia|Beatrice|With Love/i);
 for(const x of [...AURORA_SEEDS,...NOBLESSE_SEEDS])assert.ok(sql.includes(`'${x.name}'`));
});
test('routes, generated-image labels and exact sale-price projection are wired',()=>{
 assert.match(read('src/App.tsx'),/path="\/aurora"/);assert.match(read('src/App.tsx'),/path="\/noblesse"/);
 for(const p of ['src/lib/motion.tsx','src/ui/HeroMedia.tsx','src/pages/DressPage.tsx'])assert.match(read(p),/Imagine generată cu AI/);
 assert.match(read('src/data/catalog.ts'),/price: seed.price/);
 assert.doesNotMatch(source,/reduc|discount|oldPrice|rentPrice/i);
});
