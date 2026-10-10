import { Review, GOOGLE_REVIEWS, JUSTDIAL_REVIEWS, ALL_REVIEWS } from "@/data/reviews";
import { supabase } from "@/integrations/supabase/client";
import { isSupabaseConfigured } from "./mediaService";

const DYNAMIC_REVIEWS_LOCAL_KEY = "aesthetic_villa_dynamic_reviews_v1";

export interface ReviewInput {
  name: string;
  rating: number;
  text: string;
  source: "Google" | "JustDial";
  date?: string;
}

class ReviewsService {
  // ── Local storage fallback ──────────────────
  private getLocalDynamicReviews(): Review[] {
    try {
      const raw = localStorage.getItem(DYNAMIC_REVIEWS_LOCAL_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Review[];
    } catch {
      return [];
    }
  }

  private setLocalDynamicReviews(reviews: Review[]): void {
    try {
      localStorage.setItem(DYNAMIC_REVIEWS_LOCAL_KEY, JSON.stringify(reviews));
    } catch {
      /* quota exceeded or private mode */
    }
  }

  // ── Fetch only newly added / dynamic reviews ──────────────────
  public async getDynamicReviews(): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase as any)
          .from("reviews")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && Array.isArray(data)) {
          return data.map((d: any) => ({
            id: String(d.id),
            name: d.name,
            rating: Number(d.rating) || 5,
            text: d.text,
            source: (d.source === "JustDial" ? "JustDial" : "Google") as "Google" | "JustDial",
            date: d.date || (d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Recent"),
            isCustom: true,
          }));
        }
      } catch (err) {
        console.warn("Supabase reviews table fetch error, falling back to local:", err);
      }
    }
    return this.getLocalDynamicReviews();
  }

  // ── Fetch all reviews (Dynamic new ones at top + default catalog) ──
  public async getAllMergedReviews(): Promise<{
    all: Review[];
    google: Review[];
    justdial: Review[];
    dynamicCount: number;
  }> {
    const dynamic = await this.getDynamicReviews();

    // Avoid duplicate IDs
    const dynamicIds = new Set(dynamic.map((r) => r.id));
    const baseGoogle = GOOGLE_REVIEWS.filter((r) => !dynamicIds.has(r.id));
    const baseJustDial = JUSTDIAL_REVIEWS.filter((r) => !dynamicIds.has(r.id));

    const google = [
      ...dynamic.filter((r) => r.source === "Google"),
      ...baseGoogle,
    ];

    const justdial = [
      ...dynamic.filter((r) => r.source === "JustDial"),
      ...baseJustDial,
    ];

    const all = [
      ...dynamic,
      ...ALL_REVIEWS.filter((r) => !dynamicIds.has(r.id)),
    ];

    return {
      all,
      google,
      justdial,
      dynamicCount: dynamic.length,
    };
  }

  // ── Add a new Review ────────────────────────
  public async addReview(input: ReviewInput): Promise<Review> {
    const newId = `dyn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const displayDate = input.date?.trim() || new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" });

    const newReview: Review = {
      id: newId,
      name: input.name.trim(),
      rating: Math.min(5, Math.max(1, input.rating || 5)),
      text: input.text.trim(),
      source: input.source || "Google",
      date: displayDate,
      isCustom: true,
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await (supabase as any)
          .from("reviews")
          .insert([
            {
              name: newReview.name,
              rating: newReview.rating,
              text: newReview.text,
              source: newReview.source,
              date: newReview.date,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          const inserted: Review = {
            id: String(data.id),
            name: data.name,
            rating: Number(data.rating) || 5,
            text: data.text,
            source: data.source as "Google" | "JustDial",
            date: data.date,
            isCustom: true,
          };
          // Also sync locally
          const local = this.getLocalDynamicReviews();
          this.setLocalDynamicReviews([inserted, ...local]);
          return inserted;
        }
      } catch (err) {
        console.warn("Supabase insert failed, storing locally:", err);
      }
    }

    // Local fallback
    const local = this.getLocalDynamicReviews();
    const updated = [newReview, ...local];
    this.setLocalDynamicReviews(updated);
    return newReview;
  }

  // ── Delete a dynamic Review ──────────────────
  public async deleteReview(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await (supabase as any)
          .from("reviews")
          .delete()
          .eq("id", id);
        if (!error) {
          const local = this.getLocalDynamicReviews().filter((r) => r.id !== id);
          this.setLocalDynamicReviews(local);
          return true;
        }
      } catch (err) {
        console.warn("Supabase delete failed:", err);
      }
    }

    const local = this.getLocalDynamicReviews().filter((r) => r.id !== id);
    this.setLocalDynamicReviews(local);
    return true;
  }
}

export const reviewsService = new ReviewsService();

export const REVIEWS_SQL_SETUP = `-- 1. Create the reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Google',
  date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 3. Allow public to read reviews on the website
CREATE POLICY "Public reviews are viewable by everyone" 
ON public.reviews FOR SELECT 
USING (true);

-- 4. Allow admin/service to insert, update and delete
CREATE POLICY "Allow insert reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow update reviews" 
ON public.reviews FOR UPDATE 
USING (true);

CREATE POLICY "Allow delete reviews" 
ON public.reviews FOR DELETE 
USING (true);`;
