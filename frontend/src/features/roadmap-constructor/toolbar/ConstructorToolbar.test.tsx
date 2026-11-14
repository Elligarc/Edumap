import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConstructorToolbar } from './ConstructorToolbar'
import * as ConstructorContextModule from '../model/ConstructorContext'

describe('ConstructorToolbar', () => {
  const mockAddNode = vi.fn()
  const mockAddSection = vi.fn()
  const mockAddText = vi.fn()

  const mockContext = {
    addNode: mockAddNode,
    addSection: mockAddSection,
    addText: mockAddText,
  }

  vi.spyOn(ConstructorContextModule, 'useConstructorContext').mockReturnValue(
    mockContext as unknown as ReturnType<typeof ConstructorContextModule.useConstructorContext>,
  )

  it('рендерит кнопки добавления элементов с атрибутом draggable', () => {
    render(<ConstructorToolbar />)

    const nodeBtn = screen.getByTitle(/добавить узел/i)
    const sectionBtn = screen.getByTitle(/добавить секцию/i)
    const textBtn = screen.getByTitle(/добавить текстовый блок/i)

    expect(nodeBtn).toBeInTheDocument()
    expect(nodeBtn).toHaveAttribute('draggable', 'true')

    expect(sectionBtn).toBeInTheDocument()
    expect(sectionBtn).toHaveAttribute('draggable', 'true')

    expect(textBtn).toBeInTheDocument()
    expect(textBtn).toHaveAttribute('draggable', 'true')
  })

  it('вызывает методы добавления по обычному клику на кнопки', () => {
    render(<ConstructorToolbar />)

    fireEvent.click(screen.getByTitle(/добавить узел/i))
    expect(mockAddNode).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTitle(/добавить секцию/i))
    expect(mockAddSection).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTitle(/добавить текстовый блок/i))
    expect(mockAddText).toHaveBeenCalledTimes(1)
  })

  it('устанавливает корректный MIME-тип и данные при dragStart', () => {
    render(<ConstructorToolbar />)

    const setDataMock = vi.fn()
    const dataTransfer = {
      setData: setDataMock,
      effectAllowed: '',
    }

    const nodeBtn = screen.getByTitle(/добавить узел/i)
    fireEvent.dragStart(nodeBtn, { dataTransfer })
    expect(setDataMock).toHaveBeenCalledWith('application/reactflow', 'node')
    expect(dataTransfer.effectAllowed).toBe('move')

    const sectionBtn = screen.getByTitle(/добавить секцию/i)
    fireEvent.dragStart(sectionBtn, { dataTransfer })
    expect(setDataMock).toHaveBeenCalledWith('application/reactflow', 'section')

    const textBtn = screen.getByTitle(/добавить текстовый блок/i)
    fireEvent.dragStart(textBtn, { dataTransfer })
    expect(setDataMock).toHaveBeenCalledWith('application/reactflow', 'text')
  })
})
