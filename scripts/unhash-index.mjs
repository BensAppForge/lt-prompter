// Removes the integrity hash of index.html from the generated service-worker
// manifest (ngsw.json).
//
// Why: Netlify adds an HTML comment to index.html when serving the site, so
// the file the service worker downloads never matches the hash computed at
// build time. The Angular service worker then rejects the whole version
// ("Hash mismatch ... /index.html") and installed PWAs stay on the old
// release forever. Without a hash entry, index.html is still fetched and
// cached for every new version, just without the byte-for-byte check. All
// other files keep their hashes.
import { readFileSync, writeFileSync } from 'node:fs';

const manifestPath = process.argv[2] ?? 'dist/lt-prompter/browser/ngsw.json';
const INDEX = '/index.html';

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.hashTable && INDEX in manifest.hashTable) {
  delete manifest.hashTable[INDEX];
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`unhash-index: removed the hash of ${INDEX} from ${manifestPath}`);
} else {
  console.log(`unhash-index: no hash for ${INDEX} in ${manifestPath}, nothing to do`);
}
