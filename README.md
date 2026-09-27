# Grimoire de Table

Application Android pour jouer à D&D 5e (règles 2014) sans papier.

- **Le MJ** crée une campagne, invite ses joueurs avec un code, crée les fiches de personnage et les attribue.
- **Les joueurs** voient leurs fiches se mettre à jour en direct quand le MJ les modifie (niveau, PV, objets…).
- **Les sorts** proposés dépendent de la classe et du niveau du personnage. Le MJ peut valider les choix et créer des sorts maison.
- **Réglages MJ** : qui gère les PV, l'inventaire, et si les sorts doivent être validés.

## Technique

- App : [Expo](https://expo.dev) (React Native) avec Expo Router, code dans `src/`.
- Serveur : [Supabase](https://supabase.com) (comptes, base Postgres, temps réel). Schéma et règles d'accès dans `supabase/migrations/`.
- APK : construit automatiquement par GitHub Actions (`.github/workflows/android-apk.yml`) à chaque push sur `main`.

## Mise en route

1. Crée un projet gratuit sur supabase.com.
2. Dans **SQL Editor**, colle et exécute `supabase/migrations/0001_init.sql`, puis `0002_srd_spells.sql` (164 sorts du SRD en français, niveaux 0 à 3) et `0003_fiche_complete.sql`.
   À chaque nouvelle migration, exécute uniquement le nouveau fichier.
3. Dans **Project Settings → API**, récupère l'URL du projet et la clé `anon` publique.
4. Sur GitHub, dans **Settings → Secrets and variables → Actions**, ajoute `SUPABASE_URL` et `SUPABASE_ANON_KEY`.
5. Lance le workflow **APK Android** (onglet Actions), télécharge l'artefact et installe l'APK sur la tablette
   (autoriser l'installation d'applications inconnues).

En développement : copie `.env.example` en `.env`, remplis les deux valeurs, puis `npm install` et `npx expo start`.

## Vérifier les règles d'accès

`supabase/tests_rls.sql` rejoue les cas MJ / joueur / intrus sur un Postgres local
(il faut d'abord créer un faux schéma `auth` avec `auth.users` et `auth.uid()`).
