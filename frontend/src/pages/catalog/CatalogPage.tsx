import { ChevronLeft, ChevronRight, FolderSearch, RotateCcw } from 'lucide-react'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { Button } from '@/shared/ui'
import { RoadmapCard, RoadmapCardSkeleton } from '@/entities/roadmap'
import { CatalogSearch } from '@/features/catalog-search'
import { CatalogFilters } from '@/features/catalog-filters'
import { useCatalogPage } from './useCatalogPage'
import './CatalogPage.css'

export function CatalogPage() {
  const {
    filters,
    searchInput,
    categories,
    roadmaps,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleFilterChange,
    handleSortChange,
    handleResetFilters,
    handlePageChange,
  } = useCatalogPage()

  return (
    <div className="catalog-page" data-testid="catalog-page">
      <AppHeader />

      <main className="catalog-page-main">
        <section className="catalog-hero">
          <h1 className="catalog-hero-title">Исследуйте дорожные карты</h1>
          <p className="catalog-hero-subtitle">
            Откройте для себя пути от сообщества для освоения любого навыка.
          </p>
        </section>

        <CatalogSearch
          searchQuery={searchInput}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          selectedCategory={filters.category}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />

        <div className="catalog-layout">
          <CatalogFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />

          <section className="catalog-content">
            <div className="catalog-toolbar">
              <span className="catalog-results-count">
                Показано {totalCount} {" "} 
                {totalCount === 1 ? 'результат' : totalCount < 5 ? 'результата' : 'результатов'}
                {filters.search && ` для «${filters.search}»`}
              </span>

              <div className="catalog-sort-wrap">
                <label htmlFor="catalog-sort-select" className="catalog-sort-label">
                  Сортировать по:
                </label>
                <select
                  id="catalog-sort-select"
                  value={filters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value as typeof filters.sortBy)}
                  className="catalog-sort-select"
                  aria-label="Сортировка каталога"
                >
                  <option value="popular">Популярности</option>
                  <option value="newest">Новизне</option>
                  <option value="title">Названию</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="catalog-grid" data-testid="catalog-loading-grid">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <RoadmapCardSkeleton key={idx} />
                ))}
              </div>
            ) : roadmaps.length === 0 ? (
              <div className="catalog-empty" data-testid="catalog-empty-state">
                <FolderSearch className="catalog-empty-icon" />
                <h3 className="catalog-empty-title">Дорожные карты не найдены</h3>
                <p className="catalog-empty-desc">
                  По заданным параметрам поиска и фильтров ничего не найдено. Попробуйте изменить
                  запрос или сбросить фильтры.
                </p>
                <Button
                  variant="primary"
                  onClick={handleResetFilters}
                  className="gap-2"
                >
                  <RotateCcw size={14} />
                  <span>Сбросить фильтры</span>
                </Button>
              </div>
            ) : (
              <div className="catalog-grid" data-testid="catalog-grid">
                {roadmaps.map((item) => (
                  <RoadmapCard key={item.id} roadmap={item} />
                ))}
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <nav className="catalog-pagination" aria-label="Пагинация каталога">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className={`catalog-page-btn catalog-page-btn--inactive ${
                    currentPage <= 1 ? 'catalog-page-btn--disabled' : ''
                  }`}
                  aria-label="Предыдущая страница"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1
                  const isActive = currentPage === pageNum
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`catalog-page-btn ${
                        isActive ? 'catalog-page-btn--active' : 'catalog-page-btn--inactive'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`catalog-page-btn catalog-page-btn--inactive ${
                    currentPage >= totalPages ? 'catalog-page-btn--disabled' : ''
                  }`}
                  aria-label="Следующая страница"
                >
                  <ChevronRight size={18} />
                </button>
              </nav>
            )}
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}
