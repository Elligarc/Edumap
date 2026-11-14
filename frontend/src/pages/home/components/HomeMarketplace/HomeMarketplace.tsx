import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { HomeMarketplaceCard, type HomeMarketplaceCardProps } from './HomeMarketplaceCard'
import { HomeMarketplaceCardSkeleton } from './HomeMarketplaceCardSkeleton'
import './HomeMarketplace.css'

interface HomeMarketplaceProps {
  roadmaps: HomeMarketplaceCardProps[]
  isLoading?: boolean
}

export function HomeMarketplace({ roadmaps, isLoading }: HomeMarketplaceProps) {
  return (
    <section className="home-marketplace" aria-labelledby="home-marketplace-heading">
      <div className="home-marketplace-container">
        <div className="home-marketplace-header">
          <div>
            <h2 id="home-marketplace-heading" className="home-marketplace-title">
              Исследуйте маркетплейс
            </h2>
            <p className="home-marketplace-subtitle">
              Изучайте проверенные базовые траектории или выбирайте специализированные треки от авторов сообщества.
            </p>
          </div>

          <Link to="/catalog" className="home-marketplace-all-link group">
            <span>Все дорожные карты</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="home-marketplace-grid" data-testid="home-marketplace-grid">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <HomeMarketplaceCardSkeleton key={idx} />
            ))
          ) : roadmaps.length > 0 ? (
            roadmaps.map((mapItem) => (
              <HomeMarketplaceCard key={mapItem.id} {...mapItem} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-500 text-sm">
              Пока нет опубликованных дорожных карт
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
