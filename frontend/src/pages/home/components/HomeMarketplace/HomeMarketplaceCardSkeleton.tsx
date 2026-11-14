export function HomeMarketplaceCardSkeleton() {
  return (
    <div
      className="bg-(--color-surface) rounded-(--radius-sm) border border-(--color-border) p-6 animate-pulse flex flex-col justify-between h-[210px]"
      data-testid="home-marketplace-card-skeleton"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-(--radius-xs) bg-(--color-surface-muted)" />
        <div className="w-20 h-5 rounded-(--radius-xs) bg-(--color-surface-muted)" />
      </div>

      <div className="space-y-2 py-2">
        <div className="w-3/4 h-5 rounded-(--radius-xs) bg-(--color-border-subtle)" />
        <div className="w-full h-3.5 rounded-(--radius-xs) bg-(--color-surface-muted)" />
        <div className="w-2/3 h-3.5 rounded-(--radius-xs) bg-(--color-surface-muted)" />
      </div>

      <div className="pt-4 border-t border-(--color-surface-muted) flex items-center justify-between">
        <div className="w-24 h-4 rounded-(--radius-xs) bg-(--color-surface-muted)" />
        <div className="w-16 h-4 rounded-(--radius-xs) bg-(--color-surface-muted)" />
      </div>
    </div>
  )
}
