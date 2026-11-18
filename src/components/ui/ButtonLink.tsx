import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "light" | "outline-light";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-ink text-paper hover:bg-ink/85",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
  light: "bg-white text-ink hover:bg-white/90",
  "outline-light": "border border-white/60 text-white hover:bg-white hover:text-ink",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean; // true = buka di tab baru (misal: WhatsApp / Gmail)
  className?: string;
}

/** Tombol berbentuk tautan. Sudut tegas, sesuai gaya arsitektural. */
export function ButtonLink({ href, children, variant = "primary", external = false, className = "" }: ButtonLinkProps) {
  const classes = `inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${VARIANT_CLASSES[variant]} ${className}`;

  if (href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
