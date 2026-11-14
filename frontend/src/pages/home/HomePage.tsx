import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { HomeHero } from './components/HomeHero/HomeHero'
import { HomeFeatures } from './components/HomeFeatures/HomeFeatures'
import { HomeMarketplace } from './components/HomeMarketplace/HomeMarketplace'
import { useHomePage } from './useHomePage'
import './HomePage.css'

export function HomePage() {
  const { featuredRoadmaps, isLoading } = useHomePage()

  return (
    <div className="home-page" data-testid="home-page">
      <AppHeader />

      <main className="home-page-main">
        <HomeHero />

        <HomeFeatures />

        <HomeMarketplace roadmaps={featuredRoadmaps} isLoading={isLoading} />
      </main>

      <AppFooter />
    </div>
  )
}
