"use client";

import { GalleryGrid } from "@/components/GalleryGrid";
import type { Bouquet } from "@/lib/types";

interface GalleryPageClientProps {
  initialBouquets: Bouquet[];
}

export function GalleryPageClient({ initialBouquets }: GalleryPageClientProps) {
  async function handleDelete(id: string) {
    const response = await fetch(`/api/bouquets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body?.error || "Unable to delete this bouquet.");
    }
  }

  return <GalleryGrid bouquets={initialBouquets} onDelete={handleDelete} />;
}
