// Active les mises à jour automatiques (EAS Update) dans app.json, en CI.
// Lancé après `eas init`, qui a écrit l'identifiant du projet Expo dans app.json.
const fs = require('fs');

const path = 'app.json';
const app = JSON.parse(fs.readFileSync(path, 'utf8'));
const projectId = app.expo.extra?.eas?.projectId;
if (!projectId) {
  console.log('Pas de projet Expo lié : mises à jour automatiques désactivées.');
  process.exit(0);
}

app.expo.runtimeVersion = { policy: 'appVersion' };
app.expo.updates = {
  enabled: true,
  url: `https://u.expo.dev/${projectId}`,
  requestHeaders: { 'expo-channel-name': 'production' },
  checkAutomatically: 'ON_LOAD',
  fallbackToCacheTimeout: 0,
};
fs.writeFileSync(path, JSON.stringify(app, null, 2) + '\n');
console.log(`Mises à jour automatiques activées pour le projet ${projectId}.`);
