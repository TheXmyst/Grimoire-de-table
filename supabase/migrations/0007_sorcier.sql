-- La classe « Occultiste » prend le nom du Manuel des joueurs : « Sorcier »

update public.characters set class = 'Sorcier' where class = 'Occultiste';

update public.spells set classes = array_replace(classes, 'Occultiste', 'Sorcier')
where 'Occultiste' = any(classes);

update public.character_spells set tag = 'Sorcier' where tag = 'Occultiste';

-- Envoi de message : dans la liste étendue du Grand Ancien, absent jusqu'ici
insert into public.spells (name, level, school, classes, casting_time, range, components, duration, concentration, ritual, description)
select 'Envoi de message', 3, 'Évocation', '{"Barde","Clerc","Magicien"}', '1 action', 'Illimitée', 'V, S, M', '1 round', false, false,
  'Envoie un message de 25 mots au plus à une créature que tu connais, où qu''elle soit sur ton plan. Elle te reconnaît et peut répondre aussitôt de la même façon. Sur un autre plan, 5 % de chances que le message se perde.'
where not exists (select 1 from public.spells s where s.campaign_id is null and s.name = 'Envoi de message');
