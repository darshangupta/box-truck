'use client';

import { useState } from 'react';
import { api } from '@/trpc/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LoadGraph } from '@/lib/loads/types';
import dynamic from 'next/dynamic';

// Dynamically import the graph visualization component
const GraphVisualization = dynamic(() => import('@/components/loads/GraphVisualization'), {
  ssr: false,
  loading: () => <div>Loading graph visualization...</div>
});

export default function LoadsPage() {
  const [graph, setGraph] = useState<LoadGraph | null>(null);
  
  const generateLoads = api.loads.generate.useMutation({
    onSuccess: (loads) => {
      buildGraph.mutate({ loads });
    }
  });

  const buildGraph = api.loads.buildGraph.useMutation({
    onSuccess: (newGraph) => {
      setGraph(newGraph);
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Load Network Visualization</h1>
      
      <div className="mb-4">
        <Button 
          onClick={() => generateLoads.mutate({ count: 200 })}
          disabled={generateLoads.isLoading}
        >
          Generate New Loads
        </Button>
      </div>

      {graph && (
        <Card className="p-4">
          <GraphVisualization graph={graph} />
        </Card>
      )}
    </div>
  );
} 