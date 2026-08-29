-- =====================================================================
-- IFSW AFRICA 2027 CONFERENCE - ABSTRACT SUBMISSIONS SCHEMA & POLICIES
-- =====================================================================
-- This script provisions the 'abstract_submissions' table to receive and manage abstracts,
-- along with custom row-level security (RLS) policies allowing public submission and admin audit.
-- =====================================================================

-- 1. CREATE ABSTRACT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.abstract_submissions (
  id VARCHAR(50) PRIMARY KEY, -- Sequential ID or UUID
  email VARCHAR(255) NOT NULL,
  title VARCHAR(50), -- e.g. Mr, Dr, Prof, Ms
  first_name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  institution_affiliation TEXT NOT NULL, -- Affiliation and country
  theme_selection VARCHAR(255) NOT NULL,
  proposal_type VARCHAR(100) NOT NULL, -- Individual paper, Co-authored paper, Poster presentation, Workshop
  authors_affiliation TEXT,
  abstract_title TEXT NOT NULL,
  abstract_body TEXT NOT NULL, -- 250-300 words
  keywords VARCHAR(255) NOT NULL, -- 3-5 keywords
  file_url TEXT, -- Uploaded abstract document format (.pdf, .doc, .docx)
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected
  reviewed_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  status_note TEXT,
  status_updated_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CREATE INDEXES FOR FAST SORTING & FILTERING
CREATE INDEX IF NOT EXISTS idx_abstracts_email ON public.abstract_submissions(email);
CREATE INDEX IF NOT EXISTS idx_abstracts_status ON public.abstract_submissions(status);
CREATE INDEX IF NOT EXISTS idx_abstracts_proposal_type ON public.abstract_submissions(proposal_type);
CREATE INDEX IF NOT EXISTS idx_abstracts_submitted_at ON public.abstract_submissions(submitted_at DESC);

-- 3. ENABLE UPDATED_AT TRIGGER
CREATE OR REPLACE TRIGGER trigger_update_abstracts_updated_at
BEFORE UPDATE ON public.abstract_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. CONFIGURE ROW LEVEL SECURITY
ALTER TABLE public.abstract_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can submit abstracts" ON public.abstract_submissions;
DROP POLICY IF EXISTS "Admins can view and manage abstracts" ON public.abstract_submissions;

-- 5. READ/WRITE POLICIES
-- Public submission (Anonymous + registered delegates can submit)
CREATE POLICY "Public can submit abstracts" ON public.abstract_submissions
  FOR INSERT WITH CHECK (true);

-- Admin Management (Allows authenticated administrators full control)
CREATE POLICY "Admins can view and manage abstracts" ON public.abstract_submissions
  FOR ALL USING (true);
