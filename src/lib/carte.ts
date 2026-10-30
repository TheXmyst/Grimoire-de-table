import { Linking } from 'react-native';

/** Page de la carte animée (publiée avec la version web, voir scripts/prepare-web.js) */
export const CARTE_URL = 'https://thexmyst.github.io/Grimoire-de-table/carte/';

export const openCarte = () => {
  Linking.openURL(CARTE_URL).catch(() => {});
};
