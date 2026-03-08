import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <section className="h-full">
      <div className="sticky top-[48px] bg-[var(--background)]">
        <div className="flex justify-between items-center p-3">
          <div className="h-8 w-32 bg-muted/20 animate-pulse rounded-md" />
          <div className="flex justify-end items-center gap-2 w-1/2">
            <div className="h-10 w-1/2 bg-muted/20 animate-pulse rounded-md" />
            <div className="h-10 w-1/4 bg-muted/20 animate-pulse rounded-md" />
          </div>
        </div>
        <Separator />
      </div>

      <div className="p-[20px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-xl overflow-hidden p-0 animate-pulse bg-muted/5"
          >
            <div className="h-[120px] bg-muted/20" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-muted/20 rounded" />
              <div className="h-4 w-1/2 bg-muted/20 rounded" />

              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-muted/20 rounded-full" />
                <div className="h-6 w-16 bg-muted/20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
