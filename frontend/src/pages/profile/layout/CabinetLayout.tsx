import React from 'react'
import { Outlet } from 'react-router'
import { AppHeader } from '@/widgets/app-header'
import { AppFooter } from '@/widgets/app-footer'
import { CabinetSidebar } from './CabinetSidebar'
import './CabinetLayout.css'

interface CabinetLayoutProps {
  children?: React.ReactNode
}

export function CabinetLayout({ children }: CabinetLayoutProps) {
  return (
    <div className="cabinet-page">
      <AppHeader />

      <div className="cabinet-container">
        <CabinetSidebar />

        <main className="cabinet-content">
          {children || <Outlet />}
        </main>
      </div>

      <AppFooter />
    </div>
  )
}
