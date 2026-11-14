import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router'
import { ConstructorTopBar } from './ConstructorTopBar'
import { ConstructorContext, type ConstructorContextValue } from '../model/ConstructorContext'

const mockContextValue: ConstructorContextValue = {
  roadmapId: 1,
  roadmap: { id: 1, title: 'Тестовая карта', visibility: 'PUBLISHED' },
  mode: 'editor',
  setMode: vi.fn(),
  isSettingsOpen: false,
  setIsSettingsOpen: vi.fn(),
  nodes: [],
  edges: [],
  selectedElement: null,
  setSelectedElement: vi.fn(),
  isSaving: false,
  lastSaved: null,
  isDirty: false,
  saveCanvas: vi.fn().mockResolvedValue(undefined),
  undo: vi.fn(),
  redo: vi.fn(),
  canUndo: false,
  canRedo: false,
  onNodesChange: vi.fn(),
  onEdgesChange: vi.fn(),
  isValidConnection: vi.fn().mockReturnValue(true),
  onConnect: vi.fn(),
  addNode: vi.fn(),
  addSection: vi.fn(),
  addText: vi.fn(),
  updateNodeData: vi.fn(),
  updateSectionData: vi.fn(),
  updateTextData: vi.fn(),
  deleteNode: vi.fn(),
  deleteSection: vi.fn(),
  deleteText: vi.fn(),
  addResource: vi.fn(),
  deleteResource: vi.fn(),
  completedIds: [],
  toggleComplete: vi.fn(),
}

describe('ConstructorTopBar', () => {
  it('renders undo and redo icon buttons disabled when stacks are empty', () => {
    render(
      <MemoryRouter>
        <ConstructorContext.Provider value={mockContextValue}>
          <ConstructorTopBar />
        </ConstructorContext.Provider>
      </MemoryRouter>,
    )

    const undoBtn = screen.getByRole('button', { name: /отменить \(ctrl\+z\)/i })
    const redoBtn = screen.getByRole('button', { name: /повторить \(ctrl\+shift\+z\)/i })

    expect(undoBtn).toBeInTheDocument()
    expect(redoBtn).toBeInTheDocument()
    expect(undoBtn).toBeDisabled()
    expect(redoBtn).toBeDisabled()
  })

  it('enables undo and redo buttons and calls handlers on click when available', () => {
    const undoMock = vi.fn()
    const redoMock = vi.fn()

    render(
      <MemoryRouter>
        <ConstructorContext.Provider
          value={{
            ...mockContextValue,
            canUndo: true,
            canRedo: true,
            undo: undoMock,
            redo: redoMock,
          }}
        >
          <ConstructorTopBar />
        </ConstructorContext.Provider>
      </MemoryRouter>,
    )

    const undoBtn = screen.getByRole('button', { name: /отменить \(ctrl\+z\)/i })
    const redoBtn = screen.getByRole('button', { name: /повторить \(ctrl\+shift\+z\)/i })

    expect(undoBtn).not.toBeDisabled()
    expect(redoBtn).not.toBeDisabled()

    fireEvent.click(undoBtn)
    expect(undoMock).toHaveBeenCalledTimes(1)

    fireEvent.click(redoBtn)
    expect(redoMock).toHaveBeenCalledTimes(1)
  })

  it('hides undo and redo buttons in preview mode', () => {
    render(
      <MemoryRouter>
        <ConstructorContext.Provider
          value={{
            ...mockContextValue,
            mode: 'preview',
          }}
        >
          <ConstructorTopBar />
        </ConstructorContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: /отменить \(ctrl\+z\)/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /повторить \(ctrl\+shift\+z\)/i })).not.toBeInTheDocument()
  })

  it('renders "Приватный" badge when roadmap visibility is PRIVATE', () => {
    render(
      <MemoryRouter>
        <ConstructorContext.Provider
          value={{
            ...mockContextValue,
            roadmap: { id: 2, title: 'Черновик курс', visibility: 'PRIVATE' },
          }}
        >
          <ConstructorTopBar />
        </ConstructorContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByText('Приватный')).toBeInTheDocument()
    expect(screen.queryByText('Черновик')).not.toBeInTheDocument()
  })
})
