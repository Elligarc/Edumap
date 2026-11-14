import { X, RotateCcw } from 'lucide-react'
import { Button } from '@/shared/ui'
import type {
  CatalogFiltersState,
  RoadmapDifficulty,
  RoadmapPrice,
  RoadmapAuthorType,
} from '@/entities/roadmap'
import './CatalogFilters.css'

interface CatalogFiltersProps {
  filters: CatalogFiltersState
  onFilterChange: <K extends keyof CatalogFiltersState>(key: K, value: CatalogFiltersState[K]) => void
  onResetFilters: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

const DIFFICULTY_OPTIONS: { label: string; value: RoadmapDifficulty | 'ALL' }[] = [
  { label: 'Все уровни', value: 'ALL' },
  { label: 'Легкий', value: 'BEGINNER' },
  { label: 'Средний', value: 'INTERMEDIATE' },
  { label: 'Продвинутый', value: 'ADVANCED' },
]

const PRICE_OPTIONS: { label: string; value: RoadmapPrice | 'ALL' }[] = [
  { label: 'Все', value: 'ALL' },
  { label: 'Бесплатно', value: 'FREE' },
  { label: 'Платно', value: 'PAID' },
]

const AUTHOR_OPTIONS: { label: string; value: RoadmapAuthorType | 'ALL' }[] = [
  { label: 'Все авторы', value: 'ALL' },
  { label: 'Официальные', value: 'OFFICIAL' },
  { label: 'Сообщество', value: 'COMMUNITY' },
]

export function CatalogFilters({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileOpen = false,
  onMobileClose,
}: CatalogFiltersProps) {
  const hasActiveFilters =
    filters.difficulty !== 'ALL' ||
    filters.price !== 'ALL' ||
    filters.authorType !== 'ALL'

  const content = (
    <div className="catalog-filters" data-testid="catalog-filters-content">
      <div className="catalog-filter-group">
        <span className="catalog-filter-title">Уровень</span>
        <div className="catalog-filter-options">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <label key={opt.value} className="catalog-filter-option">
              <input
                type="radio"
                name="difficulty"
                checked={filters.difficulty === opt.value}
                onChange={() => onFilterChange('difficulty', opt.value)}
                className="catalog-filter-radio"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="catalog-filter-group">
        <span className="catalog-filter-title">Цена</span>
        <div className="catalog-filter-options">
          {PRICE_OPTIONS.map((opt) => (
            <label key={opt.value} className="catalog-filter-option">
              <input
                type="radio"
                name="price"
                checked={filters.price === opt.value}
                onChange={() => onFilterChange('price', opt.value)}
                className="catalog-filter-radio"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="catalog-filter-group">
        <span className="catalog-filter-title">Автор</span>
        <div className="catalog-filter-options">
          {AUTHOR_OPTIONS.map((opt) => (
            <label key={opt.value} className="catalog-filter-option">
              <input
                type="radio"
                name="authorType"
                checked={filters.authorType === opt.value}
                onChange={() => onFilterChange('authorType', opt.value)}
                className="catalog-filter-radio"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="catalog-filters-reset-btn flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          <span>Сбросить фильтры</span>
        </button>
      )}
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0" aria-label="Фильтры каталога">
        <div className="sticky top-24 pr-4">{content}</div>
      </aside>

      {isMobileOpen && (
        <div
          className="catalog-filters-drawer-overlay"
          onClick={onMobileClose}
          data-testid="catalog-filters-drawer"
        >
          <div
            className="catalog-filters-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры каталога"
          >
            <div className="catalog-filters-drawer-header">
              <span className="catalog-filters-drawer-title">Фильтры</span>
              <button
                type="button"
                onClick={onMobileClose}
                className="catalog-filters-drawer-close"
                aria-label="Закрыть фильтры"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1">{content}</div>

            <div className="catalog-filters-drawer-footer">
              <Button
                variant="primary"
                onClick={onMobileClose}
                className="w-full py-2.5 text-sm"
              >
                Применить
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
