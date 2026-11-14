import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { RoadmapViewerWidget } from '@/widgets/roadmap-viewer'
import { Button } from '@/shared/ui'
import { useNavigateBack } from '@/shared/hooks/useNavigateBack'
import { useRoadmapViewerPage } from './useRoadmapViewerPage'
import './RoadmapViewerPage.css'

export function RoadmapViewerPage() {
  const handleBack = useNavigateBack('/catalog')
  const {
    roadmap,
    canvasData,
    isLoading,
    error,
  } = useRoadmapViewerPage()

  return (
    <div className="roadmap-viewer-page" data-testid="roadmap-viewer-page">
      <AppHeader />

      <main className="roadmap-viewer-main">
        {isLoading ? (
          <div className="roadmap-viewer-loading" data-testid="roadmap-viewer-loading">
            <Loader2 size={40} className="roadmap-viewer-loading-spinner" />
            <p className="roadmap-viewer-loading-text">
              Загрузка карты...
            </p>
          </div>
        ) : error || !roadmap ? (
          <div className="roadmap-viewer-error" data-testid="roadmap-viewer-error">
            <div className="roadmap-viewer-error-icon-box">
              <AlertCircle size={28} />
            </div>
            <h2 className="roadmap-viewer-error-title">
              Не удалось загрузить дорожную карту
            </h2>
            <p className="roadmap-viewer-error-desc">
              {error?.message || 'Дорожная карта не найдена или была удалена'}
            </p>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft size={16} />
              Вернуться в каталог
            </Button>
          </div>
        ) : (
          <RoadmapViewerWidget
            roadmap={roadmap}
            canvasData={canvasData}
          />
        )}
      </main>

      <AppFooter />
    </div>
  )
}
