import React from 'react'
import { Link } from 'react-router'
import {
  Layers,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react'
import './HomeMarketplaceCard.css'

export interface HomeMarketplaceCardProps {
  id: number | string
  title: string
  description?: string | null
  category?: string | null
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null
  price?: number | string | null
  authorName?: string
  nodesCount?: number
  stepsCount?: number
  studentsCount?: number
}

function JavaScriptIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="8" fill="#F7DF1E" />
      <path
        fill="#000000"
        d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"
      />
    </svg>
  )
}

function FigmaIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
      <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
      <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
      <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
    </svg>
  )
}

function SpringJavaIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M116.452 6.643a59.104 59.104 0 01-6.837 12.136A64.249 64.249 0 0064.205-.026C28.984-.026 0 28.982 0 64.242a64.316 64.316 0 0019.945 46.562l2.368 2.1a64.22 64.22 0 0041.358 15.122c33.487 0 61.637-26.24 64.021-59.683 1.751-16.371-3.051-37.077-11.24-61.7zM29.067 111.17a5.5 5.5 0 01-4.269 2.034c-3.018 0-5.487-2.484-5.487-5.502 0-3.017 2.485-5.501 5.487-5.501 1.25 0 2.485.433 3.452 1.234 2.351 1.9 2.718 5.384.817 7.735zm87.119-19.238c-15.843 21.122-49.68 14.003-71.376 15.02 0 0-3.852.234-7.721.867 0 0 1.45-.617 3.335-1.334 15.226-5.301 22.43-6.335 31.685-11.086 17.427-8.869 34.654-28.274 38.24-48.463-6.637 19.422-26.75 36.11-45.077 42.895-12.557 4.635-35.238 9.136-35.238 9.136l-.917-.484c-15.442-7.518-15.91-40.977 12.157-51.78 12.291-4.735 24.048-2.134 37.323-5.302 14.175-3.367 30.568-14.004 37.238-27.874 7.471 22.19 16.46 56.932.35 78.405z"
        fill="#6DB33F"
      />
    </svg>
  )
}

function CodeDefaultIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-600">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function renderRoadmapBrandLogo(id: string | number, category?: string | null, title?: string) {
  const key = `${id} ${category ?? ''} ${title ?? ''}`.toLowerCase()
  if (key.includes('front') || key.includes('react') || key.includes('web') || key.includes('js') || key.includes('vue')) {
    return <JavaScriptIcon size={26} />
  }
  if (key.includes('design') || key.includes('дизайн') || key.includes('ui') || key.includes('ux') || key.includes('figma')) {
    return <FigmaIcon size={22} />
  }
  if (key.includes('back') || key.includes('java') || key.includes('spring') || key.includes('node')) {
    return <SpringJavaIcon size={26} />
  }
  return <CodeDefaultIcon size={24} />
}

function formatNodesCount(count: number): string {
  const mod100 = count % 100
  const mod10 = count % 10
  if (mod100 >= 11 && mod100 <= 14) return `${count} узлов`
  if (mod10 === 1) return `${count} узел`
  if (mod10 >= 2 && mod10 <= 4) return `${count} узла`
  return `${count} узлов`
}

function formatMembersCount(count: number): string {
  const mod100 = count % 100
  const mod10 = count % 10
  if (mod100 >= 11 && mod100 <= 14) return `${count} участников`
  if (mod10 === 1) return `${count} участник`
  if (mod10 >= 2 && mod10 <= 4) return `${count} участника`
  return `${count} участников`
}

export function HomeMarketplaceCard({
  id,
  title,
  description,
  category,
  authorName,
  nodesCount,
  stepsCount,
  studentsCount,
}: HomeMarketplaceCardProps) {
  const count = nodesCount ?? stepsCount ?? 0
  const author = authorName || 'YPD Team'
  const members = studentsCount && studentsCount > 0 ? studentsCount : 142

  return (
    <article className="home-market-card group" data-testid={`home-roadmap-card-${id}`}>
      <Link
        to={`/roadmaps/${id}`}
        className="home-market-card-link focus:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/20 rounded-(--radius-sm)"
      >
        <div className="home-market-card-content">
          <div className="home-market-card-top">
            <div className="home-market-card-icon-box" aria-hidden="true">
              {renderRoadmapBrandLogo(id, category, title)}
            </div>
          </div>

          <div className="home-market-card-body">
            <h3 className="home-market-card-title">{title}</h3>
            <p className="home-market-card-desc">
              {description || 'Подробный пошаговый маршрут изучения ключевых навыков и технологий.'}
            </p>
          </div>

          <div className="home-market-card-footer">
            <div className="home-market-card-author">
              <div className="home-market-card-avatar" aria-hidden="true">
                <User size={12} />
              </div>
              <span>от {author}</span>
            </div>

            <div className="home-market-card-meta">
              <span className="home-market-card-nodes">
                <Layers size={13} className="text-slate-500" />
                <span>{formatNodesCount(count)}</span>
              </span>
              <span className="home-market-card-members">
                <Users size={13} className="text-slate-400" />
                <span>{members}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
