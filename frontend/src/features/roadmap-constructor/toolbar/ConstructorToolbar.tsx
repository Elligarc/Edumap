import type { DragEvent } from 'react'
import { MousePointer, PlusCircle, FolderPlus, Type } from 'lucide-react'
import { useConstructorContext } from '../model/ConstructorContext'
import './ConstructorToolbar.css'

export type CanvasDraggableType = 'node' | 'section' | 'text'

export function ConstructorToolbar() {
  const { addNode, addSection, addText } = useConstructorContext()

  const handleDragStart = (
    event: DragEvent<HTMLButtonElement>,
    type: CanvasDraggableType,
  ) => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="constructor-toolbar">
      <button
        type="button"
        title="Режим перемещения / выбора"
        className="constructor-toolbar-btn constructor-toolbar-btn--active"
      >
        <MousePointer size={18} />
      </button>

      <div className="constructor-toolbar-divider" />

      <button
        type="button"
        onClick={() => addNode()}
        onDragStart={(e) => handleDragStart(e, 'node')}
        draggable
        title="Добавить узел (клик или перетаскивание на холст)"
        className="constructor-toolbar-btn constructor-toolbar-btn--default constructor-toolbar-btn--draggable"
      >
        <PlusCircle size={18} />
      </button>

      <button
        type="button"
        onClick={() => addSection()}
        onDragStart={(e) => handleDragStart(e, 'section')}
        draggable
        title="Добавить секцию (клик или перетаскивание на холст)"
        className="constructor-toolbar-btn constructor-toolbar-btn--default constructor-toolbar-btn--draggable"
      >
        <FolderPlus size={18} />
      </button>

      <button
        type="button"
        onClick={() => addText()}
        onDragStart={(e) => handleDragStart(e, 'text')}
        draggable
        title="Добавить текстовый блок (клик или перетаскивание на холст)"
        className="constructor-toolbar-btn constructor-toolbar-btn--default constructor-toolbar-btn--draggable"
      >
        <Type size={18} />
      </button>
    </div>
  )
}
