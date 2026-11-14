import { useMemo, type MouseEvent } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ConnectionMode,
  type Edge,
  type Node,
} from '@xyflow/react'
import { ConstructorNode } from './nodes/ConstructorNode'
import {
  SectionNode,
  CanvasTextNode,
  CustomConnectionEdge,
  DEFAULT_EDGE_MARKER,
} from '@/entities/roadmap'
import { useConstructorContext } from '../model/ConstructorContext'
import { useCanvasDrop } from '../hooks/useCanvasDrop'
import { useCanvasKeyboardShortcuts } from '../hooks/useCanvasKeyboardShortcuts'
import './ConstructorCanvas.css'

const nodeTypes = {
  constructorNode: ConstructorNode,
  sectionNode: SectionNode,
  textNode: CanvasTextNode,
}

const edgeTypes = {
  customEdge: CustomConnectionEdge,
}

export function ConstructorCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    setSelectedElement,
    addNode,
    addSection,
    addText,
    undo,
    redo,
    mode,
  } = useConstructorContext()

  useCanvasKeyboardShortcuts({
    undo,
    redo,
    enabled: mode === 'editor',
  })

  const { onDragOver, onDrop } = useCanvasDrop({
    addNode,
    addSection,
    addText,
  })

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'customEdge',
      animated: false,
      zIndex: 1,
      markerEnd: DEFAULT_EDGE_MARKER,
    }),
    [],
  )

  const handleNodeClick = (_: MouseEvent, node: Node) => {
    setSelectedElement(node)
  }

  const handleEdgeClick = (_: MouseEvent, edge: Edge) => {
    setSelectedElement(edge)
  }

  const handlePaneClick = () => {
    setSelectedElement(null)
  }

  return (
    <div
      className="constructor-canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        deleteKeyCode={['Backspace', 'Delete']}
        edgesFocusable={true}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#CBD5E1"
        />
        <Controls
          className="constructor-canvas-controls"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  )
}
