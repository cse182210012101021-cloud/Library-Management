export default function Loading() {
  return (
    <div className="relative min-h-screen w-full bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 animate-pulse">
        <div className="h-10 w-32 bg-muted/20 rounded-full" />

        <div className="w-full flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[250px] aspect-square bg-muted/20 rounded-2xl flex-shrink-0" />

          <div className="flex-1 space-y-8 py-4">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-20 bg-muted/20 rounded-full" />
                <div className="h-6 w-32 bg-muted/20 rounded-full" />
              </div>
              <div className="h-12 w-3/4 bg-muted/20 rounded-lg" />
              <div className="h-8 w-1/4 bg-muted/20 rounded-lg" />
            </div>

            <div className="h-px w-full bg-border/50" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-12 bg-muted/20 rounded" />
                  <div className="h-5 w-24 bg-muted/20 rounded" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="h-4 w-24 bg-muted/20 rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-2/3 bg-muted/20 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
