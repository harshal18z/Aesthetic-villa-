import { MediaItem, StorageStats } from "@/types/media";
import { DEFAULT_MEDIA_ITEMS, DEFAULT_CATEGORIES } from "./initialMedia";
import { supabase } from "@/integrations/supabase/client";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const MEDIA_LOCAL_KEY = "aesthetic_villa_media_v2";
const CATS_LOCAL_KEY = "aesthetic_villa_categories_v2";
const BUCKET_NAME = "gallery-media";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
export const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  return !!(url && key && url.startsWith("https://") && key.length > 10);
};

/** Parse a YouTube or Vimeo URL into an embeddable URL */
export const formatVideoUrl = (
  rawUrl: string
): { embedUrl: string; isExternal: boolean } => {
  const trimmed = rawUrl.trim();

  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch?.[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isExternal: true,
    };
  }

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      isExternal: true,
    };
  }

  return { embedUrl: trimmed, isExternal: false };
};

/** Extract high-quality YouTube thumbnail */
export const getYouTubeThumbnail = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match?.[1] ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

// ──────────────────────────────────────────────
// Supabase row → MediaItem mapper
// ──────────────────────────────────────────────
const rowToItem = (d: any): MediaItem => ({
  id: d.id,
  title: d.title,
  type: d.type as "image" | "video",
  url: d.url,
  thumbnailUrl: d.thumbnail_url ?? undefined,
  category: d.category ?? "General",
  description: d.description ?? undefined,
  alt: d.alt ?? d.title,
  isExternalVideo: d.is_external_video ?? false,
  fileSize: d.file_size ?? undefined,
  createdAt: d.created_at ?? new Date().toISOString(),
  updatedAt: d.updated_at ?? undefined,
});

// ──────────────────────────────────────────────
// MediaService class
// ──────────────────────────────────────────────
class MediaService {
  // ── Local storage helpers ──────────────────
  private getLocalItems(): MediaItem[] {
    try {
      const raw = localStorage.getItem(MEDIA_LOCAL_KEY);
      if (!raw) {
        this.setLocalItems(DEFAULT_MEDIA_ITEMS);
        return DEFAULT_MEDIA_ITEMS;
      }
      return JSON.parse(raw) as MediaItem[];
    } catch {
      return DEFAULT_MEDIA_ITEMS;
    }
  }

  private setLocalItems(items: MediaItem[]): void {
    try {
      localStorage.setItem(MEDIA_LOCAL_KEY, JSON.stringify(items));
    } catch {
      /* quota exceeded – ignore */
    }
  }

  // ── Categories ──────────────────────────────
  public getCategories(): string[] {
    try {
      const raw = localStorage.getItem(CATS_LOCAL_KEY);
      if (!raw) {
        localStorage.setItem(CATS_LOCAL_KEY, JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
      }
      const parsed: string[] = JSON.parse(raw);
      return parsed.includes("All") ? parsed : ["All", ...parsed];
    } catch {
      return DEFAULT_CATEGORIES;
    }
  }

  public addCategory(name: string): string[] {
    const trimmed = name.trim();
    const cats = this.getCategories();
    if (!trimmed || cats.includes(trimmed)) return cats;
    const updated = [...cats, trimmed];
    localStorage.setItem(CATS_LOCAL_KEY, JSON.stringify(updated));
    return updated;
  }

  public deleteCategory(name: string): string[] {
    if (name === "All") return this.getCategories();
    const updated = this.getCategories().filter((c) => c !== name);
    localStorage.setItem(CATS_LOCAL_KEY, JSON.stringify(updated));
    return updated;
  }

  // ── Fetch items (Supabase first, then local) ──
  public async getMediaItems(): Promise<MediaItem[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase as any)
          .from("media_items")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(rowToItem);
        }
        if (!error && Array.isArray(data) && data.length === 0) {
          return this.getLocalItems();
        }
      } catch (e) {
        console.warn("[mediaService] Supabase fetch failed, using local:", e);
      }
    }
    return this.getLocalItems();
  }

  // ── Add item ──────────────────────────────────
  public async addMediaItem(
    item: Omit<MediaItem, "id" | "createdAt">
  ): Promise<MediaItem> {
    const newItem: MediaItem = {
      ...item,
      id: `media_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await (supabase as any).from("media_items").insert({
          id: newItem.id,
          title: newItem.title,
          type: newItem.type,
          url: newItem.url,
          thumbnail_url: newItem.thumbnailUrl ?? null,
          category: newItem.category,
          description: newItem.description ?? null,
          alt: newItem.alt ?? newItem.title,
          is_external_video: newItem.isExternalVideo ?? false,
          file_size: newItem.fileSize ?? null,
          created_at: newItem.createdAt,
        });

        if (error) {
          console.warn("[mediaService] Supabase insert error:", error.message);
        }
      } catch (e) {
        console.warn("[mediaService] Supabase insert exception:", e);
      }
    }

    // Always mirror to local storage so gallery works offline too
    const local = this.getLocalItems();
    this.setLocalItems([newItem, ...local]);
    return newItem;
  }

  // ── Update item ───────────────────────────────
  public async updateMediaItem(
    id: string,
    updates: Partial<MediaItem>
  ): Promise<MediaItem | null> {
    const local = this.getLocalItems();
    const idx = local.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    const updated = {
      ...local[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        await (supabase as any)
          .from("media_items")
          .update({
            title: updated.title,
            category: updated.category,
            description: updated.description ?? null,
            alt: updated.alt ?? updated.title,
            updated_at: updated.updatedAt,
          })
          .eq("id", id);
      } catch (e) {
        console.warn("[mediaService] Supabase update error:", e);
      }
    }

    local[idx] = updated;
    this.setLocalItems(local);
    return updated;
  }

  // ── Delete item ───────────────────────────────
  public async deleteMediaItem(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        await (supabase as any).from("media_items").delete().eq("id", id);
      } catch (e) {
        console.warn("[mediaService] Supabase delete error:", e);
      }
    }
    const filtered = this.getLocalItems().filter((i) => i.id !== id);
    this.setLocalItems(filtered);
    return true;
  }

  // ── File upload ───────────────────────────────
  public async uploadMediaFile(
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<{ url: string; fileSize: number }> {
    const fileSize = file.size;
    onProgress?.(10);

    if (isSupabaseConfigured()) {
      try {
        const ext = file.name.split(".").pop() ?? "bin";
        const safeName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = `uploads/${safeName}`;

        onProgress?.(30);

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        onProgress?.(80);

        if (!uploadError) {
          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
          if (data?.publicUrl) {
            onProgress?.(100);
            return { url: data.publicUrl, fileSize };
          }
        } else {
          console.warn(
            "[mediaService] Supabase Storage upload failed:",
            uploadError.message
          );
        }
      } catch (e) {
        console.warn("[mediaService] Supabase upload exception:", e);
      }
    }

    // Fallback to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const pct = Math.round((ev.loaded / ev.total) * 90) + 10;
          onProgress?.(pct);
        }
      };
      reader.onload = () => {
        onProgress?.(100);
        resolve({ url: reader.result as string, fileSize });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ── Stats ─────────────────────────────────────
  public async getStats(): Promise<StorageStats> {
    const items = await this.getMediaItems();
    const cats = this.getCategories();
    const totalBytes = items.reduce((s, i) => s + (i.fileSize ?? 512_000), 0);

    return {
      totalItems: items.length,
      totalImages: items.filter((i) => i.type === "image").length,
      totalVideos: items.filter((i) => i.type === "video").length,
      categoriesCount: Math.max(0, cats.length - 1),
      estimatedSizeMb: Math.round((totalBytes / 1_048_576) * 10) / 10,
      storageMode: isSupabaseConfigured() ? "supabase" : "local",
    };
  }

  public resetToDefaults(): void {
    this.setLocalItems(DEFAULT_MEDIA_ITEMS);
    localStorage.setItem(CATS_LOCAL_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
}

export const mediaService = new MediaService();
