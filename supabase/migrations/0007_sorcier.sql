-- La classe « Occultiste » prend le nom du Manuel des joueurs : « Sorcier »

update public.characters set class = 'Sorcier' where class = 'Occultiste';

update public.spells set classes = array_replace(classes, 'Occultiste', 'Sorcier')
where 'Occultiste' = any(classes);

update public.character_spells set tag = 'Sorcier' where tag = 'Occultiste';
