-- ============================================================
-- Fix: make profile trigger safe for conflicts
-- ============================================================

-- Delete any stale users from failed auth attempts
delete from profiles where id not in (select id from auth.users);

-- Replace trigger to handle conflicts gracefully
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url);
  return new;
end;
$$;

-- Also delete any orphaned auth users so Google can create fresh
-- (check Supabase Dashboard > Authentication > Users and delete any existing users manually if needed)
