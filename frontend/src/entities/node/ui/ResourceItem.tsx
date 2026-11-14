import type { ReactNode } from 'react'
import { Video, FileText, Globe, Trash2, ExternalLink } from 'lucide-react'
import type { NodeResourceResponse } from '@/shared/types/api'
import './ResourceItem.css'

export interface ResourceItemProps {
  resource: NodeResourceResponse
  onDelete?: (id?: number) => void
  isEditable?: boolean
}

function getResourceIcon(type: string | null | undefined, url: string): ReactNode {
  if (type === 'VIDEO' || (url && url.includes('youtu'))) {
    return <Video size={16} className="text-[#DC2626]" />
  }
  if (type === 'ARTICLE' || type === 'DOCS') {
    return <FileText size={16} className="text-[#0284c7]" />
  }
  return <Globe size={16} className="text-[#059669]" />
}

function getHostName(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace('www.', '')
  } catch {
    return url || ''
  }
}

export function ResourceItem({ resource, onDelete, isEditable = false }: ResourceItemProps) {
  return (
    <div className="resource-item">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="resource-item-link"
      >
        <div className="resource-item-icon-box">
          {getResourceIcon(resource.type, resource.url)}
        </div>
        <div className="resource-item-text-box">
          <span className="resource-item-title">
            {resource.title}
          </span>
          <span className="resource-item-host">
            {getHostName(resource.url)}
          </span>
        </div>
        <ExternalLink size={12} className="resource-item-ext-icon" />
      </a>

      {isEditable && onDelete && (
        <button
          type="button"
          onClick={() => onDelete(resource.id)}
          className="resource-item-delete-btn"
          title="Удалить ресурс"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}
