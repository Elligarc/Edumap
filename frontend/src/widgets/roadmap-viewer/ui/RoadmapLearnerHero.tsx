import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import {
  ArrowLeft,
  Star,
  Heart,
  CheckCircle2,
  Layers,
  BadgeCheck,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/shared/ui'
import { useNavigateBack } from '@/shared/hooks/useNavigateBack'
import { useAuthStore } from '@/entities/session'
import { formatRatingsCount } from '@/shared/lib/format'
import { useRoadmapRating } from '@/entities/roadmap/model/useRoadmapRating'
import type { RoadmapResponse } from '@/shared/types/api'
import './RoadmapLearnerHero.css'

interface RoadmapLearnerHeroProps {
  roadmap?: Partial<RoadmapResponse> | null
  stats: {
    total: number
    completed: number
    percentage: number
  }
  isEnrolled?: boolean
  onEnrollToggle?: () => void
  isEnrolling?: boolean
}

export function RoadmapLearnerHero({
  roadmap,
  stats,
  isEnrolled = false,
  onEnrollToggle,
  isEnrolling = false,
}: RoadmapLearnerHeroProps) {
  const handleBack = useNavigateBack('/catalog')
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const { rating, saveRating, isSubmitting } = useRoadmapRating(
    roadmap?.id,
    roadmap?.currentUserRating,
  )

  const userRating = isAuthenticated && user ? rating : null

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } })
      return
    }
    if (onEnrollToggle) {
      onEnrollToggle()
    }
  }

  const handleRateClick = () => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { from: location } })
      return
    }
    setIsRatingOpen((prev) => !prev)
  }

  const handleRate = (score: number) => {
    if (!isAuthenticated || !user?.id) {
      navigate('/login', { state: { from: location } })
      return
    }
    saveRating(score)
    setIsRatingOpen(false)
  }

  return (
    <section className="roadmap-learner-hero" data-testid="roadmap-learner-hero">
      <div className="roadmap-hero-nav">
        <button
          type="button"
          onClick={handleBack}
          className="roadmap-hero-back-link"
          aria-label="Назад к каталогу"
        >
          <ArrowLeft size={16} />
          <span>Назад к каталогу</span>
        </button>
      </div>

      <div className="roadmap-hero-main">
        <div className="roadmap-hero-info">
          <div className="roadmap-hero-badges">
            {roadmap?.category && (
              <Badge variant="primary">{roadmap.category}</Badge>
            )}
            <Badge variant="primary" className="gap-1">
              <BadgeCheck size={13} className="text-[#0284c7]" />
              Официальный роадмап
            </Badge>
            {roadmap?.difficulty && (
              <Badge variant="outline">
                {roadmap.difficulty === 'BEGINNER'
                  ? 'Легкий'
                  : roadmap.difficulty === 'ADVANCED'
                  ? 'Продвинутый'
                  : 'Средний'}
              </Badge>
            )}
          </div>

          <h1 className="roadmap-hero-title">
            {roadmap?.title || 'Загрузка дорожной карты...'}
          </h1>

          <div className="roadmap-hero-stats">
            {roadmap?.authorName && (
              <>
                <span className="text-slate-700 font-medium">от {roadmap.authorName}</span>
                <span>•</span>
              </>
            )}
            {typeof roadmap?.rating === 'number' && roadmap.rating > 0 ? (
              <div className="roadmap-hero-rating">
                <Star size={15} className="fill-amber-400 text-amber-500" />
                <span>{roadmap.rating.toFixed(1)}</span>
                {typeof roadmap.ratingsCount === 'number' && roadmap.ratingsCount > 0 && (
                  <span className="text-slate-400 font-normal">
                    ({formatRatingsCount(roadmap.ratingsCount)})
                  </span>
                )}
              </div>
            ) : (
              <div className="roadmap-hero-rating text-slate-400 font-normal">
                <Star size={15} className="text-slate-300" />
                <span>Нет оценок</span>
              </div>
            )}
            <span>•</span>
            <div className="inline-flex items-center gap-1.5">
              <Layers size={14} className="text-slate-400" />
              <span>{stats.total || roadmap?.nodesCount || 0} тем на карте</span>
            </div>
          </div>

          <p className="roadmap-hero-desc">
            {roadmap?.description ||
              'Пошаговый образовательный план для систематического освоения навыков и технологий от базовых принципов до уверенной практики.'}
          </p>

          <div className="roadmap-hero-actions">
            <button
              type="button"
              onClick={handleEnrollClick}
              disabled={isEnrolling}
              className={`roadmap-hero-enroll-btn ${
                isEnrolled
                  ? 'roadmap-hero-enroll-btn--enrolled'
                  : 'roadmap-hero-enroll-btn--idle'
              }`}
              data-testid="roadmap-hero-enroll-btn"
            >
              {isEnrolling ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Сохранение...</span>
                </>
              ) : isEnrolled ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>В процессе изучения</span>
                </>
              ) : (
                <>
                  <Heart size={16} />
                  <span>Добавить для прохождения</span>
                </>
              )}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={handleRateClick}
                className="roadmap-hero-rate-btn"
                aria-label="Оценить дорожную карту"
                data-testid="roadmap-hero-rate-btn"
              >
                <Star
                  size={15}
                  className={userRating ? 'fill-amber-400 text-amber-500' : 'text-amber-600'}
                />
                <span>{userRating ? `Ваша оценка: ${userRating}` : 'Оценить'}</span>
              </button>

              {isRatingOpen && (
                <div
                  className="absolute left-0 top-full mt-2 bg-(--color-surface) rounded-(--radius-sm) shadow-lg border border-(--color-border) p-2.5 flex items-center gap-1.5 z-20"
                  role="dialog"
                  aria-label="Выбор оценки"
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(star)}
                      className="p-1 hover:scale-110 transition-transform text-amber-400 hover:text-amber-500"
                      aria-label={`Оценка ${star}`}
                    >
                      <Star
                        size={20}
                        className={
                          (userRating || 0) >= star
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-300 hover:text-amber-400'
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="roadmap-hero-progress-card" data-testid="roadmap-hero-progress-card">
          <div className="roadmap-hero-progress-header">
            <span>Прогресс изучения</span>
            <span className="roadmap-hero-progress-value">{stats.percentage}%</span>
          </div>
          <div className="roadmap-hero-progress-track">
            <div
              className="roadmap-hero-progress-fill"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
          <span className="roadmap-hero-progress-subtext">
            Пройдено {stats.completed} из {stats.total} тем
          </span>
        </div>
      </div>
    </section>
  )
}
