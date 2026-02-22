-- ============================================================
-- Fix: Remove the auth trigger that causes "Database error saving new user"
-- Profile creation is now handled in the app code (authStore.ts)
-- ============================================================

-- Drop the trigger that fires on auth.users INSERT
drop trigger if exists on_auth_user_created on auth.users;

-- Drop the function too (no longer needed)
drop function if exists handle_new_user();

-- Make sure the profiles INSERT policy exists (so the app can create profiles)
-- This is idempotent — won't fail if it already exists
do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can insert own profile'
  ) then
    create policy "Users can insert own profile" on profiles
      for insert with check (auth.uid() = id);
  end if;
end
$$;
