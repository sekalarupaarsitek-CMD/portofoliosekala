"use client";

import { useState } from "react";
import type { FaqItem } from "@/types/content";

/** Akordeon interaktif untuk daftar FAQ di Beranda. */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="border-t border-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.id} className="border-b border-line">
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-xs font-semibold tracking-wide text-ink sm:text-sm">
                  {item.question}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-sm text-stone transition-transform duration-300"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>

            {isOpen && (
              <div className="pb-5 pl-7 pr-4">
                <p className="whitespace-pre-line text-xs leading-relaxed text-stone sm:text-sm">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
