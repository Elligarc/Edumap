import { useNavigate } from 'react-router'
import { Plus, Loader2, Map, BookOpen, CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/ui'
import { Modal } from '@/shared/ui'
import { RoadmapSettingsModal } from '@/entities/roadmap'
import { UserRoadmapCard } from './components/UserRoadmapCard'
import { ProgressRoadmapCard } from './components/ProgressRoadmapCard'
import { useProfileRoadmapsPage } from './useProfileRoadmapsPage'
import './ProfileRoadmapsPage.css'

export function ProfileRoadmapsPage() {
  const navigate = useNavigate()
  const {
    roadmaps,
    isLoading,
    error,
    inProgressRoadmaps,
    completedRoadmaps,
    isProgressLoading,
    progressError,
    isCreateOpen,
    handleOpenCreate,
    handleCloseCreate,
    handleCreateSubmit,
    roadmapToDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    isDeleting,
    deleteError,
  } = useProfileRoadmapsPage()

  return (
    <div className="profile-roadmaps-page">
      <div className="profile-roadmaps-header">
        <h1 className="profile-roadmaps-title">Дорожные карты</h1>

        <Button onClick={handleOpenCreate} size="sm">
          <Plus size={15} />
          <span>Создать дорожную карту</span>
        </Button>
      </div>

      <section className="profile-section">
        <h2 className="profile-section-title">Мои дорожные карты</h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-[#64748B]">
            <Loader2 size={18} className="animate-spin text-[#2563EB] mr-2" />
            <span className="text-sm">Загрузка ваших карт...</span>
          </div>
        ) : error ? (
          <div className="p-3.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-sm">
            {error}
          </div>
        ) : roadmaps.length === 0 ? (
          <div className="profile-roadmaps-empty">
            <Map size={32} className="text-[#94A3B8] mb-2" />
            <p className="text-sm font-semibold text-[#0F172A] mb-1">
              У вас пока нет созданных дорожных карт
            </p>
            <p className="text-xs text-[#64748B] mb-4">
              Создайте свою первую образовательную карту в визуальном конструкторе
            </p>
            <Button onClick={handleOpenCreate} size="sm">
              <Plus size={14} />
              <span>Создать первую карту</span>
            </Button>
          </div>
        ) : (
          <div className="profile-roadmaps-list">
            {roadmaps.map((r) => (
              <UserRoadmapCard
                key={r.id}
                roadmap={r}
                onDelete={handleOpenDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="profile-section-title">В процессе прохождения</h2>

        {isProgressLoading ? (
          <div className="flex items-center justify-center py-8 text-[#64748B]">
            <Loader2 size={18} className="animate-spin text-[#2563EB] mr-2" />
            <span className="text-sm">Загрузка прогресса...</span>
          </div>
        ) : progressError ? (
          <div className="p-3 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs">
            {progressError}
          </div>
        ) : inProgressRoadmaps.length === 0 ? (
          <div className="profile-roadmaps-empty">
            <BookOpen size={28} className="text-[#94A3B8] mb-2" />
            <p className="text-sm font-semibold text-[#0F172A] mb-1">
              Нет карт в процессе прохождения
            </p>
            <p className="text-xs text-[#64748B] mb-3">
              Выберите интересующую дорожную карту в каталоге и начните обучение
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate('/catalog')}>
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <div className="profile-roadmaps-list">
            {inProgressRoadmaps.map((item) => (
              <ProgressRoadmapCard
                key={item.roadmapId}
                roadmapId={item.roadmapId}
                title={item.title}
                nodesCount={item.nodesCount}
                rating={item.rating}
                participantsCount={item.participantsCount}
                progressPercent={item.progressPercent}
              />
            ))}
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2 className="profile-section-title">Пройденные</h2>

        {isProgressLoading ? (
          <div className="flex items-center justify-center py-6 text-[#64748B]">
            <Loader2 size={16} className="animate-spin text-[#2563EB] mr-2" />
            <span className="text-sm">Загрузка...</span>
          </div>
        ) : completedRoadmaps.length === 0 ? (
          <div className="profile-roadmaps-empty py-6">
            <CheckCircle2 size={26} className="text-[#94A3B8] mb-1.5" />
            <p className="text-sm font-medium text-[#475569] mb-0.5">
              Пока нет завершённых карт
            </p>
            <p className="text-xs text-[#94A3B8]">
              Завершайте все темы выбранной дорожной карты, чтобы получить 100% прогресс
            </p>
          </div>
        ) : (
          <div className="profile-roadmaps-list">
            {completedRoadmaps.map((item) => (
              <ProgressRoadmapCard
                key={item.roadmapId}
                roadmapId={item.roadmapId}
                title={item.title}
                nodesCount={item.nodesCount}
                rating={item.rating}
                participantsCount={item.participantsCount}
                progressPercent={item.progressPercent}
              />
            ))}
          </div>
        )}
      </section>

      {roadmapToDelete && (
        <Modal
          isOpen={true}
          onClose={handleCloseDelete}
          title="Удаление дорожной карты"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-[#64748B] leading-relaxed">
              Вы уверены, что хотите удалить дорожную карту «<strong className="text-[#0F172A] font-semibold">{roadmapToDelete.title}</strong>»? Все разделы, узлы и связи этой карты будут безвозвратно удалены.
            </p>

            {deleteError && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={handleCloseDelete}
                disabled={isDeleting}
                size="sm"
              >
                Отмена
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                size="sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    <span>Удаление...</span>
                  </>
                ) : (
                  'Удалить'
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      <RoadmapSettingsModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
        isCreating
      />
    </div>
  )
}
