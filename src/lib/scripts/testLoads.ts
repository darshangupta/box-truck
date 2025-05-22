import { generateLoads } from './generateLoads';
import { buildLoadGraph } from '../loads/graph';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testLoadGeneration() {
  // Generate loads
  console.log('Generating loads...');
  const loads = generateLoads(4);  // Generate 4 loads
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

  // Print detailed statistics
  console.log('\nLoad Details:');
  console.log('----------------');
  loads.forEach((load, index) => {
    console.log(`\nLoad ${index + 1}:`);
    console.log(`  Origin: ${load.origin.city}`);
    console.log(`  Destination: ${load.destination.city}`);
    console.log(`  Miles: ${load.miles.toFixed(1)}`);
    console.log(`  Rate: $${load.rate}`);
    console.log(`  RPM: $${(load.rate / load.miles).toFixed(2)}`);
    console.log(`  Equipment: ${load.equipmentType}`);
    console.log(`  Pickup: ${load.pickupWindow.start.toLocaleTimeString()} - ${load.pickupWindow.end.toLocaleTimeString()}`);
    console.log(`  Delivery: ${load.deliveryWindow.start.toLocaleTimeString()} - ${load.deliveryWindow.end.toLocaleTimeString()}`);
  });

  console.log('\nGraph Statistics:');
  console.log('----------------');
  console.log('Average Edges per Node:', (graph.edges.length / graph.nodes.length).toFixed(2));
  
  const validTransitions = graph.edges.filter(edge => edge.isValid).length;
  console.log('Valid Transitions:', validTransitions);

  // Print transition details
  console.log('\nValid Transitions:');
  console.log('----------------');
  graph.edges
    .filter(edge => edge.isValid)
    .forEach(edge => {
      console.log(`\n${edge.fromLoad.origin.city} → ${edge.fromLoad.destination.city} → ${edge.toLoad.destination.city}`);
      console.log(`  Deadhead: ${edge.deadheadMiles.toFixed(1)} miles`);
      console.log(`  Cost: $${edge.totalCost.toFixed(2)}`);
      console.log(`  Time: ${edge.deadheadTimeMinutes} minutes`);
    });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testLoadGeneration().catch(console.error);
} 