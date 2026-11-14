import { MousePointerClick } from 'lucide-react'
import type { Node } from '@xyflow/react'
import { useConstructorContext } from '../model/ConstructorContext'
import { NodePropertiesPanel } from './NodePropertiesPanel'
import { SectionPropertiesPanel } from './SectionPropertiesPanel'
import { TextPropertiesPanel } from './TextPropertiesPanel'
import './ConstructorSidebar.css'

export function ConstructorSidebar() {
  const {
    selectedElement,
    updateNodeData,
    deleteNode,
    addResource,
    deleteResource,
    updateSectionData,
    deleteSection,
    updateTextData,
    deleteText,
  } = useConstructorContext()

  if (!selectedElement || !('id' in selectedElement)) {
    return (
      <div className="constructor-sidebar-placeholder">
        <MousePointerClick size={32} className="constructor-sidebar-placeholder-icon" />
        <p className="constructor-sidebar-placeholder-title">Элемент не выбран</p>
        <p className="constructor-sidebar-placeholder-desc">
          Кликните по узлу, секции или тексту на холсте для редактирования свойств
        </p>
      </div>
    )
  }

  if (selectedElement.id.startsWith('node-')) {
    return (
      <div className="constructor-sidebar">
        <NodePropertiesPanel
          node={selectedElement as Node}
          onChange={updateNodeData}
          onDelete={deleteNode}
          onAddResource={addResource}
          onDeleteResource={deleteResource}
        />
      </div>
    )
  }

  if (selectedElement.id.startsWith('section-')) {
    return (
      <div className="constructor-sidebar">
        <SectionPropertiesPanel
          section={selectedElement as Node}
          onChange={updateSectionData}
          onDelete={deleteSection}
        />
      </div>
    )
  }

  if (selectedElement.id.startsWith('text-')) {
    return (
      <div className="constructor-sidebar">
        <TextPropertiesPanel
          textNode={selectedElement as Node}
          onChange={updateTextData}
          onDelete={deleteText}
        />
      </div>
    )
  }

  return null
}
