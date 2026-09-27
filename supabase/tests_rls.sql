-- Test manuel des règles d accès (Postgres local avec un faux schéma auth, voir mock en tête de README)
\set ON_ERROR_STOP 0
grant all on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated;
insert into auth.users values ('00000000-0000-0000-0000-00000000000a','mj@x.fr','{"display_name":"Kevin"}'),
 ('00000000-0000-0000-0000-00000000000b','joueur@x.fr','{}'),('00000000-0000-0000-0000-00000000000c','intrus@x.fr','{}');
set role authenticated;
set request.jwt.uid = '00000000-0000-0000-0000-00000000000a';
insert into campaigns(id,name,gm_id) values ('11111111-1111-1111-1111-111111111111','Mine perdue','00000000-0000-0000-0000-00000000000a');
update campaigns set invite_code='ABC123';
insert into spells(id,campaign_id,name,level,classes) values ('22222222-2222-2222-2222-222222222222',null,'x',1,'{}');  -- doit échouer (SRD)
insert into spells(id,campaign_id,name,level,classes) values ('33333333-3333-3333-3333-333333333333','11111111-1111-1111-1111-111111111111','Flèche maison',1,'{Rôdeur}');
set request.jwt.uid = '00000000-0000-0000-0000-00000000000b';
select join_campaign('abc123') is not null as joined;
set request.jwt.uid = '00000000-0000-0000-0000-00000000000a';
insert into characters(id,campaign_id,player_id,name,class) values ('44444444-4444-4444-4444-444444444444','11111111-1111-1111-1111-111111111111','00000000-0000-0000-0000-00000000000b','Elyndra','Rôdeur');
set request.jwt.uid = '00000000-0000-0000-0000-00000000000b';
select name, level from characters;                                   -- 1 ligne
update characters set hp = 5 returning hp;                            -- OK
update characters set level = 5;                                      -- doit échouer
insert into character_spells(character_id,spell_id,status) values ('44444444-4444-4444-4444-444444444444','33333333-3333-3333-3333-333333333333','approved') returning status; -- pending
update character_spells set status='approved';                        -- doit échouer
set request.jwt.uid = '00000000-0000-0000-0000-00000000000c';
select count(*) as intrus_voit from characters;                       -- 0
select count(*) as intrus_campagnes from campaigns;                   -- 0
set request.jwt.uid = '00000000-0000-0000-0000-00000000000a';
update character_spells set status='approved' returning status;       -- MJ OK
update campaigns set settings = settings || '{"players_edit_hp":false}';
set request.jwt.uid = '00000000-0000-0000-0000-00000000000b';
update characters set hp = 3;                                          -- doit échouer
