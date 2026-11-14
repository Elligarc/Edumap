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
import { ViewerNode } from './nodes/ViewerNode'
import {
  SectionNode,
  CanvasTextNode,
  CustomConnectionEdge,
  DEFAULT_EDGE_MARKER,
} from '@/entities/roadmap'
import './ViewerCanvas.css'

const nodeTypes = {
  viewerNode: ViewerNode,
  sectionNode: SectionNode,
  textNode: CanvasTextNode,
}

const edgeTypes = {
  customEdge: CustomConnectionEdge,
}

export interface ViewerCanvasProps {
  nodes: Node[]
  edges: Edge[]
  completedIds?: string[]
  onSelectNode: (node: Node | null) => void
  selectedNode?: Node | null
}

export function ViewerCanvas({
  nodes,
  edges,
  completedIds = [],
  onSelectNode,
  selectedNode,
}: ViewerCanvasProps) {
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const isSelected = Boolean(selectedNode && node.id === selectedNode.id)
      if (node.id.startsWith('node-')) {
        return {
          ...node,
          type: 'viewerNode',
          selected: isSelected,
          data: {
            ...node.data,
            isCompleted: completedIds.includes(node.id),
            onSelect: () => onSelectNode(node),
          },
        }
      }
      return {
        ...node,
        selected: isSelected,
      }
    })
  }, [nodes, completedIds, selectedNode])

  const handleNodeClick = (_: MouseEvent, node: Node) => {
    if (node.id.startsWith('node-')) {
      onSelectNode(node)
    } else {
      onSelectNode(null)
    }
  }

  const handlePaneClick = () => {
    onSelectNode(null)
  }

  const handleEdgeClick = () => {
    onSelectNode(null)
  }

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'customEdge',
      animated: false,
      zIndex: 1,
      markerEnd: DEFAULT_EDGE_MARKER,
    }),
    [],
  )

  return (
    <div className="viewer-canvas">
      <ReactFlow
        nodes={displayNodes}
        edges={edges}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onEdgeClick={handleEdgeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        elevateNodesOnSelect={false}
        onInit={(instance) => instance.fitView({ padding: 0.2 })}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#CBD5E1"
        />
        <Controls
          showInteractive={false}
          className="viewer-canvas-controls"
        />
      </ReactFlow>
    </div>
  )
}
