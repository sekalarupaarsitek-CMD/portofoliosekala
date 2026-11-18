"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ProjectGalleryProps {
  title: string;
  images: string[];
}

/**
 * Galeri foto proyek. Klik foto untuk memperbesar (lightbox).
 * Di lightbox: tombol ← → atau panah keyboard untuk ganti foto, Esc untuk menutup.
 */
export function ProjectGallery({ title, images }: ProjectGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrevious = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  // Kontrol keyboard + kunci scroll halaman saat lightbox terbuka
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, close, showPrevious, showNext]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Perbesar foto ${index + 1} dari ${images.length}`}
            className={`group relative cursor-zoom-in overflow-hidden bg-sand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
              // Foto pertama dibuat lebar penuh agar komposisi galeri tidak monoton
              index === 0 && images.length > 2 ? "aspect-[16/9] sm:col-span-2" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={src}
              alt={`${title} — foto ${index + 1}`}
              fill
              sizes={index === 0 && images.length > 2 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
              loading="lazy"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galeri ${title}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95"
          onClick={close}
        >
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-white sm:p-6">
            <span className="font-mono text-xs tracking-[0.2em] text-white/70">
              {String(openIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Tutup galeri"
              className="cursor-pointer p-2 text-xs uppercase tracking-[0.2em] text-white/80 hover:text-white"
            >
              Tutup ✕
            </button>
          </div>

          <div
            className="relative h-[75vh] w-[92vw] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${title} — foto ${openIndex + 1}`}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrevious();
                }}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer p-3 text-2xl text-white/70 hover:text-white sm:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-3 text-2xl text-white/70 hover:text-white sm:right-6"
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
