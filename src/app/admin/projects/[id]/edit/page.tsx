import { Suspense } from "react";
import { EditProjectClient } from "@/components/admin/EditProjectClient";

async function EditProjectContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditProjectClient projectId={id} />;
}

/**
 * Halaman Edit Proyek (/admin/projects/[id]/edit).
 * Dibungkus <Suspense> agar sesuai dengan arsitektur Cache Components di Next.js 16.
 */
export default function EditProjectPage({ params }: PageProps<"/admin/projects/[id]/edit">) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-stone">
            Memuat halaman edit...
          </p>
        </div>
      }
    >
      <EditProjectContent params={params} />
    </Suspense>
  );
}
