import type { FormEvent, KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import './CatalogSearch.css'

interface CatalogSearchProps {
  searchQuery: string
  onSearchChange: (val: string) => void
  onSearchSubmit: () => void
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  categories: readonly string[]
}

export function CatalogSearch({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onCategoryChange,
  categories,
}: CatalogSearchProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSearchSubmit()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearchSubmit()
    }
  }

  return (
    <div className="catalog-search" data-testid="catalog-search">
      <form onSubmit={handleSubmit} className="catalog-search-bar">
        <div className="catalog-search-input-wrap">
          <Search size={18} className="catalog-search-icon" />
          <input
            type="text"
            className="catalog-search-input"
            placeholder="Поиск по названию или описанию дорожной карты..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Поиск по каталогу"
          />
        </div>

        <button type="submit" className="catalog-search-submit-btn">
          Поиск
        </button>
      </form>

      <div
        className="catalog-search-categories"
        role="tablist"
        aria-label="Категории каталога"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(cat)}
              className={`catalog-category-chip ${
                isActive ? 'catalog-category-chip--active' : 'catalog-category-chip--inactive'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
