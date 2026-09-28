// Fiches modèles de niveau 1, une par classe (règles 5e 2014, contenu du DRS 5.1).
// Humain, tableau standard (15, 14, 13, 12, 10, 8) + 1 partout, équipement de départ par défaut.
// Dans l'inventaire, une ligne qui commence par « * » est un objet porté ou tenu en main (équipé).
import type { Pregen } from './pregens';

export const CLASS_TEMPLATES: Pregen[] = [
  {
    "name": "Modèle Barbare",
    "race": "Humain",
    "class": "Barbare",
    "subclass": "Niveau 1 (voie primitive au niveau 3)",
    "background": "Sauvageon",
    "alignment": "Chaotique bon",
    "pitch": "La force brute de l'équipe. Tu entres en rage, tu encaisses les coups comme personne et tu frappes très fort avec ta grande hache.",
    "level": 1,
    "abilities": {
      "FOR": 16,
      "DEX": 14,
      "CON": 15,
      "INT": 9,
      "SAG": 13,
      "CHA": 11
    },
    "save_profs": [
      "FOR",
      "CON"
    ],
    "skill_profs": [
      "athletisme",
      "survie",
      "intimidation",
      "perception"
    ],
    "skill_expertise": [],
    "hp": 14,
    "hp_max": 14,
    "ac": 14,
    "ac_note": "sans armure 10 + DEX 2 + CON 2 (Défense sans armure)",
    "speed": 9,
    "attacks": [
      {
        "name": "Grande hache",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d12",
        "type": "tranchant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Lourde, à deux mains. +2 aux dégâts en rage."
      },
      {
        "name": "Hachette (×2)",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "tranchant",
        "bonus": 0,
        "note": "Corps à corps ou lancer 6/18 m. Légère."
      },
      {
        "name": "Javeline (×4)",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps ou lancer 9/36 m."
      }
    ],
    "proficiencies": {
      "armures": "armures légères et intermédiaires, boucliers",
      "armes": "armes courantes et de guerre",
      "outils": "un instrument de musique (flûte)",
      "langues": "commun, géant, orc"
    },
    "features": [
      {
        "name": "Rage",
        "source": "Barbare",
        "description": "2 fois par repos long, en action bonus, pendant 1 minute : avantage aux jets de FOR, +2 aux dégâts au corps à corps avec la FOR, et tu ne subis que la moitié des dégâts contondants, perforants et tranchants. Pas de sorts pendant la rage."
      },
      {
        "name": "Défense sans armure",
        "source": "Barbare",
        "description": "Sans armure, ta CA vaut 10 + DEX + CON (déjà compté). Tu peux quand même porter un bouclier."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Voyageur",
        "source": "Sauvageon",
        "description": "Tu te souviens toujours des cartes et des lieux, et tu trouves chaque jour de quoi nourrir jusqu'à 6 personnes en pleine nature."
      }
    ],
    "inventory": "* Grande hache\n2 hachettes\n4 javelines\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nBâton de marche\nPiège de chasse\nTrophée d'un animal que tu as tué\nFlûte en os\nVêtements de voyageur",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 10,
      "pp": 0
    },
    "traits": "Je parle peu, mais quand je me fâche, tout le monde l'entend.",
    "ideals": "Liberté. Personne ne me dit comment vivre.",
    "bonds": "Ma tribu compte sur moi pour revenir plus fort.",
    "flaws": "Je fonce d'abord et je réfléchis ensuite.",
    "play_guide": "1. Premier tour de combat : action bonus : entre en Rage. Tu encaisses moitié moins de dégâts d'armes et frappes plus fort.\n2. Bouge : jusqu'à 9 m. Va au contact de l'ennemi le plus menaçant.\n3. Action : Attaquer : 1d20 +5 à la grande hache. Si tu touches : 1d12 +3 (1d12 +5 en rage).\n4. Ennemi hors de portée ? : lance une hachette ou une javeline : 1d20 +5, dégâts 1d6 +3.\n\nAstuce : ta rage s'arrête si tu ne frappes personne et ne subis aucun dégât pendant un tour. Reste dans la mêlée !",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Modèle Barde",
    "race": "Humain",
    "class": "Barde",
    "subclass": "Niveau 1 (collège au niveau 3)",
    "background": "Artiste",
    "alignment": "Chaotique bon",
    "pitch": "Le cœur et la voix de l'équipe. Tu inspires tes alliés, tu soignes, tu endors ou ridiculises tes ennemis, et tu brilles dès qu'il faut parler.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 15,
      "CON": 14,
      "INT": 11,
      "SAG": 13,
      "CHA": 16
    },
    "save_profs": [
      "DEX",
      "CHA"
    ],
    "skill_profs": [
      "acrobaties",
      "representation",
      "persuasion",
      "tromperie",
      "perception"
    ],
    "skill_expertise": [],
    "hp": 10,
    "hp_max": 10,
    "ac": 13,
    "ac_note": "armure de cuir 11 + DEX 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Rapière",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Finesse."
      },
      {
        "name": "Dague",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "perforant",
        "bonus": 0,
        "note": "Finesse, légère. Lancer 6/18 m."
      }
    ],
    "proficiencies": {
      "armures": "armures légères",
      "armes": "armes courantes, arbalètes de poing, épées longues, rapières, épées courtes",
      "outils": "kit de déguisement, luth, flûte, tambour, viole",
      "langues": "commun, elfique"
    },
    "features": [
      {
        "name": "Incantation",
        "source": "Barde",
        "description": "Tu lances des sorts grâce à ton Charisme. DD de sauvegarde 13, attaque de sort +5. 2 emplacements de niveau 1, récupérés après un repos long."
      },
      {
        "name": "Inspiration bardique",
        "source": "Barde",
        "description": "En action bonus, donne un d6 à un allié qui t'entend à 18 m : il l'ajoute à un jet d'attaque, de caractéristique ou de sauvegarde dans les 10 minutes. 3 fois par repos long (CHA)."
      },
      {
        "name": "Incantation rituelle",
        "source": "Barde",
        "description": "Un sort connu qui porte la mention rituel peut être lancé sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "À la demande du public",
        "source": "Artiste",
        "description": "Tu trouves toujours un endroit où te produire (auberge, cirque, cour) : logement et repas modestes gratuits tant que tu joues chaque soir."
      }
    ],
    "inventory": "* Armure de cuir\n* Rapière\nDague\nLuth (te sert de focaliseur pour tes sorts)\nSac d'artiste : sac à dos, sac de couchage, 2 costumes, 5 bougies, 5 jours de rations, outre d'eau, kit de déguisement\nFaveur d'un admirateur (un ruban parfumé)\nCostume de scène",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 15,
      "pp": 0
    },
    "traits": "Je connais une histoire pour chaque situation, et je la raconte.",
    "ideals": "Beauté. Mes chansons rendent le monde un peu meilleur.",
    "bonds": "Je veux écrire la chanson qui me rendra célèbre, et cette aventure en sera le sujet.",
    "flaws": "Je ne résiste jamais à un public, même au pire moment.",
    "play_guide": "1. Début du combat : action bonus : Inspiration bardique (d6) à l'allié qui va attaquer ou résister à un sort.\n2. Bouge : jusqu'à 9 m. Reste en deuxième ligne, à portée de voix de tes alliés.\n3. Action : Moquerie cruelle (gratuit, à volonté, 18 m) : la cible fait une sauvegarde de SAG DD 13, sinon 1d4 dégâts psychiques et désavantage à sa prochaine attaque.\n4. Un allié est à 0 PV ? : action bonus : Mot de guérison (18 m), il se relève avec 1d4 +3 PV.\n5. Beaucoup d'ennemis ? : Sommeil (5d8 PV d'ennemis endormis) ou Fou rire sur le plus dangereux.\n\nAstuce : au contact, ta rapière fait 1d20 +4, dégâts 1d8 +2. Mais ta vraie force, c'est d'aider les autres à réussir.",
    "spell_notes": "Tu connais 2 sorts mineurs et 4 sorts de niveau 1 (2 emplacements). DD 13, attaque de sort +5. Tu changes un sort connu seulement en montant de niveau.",
    "spells": [
      {
        "name": "Moquerie cruelle",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Illusion mineure",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mot de guérison",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Sommeil",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Fou rire",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Lueurs féeriques",
        "tag": "",
        "prepared": true
      }
    ]
  },
  {
    "name": "Modèle Clerc",
    "race": "Humain",
    "class": "Clerc",
    "subclass": "Domaine de la Vie",
    "background": "Acolyte",
    "alignment": "Loyal bon",
    "pitch": "Le soigneur en armure. Tu gardes l'équipe en vie avec tes sorts de soin et tu tiens la ligne avec ta masse et ton bouclier.",
    "level": 1,
    "abilities": {
      "FOR": 14,
      "DEX": 11,
      "CON": 15,
      "INT": 9,
      "SAG": 16,
      "CHA": 13
    },
    "save_profs": [
      "SAG",
      "CHA"
    ],
    "skill_profs": [
      "perspicacite",
      "religion",
      "medecine",
      "persuasion"
    ],
    "skill_expertise": [],
    "hp": 10,
    "hp_max": 10,
    "ac": 18,
    "ac_note": "cotte de mailles 16 + bouclier 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Masse d'armes",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "contondant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m."
      },
      {
        "name": "Arbalète légère",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 carreaux), chargement, à deux mains."
      }
    ],
    "proficiencies": {
      "armures": "toutes les armures, boucliers",
      "armes": "armes courantes",
      "outils": "aucun",
      "langues": "commun, nain, céleste, elfique"
    },
    "features": [
      {
        "name": "Incantation",
        "source": "Clerc",
        "description": "Tu lances des sorts grâce à ta Sagesse. DD de sauvegarde 13, attaque de sort +5. 2 emplacements de niveau 1, récupérés après un repos long."
      },
      {
        "name": "Incantation rituelle",
        "source": "Clerc",
        "description": "Un sort préparé qui porte la mention rituel peut être lancé sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Disciple de la vie",
        "source": "Domaine de la Vie",
        "description": "Tes sorts de soin rendent 2 + niveau du sort PV en plus (+3 avec un emplacement de niveau 1, déjà compté)."
      },
      {
        "name": "Maîtrise des armures lourdes",
        "source": "Domaine de la Vie",
        "description": "Tu peux porter la cotte de mailles."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Abri des fidèles",
        "source": "Acolyte",
        "description": "Les temples de ta foi t'offrent soins et hébergement gratuits, pour toi et ton groupe."
      }
    ],
    "inventory": "* Cotte de mailles (désavantage aux jets de Discrétion)\n* Bouclier avec le symbole sacré gravé dessus (te sert de focaliseur pour tes sorts)\n* Masse d'armes\nArbalète légère + 20 carreaux\nSac d'ecclésiastique : sac à dos, couverture, 10 bougies, boîte à amadou, boîte à aumônes, 2 pains d'encens, encensoir, habits de cérémonie, 2 jours de rations, outre d'eau\nLivre de prières\n5 bâtonnets d'encens\nHabits de cérémonie\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 15,
      "pp": 0
    },
    "traits": "Je vois un signe de mon dieu dans chaque petit événement.",
    "ideals": "Charité. J'aide toujours ceux qui en ont besoin.",
    "bonds": "Je protégerai mon temple et ses fidèles, quoi qu'il m'en coûte.",
    "flaws": "J'ai du mal à faire confiance à ceux qui ne partagent pas ma foi.",
    "play_guide": "1. Un allié est à 0 PV ? : action bonus : Mot de guérison (18 m). Il se relève tout de suite avec 1d4 +6 PV.\n2. Au début d'un combat difficile : action : Bénédiction sur 3 alliés (+1d4 à leurs attaques et sauvegardes, concentration).\n3. Sinon, action : Flamme sacrée (gratuit, à volonté, 18 m) : sauvegarde de DEX DD 13, sinon 1d8 radiants. Ou ta masse au contact : 1d20 +4, dégâts 1d6 +2.\n4. Bouge : jusqu'à 9 m. Reste assez près pour atteindre tes alliés blessés.\n\nAstuce : 2 emplacements seulement ! Garde-en un pour relever quelqu'un. Les sorts mineurs sont illimités.",
    "spell_notes": "4 sorts préparés (SAG + niveau) + 2 sorts de domaine, toujours préparés. DD 13, attaque de sort +5. Tu peux changer ta liste après chaque repos long.",
    "spells": [
      {
        "name": "Flamme sacrée",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Assistance",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Épargner les mourants",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Soins",
        "tag": "Domaine",
        "prepared": true
      },
      {
        "name": "Bénédiction",
        "tag": "Domaine",
        "prepared": true
      },
      {
        "name": "Mot de guérison",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Éclair traçant",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Bouclier de la foi",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Sanctuaire",
        "tag": "",
        "prepared": true
      }
    ]
  },
  {
    "name": "Modèle Druide",
    "race": "Humain",
    "class": "Druide",
    "subclass": "Niveau 1 (cercle au niveau 2)",
    "background": "Ermite",
    "alignment": "Neutre bon",
    "pitch": "La voix de la nature. Tu soignes, tu entraves les ennemis avec des lianes et tu repousses tout le monde d'une vague de tonnerre. Au niveau 2, tu pourras te changer en animal.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 14,
      "CON": 15,
      "INT": 13,
      "SAG": 16,
      "CHA": 11
    },
    "save_profs": [
      "INT",
      "SAG"
    ],
    "skill_profs": [
      "medecine",
      "religion",
      "perception",
      "survie"
    ],
    "skill_expertise": [],
    "hp": 10,
    "hp_max": 10,
    "ac": 15,
    "ac_note": "armure de cuir 11 + DEX 2 + bouclier de bois 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Cimeterre",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d6",
        "type": "tranchant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Finesse, légère."
      }
    ],
    "proficiencies": {
      "armures": "armures légères et intermédiaires, boucliers (jamais en métal, par tradition druidique)",
      "armes": "bâton, cimeterre, dague, faucille, fléchette, fronde, gourdin, javeline, lance, masse",
      "outils": "matériel d'herboriste",
      "langues": "commun, druidique, elfique, sylvestre"
    },
    "features": [
      {
        "name": "Druidique",
        "source": "Druide",
        "description": "Tu connais la langue secrète des druides et peux laisser des messages cachés que seuls eux repèrent."
      },
      {
        "name": "Incantation",
        "source": "Druide",
        "description": "Tu lances des sorts grâce à ta Sagesse. DD de sauvegarde 13, attaque de sort +5. 2 emplacements de niveau 1, récupérés après un repos long."
      },
      {
        "name": "Incantation rituelle",
        "source": "Druide",
        "description": "Un sort préparé avec la mention rituel peut être lancé sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Découverte",
        "source": "Ermite",
        "description": "Ta longue retraite t'a révélé un secret important sur le monde. Le MJ et toi décidez lequel."
      }
    ],
    "inventory": "* Armure de cuir\n* Bouclier en bois\n* Cimeterre\nFocaliseur druidique : branche de gui (pour lancer tes sorts)\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nÉtui à parchemins rempli de notes sur tes prières\nCouverture d'hiver\nMatériel d'herboriste\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 5,
      "pp": 0
    },
    "traits": "Je parle plus volontiers aux arbres qu'aux gens.",
    "ideals": "Équilibre. Chaque chose a sa place dans le grand cycle.",
    "bonds": "Je protège la forêt où j'ai vécu seul pendant des années.",
    "flaws": "Je me méfie de tout ce qui vient des villes.",
    "play_guide": "1. Au début du combat : action : Enchevêtrement sur un groupe d'ennemis (sauvegarde de FOR DD 13). Les entravés deviennent des cibles faciles.\n2. Un allié est à 0 PV ? : action bonus : Mot de guérison à 18 m, il se relève avec 1d4 +3 PV.\n3. Sinon, action : Flammes : lance la flamme à 9 m (1d20 +5, 1d8 de feu). Gratuit et illimité.\n4. Encerclé ? : Vague tonnante repousse tout le monde autour de toi (2d8 tonnerre, DD 13).\n5. Bouge : jusqu'à 9 m. Reste en deuxième ligne.\n\nAstuce : au contact, ton cimeterre fait 1d20 +4, dégâts 1d6 +2. Un seul sort de concentration à la fois !",
    "spell_notes": "4 sorts préparés (SAG + niveau), choisis dans toute la liste du druide. DD 13, attaque de sort +5. Tu peux changer ta liste après chaque repos long.",
    "spells": [
      {
        "name": "Flammes",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Assistance",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Enchevêtrement",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mot de guérison",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Vague tonnante",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Lueurs féeriques",
        "tag": "",
        "prepared": true
      }
    ]
  },
  {
    "name": "Modèle Ensorceleur",
    "race": "Humain",
    "class": "Ensorceleur",
    "subclass": "Lignée draconique (dragon rouge, feu)",
    "background": "Noble",
    "alignment": "Chaotique neutre",
    "pitch": "La magie coule dans ton sang de dragon. Tu lances du feu, des projectiles qui ne ratent jamais, et ta peau écailleuse te protège mieux qu'une armure.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 14,
      "CON": 15,
      "INT": 11,
      "SAG": 13,
      "CHA": 16
    },
    "save_profs": [
      "CON",
      "CHA"
    ],
    "skill_profs": [
      "histoire",
      "persuasion",
      "arcanes",
      "intimidation"
    ],
    "skill_expertise": [],
    "hp": 9,
    "hp_max": 9,
    "ac": 15,
    "ac_note": "Résilience draconique 13 + DEX 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Dague (×2)",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "perforant",
        "bonus": 0,
        "note": "Finesse, légère. Lancer 6/18 m."
      },
      {
        "name": "Arbalète légère",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 carreaux), chargement, à deux mains."
      }
    ],
    "proficiencies": {
      "armures": "aucune",
      "armes": "dagues, fléchettes, frondes, bâtons, arbalètes légères",
      "outils": "jeu d'échecs draconiques",
      "langues": "commun, draconique, elfique, nain"
    },
    "features": [
      {
        "name": "Incantation",
        "source": "Ensorceleur",
        "description": "Tu lances des sorts grâce à ton Charisme. DD de sauvegarde 13, attaque de sort +5. 2 emplacements de niveau 1, récupérés après un repos long."
      },
      {
        "name": "Ancêtre dragon",
        "source": "Lignée draconique",
        "description": "Ton ancêtre est un dragon rouge (feu). Tu parles draconique, et ta maîtrise est doublée pour tes jets de CHA face aux dragons."
      },
      {
        "name": "Résilience draconique",
        "source": "Lignée draconique",
        "description": "+1 PV par niveau (déjà compté). Sans armure, ta CA vaut 13 + DEX grâce à tes écailles (déjà compté)."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Position privilégiée",
        "source": "Noble",
        "description": "On t'accueille dans la haute société : tu peux obtenir une audience auprès d'un noble local."
      }
    ],
    "inventory": "* Sacoche à composantes (à la ceinture, pour tes sorts)\nArbalète légère + 20 carreaux\n2 dagues\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nChevalière à tes armoiries\nLettre de noblesse\nJeu d'échecs draconiques\nVêtements fins",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 25,
      "pp": 0
    },
    "traits": "Je parle de ma famille comme si tout le monde la connaissait.",
    "ideals": "Pouvoir. Ce feu en moi, je dois apprendre à le maîtriser.",
    "bonds": "Je veux découvrir qui, dans ma famille, s'est uni à un dragon.",
    "flaws": "Je m'énerve vite, et alors les choses ont tendance à brûler.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Reste en retrait, derrière les combattants.\n2. Action : Trait de feu (gratuit, à volonté, 36 m) : 1d20 +5, dégâts 1d10 de feu.\n3. Ennemi difficile à toucher ? : Projectile magique, 3 fléchettes qui touchent toujours : 1d4 +1 chacune.\n4. Plusieurs ennemis groupés devant toi ? : Mains brûlantes (cône de 4,5 m, sauvegarde de DEX DD 13, 3d6 de feu).\n\nAstuce : 9 PV, c'est peu. Ta CA de 15 aide, mais ne reste jamais au contact. Au niveau 2, tu gagnes des points de sorcellerie pour modeler tes sorts.",
    "spell_notes": "Tu connais 4 sorts mineurs et 2 sorts de niveau 1 (2 emplacements). DD 13, attaque de sort +5. Tu changes un sort connu seulement en montant de niveau.",
    "spells": [
      {
        "name": "Trait de feu",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Rayon de givre",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Main de mage",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Prestidigitation",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Projectile magique",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mains brûlantes",
        "tag": "",
        "prepared": true
      }
    ]
  },
  {
    "name": "Modèle Guerrier",
    "race": "Humain",
    "class": "Guerrier",
    "subclass": "Style de combat : Défense",
    "background": "Soldat",
    "alignment": "Loyal bon",
    "pitch": "Le mur de l'équipe. Tu encaisses les coups, tu protèges les autres et tu frappes fort avec ton épée. Le personnage le plus simple à jouer.",
    "level": 1,
    "abilities": {
      "FOR": 16,
      "DEX": 14,
      "CON": 15,
      "INT": 9,
      "SAG": 13,
      "CHA": 11
    },
    "save_profs": [
      "FOR",
      "CON"
    ],
    "skill_profs": [
      "athletisme",
      "intimidation",
      "perception",
      "perspicacite"
    ],
    "skill_expertise": [],
    "hp": 12,
    "hp_max": 12,
    "ac": 19,
    "ac_note": "cotte de mailles 16 + bouclier 2 + Défense 1",
    "speed": 9,
    "attacks": [
      {
        "name": "Épée longue",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d8",
        "type": "tranchant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Polyvalente (1d10 à deux mains, sans bouclier)."
      },
      {
        "name": "Arbalète légère",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 carreaux), chargement : 1 tir par action."
      }
    ],
    "proficiencies": {
      "armures": "toutes les armures, boucliers",
      "armes": "armes courantes et de guerre",
      "outils": "jeu de dés, véhicules terrestres",
      "langues": "commun, nain"
    },
    "features": [
      {
        "name": "Second souffle",
        "source": "Guerrier",
        "description": "Une fois par repos (court ou long), en action bonus : tu récupères 1d10+1 PV."
      },
      {
        "name": "Style de combat : Défense",
        "source": "Guerrier",
        "description": "+1 à la CA quand tu portes une armure (déjà compté dans ta CA)."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Grade militaire",
        "source": "Soldat",
        "description": "Les soldats de ton ancienne armée te reconnaissent et te respectent. Tu peux réquisitionner du matériel simple ou un cheval pour une courte durée."
      }
    ],
    "inventory": "* Cotte de mailles (désavantage aux jets de Discrétion)\n* Bouclier\n* Épée longue\nArbalète légère + 20 carreaux\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nInsigne de grade\nTrophée : un croc d'un ennemi vaincu\nDés en os\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 10,
      "pp": 0
    },
    "traits": "Je suis toujours poli et respectueux, même avec mes ennemis.",
    "ideals": "Protéger. Personne ne tombe tant que je suis debout.",
    "bonds": "Je me bats pour ceux qui ne peuvent pas se défendre.",
    "flaws": "J'obéis aux ordres sans toujours réfléchir s'ils sont justes.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Place-toi entre l'ennemi et tes amis les plus fragiles.\n2. Action : Attaquer : lance 1d20 +5 avec ton épée. Si le résultat atteint la CA de l'ennemi, lance 1d8 +3 pour les dégâts.\n3. Action bonus (si besoin) : Second souffle quand tes PV sont bas : 1d10+1 PV, une fois par repos.\n4. Loin des ennemis ? : utilise l'arbalète : 1d20 +4, dégâts 1d8 +2.\n\nAstuce : avec une CA de 19, tu es très dur à toucher. Va au contact, c'est ton rôle !",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Modèle Magicien",
    "race": "Humain",
    "class": "Magicien",
    "subclass": "Niveau 1 (tradition arcanique au niveau 2)",
    "background": "Sage",
    "alignment": "Neutre",
    "pitch": "L'érudit aux sorts puissants. Tu es fragile, alors reste en retrait et fais pleuvoir la magie : projectiles qui ne ratent jamais, sommeil magique, bouclier instantané.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 14,
      "CON": 15,
      "INT": 16,
      "SAG": 13,
      "CHA": 11
    },
    "save_profs": [
      "INT",
      "SAG"
    ],
    "skill_profs": [
      "arcanes",
      "histoire",
      "investigation",
      "perspicacite"
    ],
    "skill_expertise": [],
    "hp": 8,
    "hp_max": 8,
    "ac": 12,
    "ac_note": "sans armure 10 + DEX 2 ; 15 avec Armure du mage",
    "speed": 9,
    "attacks": [
      {
        "name": "Bâton",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "contondant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Polyvalent (1d8 à deux mains)."
      }
    ],
    "proficiencies": {
      "armures": "aucune",
      "armes": "dagues, fléchettes, frondes, bâtons, arbalètes légères",
      "outils": "aucun",
      "langues": "commun, nain, elfique, draconique"
    },
    "features": [
      {
        "name": "Incantation",
        "source": "Magicien",
        "description": "Tu lances des sorts grâce à ton Intelligence. DD de sauvegarde 13, attaque de sort +5. 2 emplacements de niveau 1, récupérés après un repos long."
      },
      {
        "name": "Restauration arcanique",
        "source": "Magicien",
        "description": "Une fois par jour, lors d'un repos court, tu récupères 1 emplacement de sort de niveau 1."
      },
      {
        "name": "Incantation rituelle",
        "source": "Magicien",
        "description": "Tu lances les sorts rituels de ton grimoire sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Chercheur",
        "source": "Sage",
        "description": "Si tu ne connais pas une information, tu sais souvent où ou auprès de qui la trouver."
      }
    ],
    "inventory": "* Bâton\nGrimoire (tes 6 sorts de niveau 1)\nSacoche à composantes (pour lancer tes sorts)\nSac d'érudit : sac à dos, livre de savoir, bouteille d'encre, plume, 10 feuilles de parchemin, petit sac de sable, petit couteau\nBouteille d'encre noire et plume\nPetit couteau\nLettre d'un collègue mort posant une question sans réponse\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 10,
      "pp": 0
    },
    "traits": "J'utilise des mots compliqués pour paraître savant.",
    "ideals": "Connaissance. Le savoir est la vraie puissance.",
    "bonds": "Je dois trouver la réponse à la question laissée par mon ancien maître.",
    "flaws": "Je suis facilement distrait par la promesse d'un secret ou d'un livre rare.",
    "play_guide": "1. Avant l'aventure : lance Armure du mage (1 emplacement) : CA 15 pour la journée.\n2. Bouge : jusqu'à 9 m, en restant loin des ennemis, derrière les combattants.\n3. Action : un sort mineur, gratuit : Trait de feu (1d20 +5, 1d10 de feu) à 36 m. Tu peux le faire à chaque tour.\n4. Beaucoup d'ennemis ou urgence ? : Sommeil sur un groupe (5d8 PV d'ennemis), ou Projectile magique qui ne rate jamais (3 × 1d4 +1).\n5. Réaction : si on te touche, Bouclier (+5 CA) peut transformer le coup en raté.\n\nAstuce : 8 PV, c'est peu. Ne va jamais au contact (ton bâton ne fait que 1d20 +1, 1d6 -1).",
    "spell_notes": "Ton grimoire contient 6 sorts de niveau 1. Tu en prépares 4 (INT + niveau), modifiables après chaque repos long. DD 13, attaque de sort +5.",
    "spells": [
      {
        "name": "Trait de feu",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Rayon de givre",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Main de mage",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Projectile magique",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Sommeil",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Bouclier",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Armure du mage",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mains brûlantes",
        "tag": "Grimoire",
        "prepared": false
      },
      {
        "name": "Détection de la magie",
        "tag": "Grimoire",
        "prepared": false
      }
    ]
  },
  {
    "name": "Modèle Moine",
    "race": "Humain",
    "class": "Moine",
    "subclass": "Niveau 1 (tradition monastique au niveau 3)",
    "background": "Ermite",
    "alignment": "Loyal neutre",
    "pitch": "Rapide et discipliné, tu te bats sans armure, à mains nues ou avec une épée courte, et tu frappes deux fois par tour.",
    "level": 1,
    "abilities": {
      "FOR": 13,
      "DEX": 16,
      "CON": 14,
      "INT": 11,
      "SAG": 15,
      "CHA": 9
    },
    "save_profs": [
      "FOR",
      "DEX"
    ],
    "skill_profs": [
      "medecine",
      "religion",
      "acrobaties",
      "discretion"
    ],
    "skill_expertise": [],
    "hp": 10,
    "hp_max": 10,
    "ac": 15,
    "ac_note": "sans armure 10 + DEX 3 + SAG 2 (Défense sans armure)",
    "speed": 9,
    "attacks": [
      {
        "name": "Épée courte",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d6",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Finesse, légère. Arme de moine."
      },
      {
        "name": "Mains nues",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "contondant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Arts martiaux : une attaque en plus en action bonus."
      },
      {
        "name": "Fléchettes (×10)",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "perforant",
        "bonus": 0,
        "note": "Lancer 6/18 m. Finesse."
      }
    ],
    "proficiencies": {
      "armures": "aucune",
      "armes": "armes courantes, épées courtes",
      "outils": "matériel de calligraphe, matériel d'herboriste",
      "langues": "commun, elfique, céleste"
    },
    "features": [
      {
        "name": "Défense sans armure",
        "source": "Moine",
        "description": "Sans armure ni bouclier, ta CA vaut 10 + DEX + SAG (déjà compté)."
      },
      {
        "name": "Arts martiaux",
        "source": "Moine",
        "description": "Avec tes mains nues ou une arme de moine, tu utilises la DEX et tes coups à mains nues font 1d4. Après l'action Attaquer, tu peux donner un coup à mains nues en action bonus."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Découverte",
        "source": "Ermite",
        "description": "Ta longue retraite t'a révélé un secret important sur le monde. Le MJ et toi décidez lequel."
      }
    ],
    "inventory": "* Épée courte\n10 fléchettes\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nÉtui à parchemins rempli de notes sur tes méditations\nCouverture d'hiver\nMatériel d'herboriste\nMatériel de calligraphe\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 5,
      "pp": 0
    },
    "traits": "Je reste calme, même quand tout s'effondre autour de moi.",
    "ideals": "Maîtrise de soi. Un esprit calme rend le corps invincible.",
    "bonds": "Mon monastère m'a envoyé dans le monde pour apprendre, je ne dois pas le décevoir.",
    "flaws": "Je juge sévèrement ceux qui cèdent à leurs émotions.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Va au contact d'un ennemi isolé ou d'un lanceur de sorts adverse.\n2. Action : Attaquer à l'épée courte : 1d20 +5, dégâts 1d6 +3.\n3. Action bonus : un coup à mains nues (Arts martiaux) : 1d20 +5, dégâts 1d4 +3.\n4. Ennemi loin ? : lance une fléchette : 1d20 +5, dégâts 1d4 +3.\n\nAstuce : tu n'as que 10 PV. Frappe puis replie-toi derrière un allié plus solide. Au niveau 2, le ki te permettra de te désengager en action bonus.",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Modèle Occultiste",
    "race": "Humain",
    "class": "Occultiste",
    "subclass": "Fiélon",
    "background": "Charlatan",
    "alignment": "Chaotique neutre",
    "pitch": "Tu as passé un pacte avec un fiélon. Ta décharge occulte frappe fort de loin, et chaque ennemi que tu abats te rend plus résistant.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 14,
      "CON": 15,
      "INT": 11,
      "SAG": 13,
      "CHA": 16
    },
    "save_profs": [
      "SAG",
      "CHA"
    ],
    "skill_profs": [
      "tromperie",
      "escamotage",
      "arcanes",
      "intimidation"
    ],
    "skill_expertise": [],
    "hp": 10,
    "hp_max": 10,
    "ac": 13,
    "ac_note": "armure de cuir 11 + DEX 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Arbalète légère",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 carreaux), chargement, à deux mains."
      },
      {
        "name": "Masse d'armes",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "contondant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m."
      },
      {
        "name": "Dague (×2)",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "perforant",
        "bonus": 0,
        "note": "Finesse, légère. Lancer 6/18 m."
      }
    ],
    "proficiencies": {
      "armures": "armures légères",
      "armes": "armes courantes",
      "outils": "kit de déguisement, kit de contrefaçon",
      "langues": "commun, infernal"
    },
    "features": [
      {
        "name": "Patron d'outre-monde : Fiélon",
        "source": "Occultiste",
        "description": "Un démon ou un diable t'a accordé ses pouvoirs. Il ajoute Mains brûlantes et Injonction à la liste de sorts où tu peux choisir."
      },
      {
        "name": "Bénédiction du ténébreux",
        "source": "Fiélon",
        "description": "Quand tu fais tomber un ennemi à 0 PV, tu gagnes 4 PV temporaires (CHA + niveau)."
      },
      {
        "name": "Magie de pacte",
        "source": "Occultiste",
        "description": "Tu lances des sorts grâce à ton Charisme. DD 13, attaque de sort +5. 1 seul emplacement de niveau 1, mais il revient après chaque repos court."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Fausse identité",
        "source": "Charlatan",
        "description": "Tu as une seconde identité, avec papiers et contacts, et tu sais imiter une écriture si tu as un modèle."
      }
    ],
    "inventory": "* Armure de cuir\n* Sacoche à composantes (à la ceinture, pour tes sorts)\nArbalète légère + 20 carreaux\nMasse d'armes\n2 dagues\nSac d'érudit : sac à dos, livre de savoir, bouteille d'encre, plume, 10 feuilles de parchemin, petit sac de sable, petit couteau\nKit de déguisement\nDés pipés\nVêtements fins",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 15,
      "pp": 0
    },
    "traits": "J'ai toujours un sourire charmeur et un mensonge prêt.",
    "ideals": "Ambition. Ce pacte me mènera au sommet, quel qu'en soit le prix.",
    "bonds": "Je dois un jour payer mon patron, et j'ai peur de ce qu'il demandera.",
    "flaws": "Je ne peux pas m'empêcher de mentir, même quand la vérité m'arrangerait.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Reste à distance, à couvert si possible.\n2. Action : Décharge occulte (gratuit, à volonté, 36 m) : 1d20 +5, dégâts 1d10 de force. C'est ton attaque principale.\n3. Un ennemi te frappe ? : réaction : Représailles infernales, il fait une sauvegarde de DEX DD 13 ou subit 2d10 de feu.\n4. Ennemis groupés près de toi ? : Mains brûlantes (cône de 4,5 m, DD 13, 3d6 de feu).\n\nAstuce : ton unique emplacement revient après chaque repos court. N'hésite pas à l'utiliser, puis demande une pause d'une heure au groupe.",
    "spell_notes": "Tu connais 2 sorts mineurs et 2 sorts de niveau 1 (1 emplacement, récupéré après un repos court). DD 13, attaque de sort +5.",
    "spells": [
      {
        "name": "Décharge occulte",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Main de mage",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Représailles infernales",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mains brûlantes",
        "tag": "Patron",
        "prepared": true
      }
    ]
  },
  {
    "name": "Modèle Paladin",
    "race": "Humain",
    "class": "Paladin",
    "subclass": "Niveau 1 (serment au niveau 3)",
    "background": "Héros du peuple",
    "alignment": "Loyal bon",
    "pitch": "Le chevalier sacré. Lourdement armé, tu protèges les faibles, tu soignes d'un simple toucher et tu sens la présence du mal.",
    "level": 1,
    "abilities": {
      "FOR": 16,
      "DEX": 11,
      "CON": 14,
      "INT": 9,
      "SAG": 13,
      "CHA": 15
    },
    "save_profs": [
      "SAG",
      "CHA"
    ],
    "skill_profs": [
      "dressage",
      "survie",
      "athletisme",
      "persuasion"
    ],
    "skill_expertise": [],
    "hp": 12,
    "hp_max": 12,
    "ac": 18,
    "ac_note": "cotte de mailles 16 + bouclier 2",
    "speed": 9,
    "attacks": [
      {
        "name": "Épée longue",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d8",
        "type": "tranchant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Polyvalente (1d10 à deux mains, sans bouclier)."
      },
      {
        "name": "Javeline (×5)",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d6",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps ou lancer 9/36 m."
      }
    ],
    "proficiencies": {
      "armures": "toutes les armures, boucliers",
      "armes": "armes courantes et de guerre",
      "outils": "outils de forgeron, véhicules terrestres",
      "langues": "commun, nain"
    },
    "features": [
      {
        "name": "Sens divin",
        "source": "Paladin",
        "description": "En action, tu sens jusqu'à 18 m la présence de célestes, fiélons et morts-vivants, ainsi que les lieux consacrés ou profanés. 3 fois par repos long (1 + CHA)."
      },
      {
        "name": "Imposition des mains",
        "source": "Paladin",
        "description": "Tu as une réserve de 5 PV de soins (5 × niveau). En action, touche une créature pour lui rendre autant de PV que tu veux de cette réserve, ou dépense 5 PV pour guérir une maladie ou un poison. Se recharge après un repos long."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Hospitalité rustique",
        "source": "Héros du peuple",
        "description": "Les gens du peuple te cachent et te nourrissent volontiers, tant que tu ne les mets pas en danger."
      }
    ],
    "inventory": "* Cotte de mailles (désavantage aux jets de Discrétion)\n* Bouclier\n* Épée longue\n5 javelines\nSymbole sacré (amulette)\nSac d'ecclésiastique : sac à dos, couverture, 10 bougies, boîte à amadou, boîte à aumônes, 2 pains d'encens, encensoir, habits de cérémonie, 2 jours de rations, outre d'eau\nOutils de forgeron\nPelle\nMarmite en fer\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 10,
      "pp": 0
    },
    "traits": "Je défends toujours le plus faible, même contre plus fort que moi.",
    "ideals": "Justice. Personne n'est au-dessus des lois, ni les nobles, ni les monstres.",
    "bonds": "Mon village natal compte sur moi, et je ne l'oublierai jamais.",
    "flaws": "Je crois qu'il existe toujours une solution juste, et je m'entête à la chercher.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Va au contact et protège les alliés fragiles.\n2. Action : Attaquer à l'épée longue : 1d20 +5, dégâts 1d8 +3.\n3. Un allié est tombé ? : action : Imposition des mains, touche-le et rends-lui jusqu'à 5 PV.\n4. Ennemi loin ? : lance une javeline : 1d20 +5, dégâts 1d6 +3.\n\nAstuce : pas de sorts au niveau 1, mais tu en auras dès le niveau 2, avec le Châtiment divin. Avec une CA de 18, tu peux tenir la première ligne.",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Modèle Rôdeur",
    "race": "Humain",
    "class": "Rôdeur",
    "subclass": "Niveau 1 (archétype au niveau 3)",
    "background": "Sauvageon",
    "alignment": "Neutre bon",
    "pitch": "Le chasseur des terres sauvages. Tu tires à l'arc de très loin, tu pistes n'importe quelle proie et tu guides le groupe en pleine nature.",
    "level": 1,
    "abilities": {
      "FOR": 13,
      "DEX": 16,
      "CON": 15,
      "INT": 11,
      "SAG": 14,
      "CHA": 9
    },
    "save_profs": [
      "FOR",
      "DEX"
    ],
    "skill_profs": [
      "athletisme",
      "survie",
      "perception",
      "discretion",
      "nature"
    ],
    "skill_expertise": [],
    "hp": 12,
    "hp_max": 12,
    "ac": 16,
    "ac_note": "armure d'écailles 14 + DEX 2 (max 2)",
    "speed": 9,
    "attacks": [
      {
        "name": "Arc long",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 45/180 m. Munitions (20 flèches), lourd, à deux mains."
      },
      {
        "name": "Épée courte (×2)",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d6",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Finesse, légère : attaque avec la seconde en action bonus (sans ajouter ta DEX aux dégâts)."
      }
    ],
    "proficiencies": {
      "armures": "armures légères et intermédiaires, boucliers",
      "armes": "armes courantes et de guerre",
      "outils": "un instrument de musique (cor)",
      "langues": "commun, elfique, sylvestre, gobelin"
    },
    "features": [
      {
        "name": "Ennemi juré : orcs et gobelins",
        "source": "Rôdeur",
        "description": "Avantage aux jets de Sagesse (Survie) pour les pister et aux jets d'Intelligence pour te souvenir d'informations sur eux. Tu parles gobelin."
      },
      {
        "name": "Explorateur-né : forêt",
        "source": "Rôdeur",
        "description": "En forêt, le groupe ne se perd jamais et n'est pas ralenti par le terrain difficile. Tu restes sur tes gardes même en faisant autre chose, et tu trouves deux fois plus de nourriture."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Voyageur",
        "source": "Sauvageon",
        "description": "Tu te souviens toujours des cartes et des lieux, et tu trouves chaque jour de quoi nourrir jusqu'à 6 personnes en pleine nature."
      }
    ],
    "inventory": "* Armure d'écailles (désavantage aux jets de Discrétion)\n* Arc long + carquois de 20 flèches\n* 2 épées courtes\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nBâton de marche\nPiège de chasse\nTrophée d'un animal que tu as tué\nCor de chasse\nVêtements de voyageur",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 10,
      "pp": 0
    },
    "traits": "Je me sens plus à l'aise sous les arbres que sous un toit.",
    "ideals": "Protection. La forêt et ceux qui y vivent méritent d'être défendus.",
    "bonds": "Une bande de gobelins a ravagé mon camp, je la retrouverai.",
    "flaws": "Je ne fais pas confiance aux gens de la ville.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Garde tes distances et trouve une ligne de tir dégagée.\n2. Action : tire à l'arc long : 1d20 +5, dégâts 1d8 +3. Portée énorme (45 m sans pénalité).\n3. Un ennemi au contact ? : passe aux épées courtes : 1d20 +5, dégâts 1d6 +3, puis action bonus avec la seconde : 1d20 +5, dégâts 1d6.\n4. Hors combat : c'est toi qui pistes, guides et montes la garde (Perception +4).\n\nAstuce : tirer à l'arc avec un ennemi à côté de toi donne le désavantage. Recule d'abord, ou sors les épées.",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Modèle Roublard",
    "race": "Humain",
    "class": "Roublard",
    "subclass": "Niveau 1 (archétype au niveau 3)",
    "background": "Criminel",
    "alignment": "Chaotique bon",
    "pitch": "Rapide et discret. Tu te caches, tu crochètes les serrures, tu repères les pièges et tu frappes là où ça fait mal grâce à l'attaque sournoise.",
    "level": 1,
    "abilities": {
      "FOR": 9,
      "DEX": 16,
      "CON": 14,
      "INT": 11,
      "SAG": 13,
      "CHA": 15
    },
    "save_profs": [
      "DEX",
      "INT"
    ],
    "skill_profs": [
      "discretion",
      "tromperie",
      "acrobaties",
      "perception",
      "escamotage",
      "investigation"
    ],
    "skill_expertise": [
      "discretion",
      "perception"
    ],
    "hp": 10,
    "hp_max": 10,
    "ac": 14,
    "ac_note": "armure de cuir 11 + DEX 3",
    "speed": 9,
    "attacks": [
      {
        "name": "Rapière",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Finesse."
      },
      {
        "name": "Arc court",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d6",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 flèches), à deux mains."
      },
      {
        "name": "Dague (×2)",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d4",
        "type": "perforant",
        "bonus": 0,
        "note": "Finesse, légère. Lancer 6/18 m."
      }
    ],
    "proficiencies": {
      "armures": "armures légères",
      "armes": "armes courantes, arbalètes de poing, épées longues, rapières, épées courtes",
      "outils": "outils de voleur, jeu de cartes",
      "langues": "commun, halfelin, jargon des voleurs"
    },
    "features": [
      {
        "name": "Attaque sournoise",
        "source": "Roublard",
        "description": "Une fois par tour, +1d6 dégâts si tu as l'avantage à l'attaque, ou si un allié est à 1,5 m de ta cible. Arme de finesse ou à distance obligatoire."
      },
      {
        "name": "Expertise",
        "source": "Roublard",
        "description": "Ta maîtrise est doublée en Discrétion et en Perception (déjà compté)."
      },
      {
        "name": "Jargon des voleurs",
        "source": "Roublard",
        "description": "Langage secret de signes et de mots codés entre voyous."
      },
      {
        "name": "Polyvalence humaine",
        "source": "Humain",
        "description": "+1 à toutes tes caractéristiques (déjà compté) et une langue de plus au choix."
      },
      {
        "name": "Contact criminel",
        "source": "Criminel",
        "description": "Tu connais quelqu'un de fiable dans le milieu, capable de faire passer des messages discrètement."
      }
    ],
    "inventory": "* Armure de cuir\n* Rapière\nArc court + carquois de 20 flèches\n2 dagues\nOutils de voleur\nSac de cambrioleur : sac à dos, 1 000 billes, 3 m de ficelle, clochette, 5 bougies, pied-de-biche, marteau, 10 pitons, lanterne à capote, 2 flasques d'huile, 5 jours de rations, boîte à amadou, outre d'eau, corde de chanvre 15 m\nPied-de-biche\nVêtements sombres avec capuche\nJeu de cartes",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 15,
      "pp": 0
    },
    "traits": "J'ai toujours un plan de fuite, au cas où.",
    "ideals": "Liberté. Les chaînes sont faites pour être brisées.",
    "bonds": "Je dois de l'argent à quelqu'un de dangereux, et je compte le rembourser.",
    "flaws": "Si je vois quelque chose de précieux, j'ai du mal à ne pas le prendre.",
    "play_guide": "1. Bouge : jusqu'à 9 m. Cherche un ennemi qui est déjà au contact d'un allié.\n2. Action : Attaquer : 1d20 +5 à la rapière (ou à l'arc court). Si tu touches : 1d8 +3 (1d6 +3 à l'arc), plus 1d6 d'attaque sournoise si un allié est à côté de la cible.\n3. Pas d'allié à côté ? : Action : se Cacher (Discrétion +7). Caché, ta prochaine attaque a l'avantage, donc sournoise.\n4. Hors combat : tu es la personne pour crocheter, fouiller (Perception +5) et passer sans bruit.\n\nAstuce : tu n'as que 10 PV. Évite d'être seul au milieu des ennemis, frappe puis mets-toi à l'abri.",
    "spell_notes": "",
    "spells": []
  }
];
