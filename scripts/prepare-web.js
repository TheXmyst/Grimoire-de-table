// Finalise l'export web pour GitHub Pages : icône et plein écran sur iPad/iPhone,
// et 404.html pour que les liens directs (/character/…) ouvrent aussi l'appli.
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
const base = '/Grimoire-de-table';
const indexPath = path.join(dist, 'index.html');

fs.copyFileSync(path.join(__dirname, '..', 'assets', 'icon.png'), path.join(dist, 'apple-touch-icon.png'));

const head = [
  '<meta name="apple-mobile-web-app-capable" content="yes" />',
  '<meta name="mobile-web-app-capable" content="yes" />',
  '<meta name="apple-mobile-web-app-title" content="Grimoire" />',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />',
  `<link rel="apple-touch-icon" href="${base}/apple-touch-icon.png" />`,
].join('\n    ');

let html = fs.readFileSync(indexPath, 'utf8')
  .replace('<html lang="en">', '<html lang="fr">')
  .replace('shrink-to-fit=no"', 'shrink-to-fit=no, viewport-fit=cover"')
  .replace('</head>', `    ${head}\n  </head>`);
fs.writeFileSync(indexPath, html);
fs.copyFileSync(indexPath, path.join(dist, '404.html'));
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
console.log('Export web prêt pour GitHub Pages.');
