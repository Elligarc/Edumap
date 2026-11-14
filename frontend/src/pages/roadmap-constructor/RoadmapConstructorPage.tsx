import { Link } from 'react-router'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { RoadmapEditorWidget } from '@/widgets/roadmap-editor'
import { ConstructorProvider } from '@/features/roadmap-constructor'
import { Button } from '@/shared/ui'
import { useRoadmapConstructorPage } from './useRoadmapConstructorPage'
import './RoadmapConstructorPage.css'

export function RoadmapConstructorPage() {
  const {
    roadmapId,
    roadmap,
    canvasData,
    handleSaveSuccess,
    isLoading,
    error,
    updateRoadmapSettings,
  } = useRoadmapConstructorPage()

  if (isLoading) {
    return (
      <div className="roadmap-constructor-loading">
        <Loader2 size={36} className="roadmap-constructor-loading-spinner" />
        <p className="roadmap-constructor-loading-text">
          Загрузка конструктора дорожной карты...
        </p>
      </div>
    )
  }

  if (error || !roadmap) {
    return (
      <div className="roadmap-constructor-error">
        <div className="roadmap-constructor-error-icon-box">
          <AlertCircle size={24} />
        </div>
        <h2 className="roadmap-constructor-error-title">
          Не удалось загрузить дорожную карту
        </h2>
        <p className="roadmap-constructor-error-desc">
          {error?.message || 'Дорожная карта не найдена'}
        </p>
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft size={16} />
            Вернуться в каталог
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="roadmap-constructor-page">
      <ConstructorProvider
        roadmapId={roadmapId}
        roadmap={roadmap}
        canvasData={canvasData}
        onSaveSuccess={handleSaveSuccess}
        onUpdateRoadmapSettings={updateRoadmapSettings}
      >
        <RoadmapEditorWidget />
      </ConstructorProvider>
    </div>
  )
}
