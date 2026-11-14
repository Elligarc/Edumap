import { Link } from 'react-router'
import { BadgeCheck, ArrowRight, Star, Users } from 'lucide-react'
import type { CatalogRoadmap } from '../../model/catalog-types'
import './RoadmapCard.css'

interface RoadmapCardProps {
  roadmap: CatalogRoadmap
}

const DIFFICULTY_CONFIG: Record<
  CatalogRoadmap['difficulty'],
  {
    label: string
    level: number
  }
> = {
  BEGINNER: {
    label: 'Легкий',
    level: 1,
  },
  INTERMEDIATE: {
    label: 'Средний',
    level: 2,
  },
  ADVANCED: {
    label: 'Продвинутый',
    level: 3,
  },
}

function formatPrice(price?: number | null): string {
  if (price === undefined || price === null || price <= 0) {
    return 'Бесплатно'
  }
  return `${Math.round(price).toLocaleString('ru-RU')} ₽`
}

export function RoadmapCard({ roadmap }: RoadmapCardProps) {
  const isFree = roadmap.price === 'FREE' || !roadmap.priceValue
  const difficulty = DIFFICULTY_CONFIG[roadmap.difficulty] || DIFFICULTY_CONFIG.BEGINNER

  return (
    <article className="roadmap-card group" data-testid={`roadmap-card-${roadmap.id}`}>
      <Link
        to={`/roadmaps/${roadmap.id}`}
        className="roadmap-card-link focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/20 rounded-(--radius-sm)"
      >
        <div className="roadmap-card-layout">
          <div className="roadmap-card-main">
            <div className="roadmap-card-header-line">
              <span className="roadmap-card-category">{roadmap.category}</span>
              {roadmap.authorName && (
                <>
                  <span className="roadmap-card-separator">•</span>
                  <span className="roadmap-card-author">от {roadmap.authorName}</span>
                </>
              )}
            </div>

            <h3 className="roadmap-card-title">{roadmap.title}</h3>
            <p className="roadmap-card-description">{roadmap.description}</p>

            <div className="roadmap-card-meta">
              <span className="roadmap-card-meta-item">
                {roadmap.stepsCount} тем
              </span>

              <span className="roadmap-card-separator">•</span>
              <span
                className="roadmap-card-meta-item roadmap-card-difficulty"
                title={`Сложность: ${difficulty.label}`}
                aria-label={`Сложность: ${difficulty.label}`}
              >
                <span className="roadmap-card-difficulty-bars" aria-hidden="true">
                  <span
                    className={`roadmap-card-difficulty-bar bar-1 ${
                      difficulty.level >= 1
                        ? 'roadmap-card-difficulty-bar--active'
                        : 'roadmap-card-difficulty-bar--inactive'
                    }`}
                  />
                  <span
                    className={`roadmap-card-difficulty-bar bar-2 ${
                      difficulty.level >= 2
                        ? 'roadmap-card-difficulty-bar--active'
                        : 'roadmap-card-difficulty-bar--inactive'
                    }`}
                  />
                  <span
                    className={`roadmap-card-difficulty-bar bar-3 ${
                      difficulty.level >= 3
                        ? 'roadmap-card-difficulty-bar--active'
                        : 'roadmap-card-difficulty-bar--inactive'
                    }`}
                  />
                </span>
                <span className="roadmap-card-difficulty-label">{difficulty.label}</span>
              </span>

              {typeof roadmap.rating === 'number' && roadmap.rating > 0 && (
                <>
                  <span className="roadmap-card-separator">•</span>
                  <span
                    className="roadmap-card-meta-item roadmap-card-meta-rating"
                    aria-label={`Оценка ${roadmap.rating.toFixed(1)} из 5`}
                  >
                    <Star size={13} className="roadmap-card-rating-star" aria-hidden="true" />
                    <span>{roadmap.rating.toFixed(1)}</span>
                    {typeof roadmap.ratingsCount === 'number' && roadmap.ratingsCount > 0 && (
                      <span className="roadmap-card-rating-count">
                        ({roadmap.ratingsCount})
                      </span>
                    )}
                  </span>
                </>
              )}

              {typeof roadmap.studentsCount === 'number' && roadmap.studentsCount > 0 && (
                <>
                  <span className="roadmap-card-separator">•</span>
                  <span
                    className="roadmap-card-meta-item"
                    aria-label={`${roadmap.studentsCount.toLocaleString('ru-RU')} учащихся`}
                  >
                    <Users size={13} className="text-[#64748b]" aria-hidden="true" />
                    <span>{roadmap.studentsCount.toLocaleString('ru-RU')} учащихся</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="roadmap-card-sidebar">
            <div className="roadmap-card-badges-top">
              {roadmap.isOfficial && (
                <span className="roadmap-card-badge-official">
                  <BadgeCheck size={13} className="text-[#0284c7]" />
                  Официальный
                </span>
              )}
            </div>

            <div className="roadmap-card-footer-right">
              <span
                className={`roadmap-card-price ${
                  isFree ? 'roadmap-card-price--free' : 'roadmap-card-price--paid'
                }`}
              >
                {isFree ? 'Бесплатно' : formatPrice(roadmap.priceValue)}
              </span>

              <div className="roadmap-card-action" aria-hidden="true">
                <ArrowRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
