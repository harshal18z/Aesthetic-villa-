import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  mediaService,
  isSupabaseConfigured,
  formatVideoUrl,
  getYouTubeThumbnail,
} from "@/services/mediaService";
import { MediaItem, StorageStats } from "@/types/media";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Image as ImageIcon, Film, Grid, FolderPlus, Trash2, Edit3,
  ExternalLink, LogOut, Plus, CheckCircle2, Search, Database, Key,
  X, Play, Copy, Layers, Sparkles, HardDrive, RefreshCw, Star, MessageSquareQuote,
} from "lucide-react";
import { Review } from "@/data/reviews";
import { reviewsService, REVIEWS_SQL_SETUP } from "@/services/reviewsService";
import { CLINIC_INFO } from "@/data/clinicInfo";
import { toast } from "sonner";

const SupabaseBadge = () =>
  isSupabaseConfigured() ? (
    <span className="text-xs bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
      <Database className="w-3.5 h-3.5" /> Supabase Connected
    </span>
  ) : (
    <span className="text-xs bg-amber-950/80 border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
      <Database className="w-3.5 h-3.5" /> Local Mode
    </span>
  );

export const AdminDashboard: React.FC = () => {
  const { logout, updatePin, adminPin, user } = useAdminAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"library" | "upload" | "categories" | "reviews" | "setup">("library");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Reviews state
  const [dynamicReviews, setDynamicReviews] = useState<Review[]>([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"all" | "Google" | "JustDial">("all");
  const [revName, setRevName] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState("");
  const [revSource, setRevSource] = useState<"Google" | "JustDial">("Google");
  const [revDate, setRevDate] = useState("");
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [rawPasteText, setRawPasteText] = useState("");
  const [showPasteHelper, setShowPasteHelper] = useState(false);
  const [reviewSqlCopied, setReviewSqlCopied] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "image" | "video">("all");
  const [catFilter, setCatFilter] = useState("All");

  const [uploadMode, setUploadMode] = useState<"file" | "embed">("file");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Clinic");
  const [customCat, setCustomCat] = useState("");
  const [description, setDescription] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);

  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [newCatInput, setNewCatInput] = useState("");
  const [sqlCopied, setSqlCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [items, cats, st, revs] = await Promise.all([
        mediaService.getMediaItems(),
        Promise.resolve(mediaService.getCategories()),
        mediaService.getStats(),
        reviewsService.getDynamicReviews(),
      ]);
      setMediaItems(items);
      setCategories(cats);
      setStats(st);
      setDynamicReviews(revs);
    } catch (e) {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = mediaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCat = catFilter === "All" || item.category === catFilter;
    return matchesSearch && matchesType && matchesCat;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (!title) {
      const nameWithoutExt = f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(nameWithoutExt);
    }
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }

    const targetCat = category === "__CUSTOM__" ? customCat.trim() : category;
    if (!targetCat) { toast.error("Please specify a category"); return; }

    setUploading(true);
    setUploadPct(5);

    try {
      let url = "";
      let isExternal = false;
      let isVideo = false;
      let thumbUrl = "";
      let fileSize = 0;

      if (uploadMode === "file") {
        if (!file) { toast.error("Please select a file"); setUploading(false); return; }
        isVideo = file.type.startsWith("video/");
        const result = await mediaService.uploadMediaFile(file, setUploadPct);
        url = result.url;
        fileSize = result.fileSize;
      } else {
        if (!embedUrl.trim()) { toast.error("Please paste a video URL"); setUploading(false); return; }
        const parsed = formatVideoUrl(embedUrl);
        url = parsed.embedUrl;
        isExternal = parsed.isExternal;
        isVideo = true;
        thumbUrl = getYouTubeThumbnail(embedUrl) ?? "";
      }

      if (category === "__CUSTOM__" && customCat) mediaService.addCategory(customCat);

      await mediaService.addMediaItem({
        title: title.trim(),
        type: isVideo ? "video" : "image",
        url,
        thumbnailUrl: thumbUrl || undefined,
        category: targetCat,
        description: description.trim() || undefined,
        alt: title.trim(),
        isExternalVideo: isExternal,
        fileSize: fileSize || undefined,
      });

      toast.success(`${isVideo ? "Video" : "Photo"} published to gallery!`);

      setFile(null);
      setPreviewUrl("");
      setTitle("");
      setDescription("");
      setEmbedUrl("");
      setCustomCat("");
      setUploadPct(0);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await loadData();
      setActiveTab("library");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!window.confirm(`Delete "${itemTitle}"?`)) return;
    await mediaService.deleteMediaItem(id);
    toast.success("Deleted successfully");
    loadData();
  };

  const handleSaveEdit = async () => {
    if (!editItem) return;
    await mediaService.updateMediaItem(editItem.id, {
      title: editItem.title,
      category: editItem.category,
      description: editItem.description,
    });
    toast.success("Updated successfully");
    setEditItem(null);
    loadData();
  };

  const handleAddCat = () => {
    if (!newCatInput.trim()) return;
    const updated = mediaService.addCategory(newCatInput.trim());
    setCategories(updated);
    toast.success(`Category "${newCatInput}" added`);
    setNewCatInput("");
  };

  const handleDeleteCat = (cat: string) => {
    if (!window.confirm(`Delete category "${cat}"?`)) return;
    setCategories(mediaService.deleteCategory(cat));
    toast.success(`Deleted "${cat}"`);
  };

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) { toast.error("PIN must be ≥ 4 characters"); return; }
    updatePin(newPin.trim());
    toast.success("PIN updated!");
    setShowPinModal(false);
    setNewPin("");
  };

  const sqlScript = `-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image','video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'General',
  description TEXT,
  alt TEXT,
  is_external_video BOOLEAN DEFAULT false,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.media_items FOR SELECT USING (true);
CREATE POLICY "admin_write" ON public.media_items FOR ALL USING (true);

-- Storage bucket: Storage → New Bucket → name: "gallery-media" → Public: ON`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setSqlCopied(true);
    toast.success("SQL script copied!");
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim()) {
      toast.error("Reviewer name is required");
      return;
    }
    if (!revText.trim()) {
      toast.error("Review text is required");
      return;
    }

    setRevSubmitting(true);
    try {
      const added = await reviewsService.addReview({
        name: revName,
        rating: revRating,
        text: revText,
        source: revSource,
        date: revDate.trim() || undefined,
      });
      setDynamicReviews([added, ...dynamicReviews]);
      setRevName("");
      setRevText("");
      setRevRating(5);
      setRevDate("");
      setRawPasteText("");
      setShowPasteHelper(false);
      toast.success("Review added to website successfully!");
    } catch (err) {
      toast.error("Failed to save review");
    } finally {
      setRevSubmitting(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to remove this review from the website?")) return;
    try {
      await reviewsService.deleteReview(id);
      setDynamicReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review removed");
    } catch {
      toast.error("Failed to remove review");
    }
  };

  const handleParsePaste = () => {
    if (!rawPasteText.trim()) return;
    const lines = rawPasteText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      setRevName(lines[0]);
    }
    const textLines = lines.slice(1).filter((l) => !l.match(/^\d(\.\d)?\s*stars?$/i) && !l.includes("★"));
    if (textLines.length > 0) {
      setRevText(textLines.join("\n"));
    }
    toast.success("Parsed pasted review text!");
  };

  const copyReviewSql = () => {
    navigator.clipboard.writeText(REVIEWS_SQL_SETUP);
    setReviewSqlCopied(true);
    toast.success("Review SQL schema copied!");
    setTimeout(() => setReviewSqlCopied(false), 2000);
  };

  const filteredReviews = dynamicReviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(reviewSearch.toLowerCase()) ||
      r.text.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesSource = reviewFilter === "all" || r.source === reviewFilter;
    return matchesSearch && matchesSource;
  });

  const tabs = [
    { id: "library" as const, label: `Library (${mediaItems.length})`, icon: Grid },
    { id: "upload" as const, label: "Upload / Embed", icon: Upload },
    { id: "reviews" as const, label: `Google Reviews (${dynamicReviews.length})`, icon: Star },
    { id: "categories" as const, label: "Categories", icon: FolderPlus },
    { id: "setup" as const, label: "Supabase Setup", icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B8955A]/20 border border-[#B8955A]/40 flex items-center justify-center text-[#D9B878] font-black text-sm">
            AV
          </div>
          <div className="leading-tight">
            <p className="font-bold text-white text-sm">The Aesthetic Villa</p>
            <p className="text-[11px] text-slate-400">
              {user ? `Signed in as ${user.email}` : "Admin Panel · PIN session"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SupabaseBadge />

          <Link
            to="/"
            target="_blank"
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Site
          </Link>

          <button
            onClick={() => loadData()}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={() => setShowPinModal(true)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" /> PIN
          </button>

          <button
            onClick={async () => { await logout(); navigate("/admin/login"); toast.info("Logged out"); }}
            className="text-xs bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total Media", value: stats.totalItems, icon: Layers, color: "text-[#D9B878]" },
              { label: "Photos", value: stats.totalImages, icon: ImageIcon, color: "text-blue-400" },
              { label: "Videos", value: stats.totalVideos, icon: Film, color: "text-purple-400" },
              { label: "Categories", value: stats.categoriesCount, icon: Grid, color: "text-emerald-400" },
              { label: "Est. Size", value: `${stats.estimatedSizeMb} MB`, icon: HardDrive, color: "text-amber-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <span className="text-xl font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 border-b border-slate-800 mb-6 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                activeTab === id
                  ? id === "setup"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-[#B8955A] text-white shadow-lg shadow-[#B8955A]/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "library" && (
          <>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-5 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search media…"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                />
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                {(["all", "image", "video"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize cursor-pointer ${
                      typeFilter === t ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t === "all" ? "All" : t === "image" ? "Photos" : "Videos"}
                  </button>
                ))}
              </div>

              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B8955A]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="py-24 text-center flex flex-col items-center gap-3 text-slate-400">
                <div className="w-8 h-8 border-2 border-[#B8955A] border-t-transparent rounded-full animate-spin" />
                Loading media library…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
                <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-slate-300">No media found</p>
                <p className="text-xs text-slate-500 mt-1">Adjust filters or upload new media.</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 bg-[#B8955A] text-white px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col group hover:border-slate-700 transition"
                  >
                    <div
                      className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                      onClick={() => setPreviewItem(item)}
                    >
                      {item.type === "video" ? (
                        <>
                          <img
                            src={item.thumbnailUrl || ""}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
                            <div className="w-11 h-11 rounded-full bg-[#B8955A]/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute top-2 left-2 bg-slate-950/80 text-[10px] px-2 py-0.5 rounded-md text-white border border-slate-800 flex items-center gap-1">
                        {item.type === "video"
                          ? <><Film className="w-3 h-3 text-purple-400" />Video</>
                          : <><ImageIcon className="w-3 h-3 text-blue-400" />Photo</>}
                      </div>
                      <div className="absolute top-2 right-2 bg-[#B8955A]/80 text-[10px] px-2 py-0.5 rounded-full text-white font-semibold">
                        {item.category}
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="font-semibold text-white text-xs line-clamp-1">{item.title}</p>
                      {item.description && (
                        <p className="text-slate-400 text-[11px] line-clamp-2 mt-1">{item.description}</p>
                      )}
                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditItem(item)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "upload" && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D9B878]" /> Add Photo or Video
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              {isSupabaseConfigured()
                ? "Files upload to Supabase Storage and appear in the gallery instantly."
                : "No Supabase key detected — files are stored locally in your browser."}
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
              {[
                { key: "file" as const, label: "Upload File", icon: Upload },
                { key: "embed" as const, label: "Video URL (YouTube/Vimeo)", icon: Film },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setUploadMode(key)}
                  className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    uploadMode === key ? "bg-[#B8955A] text-white shadow-md" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              {uploadMode === "file" && (
                <label className="block">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Select File (JPG / PNG / WEBP / MP4 / WEBM)
                  </span>
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-[#B8955A]/60 rounded-2xl p-6 text-center bg-slate-950/50 cursor-pointer transition group">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previewUrl ? (
                      <div className="space-y-2">
                        {file?.type.startsWith("video/") ? (
                          <video src={previewUrl} controls className="max-h-44 mx-auto rounded-xl shadow-lg" />
                        ) : (
                          <img src={previewUrl} alt="preview" className="max-h-44 mx-auto rounded-xl object-contain shadow-lg" />
                        )}
                        <p className="text-xs text-[#D9B878] font-medium">{file?.name}</p>
                        <p className="text-[11px] text-slate-500">Click to replace</p>
                      </div>
                    ) : (
                      <div className="py-6 space-y-2">
                        <Upload className="w-8 h-8 text-slate-500 mx-auto group-hover:text-[#B8955A] transition" />
                        <p className="text-sm font-medium text-slate-200">Click or drag a file here</p>
                        <p className="text-[11px] text-slate-500">Photos & video recordings</p>
                      </div>
                    )}
                  </div>
                </label>
              )}

              {uploadMode === "embed" && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=… or Vimeo link"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Teeth Whitening Treatment"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__CUSTOM__">+ New Category…</option>
                </select>
                {category === "__CUSTOM__" && (
                  <input
                    type="text"
                    value={customCat}
                    onChange={(e) => setCustomCat(e.target.value)}
                    placeholder="Enter new category name"
                    className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description for gallery card…"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8955A] resize-none"
                />
              </div>

              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Uploading…</span>
                    <span>{uploadPct}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div className="bg-[#B8955A] h-full transition-all" style={{ width: `${uploadPct}%` }} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-[#B8955A] hover:bg-[#a3824c] disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#B8955A]/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {uploading ? (
                  <><div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" /> Uploading…</>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" /> Publish to Gallery</>
                )}
              </button>
            </form>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-emerald-400" /> Manage Categories
            </h2>
            <p className="text-slate-400 text-xs mb-6">Add or remove gallery filter categories.</p>

            <div className="flex gap-2 mb-6">
              <input
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCat())}
                placeholder="New category (e.g. Skin Care)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A]"
              />
              <button
                onClick={handleAddCat}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="space-y-2">
              {categories.filter((c) => c !== "All").map((cat) => (
                <div key={cat} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-[#D9B878]" /> {cat}
                  </span>
                  <button
                    onClick={() => handleDeleteCat(cat)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "setup" && (
          <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-600/30 flex items-center justify-center text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Supabase Database Setup</h2>
                <p className="text-xs text-slate-400">One-time SQL migration to enable cloud gallery storage.</p>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border mb-6 ${isSupabaseConfigured()
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : "bg-amber-950/40 border-amber-500/40 text-amber-300"
            }`}>
              <div className="flex items-center gap-2 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {isSupabaseConfigured()
                  ? "Supabase credentials detected — cloud mode active!"
                  : "Supabase keys not found in .env — running in local mode."}
              </div>
              <p className="text-xs mt-1 text-slate-400">
                {isSupabaseConfigured()
                  ? `Connected URL: ${import.meta.env.VITE_SUPABASE_URL}`
                  : "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env and restart."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">SQL Migration Script</h3>
                <button
                  onClick={copySql}
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 text-white border border-slate-700 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {sqlCopied ? "Copied!" : "Copy SQL"}
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
                {sqlScript}
              </pre>
              <p className="text-[11px] text-slate-500">
                Paste this in <strong>Supabase Dashboard → SQL Editor → Run</strong>.
                Then create the <code className="text-[#D9B878]">gallery-media</code> storage bucket with <strong>Public = ON</strong>.
              </p>
            </div>
          </div>
        )}

        {/* REVIEWS MANAGER TAB */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Top Overview & Action Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-[#B8955A]/20 text-[#D9B878]">
                    <Star className="w-5 h-5 fill-[#B8955A]" />
                  </span>
                  <h2 className="text-xl font-bold text-white">Google Maps Reviews Manager</h2>
                </div>
                <p className="text-xs text-slate-400 max-w-xl">
                  Add newly posted reviews directly from your Google Maps profile or JustDial.
                  New reviews appear at the top of the live website instantly with a &ldquo;Recent&rdquo; verified badge.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={CLINIC_INFO.contact.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-xs px-3.5 py-2 rounded-xl text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Google Maps Profile
                </a>
                <button
                  onClick={() => setShowPasteHelper(!showPasteHelper)}
                  className="bg-[#B8955A]/20 hover:bg-[#B8955A]/30 text-[#D9B878] border border-[#B8955A]/40 text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Quick Paste Google Review
                </button>
              </div>
            </div>

            {/* Quick Paste Helper Accordion */}
            <AnimatePresence>
              {showPasteHelper && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-900/90 border border-[#B8955A]/30 rounded-2xl p-5"
                >
                  <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D9B878]" />
                    Paste Google Review Snippet
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    Copy the reviewer&apos;s name and text directly from Google Maps and paste here. We will auto-extract the name and review text for you.
                  </p>
                  <textarea
                    rows={3}
                    value={rawPasteText}
                    onChange={(e) => setRawPasteText(e.target.value)}
                    placeholder="e.g.&#10;Dr. Rahul Sharma&#10;5 stars&#10;Best dental clinic in Kothrud! Dr. Tejashree was very gentle..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#B8955A] mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleParsePaste}
                      className="bg-[#B8955A] hover:bg-[#a3824c] text-white text-xs px-4 py-2 rounded-xl font-semibold transition cursor-pointer"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasteHelper(false)}
                      className="bg-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl hover:bg-slate-700 transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Add Review Form */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D9B878]" />
                  Add New Review
                </h3>

                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Platform Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Platform Source
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRevSource("Google")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          revSource === "Google"
                            ? "bg-[#B8955A] text-white border-[#B8955A]"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        Google Maps
                      </button>
                      <button
                        type="button"
                        onClick={() => setRevSource("JustDial")}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          revSource === "JustDial"
                            ? "bg-[#B8955A] text-white border-[#B8955A]"
                            : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        JustDial
                      </button>
                    </div>
                  </div>

                  {/* Reviewer Name */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Patient / Reviewer Name *
                    </label>
                    <input
                      type="text"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Rating ({revRating} Stars)
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className="p-1 hover:scale-125 transition cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= revRating
                                ? "fill-[#B8955A] text-[#B8955A]"
                                : "text-slate-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Review Date (Optional)
                    </label>
                    <input
                      type="text"
                      value={revDate}
                      onChange={(e) => setRevDate(e.target.value)}
                      placeholder="e.g. Oct 2026 or 2 days ago"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Review Text *
                    </label>
                    <textarea
                      rows={4}
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                      placeholder="Paste patient review text here..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8955A] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={revSubmitting}
                    className="w-full bg-[#B8955A] hover:bg-[#a3824c] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {revSubmitting ? "Saving Review…" : "Publish Review to Website"}
                  </button>
                </form>

                {/* Supabase SQL Helper Card */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Supabase Cloud Sync
                    </span>
                    <button
                      onClick={copyReviewSql}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded flex items-center gap-1 border border-slate-700 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      {reviewSqlCopied ? "Copied" : "Copy SQL"}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    To persist reviews in the cloud across all devices, run the reviews SQL table script in Supabase once.
                  </p>
                </div>
              </div>

              {/* Right Column: Live Dynamic Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      placeholder="Search recent reviews…"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B8955A]"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(["all", "Google", "JustDial"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setReviewFilter(filter)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                          reviewFilter === filter
                            ? "bg-[#B8955A] text-white"
                            : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                        }`}
                      >
                        {filter === "all" ? "All Sources" : filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reviews List Cards */}
                {filteredReviews.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
                    <Star className="w-8 h-8 text-[#B8955A] mx-auto mb-3 opacity-40" />
                    <h4 className="text-sm font-bold text-white mb-1">No custom reviews added yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                      When you add newly posted reviews using the form on the left, they will appear here and at the top of your public website.
                    </p>
                    <button
                      onClick={() => setShowPasteHelper(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-xs px-4 py-2 rounded-xl text-slate-200 border border-slate-700 transition cursor-pointer"
                    >
                      Add First Google Review
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-slate-700 transition"
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-white">{rev.name}</span>
                            <span className="text-[10px] bg-[#B8955A]/20 text-[#D9B878] border border-[#B8955A]/30 px-2 py-0.5 rounded-full font-medium">
                              {rev.source}
                            </span>
                            <span className="text-[10px] text-slate-500">{rev.date || "Recent"}</span>
                            <div className="flex items-center gap-0.5 ml-auto sm:ml-0">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#B8955A] text-[#B8955A]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            &ldquo;{rev.text}&rdquo;
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            title="Remove review from website"
                            className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-400 border border-red-900 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">Edit Media Details</h3>
                <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Title</label>
                  <input
                    value={editItem.title}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Category</label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editItem.description || ""}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A] resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setEditItem(null)}
                    className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-[#B8955A] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#a3824c] transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Media Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{previewItem.title}</h3>
                  <span className="text-[10px] text-[#D9B878] font-semibold uppercase">{previewItem.category}</span>
                </div>
                <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-auto bg-slate-950 flex items-center justify-center min-h-[300px]">
                {previewItem.type === "video" ? (
                  previewItem.isExternalVideo ? (
                    <iframe
                      src={previewItem.url}
                      title={previewItem.title}
                      className="w-full aspect-video rounded-xl shadow-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <video src={previewItem.url} controls className="max-h-[60vh] w-full rounded-xl shadow-lg" />
                  )
                ) : (
                  <img src={previewItem.url} alt={previewItem.title} className="max-h-[60vh] object-contain rounded-xl shadow-lg" />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PIN Update Modal */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#D9B878]" /> Change Admin PIN
                </h3>
                <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handlePinUpdate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Current PIN: <span className="text-[#D9B878] font-mono">{adminPin}</span>
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="Enter new PIN (min 4 chars)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8955A] font-mono"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPinModal(false)}
                    className="flex-1 bg-slate-800 text-slate-300 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#B8955A] text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-[#a3824c] transition cursor-pointer"
                  >
                    Save PIN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
