export default function PageLoading() {
  return (
    <article className="py-6 prose">
      <div className="h-8 w-1/2 bg-muted rounded animate-pulse mb-4" />
      <div className="h-5 w-2/3 bg-muted rounded animate-pulse mb-6" />
      <div className="h-4 w-full bg-muted rounded animate-pulse mb-3" />
      <div className="h-4 w-11/12 bg-muted rounded animate-pulse mb-3" />
      <div className="h-4 w-10/12 bg-muted rounded animate-pulse" />
    </article>
  );
}
