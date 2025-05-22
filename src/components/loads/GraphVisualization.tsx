'use client';

import { useCallback, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { LoadGraph } from '@/lib/loads/types';

interface GraphVisualizationProps {
  graph: LoadGraph;
}

export default function GraphVisualization({ graph }: GraphVisualizationProps) {
  const graphRef = useRef();

  // Transform our graph data into the format expected by react-force-graph
  const graphData = {
    nodes: graph.nodes.map(load => ({
      id: load.id,
      name: `${load.origin.city} → ${load.destination.city}`,
      val: load.rate / 100, // Node size based on rate
      color: getEquipmentColor(load.equipmentType),
      load // Store the full load data for tooltips
    })),
    links: graph.edges.map(edge => ({
      source: edge.fromLoad.id,
      target: edge.toLoad.id,
      value: edge.deadheadMiles,
      color: edge.isValid ? '#4CAF50' : '#F44336',
      edge // Store the full edge data for tooltips
    }))
  };

  const handleNodeClick = useCallback((node: any) => {
    // Zoom to node
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y);
    
    if (graphRef.current) {
      (graphRef.current as any).centerAt(node.x, node.y, 1000);
      (graphRef.current as any).zoom(2.5, 1000);
    }
  }, []);

  return (
    <div className="w-full h-[600px]">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={node => `
          ${node.name}
          Rate: $${node.load.rate}
          Miles: ${node.load.miles}
          Equipment: ${node.load.equipmentType}
        `}
        linkLabel={link => `
          Deadhead: ${link.edge.deadheadMiles} miles
          Cost: $${link.edge.totalCost.toFixed(2)}
        `}
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y - bckgDimensions[1] / 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          ctx.fillText(label, node.x, node.y);
        }}
      />
    </div>
  );
}

function getEquipmentColor(equipmentType: string): string {
  switch (equipmentType) {
    case 'Dry Van':
      return '#2196F3';
    case 'Reefer':
      return '#4CAF50';
    case 'Flatbed':
      return '#FF9800';
    default:
      return '#9E9E9E';
  }
} 