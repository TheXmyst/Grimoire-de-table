// Personnages prétirés de niveau 1 (règles 5e 2014, contenu du DRS 5.1).
// Généré depuis les fiches de l’aventure : ne pas modifier à la main.
import type { Character } from "./types";

export type Pregen = Omit<
  Character,
  "id" | "campaign_id" | "player_id" | "xp" | "temp_hp" | "slots_used" | "notes" | "backstory" | "hit_dice_used" | "death_successes" | "death_failures" | "inspiration" | "spell_ability"
  | "conditions" | "exhaustion" | "concentration" | "resources" | "magic_items" | "defenses" | "details"
> & { spells: { name: string; tag: string; prepared: boolean }[] };

export const PREGENS: Pregen[] = [
  {
    "name": "Bran Forgefer",
    "race": "Humain",
    "class": "Guerrier",
    "subclass": "Style de combat : Défense",
    "background": "Soldat",
    "alignment": "Loyal bon",
    "pitch": "Le mur de l'équipe. Tu encaisses les coups, tu protèges les autres et tu frappes fort avec ton épée. Le personnage le plus simple à jouer : parfait pour un premier D&D.",
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
      "survie"
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
    "play_guide": "1. Bouge : jusqu'à 9 m. Place-toi entre l'ennemi et tes amis les plus fragiles (Elaïs, par exemple).\n2. Action : Attaquer : lance 1d20 +5 avec ton épée. Si le résultat atteint la CA de l'ennemi, lance 1d8 +3 pour les dégâts.\n3. Action bonus (si besoin) : Second souffle quand tes PV sont bas : 1d10+1 PV, une fois par repos.\n4. Loin des ennemis ? : utilise l'arbalète : 1d20 +4, dégâts 1d8 +2.\n\nAstuce : avec une CA de 19, tu es très dur à toucher. Va au contact, c'est ton rôle !",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Pip Vifargent",
    "race": "Halfelin pied-léger",
    "class": "Roublard",
    "subclass": "Niveau 1 (archétype au niveau 3)",
    "background": "Criminel",
    "alignment": "Chaotique bon",
    "pitch": "Petit, rapide et discret. Tu te caches, tu crochètes les serrures, tu repères les pièges et tu frappes là où ça fait mal grâce à l'attaque sournoise.",
    "level": 1,
    "abilities": {
      "FOR": 8,
      "DEX": 17,
      "CON": 14,
      "INT": 10,
      "SAG": 12,
      "CHA": 14
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
      "perspicacite"
    ],
    "skill_expertise": [
      "discretion",
      "perception"
    ],
    "hp": 10,
    "hp_max": 10,
    "ac": 14,
    "ac_note": "armure de cuir 11 + DEX 3",
    "speed": 7.5,
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
        "name": "Chanceux",
        "source": "Halfelin",
        "description": "Quand tu fais un 1 naturel sur un jet d'attaque, de caractéristique ou de sauvegarde, relance le dé et garde le nouveau résultat."
      },
      {
        "name": "Brave",
        "source": "Halfelin",
        "description": "Avantage aux jets de sauvegarde contre la peur (état effrayé)."
      },
      {
        "name": "Agilité halfeline",
        "source": "Halfelin",
        "description": "Tu peux traverser l'espace d'une créature plus grande que toi."
      },
      {
        "name": "Discrétion naturelle",
        "source": "Halfelin",
        "description": "Tu peux te cacher derrière une créature plus grande que toi d'au moins une taille."
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
    "play_guide": "1. Bouge : jusqu'à 7,5 m. Cherche un ennemi qui est déjà au contact d'un allié (Bran ou Dagna).\n2. Action : Attaquer : 1d20 +5 à la rapière (ou à l'arc). Si tu touches : 1d8 +3, plus 1d6 d'attaque sournoise si un allié est à côté de la cible.\n3. Pas d'allié à côté ? : Action : se Cacher (Discrétion +7). Caché, ta prochaine attaque a l'avantage, donc sournoise.\n4. Hors combat : tu es la personne pour crocheter, fouiller (Perception +5) et passer sans bruit.\n\nAstuce : 7,5 m seulement, mais tu peux traverser l'espace des créatures plus grandes. Reste souple et évite d'être seul au milieu des ennemis, tu n'as que 10 PV.",
    "spell_notes": "",
    "spells": []
  },
  {
    "name": "Dagna Martelpierre",
    "race": "Naine des collines",
    "class": "Clerc",
    "subclass": "Domaine de la Vie",
    "background": "Acolyte",
    "alignment": "Neutre bon",
    "pitch": "La soigneuse solide. Tu gardes l'équipe en vie avec tes sorts de soin, tu portes une armure lourde et tu n'as pas peur d'aller au contact avec ton marteau.",
    "level": 1,
    "abilities": {
      "FOR": 13,
      "DEX": 10,
      "CON": 16,
      "INT": 8,
      "SAG": 16,
      "CHA": 12
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
    "hp": 12,
    "hp_max": 12,
    "ac": 18,
    "ac_note": "cotte de mailles 16 + bouclier 2",
    "speed": 7.5,
    "attacks": [
      {
        "name": "Marteau de guerre",
        "ability": "FOR",
        "proficient": true,
        "dice": "1d8",
        "type": "contondant",
        "bonus": 0,
        "note": "Corps à corps, 1,5 m. Polyvalent (1d10 à deux mains, sans bouclier)."
      },
      {
        "name": "Arbalète légère",
        "ability": "DEX",
        "proficient": true,
        "dice": "1d8",
        "type": "perforant",
        "bonus": 0,
        "note": "Portée 24/96 m. Munitions (20 carreaux), chargement."
      }
    ],
    "proficiencies": {
      "armures": "toutes les armures, boucliers",
      "armes": "armes courantes, hache d'armes, hachette, marteau léger, marteau de guerre",
      "outils": "outils de forgeron",
      "langues": "commun, nain, elfique, halfelin"
    },
    "features": [
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
        "name": "Vision dans le noir",
        "source": "Naine",
        "description": "Tu vois dans le noir à 18 m comme en faible lumière (en nuances de gris)."
      },
      {
        "name": "Résistance naine",
        "source": "Naine",
        "description": "Avantage aux sauvegardes contre le poison et résistance aux dégâts de poison (tu en subis la moitié)."
      },
      {
        "name": "Robustesse naine",
        "source": "Naine",
        "description": "+1 PV par niveau (déjà compté)."
      },
      {
        "name": "Connaissance de la pierre",
        "source": "Naine",
        "description": "Sur un jet d'Histoire concernant la pierre ou la maçonnerie, ton bonus de maîtrise est doublé."
      },
      {
        "name": "Incantation rituelle",
        "source": "Clerc",
        "description": "Un sort préparé qui porte la mention rituel peut être lancé sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Abri des fidèles",
        "source": "Acolyte",
        "description": "Les temples de ta foi t'offrent soins et hébergement gratuits, pour toi et ton groupe."
      }
    ],
    "inventory": "* Cotte de mailles (désavantage aux jets de Discrétion)\n* Bouclier avec le symbole sacré gravé dessus (te sert de focaliseur pour tes sorts)\n* Marteau de guerre\nArbalète légère + 20 carreaux\nSac d'ecclésiastique : sac à dos, couverture, 10 bougies, boîte à amadou, boîte à aumônes, 2 pains d'encens, encensoir, habits de cérémonie, 2 jours de rations, outre d'eau\nLivre de prières\n5 bâtonnets d'encens\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 15,
      "pp": 0
    },
    "traits": "Je cite des proverbes de mon clan à tout propos, même quand ça n'a aucun rapport.",
    "ideals": "Charité. J'aide toujours ceux qui en ont besoin, quoi qu'il m'en coûte.",
    "bonds": "Mon temple est ma famille. Je le protégerai toujours.",
    "flaws": "Je juge durement ceux qui ne partagent pas ma foi.",
    "play_guide": "1. Un allié est à 0 PV ? : action bonus : Mot de guérison (18 m). Il se relève tout de suite avec 1d4 +6 PV.\n2. Au début d'un combat difficile : action : Bénédiction sur 3 alliés. Ça reste actif tant que tu te concentres.\n3. Sinon, action : attaquer : Flamme sacrée (gratuit, à volonté, DD 13) à distance, ou le marteau (+3, 1d8 +1) au contact.\n4. Bouge : jusqu'à 7,5 m. Reste assez près pour atteindre tes alliés blessés.\n\nAstuce : 2 emplacements seulement ! Garde-en un pour sauver quelqu'un. Les sorts mineurs (Flamme sacrée…) sont illimités.",
    "spell_notes": "4 sorts préparés (SAG + niveau) + 2 sorts de domaine, toujours préparés. Tu peux changer ta liste après chaque repos long.",
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
    "name": "Elaïs Sylvanel",
    "race": "Haut-elfe",
    "class": "Magicien",
    "subclass": "Niveau 1 (tradition arcanique au niveau 2)",
    "background": "Sage",
    "alignment": "Neutre",
    "pitch": "L'érudit aux sorts puissants. Tu es fragile, alors reste en retrait et fais pleuvoir la magie : projectiles qui ne ratent jamais, sommeil magique, bouclier instantané.",
    "level": 1,
    "abilities": {
      "FOR": 8,
      "DEX": 16,
      "CON": 13,
      "INT": 16,
      "SAG": 12,
      "CHA": 10
    },
    "save_profs": [
      "INT",
      "SAG"
    ],
    "skill_profs": [
      "arcanes",
      "histoire",
      "investigation",
      "perspicacite",
      "perception"
    ],
    "skill_expertise": [],
    "hp": 7,
    "hp_max": 7,
    "ac": 13,
    "ac_note": "sans armure 10 + DEX 3 ; 16 avec Armure de mage",
    "speed": 9,
    "attacks": [
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
      "armures": "aucune",
      "armes": "dagues, fléchettes, frondes, bâtons, arbalètes légères ; épées longues et courtes, arcs courts et longs (elfe)",
      "outils": "aucun",
      "langues": "commun, elfique, draconique, nain, céleste"
    },
    "features": [
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
        "name": "Vision dans le noir",
        "source": "Haut-elfe",
        "description": "Tu vois dans le noir à 18 m comme en faible lumière."
      },
      {
        "name": "Sens aiguisés",
        "source": "Haut-elfe",
        "description": "Maîtrise de Perception (déjà comptée)."
      },
      {
        "name": "Ascendance féerique",
        "source": "Haut-elfe",
        "description": "Avantage aux sauvegardes contre les charmes ; la magie ne peut pas t'endormir."
      },
      {
        "name": "Transe",
        "source": "Haut-elfe",
        "description": "Tu médites 4 h au lieu de dormir 8 h, et gardes conscience de ce qui t'entoure."
      },
      {
        "name": "Chercheur",
        "source": "Sage",
        "description": "Si tu ne connais pas une information, tu sais souvent où ou auprès de qui la trouver."
      }
    ],
    "inventory": "Grimoire (tes 6 sorts de niveau 1)\nSacoche à composantes\n* Dague\nSac d'érudit : sac à dos, livre de savoir, bouteille d'encre, plume, 10 feuilles de parchemin, petit sac de sable, petit couteau\nBouteille d'encre noire et plume\nPetit couteau\nLettre d'un collègue mort posant une question sans réponse\nVêtements communs",
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
    "play_guide": "1. Avant l'aventure : lance Armure de mage (1 emplacement) : CA 16 pour la journée.\n2. Bouge : jusqu'à 9 m, en restant loin des ennemis, derrière Bran si possible.\n3. Action : un sort mineur, gratuit : Trait de feu (+5, 1d10) à 36 m. Tu peux le faire à chaque tour.\n4. Beaucoup d'ennemis ou urgence ? : Sommeil sur un groupe, ou Projectile magique qui ne rate jamais.\n5. Réaction : si on te touche, Bouclier (+5 CA) peut transformer le coup en raté.\n\nAstuce : 7 PV, c'est peu. Ne va jamais au contact, et garde souvent un emplacement pour Bouclier.",
    "spell_notes": "Ton grimoire contient 6 sorts de niveau 1. Tu en prépares 4 (INT + niveau), modifiables après chaque repos long.",
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
        "tag": "Race",
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
    "name": "Aëlys Brumelune",
    "race": "Demi-elfe",
    "class": "Druide",
    "subclass": "Cercle choisi au niveau 2",
    "background": "Ermite",
    "alignment": "Neutre bon",
    "pitch": "Le lien avec la nature et la nuit. Tu soignes, tu entraves les ennemis avec des lianes et tu illumines leurs cachettes. Au niveau 2, tu pourras te transformer en animal.",
    "level": 1,
    "abilities": {
      "FOR": 8,
      "DEX": 14,
      "CON": 14,
      "INT": 12,
      "SAG": 16,
      "CHA": 12
    },
    "save_profs": [
      "INT",
      "SAG"
    ],
    "skill_profs": [
      "perception",
      "dressage",
      "medecine",
      "religion",
      "nature",
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
      "langues": "commun, elfique, druidique, sylvestre, céleste"
    },
    "features": [
      {
        "name": "Druidique",
        "source": "Druide",
        "description": "Tu connais la langue secrète des druides et peux laisser des messages cachés que seuls eux repèrent."
      },
      {
        "name": "Incantation rituelle",
        "source": "Druide",
        "description": "Un sort préparé avec la mention rituel peut être lancé sans emplacement, en prenant 10 minutes de plus."
      },
      {
        "name": "Forme sauvage et cercle druidique",
        "source": "Niveau 2",
        "description": "Pas encore au niveau 1. Au niveau 2, tu pourras te changer en animal et tu choisiras ton cercle (voir la note du MJ)."
      },
      {
        "name": "Vision dans le noir",
        "source": "Demi-elfe",
        "description": "Tu vois dans le noir à 18 m comme en faible lumière."
      },
      {
        "name": "Ascendance féerique",
        "source": "Demi-elfe",
        "description": "Avantage aux sauvegardes contre les charmes ; la magie ne peut pas t'endormir."
      },
      {
        "name": "Polyvalence",
        "source": "Demi-elfe",
        "description": "Maîtrise de deux compétences au choix : Nature et Survie (déjà comptées)."
      },
      {
        "name": "Découverte",
        "source": "Ermite",
        "description": "Ta longue retraite t'a révélé un secret important sur le monde. Le MJ et toi décidez lequel."
      }
    ],
    "inventory": "* Armure de cuir\n* Bouclier en bois\n* Cimeterre\nFocaliseur druidique : branche de gui (pour lancer tes sorts)\nSac d'explorateur : sac à dos, sac de couchage, gamelle, boîte à amadou, 10 torches, 10 jours de rations, outre d'eau, corde de chanvre 15 m\nÉtui à parchemins rempli de notes sur tes prières et visions\nCouverture d'hiver\nMatériel d'herboriste\nVêtements communs",
    "coins": {
      "pc": 0,
      "pa": 0,
      "pe": 0,
      "po": 5,
      "pp": 0
    },
    "traits": "Je parle peu, mais je remarque tout, surtout la nuit.",
    "ideals": "Équilibre. Le jour et la nuit, la vie et la mort ont chacun leur place.",
    "bonds": "J'ai quitté ma retraite pour comprendre une vision qui m'a été envoyée sous la lune.",
    "flaws": "Je me sens plus à l'aise avec les animaux qu'avec les gens, et ça se voit.",
    "play_guide": "1. Au début du combat : action : Enchevêtrement sur un groupe d'ennemis. Les entravés deviennent des cibles faciles pour toute l'équipe.\n2. Un allié est à 0 PV ? : action bonus : Mot de guérison à 18 m, il se relève tout de suite.\n3. Sinon, action : Flammes : lance la flamme à 9 m (+5, 1d8 de feu). Gratuit et illimité.\n4. Bouge : jusqu'à 9 m. Reste en deuxième ligne, derrière Bran ou Dagna.\n\nAstuce : un seul sort de concentration à la fois. Si Enchevêtrement tient, ne lance pas Lueurs féeriques par-dessus, sinon le premier s'arrête.",
    "spell_notes": "4 sorts préparés (SAG + niveau), choisis dans toute la liste du druide. Tu peux changer ta liste après chaque repos long.",
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
        "name": "Lueurs féeriques",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Soins",
        "tag": "",
        "prepared": true
      },
      {
        "name": "Mot de guérison",
        "tag": "",
        "prepared": true
      }
    ]
  }
];
