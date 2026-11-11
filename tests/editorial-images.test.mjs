import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const pages=['Homepage','Atelier','CollectionsIndex','Programare'];
const manifest=JSON.parse(fs.readFileSync('src/data/newCollectionImages.json','utf8'));
test('active editorial pages no longer use generic theme images',()=>{
 for(const page of pages){
  const source=fs.readFileSync(`src/pages/${page}.tsx`,'utf8');
  assert.doesNotMatch(source,/atelier_hands_sewing|atelier_royal_vintage|atelier_vintage|feminity_vintage|jardin_vintage|history_hero_portrait/);
 }
});
test('all nine replacement placements use already supplied catalog JPEGs',()=>{
 const sources=pages.map(page=>fs.readFileSync(`src/pages/${page}.tsx`,'utf8')).join('\n');
 const replacements=[...sources.matchAll(/(?:src|poster)="(\/images\/(?:AURORA|NOBLESSE)\/[^\"]+)"/g)].map(m=>m[1]);
 assert.equal(replacements.length,9);
 assert.equal(new Set(replacements).size,6);
 for(const image of replacements){assert.ok(manifest.some(x=>x.path===image));assert.ok(fs.existsSync('public'+image));}
 assert.doesNotMatch(sources,/Interiorul atelierului FYA|Mâini care cos o rochie în atelierul FYA|Probă de rochie în showroom/);
});
