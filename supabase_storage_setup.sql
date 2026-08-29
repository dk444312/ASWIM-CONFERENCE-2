-- =====================================================================
-- IFSW AFRICA 2027 CONFERENCE - SUPABASE STORAGE BUCKET & RLS POLICIES
-- =====================================================================
-- Bucket Name: 'leader-photos'
-- Optimized for:
--   1. IFSW Leadership & Subcommittee member portraits
--   2. Delegate registration uploads (Student IDs, passports, photos)
--   3. Presenter abstract submissions (.pdf, .doc, .docx, images)
--   4. Exhibitor logos and promotional media
-- =====================================================================

-- =====================================================================
-- IFSW AFRICA 2027 CONFERENCE - SUPABASE STORAGE BUCKET & POLICIES
-- =====================================================================
-- Bucket Name: 'leader-photos'
-- Optimized for:
--   1. IFSW Leadership & Subcommittee member portraits
--   2. Delegate registration uploads (Student IDs, passports, photos)
--   3. Presenter abstract submissions (.pdf, .doc, .docx)
--   4. Exhibitor logos and promotional media (.pdf, .zip, images)
-- =====================================================================

-- 1. CREATE STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leader-photos',
  'leader-photos',
  true,
  20971520, -- 20 MB size limit
  ARRAY[
    -- Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
    -- Documents & Verification
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 20971520,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream'
  ];

-- 2. DROP OLD/EXISTING POLICIES IF PRESENT
DROP POLICY IF EXISTS "Public can view leader photos and uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for leader photos and registration docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow update and replace of photos and docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete of storage objects" ON storage.objects;

-- 3. READ POLICY (Public CDN Access)
CREATE POLICY "Public can view leader photos and uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'leader-photos');

-- 4. INSERT / UPLOAD POLICY (Delegates + Admins)
CREATE POLICY "Allow public uploads for leader photos and registration docs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'leader-photos');

-- 5. UPDATE / UPSERT POLICY
CREATE POLICY "Allow update and replace of photos and docs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'leader-photos')
WITH CHECK (bucket_id = 'leader-photos');

-- 6. DELETE POLICY
CREATE POLICY "Allow delete of storage objects"
ON storage.objects FOR DELETE
USING (bucket_id = 'leader-photos');

-- =====================================================================
-- VERIFICATION QUERY:
-- Run this in Supabase SQL Editor to confirm bucket and RLS setup
-- =====================================================================
-- SELECT id, name, public, file_size_limit, allowed_mime_types 
-- FROM storage.buckets 
-- WHERE id = 'leader-photos';
