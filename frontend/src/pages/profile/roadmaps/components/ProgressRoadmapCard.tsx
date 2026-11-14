import { useNavigate } from 'react-router'
import { Layers, Star, Users, ArrowRight } from 'lucide-react'
import { Card } from '@/shared/ui'
import { formatNodesCount, formatParticipantsCount } from '@/shared/lib/format'

interface ProgressRoadmapCardProps {
  roadmapId?: number | string
  title: string
  nodesCount: number
  rating: number
  participantsCount: number
  progressPercent: number
}

export function ProgressRoadmapCard({
  roadmapId,
  title,
  nodesCount,
  rating,
  participantsCount,
  progressPercent,
}: ProgressRoadmapCardProps) {
  const navigate = useNavigate()
  const isCompleted = progressPercent === 100
  const hasRating = typeof rating === 'number' && rating > 0

  const handleClick = () => {
    if (roadmapId) {
      navigate(`/roadmaps/${roadmapId}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (roadmapId && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      navigate(`/roadmaps/${roadmapId}`)
    }
  }

  return (
    <Card
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={roadmapId ? 'button' : undefined}
      tabIndex={roadmapId ? 0 : undefined}
      interactive={Boolean(roadmapId)}
      highlight={Boolean(roadmapId)}
      className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 group">
          <h4 className="font-semibold text-sm text-(--color-text) tracking-tight group-hover:text-(--color-primary) transition-colors">
            {title}
          </h4>
          {roadmapId && (
            <ArrowRight size={13} className="text-(--color-text-subtle) opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        <div className="flex items-center gap-3.5 text-xs font-sans tabular-nums text-(--color-text-muted) flex-wrap">
          <div className="flex items-center gap-1.5" title={`Количество узлов: ${nodesCount}`}>
            <Layers size={13} className="text-(--color-text-subtle)" aria-hidden="true" />
            <span>{formatNodesCount(nodesCount)}</span>
          </div>

          {hasRating && (
            <div
              className="flex items-center gap-1 font-semibold text-(--color-text)"
              aria-label={`Оценка ${rating.toFixed(1)} из 5`}
            >
              <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}

          <div
            className="flex items-center gap-1.5"
            title={`Количество участников: ${participantsCount}`}
          >
            <Users size={13} className="text-(--color-text-subtle)" aria-hidden="true" />
            <span>{formatParticipantsCount(participantsCount)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="flex flex-col items-end flex-1 gap-1">
          <div className="flex items-center justify-between w-full font-sans">
            <span className="text-[11px] font-medium text-(--color-text-muted)">
              Прогресс
            </span>
            <span
              className={`text-xs font-semibold tabular-nums ${
                isCompleted ? 'text-(--color-success)' : 'text-(--color-primary)'
              }`}
            >
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-(--color-surface-muted) rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-(--color-success)' : 'bg-(--color-primary)'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}
