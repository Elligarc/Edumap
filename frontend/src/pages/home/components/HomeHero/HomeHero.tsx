import { Link } from 'react-router'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import './HomeHero.css'

export function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-hero-heading">
      <div className="home-hero-container">
        <div className="home-hero-text-col">
          <h1 id="home-hero-heading" className="home-hero-title">
            Освойте любой навык с визуальными дорожными картами.
          </h1>

          <p className="home-hero-subtitle">
            Структурируйте процесс обучения через интерактивные деревья навыков.
            Отслеживайте прогресс по каждому узлу, закрепляйте теорию практическими ресурсами
            и выстраивайте собственные образовательные траектории.
          </p>

          <div className="home-hero-actions">
            <Link to="/catalog" className="home-hero-cta-btn">
              <span>Найти первую карту</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="home-hero-graphic-col" aria-hidden="true">
          <div className="home-hero-canvas-mock">
            <div className="home-hero-canvas-grid" />

            <svg
              className="home-hero-canvas-svg"
              viewBox="0 0 500 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M 170 100 C 210 100, 220 160, 250 170"
                className="home-hero-edge-completed"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M 370 200 C 400 200, 400 140, 410 125"
                className="home-hero-edge-pending"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            </svg>

            <div className="home-hero-node home-hero-node--html">
              <div className="home-hero-node-header">
                <span className="home-hero-tech-icon home-hero-tech-icon--html">
                  &lt;/&gt;
                </span>
                <span className="home-hero-node-label">Основы HTML</span>
                <CheckCircle2 size={15} className="text-emerald-500 ml-auto shrink-0" />
              </div>
              <div className="home-hero-node-progress home-hero-node-progress--done" />
            </div>

            <div className="home-hero-node home-hero-node--js">
              <div className="home-hero-node-header">
                <span className="home-hero-tech-icon home-hero-tech-icon--js">
                  JS
                </span>
                <div className="flex flex-col">
                  <span className="home-hero-node-label font-bold text-slate-900">
                    Основы JavaScript
                  </span>
                  <span className="text-xs text-slate-500">ES6+, DOM, Fetch</span>
                </div>
                <span className="home-hero-status-badge">
                  В процессе
                </span>
              </div>
              <div className="home-hero-node-progress home-hero-node-progress--active">
                <div className="home-hero-progress-bar" />
              </div>
            </div>

            <div className="home-hero-node home-hero-node--react">
              <div className="home-hero-node-header">
                <span className="home-hero-tech-icon home-hero-tech-icon--react">
                  TS
                </span>
                <span className="home-hero-node-label">React & TypeScript</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
