import * as fs from 'fs';
import * as path from 'path';

// Just define the data extraction directly to bypass typescript compiling issues if we use the TS file
const catalogPath = path.join(__dirname, '../src/data/catalog.ts');
const catalogContent = fs.readFileSync(catalogPath, 'utf8');

// I will write a simpler generator in a JS file so I don't have to compile it.
