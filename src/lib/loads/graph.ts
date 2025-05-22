import { addMinutes } from 'date-fns';
import type { Load, LoadTransition, LoadGraph } from './types';
import { 
  AVERAGE_SPEED_MPH, 
  MINIMUM_REST_TIME_MINUTES, 
  DEADHEAD_COST_PER_MILE, 
  OPPORTUNITY_COST_PER_HOUR 
} from './constants';
import { 
  calculateDeadhead, 
  calculateDriveTime, 
  hasEnoughTimeBetween 
} from './utils';

export function calculateTransition(fromLoad: Load, toLoad: Load): LoadTransition {
  // Calculate deadhead distance
  const deadheadMiles = calculateDeadhead(fromLoad.destination, toLoad.origin);
  
  // Calculate deadhead time
  const deadheadTime = calculateDriveTime(deadheadMiles, AVERAGE_SPEED_MPH);
  
  // Calculate total time needed between loads
  const totalTimeNeeded = deadheadTime + MINIMUM_REST_TIME_MINUTES;
  
  // Check if there's enough time between loads
  const hasTime = hasEnoughTimeBetween(
    fromLoad.deliveryWindow,
    toLoad.pickupWindow,
    totalTimeNeeded
  );
  
  // Check if deadhead is within acceptable range for the destination city
  const isDeadheadAcceptable = deadheadMiles <= toLoad.origin.maxDeadhead;
  
  // Calculate costs
  const deadheadCost = deadheadMiles * DEADHEAD_COST_PER_MILE;
  const waitingTime = Math.max(0, 
    (toLoad.pickupWindow.start.getTime() - 
     addMinutes(fromLoad.deliveryWindow.end, totalTimeNeeded).getTime()) / 
    (1000 * 60)
  );
  const opportunityCost = (waitingTime / 60) * OPPORTUNITY_COST_PER_HOUR;
  const totalCost = deadheadCost + opportunityCost;
  
  return {
    fromLoad,
    toLoad,
    deadheadMiles,
    deadheadTime,
    totalCost,
    isValid: hasTime && isDeadheadAcceptable
  };
}

export function buildLoadGraph(loads: Load[]): LoadGraph {
  const edges: LoadTransition[] = [];
  
  // Calculate all possible transitions between loads
  for (let i = 0; i < loads.length; i++) {
    for (let j = 0; j < loads.length; j++) {
      if (i !== j) { // Don't connect a load to itself
        const transition = calculateTransition(loads[i], loads[j]);
        if (transition.isValid) {
          edges.push(transition);
        }
      }
    }
  }
  
  return {
    nodes: loads,
    edges
  };
}

// Find optimal path through loads
export function findOptimalPath(graph: LoadGraph, startLoad: Load, maxLoads: number = 5): Load[] {
  // TODO: Implement path finding algorithm (e.g., Dijkstra's or A*)
  // This would consider:
  // - Total cost (deadhead + opportunity)
  // - Time windows
  // - Maximum number of loads
  // - Equipment compatibility
  return [];
} 