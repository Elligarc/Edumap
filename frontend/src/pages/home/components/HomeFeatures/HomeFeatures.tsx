import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import {
  VisualEditorIcon,
  TeamTrackingIcon,
  GamificationIcon,
  GamificationVisual,
} from './HomeFeaturesIcons'
import { useHomeFeatures } from './useHomeFeatures'
import './HomeFeatures.css'

export function HomeFeatures() {
  const { constructorDestination } = useHomeFeatures()

  return (
    <section className="home-features" aria-labelledby="home-features-heading">
      <div className="home-features-container">
        <div className="home-features-header">
          <h2 id="home-features-heading" className="home-features-title">
            Все, что нужно для освоения навыков
          </h2>
          <p className="home-features-subtitle">
            Мощные инструменты, созданные для концентрации, мотивации и достижения ваших целей в обучении.
          </p>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-card home-feature-card--editor">
            <div className="home-feature-card-content">
              <div className="home-feature-icon-box" aria-hidden="true">
                <VisualEditorIcon size={20} />
              </div>
              <h3 className="home-feature-card-title">Визуальный редактор</h3>
              <p className="home-feature-card-desc">
                Перетаскивайте узлы для создания сложных путей обучения. Связывайте зависимости, добавляйте ресурсы и структурируйте программу визуально.
              </p>
            </div>

            <div className="home-feature-card-footer">
              <Link
                to={constructorDestination}
                className="home-feature-action-btn"
                data-testid="go-to-constructor-btn"
              >
                <span>Перейти в конструктор</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-card-content">
              <div className="home-feature-icon-box" aria-hidden="true">
                <TeamTrackingIcon size={20} />
              </div>
              <h3 className="home-feature-card-title">Командный трекинг</h3>
              <p className="home-feature-card-desc">
                Назначайте дорожные карты членам команды. Мониторьте прогресс, выявляйте узкие места и следите за развитием навыков каждого.
              </p>
            </div>
          </div>

          <div className="home-feature-card home-feature-card--gamification">
            <div className="home-feature-card-content">
              <div className="home-feature-icon-box" aria-hidden="true">
                <GamificationIcon size={20} />
              </div>
              <h3 className="home-feature-card-title">Геймификация прогресса</h3>
              <p className="home-feature-card-desc">
                Поддерживайте мотивацию с помощью серий, достижений и визуальных графиков. Наблюдайте, как ваши ежедневные усилия приносят плоды.
              </p>
            </div>

            <GamificationVisual className="home-feature-gamification-bg" />
          </div>
        </div>
      </div>
    </section>
  )
}
