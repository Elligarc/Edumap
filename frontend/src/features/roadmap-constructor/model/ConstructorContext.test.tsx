import { render, screen, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ConstructorProvider,
  useConstructorContext,
} from './ConstructorContext'
import { ConstructorSidebar } from '../sidebar/ConstructorSidebar'

describe('ConstructorContext & Provider', () => {
  it('useConstructorContext выбрасывает ошибку при вызове вне ConstructorProvider', () => {
    expect(() => {
      renderHook(() => useConstructorContext())
    }).toThrow('useConstructorContext must be used within a ConstructorProvider')
  })

  it('ConstructorProvider предоставляет корректное начальное состояние', () => {
    function Consumer() {
      const { roadmapId, mode, nodes, canUndo, canRedo } = useConstructorContext()
      return (
        <div>
          <span data-testid="roadmap-id">{roadmapId}</span>
          <span data-testid="mode">{mode}</span>
          <span data-testid="nodes-count">{nodes.length}</span>
          <span data-testid="can-undo">{String(canUndo)}</span>
          <span data-testid="can-redo">{String(canRedo)}</span>
        </div>
      )
    }

    render(
      <ConstructorProvider roadmapId={42}>
        <Consumer />
      </ConstructorProvider>,
    )

    expect(screen.getByTestId('roadmap-id')).toHaveTextContent('42')
    expect(screen.getByTestId('mode')).toHaveTextContent('editor')
    expect(screen.getByTestId('nodes-count')).toHaveTextContent('0')
    expect(screen.getByTestId('can-undo')).toHaveTextContent('false')
    expect(screen.getByTestId('can-redo')).toHaveTextContent('false')
  })

  it('ConstructorSidebar отображает плейсхолдер если элемент не выбран', () => {
    render(
      <ConstructorProvider roadmapId={1}>
        <ConstructorSidebar />
      </ConstructorProvider>,
    )

    expect(screen.getByText('Элемент не выбран')).toBeInTheDocument()
  })
})
