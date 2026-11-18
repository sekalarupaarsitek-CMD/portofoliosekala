import type { ReactNode } from "react";

interface SectionHeadingProps {
  index: string; // nomor bagian, contoh "01"
  eyebrow: string; // label kecil di atas judul
  title: ReactNode;
  description?: string;
  tone?: "dark" | "light"; // light = untuk latar gelap
}

/** Judul bagian ringkas & bersih mengikuti gaya tipografi bar atas. */
export function SectionHeading({ index, eyebrow, title, description, tone = "dark" }: SectionHeadingProps) {
  const titleColor = tone === "light" ? "text-white" : "text-ink";
  const mutedColor = tone === "light" ? "text-white/70" : "text-stone";

  return (
    <div className="max-w-xl">
      <p className={`flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] ${mutedColor}`}>
        <span className="font-mono text-accent">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-accent" />
        <span>{eyebrow}</span>
      </p>
      <h2 className={`mt-3 font-sans text-xl font-semibold leading-snug tracking-tight sm:text-2xl lg:text-[1.75rem] ${titleColor}`}>
        {title}
      </h2>
      {description && <p className={`mt-2 text-xs leading-relaxed sm:text-sm ${mutedColor}`}>{description}</p>}
    </div>
  );
}
