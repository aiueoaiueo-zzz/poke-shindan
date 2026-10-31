-- 🔐 部屋IDを「連番」から「10文字のランダム文字列」に変更するマイグレーション
--
-- アプリ側（utils/roomId.js）で英数字10文字のIDを発行して rooms.id に入れるため、
-- rooms.id と players.room_id を text 型に変更します。
-- Supabase の SQL Editor に貼り付けて実行してください。
--
-- ⚠️ 既存の部屋・プレイヤーデータは削除します（連番IDの部屋は推測されやすいため引き継がない）。
--    残したい場合は、実行前にバックアップを取ってください。

begin;

-- 既存データを削除（players → rooms の順）
delete from public.players;
delete from public.rooms;

-- players.room_id → rooms.id の外部キー制約を一旦外す（制約名に依存しないよう動的に探す）
do $$
declare
  fk record;
begin
  for fk in
    select conname
    from pg_constraint
    where conrelid = 'public.players'::regclass
      and contype = 'f'
  loop
    execute format('alter table public.players drop constraint %I', fk.conname);
  end loop;
end $$;

-- rooms.id を text 型・自動採番なしにする
alter table public.rooms alter column id drop identity if exists;
alter table public.rooms alter column id drop default;
alter table public.rooms alter column id type text using id::text;
alter table public.rooms
  add constraint rooms_id_format check (id ~ '^[A-Za-z0-9]{10}$');

-- players.room_id も text 型にして、外部キーを貼り直す
alter table public.players alter column room_id type text using room_id::text;
alter table public.players
  add constraint players_room_id_fkey
  foreign key (room_id) references public.rooms (id) on delete cascade;

-- 連番時代のシーケンスが残っていれば削除
drop sequence if exists public.rooms_id_seq;

commit;
