import { generateLoads } from './generateLoads.js';
import { buildLoadGraph } from '../loads/graph.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLoadGeneration() {
  // Generate loads
  console.log('Generating loads...');
  const loads = generateLoads(200);
  console.log(`Generated ${loads.length} loads`);

  // Build graph
  console.log('Building graph...');
  const graph = buildLoadGraph(loads);
  console.log(`Graph has ${graph.nodes.length} nodes and ${graph.edges.length} edges`);

  // Save results
  const outDir = path.resolve(__dirname, '../../test-data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const timestamp = Date.now();
  fs.writeFileSync(
    path.join(outDir, `test-data-${timestamp}.json`),
    JSON.stringify(loads, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, `test-graph-${timestamp}.json`),
    JSON.stringify(graph, null, 2)
  );

  // Print some statistics
  console.log('\nLoad Statistics:');
  console.log('----------------');
  const equipmentCounts = loads.reduce((acc, load) => {
    acc[load.equipmentType] = (acc[load.equipmentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('Equipment Types:', equipmentCounts);

  const avgRate = loads.reduce((sum, load) => sum + load.rate, 0) / loads.length;
  console.log('Average Rate:', avgRate.toFixed(2));

  const avgMiles = loads.reduce((sum, load) => sum + load.miles, 0) / loads.length;
  console.log('Average Miles:', avgMiles.toFixed(2));

  console.log('\nGraph Statistics:');
  console.log('----------------');
  console.log('Average Edges per Node:', (graph.edges.length / graph.nodes.length).toFixed(2));
  
  const validTransitions = graph.edges.filter(edge => edge.isValid).length;
  console.log('Valid Transitions:', validTransitions);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testLoadGeneration().catch(console.error);
} 