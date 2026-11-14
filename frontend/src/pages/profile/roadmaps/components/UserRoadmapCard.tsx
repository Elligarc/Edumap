import { Link } from 'react-router'
import { Edit3, Eye, Layers, Star, Users, Trash2 } from 'lucide-react'
import type { RoadmapResponse } from '@/shared/types/api'
import { Card, Button } from '@/shared/ui'
import { formatNodesCount, formatParticipantsCount } from '@/shared/lib/format'

interface UserRoadmapCardProps {
  roadmap: RoadmapResponse
  onDelete?: (roadmap: RoadmapResponse) => void
}

export function UserRoadmapCard({ roadmap, onDelete }: UserRoadmapCardProps) {
  const nodesCount = roadmap.nodesCount ?? 0
  const studentsCount = roadmap.studentsCount ?? 0
  const hasRating = typeof roadmap.rating === 'number' && roadmap.rating > 0

  return (
    <Card interactive className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-sm text-(--color-text) tracking-tight">
          {roadmap.title}
        </h4>

        <div className="flex items-center gap-3.5 text-xs font-sans tabular-nums text-(--color-text-muted) flex-wrap">
          <div className="flex items-center gap-1.5" title={`Количество узлов: ${nodesCount}`}>
            <Layers size={13} className="text-(--color-text-subtle)" aria-hidden="true" />
            <span>{formatNodesCount(nodesCount)}</span>
          </div>

          {hasRating && (
            <div
              className="flex items-center gap-1 font-semibold text-(--color-text)"
              aria-label={`Оценка ${roadmap.rating!.toFixed(1)} из 5`}
            >
              <Star size={13} className="fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
              <span>{roadmap.rating!.toFixed(1)}</span>
              {typeof roadmap.ratingsCount === 'number' && roadmap.ratingsCount > 0 && (
                <span className="font-normal text-(--color-text-muted)">
                  ({roadmap.ratingsCount})
                </span>
              )}
            </div>
          )}

          <div
            className="flex items-center gap-1.5"
            title={`Количество участников: ${studentsCount}`}
          >
            <Users size={13} className="text-(--color-text-subtle)" aria-hidden="true" />
            <span>{formatParticipantsCount(studentsCount)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center">
        <Link to={`/roadmaps/${roadmap.id}/edit`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Edit3 size={13} className="text-(--color-text-muted)" />
            <span>Редактор</span>
          </Button>
        </Link>

        <Link to={`/roadmaps/${roadmap.id}`} title="Просмотр">
          <Button variant="outline" size="sm" className="px-2">
            <Eye size={15} />
          </Button>
        </Link>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(roadmap)}
            className="px-2 text-(--color-text-subtle) hover:text-(--color-danger) hover:bg-(--color-danger-light)"
            title="Удалить карту"
            aria-label={`Удалить карту ${roadmap.title}`}
          >
            <Trash2 size={15} />
          </Button>
        )}
      </div>
    </Card>
  )
}
