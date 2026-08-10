-- ============================================================================
-- SUPABASE STORAGE POLICIES: 'avatars' BUCKET
-- ============================================================================
-- 1. Create the 'avatars' storage bucket if not already initialized
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- 2. Policy: Public Read Access (Allows CDN serving for profile pictures)
CREATE POLICY "Public Read Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- 3. Policy: Service Role / Server API Write Access (Restricts writes to server-side re-encoded uploads)
CREATE POLICY "Service Role Upload Avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'service_role');

-- 4. Policy: Service Role Update / Delete Access
CREATE POLICY "Service Role Modify Avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.role() = 'service_role');

CREATE POLICY "Service Role Delete Avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.role() = 'service_role');
