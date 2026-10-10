export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  category: string;
  description?: string;
  alt?: string;
  isExternalVideo?: boolean;
  fileSize?: number;
  createdAt: string;
  updatedAt?: string;
}

export type MediaCategory = 'Clinic' | 'Doctor' | 'Equipment' | 'Treatment' | 'Videos' | string;

export interface StorageStats {
  totalItems: number;
  totalImages: number;
  totalVideos: number;
  categoriesCount: number;
  estimatedSizeMb: number;
  storageMode: 'supabase' | 'local';
}
