-- =====================================================================
-- IFSW AFRICA REGIONAL CONFERENCE 2027 (LILONGWE, MALAWI)
-- FULL PRODUCTION SUPABASE POSTGRESQL SCHEMA & INITIALIZATION SCRIPT
-- Covers: Admin & RBAC, Delegate Registrations, Landing Page CMS,
--         Communications, Payments, Workshops/Sessions, Badges, & Audit Logs
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================================
-- 2. CUSTOM TYPES & ENUMS
-- =====================================================================

DO $$ BEGIN
  CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'deactivated');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status_enum AS ENUM ('pending', 'accepted', 'rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'pending_verification', 'paid', 'refunded', 'waived');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notice_type_enum AS ENUM ('accepted', 'rejected', 'reminder', 'custom', 'broadcast', 'receipt');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE delivery_status_enum AS ENUM ('delivered', 'pending', 'failed', 'bounced');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE audit_category_enum AS ENUM ('admins', 'delegates', 'communications', 'security', 'reports', 'settings', 'cms', 'payments');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =====================================================================
-- 3. UTILITY FUNCTIONS (TRIGGERS)
-- =====================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- 4. TABLE: SYSTEM CONFIGURATION & FEATURE FLAGS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.system_config (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
  conference_name TEXT NOT NULL DEFAULT 'IFSW Africa Regional Conference 2027',
  conference_dates TEXT NOT NULL DEFAULT '26–31 October 2027',
  conference_location TEXT NOT NULL DEFAULT 'Bingu International Conference Centre (BICC), Lilongwe, Malawi',
  registration_open BOOLEAN NOT NULL DEFAULT true,
  max_capacity INTEGER NOT NULL DEFAULT 1500,
  early_bird_deadline TIMESTAMPTZ,
  standard_registration_deadline TIMESTAMPTZ,
  contact_email TEXT NOT NULL DEFAULT 'admin@ifswafrica.com',
  support_phone TEXT NOT NULL DEFAULT '+265 888 000 2027',
  currency_default VARCHAR(10) NOT NULL DEFAULT 'USD',
  allow_virtual_registrations BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 5. TABLE: ADMINISTRATORS & STAFF (RBAC)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.admins (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(100) NOT NULL DEFAULT 'Registration Officer',
  department VARCHAR(150) NOT NULL DEFAULT 'Secretariat',
  location VARCHAR(150) NOT NULL DEFAULT 'Lilongwe, Malawi',
  status user_status_enum NOT NULL DEFAULT 'active',
  permissions JSONB NOT NULL DEFAULT '["approve_delegates","reject_delegates","send_notices","export_reports"]'::jsonb,
  access_pin VARCHAR(20) DEFAULT '1999',
  actions_count INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_username ON public.admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_status ON public.admins(status);

CREATE TRIGGER trigger_update_admins_updated_at
BEFORE UPDATE ON public.admins
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 6. TABLE: ADMIN AUDIT & ACTIVITY LOGS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  admin_name VARCHAR(255) NOT NULL,
  admin_email VARCHAR(255) NOT NULL,
  admin_role VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  action_label TEXT NOT NULL,
  category audit_category_enum NOT NULL DEFAULT 'security',
  target_id VARCHAR(100),
  target_name VARCHAR(255),
  details TEXT,
  ip_address VARCHAR(50),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_id ON public.admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_category ON public.admin_activity_logs(category);

-- =====================================================================
-- 7. TABLE: LANDING PAGE CMS CONTENT & LEADERSHIP
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.landing_content (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
  topbar JSONB NOT NULL,
  hero JSONB NOT NULL,
  about JSONB NOT NULL,
  stats JSONB NOT NULL,
  malawi JSONB NOT NULL,
  programme JSONB NOT NULL,
  ifsw_region JSONB NOT NULL,
  subcommittee JSONB NOT NULL,
  sponsors JSONB NOT NULL,
  organizers JSONB NOT NULL,
  cta JSONB NOT NULL,
  footer JSONB NOT NULL,
  last_modified_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.leader_members (
  id VARCHAR(50) PRIMARY KEY,
  section_type VARCHAR(50) NOT NULL CHECK (section_type IN ('ifsw_region', 'subcommittee', 'keynote_speaker', 'patron')),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  organization VARCHAR(255),
  country VARCHAR(100),
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leader_members_section ON public.leader_members(section_type, display_order);

-- =====================================================================
-- 8. TABLE: DELEGATE REGISTRATIONS (ALL 5 APPLICATION STEPS)
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.registrations (
  -- Core Identification
  id VARCHAR(50) PRIMARY KEY,
  ticket_number VARCHAR(100) UNIQUE,
  status registration_status_enum NOT NULL DEFAULT 'pending',
  status_note TEXT,
  status_updated_at TIMESTAMPTZ,
  reviewed_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Step 1: Personal Details
  title VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(50) NOT NULL,
  dob DATE,
  nationality VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  alt_email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  alt_phone VARCHAR(50),
  
  -- Emergency Contact
  emergency_name VARCHAR(255) NOT NULL,
  emergency_relationship VARCHAR(100) NOT NULL,
  emergency_phone VARCHAR(50) NOT NULL,
  emergency_email VARCHAR(255),

  -- Step 2: Professional Details & IFSW Affiliation
  prof_background TEXT NOT NULL,
  area_practice TEXT[] DEFAULT '{}',
  years_exp VARCHAR(50),
  prof_assoc VARCHAR(255),
  is_ifsw VARCHAR(20) NOT NULL DEFAULT 'no',
  ifsw_name VARCHAR(255),
  ifsw_country VARCHAR(100),
  ifsw_number VARCHAR(100),
  ifsw_position VARCHAR(255),
  interests TEXT[] DEFAULT '{}',

  -- Step 3: Category & Tier Specific Logistics
  category VARCHAR(100) NOT NULL,
  fee_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',

  -- International Logistics (Flights, Airport, Visa, Accommodation)
  arrival_date DATE,
  arrival_time TIME,
  arrival_flight VARCHAR(100),
  dep_date DATE,
  dep_time TIME,
  dep_flight VARCHAR(100),
  airport_transfer VARCHAR(50),
  acc_req VARCHAR(50),
  hotel_cat VARCHAR(100),
  room_pref VARCHAR(100),
  visa_req VARCHAR(50),
  pass_name VARCHAR(255),
  pass_num VARCHAR(100),
  pass_exp DATE,
  embassy_name VARCHAR(255),
  embassy_loc VARCHAR(255),

  -- Malawi Local Logistics
  district VARCHAR(100),
  local_transport VARCHAR(100),

  -- Student Verification Logistics
  level_study VARCHAR(100),
  prog_study VARCHAR(255),
  student_inst VARCHAR(255),
  student_id_file_url TEXT,

  -- Virtual Participation Logistics
  time_zone VARCHAR(100),
  virtual_sessions TEXT[] DEFAULT '{}',
  tech_req TEXT,

  -- Step 4: Special Roles (Presenters & Exhibitors)
  is_presenter BOOLEAN NOT NULL DEFAULT false,
  pres_title TEXT,
  pres_track VARCHAR(255),
  pres_type VARCHAR(100),
  pres_bio TEXT,
  pres_coauthors TEXT,
  pres_av TEXT[] DEFAULT '{}',
  pres_abstract_file_url TEXT,

  is_exhibitor BOOLEAN NOT NULL DEFAULT false,
  exhib_org VARCHAR(255),
  exhib_booth VARCHAR(100),
  exhib_staff TEXT,
  exhib_elec VARCHAR(50),
  exhib_internet VARCHAR(50),
  exhib_nature TEXT,
  exhib_promo_file_url TEXT,

  -- Step 5: Sessions, Workshops & Logistics
  workshops TEXT[] DEFAULT '{}',
  parallel_sessions TEXT[] DEFAULT '{}',
  special_events TEXT[] DEFAULT '{}',
  gala VARCHAR(50) DEFAULT 'No',
  dietary VARCHAR(150),
  disability TEXT[] DEFAULT '{}',
  medical TEXT,

  -- Metadata & Timestamps
  payment_status payment_status_enum NOT NULL DEFAULT 'unpaid',
  badge_printed BOOLEAN NOT NULL DEFAULT false,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reg_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_reg_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_reg_category ON public.registrations(category);
CREATE INDEX IF NOT EXISTS idx_reg_country ON public.registrations(country);
CREATE INDEX IF NOT EXISTS idx_reg_submitted_at ON public.registrations(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_is_presenter ON public.registrations(is_presenter);
CREATE INDEX IF NOT EXISTS idx_reg_is_exhibitor ON public.registrations(is_exhibitor);

CREATE TRIGGER trigger_update_registrations_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- 9. TABLE: PAYMENTS & FINANCIAL TRANSACTIONS
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id VARCHAR(50) NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  transaction_ref VARCHAR(150) UNIQUE NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  payment_method VARCHAR(100) NOT NULL, -- 'Credit Card', 'Bank Wire', 'Airtel Money', 'TNM Mpamba', 'PayPal', 'Cash'
  payment_status payment_status_enum NOT NULL DEFAULT 'paid',
  payment_gateway_response JSONB DEFAULT '{}'::jsonb,
  payer_name VARCHAR(255),
  payer_email VARCHAR(255),
  receipt_number VARCHAR(100) UNIQUE,
  receipt_url TEXT,
  verified_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_reg_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_ref ON public.payments(transaction_ref);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(payment_status);

-- =====================================================================
-- 10. TABLE: COMMUNICATIONS & EMAIL NOTICES
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id VARCHAR(50) REFERENCES public.registrations(id) ON DELETE SET NULL,
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  type notice_type_enum NOT NULL DEFAULT 'custom',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  delivery_status delivery_status_enum NOT NULL DEFAULT 'delivered',
  delivery_error TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_comm_recipient_email ON public.communications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_comm_type ON public.communications(type);
CREATE INDEX IF NOT EXISTS idx_comm_sent_at ON public.communications(sent_at DESC);

-- =====================================================================
-- 11. TABLE: WORKSHOPS, SESSIONS & CAPACITY TRACKER
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.conference_sessions (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  track VARCHAR(150) NOT NULL,
  session_type VARCHAR(100) NOT NULL, -- 'Workshop', 'Keynote', 'Parallel Panel', 'Symposium', 'Gala Dinner'
  room VARCHAR(100),
  date_scheduled DATE,
  start_time TIME,
  end_time TIME,
  capacity INTEGER NOT NULL DEFAULT 100,
  enrolled_count INTEGER NOT NULL DEFAULT 0,
  speaker_names TEXT[] DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leader_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conference_sessions ENABLE ROW LEVEL SECURITY;

-- Anonymous / Public users can read landing content & leader profiles
CREATE POLICY "Public can view landing content" 
  ON public.landing_content FOR SELECT USING (true);

CREATE POLICY "Public can view leader members" 
  ON public.leader_members FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view system config" 
  ON public.system_config FOR SELECT USING (true);

CREATE POLICY "Public can view active conference sessions" 
  ON public.conference_sessions FOR SELECT USING (is_active = true);

-- Public users can submit new delegate registrations
CREATE POLICY "Public can insert delegate registrations" 
  ON public.registrations FOR INSERT WITH CHECK (true);

-- Authenticated Admin staff have full access
CREATE POLICY "Admins full access on registrations" 
  ON public.registrations FOR ALL USING (true);

CREATE POLICY "Admins full access on admins" 
  ON public.admins FOR ALL USING (true);

CREATE POLICY "Admins full access on logs" 
  ON public.admin_activity_logs FOR ALL USING (true);

CREATE POLICY "Admins full access on landing content" 
  ON public.landing_content FOR ALL USING (true);

CREATE POLICY "Admins full access on leader members" 
  ON public.leader_members FOR ALL USING (true);

CREATE POLICY "Admins full access on payments" 
  ON public.payments FOR ALL USING (true);

CREATE POLICY "Admins full access on communications" 
  ON public.communications FOR ALL USING (true);

CREATE POLICY "Admins full access on system config" 
  ON public.system_config FOR ALL USING (true);

CREATE POLICY "Admins full access on conference sessions" 
  ON public.conference_sessions FOR ALL USING (true);

-- =====================================================================
-- 12.1 SUPABASE STORAGE BUCKET: leader-photos
-- Optimized for: Leader Portraits + Registration ID/Abstract/Exhibitor Uploads
-- =====================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'leader-photos',
  'leader-photos',
  true,
  20971520, -- 20 MB size limit
  ARRAY[
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

DROP POLICY IF EXISTS "Public can view leader photos and uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads for leader photos and registration docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow update and replace of photos and docs" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete of storage objects" ON storage.objects;

CREATE POLICY "Public can view leader photos and uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'leader-photos');

CREATE POLICY "Allow public uploads for leader photos and registration docs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'leader-photos');

CREATE POLICY "Allow update and replace of photos and docs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'leader-photos')
WITH CHECK (bucket_id = 'leader-photos');

CREATE POLICY "Allow delete of storage objects"
ON storage.objects FOR DELETE
USING (bucket_id = 'leader-photos');


-- =====================================================================
-- 13. SEED DATA (SUPER ADMIN, CMS CONTENT, SESSIONS, CONFIG)
-- =====================================================================

-- 13.1 Default Executive Super Administrator
INSERT INTO public.admins (
  id,
  username,
  email,
  password_hash,
  name,
  phone,
  role,
  department,
  location,
  status,
  permissions,
  access_pin,
  actions_count
) VALUES (
  'ADM-2027-001',
  'admin@ifswafrica.com',
  'admin@ifswafrica.com',
  -- In production, store bcrypt/argon2 hash. Default plaintext representation: '199999'
  '199999',
  'IFSW Executive Admin',
  '+265 888 000 2027',
  'Chief Registration Admin',
  'Executive Secretariat HQ',
  'Lilongwe, Malawi',
  'active',
  '["approve_delegates","reject_delegates","send_notices","export_reports","manage_admins","system_config","edit_cms","edit_data"]'::jsonb,
  '1999',
  1
) ON CONFLICT (email) DO NOTHING;

-- 13.2 Default System Config
INSERT INTO public.system_config (
  id,
  conference_name,
  conference_dates,
  conference_location,
  registration_open,
  max_capacity,
  contact_email,
  support_phone
) VALUES (
  'default',
  'IFSW Africa Regional Conference 2027',
  '26–31 October 2027',
  'BICC, Lilongwe, Malawi',
  true,
  1500,
  'admin@ifswafrica.com',
  '+265 888 000 2027'
) ON CONFLICT (id) DO NOTHING;

-- 13.3 Default Landing Page CMS Content
INSERT INTO public.landing_content (
  id,
  topbar,
  hero,
  about,
  stats,
  malawi,
  programme,
  ifsw_region,
  subcommittee,
  sponsors,
  organizers,
  cta,
  footer
) VALUES (
  'current',
  '{
    "badgeText": "IFSW AFRICA 2027",
    "subtitle": "Regional Conference",
    "dates": "26–31 October 2027",
    "location": "Lilongwe, Malawi"
  }'::jsonb,
  '{
    "badge": "IFSW Africa Region Conference · 2027",
    "titlePart1": "Advancing",
    "titleHighlight": "social justice",
    "titlePart2": "for Africa.",
    "description": "A continental gathering of social workers, scholars, policymakers, communities and partners committed to building a more just, inclusive and sustainable Africa.",
    "dates": "26–31 October 2027",
    "location": "Lilongwe, Malawi",
    "buttonText": "Register Now →"
  }'::jsonb,
  '{
    "eyebrow": "A continental platform",
    "heading": "Where Africa''s social work community meets.",
    "description": "The IFSW Africa Region Conference 2027 brings together professionals and stakeholders from across Africa and beyond for dialogue, knowledge exchange, collaboration and collective action around social justice.",
    "quote": "“Advancing social justice for Africa” is a call to move from conversation to meaningful action."
  }'::jsonb,
  '{
    "stat1Value": "54",
    "stat1Label": "African Nations Represented",
    "stat2Value": "1,500+",
    "stat2Label": "Social Work Delegates",
    "stat3Value": "40+",
    "stat3Label": "Sessions & Workshops",
    "stat4Value": "5",
    "stat4Label": "Days of Impact"
  }'::jsonb,
  '{
    "eyebrow": "Host Destination",
    "heading": "Experience the Warm Heart of Africa",
    "description": "Lilongwe, Malawi''s peaceful and welcoming capital, will host the IFSW Africa 2027 Conference at the world-class Bingu International Conference Centre (BICC). Beyond the conference halls, experience Malawi''s legendary hospitality, rich culture, and breathtaking natural wonders.",
    "hostCity": "Lilongwe",
    "hostCityLabel": "Host City",
    "conferenceDates": "26–31 Oct",
    "conferenceDatesLabel": "2027",
    "hostCountry": "Malawi",
    "hostCountryLabel": "Warm Heart of Africa"
  }'::jsonb,
  '{
    "eyebrow": "Conference Programme",
    "heading": "Five days of inspiring dialogue, practical learning, and continental solidarity.",
    "description": "From high-level plenary addresses to grassroots community workshops, the IFSW Africa 2027 programme is designed for deep engagement and actionable outcomes.",
    "buttonText": "Register for Conference →",
    "statusBanner": "Full Programme Details & Abstract Submissions Opening Soon · Registrations Open"
  }'::jsonb,
  '{
    "heading": "IFSW Africa Region Leadership",
    "description": "Meet the regional leadership guiding social work across Africa.",
    "members": [
      {
        "id": "1",
        "name": "Dr. Joachim Mumba",
        "role": "IFSW Global President",
        "image": "/JOACHIM.jpg"
      },
      {
        "id": "2",
        "name": "Patience M. Mkandawire",
        "role": "IFSW Regional President – Africa",
        "image": "/PATIENCE.jpg"
      },
      {
        "id": "3",
        "name": "Dr. Charles Mbugua",
        "role": "IFSW Regional Vice President – Africa",
        "image": "/DR CHARLES.jpg"
      },
      {
        "id": "4",
        "name": "Oluwatoni Adeleke",
        "role": "IFSW Africa Representative to Global Human Rights Commission",
        "image": "/ADELEKE.jpg"
      }
    ]
  }'::jsonb,
  '{
    "heading": "Organizing Subcommittee",
    "description": "The dedicated leaders from the Association of Social Workers in Malawi (ASWiM) coordinating the 2027 conference.",
    "members": [
      {
        "id": "sub-1",
        "name": "Mr. Memory Hardwell Mtegha",
        "role": "Chairperson",
        "image": "/MR HARD.jpg"
      },
      {
        "id": "sub-2",
        "name": "Dr. Hope Longwe",
        "role": "Vice Chairperson",
        "image": "/DR HOPE.jpg"
      },
      {
        "id": "sub-3",
        "name": "Ms. Chimwemwe Chirwa",
        "role": "Secretary",
        "image": "/CHIRWA.jpg"
      },
      {
        "id": "sub-4",
        "name": "Mr. Mike Zgambo",
        "role": "Vice Secretary",
        "image": "/ZGABO.jpg"
      }
    ]
  }'::jsonb,
  '{
    "heading": "Our Valued Partners & Sponsors",
    "description": "We are proud to collaborate with leading organizations committed to advancing social work and social justice across Africa.",
    "sponsorName": "Partnership & Sponsorship Opportunities Open",
    "sponsorSubtext": "Contact the secretariat to explore organizational, academic, or corporate partnership packages."
  }'::jsonb,
  '{
    "heading": "Co-Organizing Bodies",
    "description": "Organized jointly by the International Federation of Social Workers (IFSW) Africa Region and the Association of Social Workers in Malawi (ASWiM)."
  }'::jsonb,
  '{
    "watermark": "JOIN US",
    "eyebrow": "Lilongwe, Malawi · 26–31 October 2027",
    "heading": "Be Part of Africa''s Definitive Social Work Gathering",
    "description": "Join over 1,500 delegates from across the continent and beyond as we shape the future of social work, community development, and social justice in Africa.",
    "buttonText": "Complete Registration"
  }'::jsonb,
  '{
    "brandTitle": "IFSW Africa\n2027 Conference",
    "brandTagline": "Advancing social justice for Africa through professional solidarity, knowledge exchange and collective action.",
    "copyrightText": "© 2027 IFSW Africa Region Conference",
    "locationTagline": "Advancing social justice for Africa · Lilongwe, Malawi",
    "contactEmail": "admin@ifswafrica.com"
  }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 13.4 Default Conference Tracks & Sessions
INSERT INTO public.conference_sessions (id, title, track, session_type, room, capacity) VALUES
  ('SES-01', 'Opening Plenary & Presidential Keynote', 'Plenary', 'Keynote', 'Main Auditorium BICC', 1500),
  ('SES-02', 'Social Protection Systems & Universal Healthcare in Africa', 'Policy & Governance', 'Symposium', 'Hall A', 300),
  ('SES-03', 'Indigenous Knowledge & Decolonizing Social Work Curricula', 'Education & Research', 'Workshop', 'Hall B', 200),
  ('SES-04', 'Child Protection, Family Welfare & Community Resilience', 'Community Practice', 'Parallel Panel', 'Hall C', 250),
  ('SES-05', 'Climate Justice, Disaster Response & Forced Displacement', 'Climate & Environment', 'Workshop', 'Hall D', 200),
  ('SES-06', 'Conference Gala Dinner & Cultural Celebration', 'Social & Networking', 'Gala Dinner', 'BICC Grand Banquet Hall', 1200)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- 14. USEFUL DATABASE VIEWS FOR ADMIN REPORTING
-- =====================================================================

CREATE OR REPLACE VIEW public.v_registration_summary AS
SELECT 
  COUNT(*) AS total_registrations,
  COUNT(*) FILTER (WHERE status = 'accepted') AS total_accepted,
  COUNT(*) FILTER (WHERE status = 'pending') AS total_pending,
  COUNT(*) FILTER (WHERE status = 'rejected') AS total_rejected,
  COUNT(*) FILTER (WHERE is_presenter = true) AS total_presenters,
  COUNT(*) FILTER (WHERE is_exhibitor = true) AS total_exhibitors,
  COUNT(*) FILTER (WHERE payment_status = 'paid') AS total_paid,
  COALESCE(SUM(fee_amount) FILTER (WHERE payment_status = 'paid'), 0) AS total_revenue_collected,
  COUNT(DISTINCT country) AS total_countries_represented
FROM public.registrations;

CREATE OR REPLACE VIEW public.v_category_breakdown AS
SELECT 
  category,
  COUNT(*) AS delegate_count,
  COUNT(*) FILTER (WHERE status = 'accepted') AS accepted_count,
  COALESCE(SUM(fee_amount), 0) AS total_fee_value
FROM public.registrations
GROUP BY category
ORDER BY delegate_count DESC;

-- =====================================================================
-- 15. TABLE: ABSTRACT SUBMISSIONS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.abstract_submissions (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  title VARCHAR(50),
  first_name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  job_title VARCHAR(255),
  institution_affiliation TEXT NOT NULL,
  theme_selection VARCHAR(255) NOT NULL,
  proposal_type VARCHAR(100) NOT NULL,
  authors_affiliation TEXT,
  abstract_title TEXT NOT NULL,
  abstract_body TEXT NOT NULL,
  keywords VARCHAR(255) NOT NULL,
  file_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_by VARCHAR(50) REFERENCES public.admins(id) ON DELETE SET NULL,
  status_note TEXT,
  status_updated_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_abstracts_email ON public.abstract_submissions(email);
CREATE INDEX IF NOT EXISTS idx_abstracts_status ON public.abstract_submissions(status);
CREATE INDEX IF NOT EXISTS idx_abstracts_proposal_type ON public.abstract_submissions(proposal_type);
CREATE INDEX IF NOT EXISTS idx_abstracts_submitted_at ON public.abstract_submissions(submitted_at DESC);

CREATE OR REPLACE TRIGGER trigger_update_abstracts_updated_at
BEFORE UPDATE ON public.abstract_submissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.abstract_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit abstracts" ON public.abstract_submissions;
CREATE POLICY "Public can submit abstracts" ON public.abstract_submissions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view and manage abstracts" ON public.abstract_submissions;
CREATE POLICY "Admins can view and manage abstracts" ON public.abstract_submissions
  FOR ALL USING (true);

-- =====================================================================
-- END OF SUPABASE SQL SCHEMA
-- =====================================================================
