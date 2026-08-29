import { supabase } from './supabase';

export const BUCKET_NAME = 'leader-photos';

/**
 * Ensures the Supabase storage bucket exists and is publicly accessible.
 */
async function ensureBucketExists(): Promise<string> {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error && buckets) {
      const exists = buckets.some((b) => b.name === BUCKET_NAME || b.id === BUCKET_NAME);
      if (exists) return BUCKET_NAME;
    }

    // Try creating the public bucket if not present
    const { error: createErr } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 20971520, // 20MB
    });

    if (createErr) {
      if (!createErr.message?.includes('already exists')) {
        console.warn('Could not create bucket:', createErr.message);
      }
    }
  } catch (e) {
    console.warn('Error checking/creating Supabase storage bucket:', e);
  }
  return BUCKET_NAME;
}

/**
 * Uploads a file (photo or document) to the Supabase Storage bucket.
 * Supports leader profiles, registration documents, student IDs, abstracts, and exhibitor materials.
 */
export async function uploadToStorage(
  file: File,
  folder: 'ifsw' | 'subcommittee' | 'leaders' | 'registration-docs' | 'student-ids' | 'abstracts' | 'exhibits' | 'uploads' = 'uploads'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!file) {
      return { success: false, error: 'No file provided.' };
    }

    // Max 20MB limit
    if (file.size > 20 * 1024 * 1024) {
      return { success: false, error: 'File size exceeds 20MB limit.' };
    }

    const bucket = await ensureBucketExists();

    // Sanitize filename & create unique path
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanBaseName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 40);
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const filePath = `${folder}/${cleanBaseName}_${uniqueId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      console.warn('Supabase storage upload error, falling back to data URL:', uploadError);
      
      // Try fallback to 'media' or public bucket if configured
      if (bucket !== 'media') {
        const { error: fallbackUploadErr } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type || 'application/octet-stream',
          });

        if (!fallbackUploadErr) {
          const { data } = supabase.storage.from('media').getPublicUrl(filePath);
          if (data?.publicUrl) {
            return { success: true, url: data.publicUrl };
          }
        }
      }

      // Convert to Data URL fallback so the user operation completes gracefully
      const base64Url = await fileToDataUrl(file);
      return { 
        success: true, 
        url: base64Url, 
        error: `Uploaded as data URL (Storage Note: ${uploadError.message})` 
      };
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    if (!publicData || !publicData.publicUrl) {
      const base64Url = await fileToDataUrl(file);
      return { success: true, url: base64Url };
    }

    return {
      success: true,
      url: publicData.publicUrl,
    };
  } catch (err: any) {
    console.error('Failed to upload file to storage:', err);
    try {
      const fallbackUrl = await fileToDataUrl(file);
      return { success: true, url: fallbackUrl };
    } catch {
      return { success: false, error: err?.message || 'Failed to process file.' };
    }
  }
}

/**
 * Uploads leader photos specifically (IFSW Region and Subcommittee)
 */
export async function uploadLeaderPhoto(
  file: File,
  folder: 'ifsw' | 'subcommittee' | 'leaders' = 'leaders'
): Promise<{ success: boolean; url?: string; error?: string }> {
  return uploadToStorage(file, folder);
}

/**
 * Uploads delegate registration attachments (Student IDs, abstract files, exhibition docs)
 */
export async function uploadRegistrationAttachment(
  file: File,
  type: 'student-id' | 'abstract' | 'exhibit' | 'general' = 'general'
): Promise<{ success: boolean; url?: string; error?: string }> {
  const folderMap = {
    'student-id': 'student-ids' as const,
    'abstract': 'abstracts' as const,
    'exhibit': 'exhibits' as const,
    'general': 'registration-docs' as const,
  };
  return uploadToStorage(file, folderMap[type]);
}

/**
 * Helper to convert file to data URL fallback
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

