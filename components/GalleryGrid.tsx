"use client";

import Image from "next/image";
import { useState } from "react";
import type { Bouquet } from "@/lib/types";
import { BloomMark } from "./BloomMark";

interface GalleryGridProps {
  bouquets: Bouquet[];
  onDelete: (id: string) => Promise<void>;
}

export function GalleryGrid({ bouquets, onDelete }: GalleryGridProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [items, setItems] = useState(bouquets);

  if (items.length === 0) {
    return <EmptyGalleryState />;
  }

  async function handleDelete(id: string) {
    setPendingId(id);
    try {
      await onDelete(id);
      setItems((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" data-testid="gallery-grid">
      {items.map((bouquet) => (
        <article
          key={bouquet.id}
          className="group overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card"
        >
          <div className="relative aspect-square w-full">
            <Image
              src={bouquet.image_url}
              alt={bouquet.prompt}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-1.5">
              {bouquet.flowers.map((flower) => (
                <span
                  key={flower}
                  className="rounded-full bg-blush px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink/70"
                >
                  {flower}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-ink/60">
              {bouquet.mood} · {bouquet.color_palette}
            </p>
            <p className="mt-1 text-xs text-ink/40">
              {new Date(bouquet.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <button
              type="button"
              onClick={() => handleDelete(bouquet.id)}
              disabled={pendingId === bouquet.id}
              className="mt-4 text-xs font-medium text-mauve-dark underline-offset-4 transition-opacity hover:underline disabled:opacity-50"
            >
              {pendingId === bouquet.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

function EmptyGalleryState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-dashed border-ink/20 px-8 py-20 text-center" data-testid="gallery-empty">
      <BloomMark className="h-12 w-12 text-mauve/50" />
      <h3 className="mt-6 font-display text-2xl text-ink">Your gallery is waiting</h3>
      <p className="mt-2 text-sm text-ink/60">
        Bouquets you save will appear here. Create your first one and give it a home.
      </p>
      <a
        href="/create"
        className="mt-6 rounded-full bg-forest px-6 py-2.5 text-sm font-medium text-paper shadow-soft transition-transform hover:scale-[1.02]"
      >
        Create a bouquet
      </a>
    </div>
  );
}
