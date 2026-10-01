// Dons du Manuel des joueurs (D&D 5e, 2014).
// Résumés rédigés librement : se référer au livre pour le texte exact.

export type Feat = { name: string; prerequisite?: string; summary: string };

export const FEATS: Feat[] = [
  {
    name: "Adepte des éléments",
    prerequisite: "Pouvoir lancer au moins un sort",
    summary:
      "Choisis acide, feu, foudre, froid ou tonnerre : tes sorts passent outre la résistance à ce type, et tu traites chaque 1 sur leurs dés de dégâts comme un 2. Tu peux reprendre ce don pour un autre type.",
  },
  {
    name: "Agresseur sauvage",
    summary:
      "Une fois par tour, après une attaque d'arme au corps à corps réussie, tu peux relancer les dés de dégâts de l'arme et garder le meilleur des deux jets.",
  },
  {
    name: "Athlète",
    summary:
      "+1 en Force ou Dextérité. Te relever ne te coûte que 1,50 m, grimper ne te ralentit plus et 1,50 m d'élan suffit pour un saut avec élan.",
  },
  {
    name: "Bagarreur de tavernes",
    summary:
      "+1 en Force ou Constitution. Tu maîtrises les armes improvisées, tes coups à mains nues font 1d4, et après en avoir touché une créature à mains nues ou avec une arme improvisée, tu peux tenter de l'empoigner par une action bonus.",
  },
  {
    name: "Chanceux",
    summary:
      "Tu as 3 points de chance par long repos. Dépense-en un pour lancer un d20 de plus sur ton attaque, test ou sauvegarde, ou sur une attaque visant toi, puis choisis le dé retenu.",
  },
  {
    name: "Combattant à deux armes",
    summary:
      "+1 à la CA quand tu tiens une arme de corps à corps dans chaque main. Tu peux combattre à deux armes même si elles ne sont pas légères, et dégainer ou rengainer les deux à la fois.",
  },
  {
    name: "Combattant monté",
    summary:
      "En selle, tu as l'avantage contre les créatures non montées plus petites que ta monture, tu peux détourner sur toi une attaque visant ta monture, et celle-ci bénéficie d'une esquive totale contre les effets à sauvegarde de Dextérité.",
  },
  {
    name: "Comédien",
    summary:
      "+1 en Charisme. Avantage en Supercherie et Représentation pour te faire passer pour quelqu'un d'autre, et tu sais imiter la voix d'une personne ou les cris d'une créature entendus au moins 1 minute.",
  },
  {
    name: "Discret",
    prerequisite: "Dextérité 13 ou plus",
    summary:
      "Tu peux te cacher d'une créature qui ne te voit que partiellement, rater un tir à distance ne trahit pas ta cachette, et la lumière faible ne te gêne pas pour la Perception visuelle.",
  },
  {
    name: "Doué",
    summary: "Tu gagnes la maîtrise de trois compétences ou outils au choix.",
  },
  {
    name: "Duelliste défensif",
    prerequisite: "Dextérité 13 ou plus",
    summary:
      "Si tu manies une arme de finesse maîtrisée et qu'une attaque au corps à corps te touche, tu peux utiliser ta réaction pour ajouter ton bonus de maîtrise à ta CA contre cette attaque.",
  },
  {
    name: "Empoigneur",
    prerequisite: "Force 13 ou plus",
    summary:
      "Avantage aux attaques contre la créature que tu empoignes. Par une action et un second test d'empoignade réussi, tu l'immobilises : vous êtes tous deux entravés jusqu'à la fin de l'empoignade.",
  },
  {
    name: "Endurant",
    summary:
      "+1 en Constitution. Quand tu dépenses un dé de vie, tu récupères au moins le double de ton modificateur de Constitution (minimum 2).",
  },
  {
    name: "Esprit affûté",
    summary:
      "+1 en Intelligence. Tu sais toujours où est le nord et combien d'heures restent avant le prochain lever ou coucher du soleil, et tu te rappelles parfaitement tout ce que tu as vu ou entendu durant le dernier mois.",
  },
  {
    name: "Expert de la charge",
    summary:
      "Après l'action Se précipiter, tu peux par une action bonus attaquer au corps à corps ou bousculer. Si tu as avancé d'au moins 3 m en ligne droite, ajoute +5 aux dégâts ou repousse la cible jusqu'à 3 m.",
  },
  {
    name: "Expert du combat",
    summary:
      "Tu apprends deux manœuvres du maître de guerre et gagnes un dé de supériorité (d6 si tu n'en avais pas), récupéré après un repos court ou long. DD des manœuvres : 8 + maîtrise + mod. de Force ou Dextérité.",
  },
  {
    name: "Explorateur de donjons",
    summary:
      "Avantage pour repérer les portes secrètes et aux sauvegardes contre les pièges, résistance à leurs dégâts, et tu peux chercher les pièges en avançant à allure normale.",
  },
  {
    name: "Grand maître d'armes",
    summary:
      "Sur un critique ou si tu fais tomber une créature à 0 PV au corps à corps, tu attaques de nouveau par une action bonus. Avec une arme lourde maîtrisée, tu peux prendre -5 au toucher pour +10 aux dégâts.",
  },
  {
    name: "Initié à la magie",
    summary:
      "Choisis barde, clerc, druide, ensorceleur, magicien ou sorcier : tu apprends deux tours de magie et un sort de niveau 1 de sa liste, ce dernier lançable une fois par long repos. Caractéristique d'incantation selon la classe.",
  },
  {
    name: "Légèrement protégé",
    summary: "+1 en Force ou Dextérité, et tu gagnes la maîtrise des armures légères.",
  },
  {
    name: "Linguiste",
    summary:
      "+1 en Intelligence. Tu apprends trois langues et sais rédiger des messages codés, lisibles seulement par ceux à qui tu as appris le code, par magie ou par un test d'Intelligence (DD = ta valeur d'Int + maîtrise).",
  },
  {
    name: "Lourdement protégé",
    prerequisite: "Maîtrise des armures intermédiaires",
    summary: "+1 en Force, et tu gagnes la maîtrise des armures lourdes.",
  },
  {
    name: "Mage de guerre",
    prerequisite: "Pouvoir lancer au moins un sort",
    summary:
      "Avantage aux sauvegardes de concentration, composantes somatiques possibles les mains pleines (armes, bouclier), et tu peux remplacer une attaque d'opportunité par un sort d'une action visant uniquement cette créature.",
  },
  {
    name: "Mage offensif",
    prerequisite: "Pouvoir lancer au moins un sort",
    summary:
      "La portée de tes sorts à jet d'attaque double et tes attaques de sort à distance ignorent les abris partiels et importants. Tu apprends un tour de magie à jet d'attaque d'une liste de classe au choix.",
  },
  {
    name: "Maître d'armes",
    summary:
      "+1 en Force ou Dextérité, et tu gagnes la maîtrise de quatre armes courantes ou de guerre au choix.",
  },
  {
    name: "Maître-arbalétrier",
    summary:
      "Tu ignores la propriété chargement des arbalètes maîtrisées, tirer au contact ne te désavantage pas, et après une attaque à une main lors de l'action Attaquer, tu peux tirer à l'arbalète de poing par une action bonus.",
  },
  {
    name: "Meneur exaltant",
    prerequisite: "Charisme 13 ou plus",
    summary:
      "Un discours de 10 minutes donne à jusqu'à six alliés (toi compris) à 9 m des PV temporaires égaux à ton niveau + ton mod. de Charisme, une fois par repos court ou long pour chacun.",
  },
  {
    name: "Mobile",
    summary:
      "Ta vitesse augmente de 3 m. En te précipitant, tu ignores le terrain difficile ce tour-ci, et une créature que tu attaques au corps à corps ne peut pas te faire d'attaque d'opportunité ce tour.",
  },
  {
    name: "Modérément protégé",
    prerequisite: "Maîtrise des armures légères",
    summary:
      "+1 en Force ou Dextérité, et tu gagnes la maîtrise des armures intermédiaires et des boucliers.",
  },
  {
    name: "Observateur",
    summary:
      "+1 en Intelligence ou Sagesse. Tu lis sur les lèvres dans une langue que tu connais, et tu as +5 à ta Perception passive et à ton Investigation passive.",
  },
  {
    name: "Résistant",
    summary:
      "Choisis une caractéristique : +1 dans celle-ci et maîtrise des jets de sauvegarde correspondants.",
  },
  {
    name: "Ritualiste",
    prerequisite: "Intelligence ou Sagesse 13 ou plus",
    summary:
      "Tu obtiens un livre de rituels avec deux sorts rituels de niveau 1 d'une classe choisie, lançables en rituel. Tu peux y copier d'autres rituels trouvés (niveau max : moitié du tien, 2 h et 50 po par niveau).",
  },
  {
    name: "Robuste",
    summary:
      "Tes PV max augmentent de 2 par niveau, rétroactivement, puis de 2 de plus à chaque nouveau niveau.",
  },
  {
    name: "Sentinelle",
    summary:
      "Toucher en attaque d'opportunité ramène la vitesse de la cible à 0. Se désengager ne protège pas de tes attaques d'opportunité, et si un ennemi à 1,50 m attaque quelqu'un d'autre, tu peux le frapper par ta réaction.",
  },
  {
    name: "Soigneur",
    summary:
      "Stabiliser avec une trousse de soins rend aussi 1 PV. Par une action et une utilisation de trousse, une créature récupère 1d6 + 4 + son nombre max de dés de vie en PV, une fois par repos court ou long.",
  },
  {
    name: "Spécialiste des armes d'hast",
    summary:
      "Avec une coutille, une hallebarde ou un bâton, une action bonus te permet de frapper avec le talon de l'arme (1d4 contondant). Avec ces armes ou une pique, les créatures entrant dans ton allonge provoquent une attaque d'opportunité.",
  },
  {
    name: "Spécialiste des armures intermédiaires",
    prerequisite: "Maîtrise des armures intermédiaires",
    summary:
      "En armure intermédiaire, pas de désavantage en Discrétion, et ton bonus de Dextérité à la CA monte à +3 si tu as 16 ou plus en Dextérité.",
  },
  {
    name: "Spécialiste des armures lourdes",
    prerequisite: "Maîtrise des armures lourdes",
    summary:
      "+1 en Force. En armure lourde, les dégâts contondants, perforants et tranchants des armes non magiques que tu subis sont réduits de 3.",
  },
  {
    name: "Spécialiste des boucliers",
    summary:
      "Avec un bouclier : bousculade par une action bonus après l'action Attaquer, bonus du bouclier ajouté aux sauvegardes de Dextérité contre ce qui ne vise que toi, et ta réaction annule les dégâts sur une sauvegarde de Dextérité réussie.",
  },
  {
    name: "Tireur d'élite",
    summary:
      "Pas de désavantage à longue portée, tes tirs ignorent les abris partiels et importants, et avec une arme à distance maîtrisée tu peux prendre -5 au toucher pour +10 aux dégâts.",
  },
  {
    name: "Tueur de mages",
    summary:
      "Ta réaction te permet de frapper au corps à corps une créature à 1,50 m qui lance un sort. Tes dégâts désavantagent ses sauvegardes de concentration, et tu as l'avantage contre les sorts lancés à 1,50 m de toi.",
  },
  {
    name: "Vigilant",
    summary:
      "+5 à l'initiative, tu ne peux pas être surpris tant que tu es conscient, et les créatures que tu ne vois pas n'ont pas l'avantage pour t'attaquer.",
  },
];
