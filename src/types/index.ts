export interface Chapter {
  id: string; // UUID
  sort_order: number; // Replaces chapter_number to support front matter (Preface, etc.)
  title: string;
  slug: string;
  content_html: string;
  summary: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface Authority {
  id: string; // UUID
  title: string;
  slug: string;
  content_html: string;
  summary: string | null;
  is_published: boolean;
  published_at: string | null; // ISO timestamp
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface SyncMeta {
  lastSyncTimestamp: string | null; // ISO timestamp of the last successful sync
}
