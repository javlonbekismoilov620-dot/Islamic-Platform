export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Yuklanmoqda">
      <div className="skeleton h-10 w-64" />
      <div className="skeleton h-5 w-96 max-w-full" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><div className="skeleton h-32" /><div className="skeleton h-32" /></div>
    </div>
  );
}
