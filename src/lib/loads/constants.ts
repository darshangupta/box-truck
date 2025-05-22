export const cityMetadata: Record<string, { 
  state: string; 
  lat: number; 
  lng: number; 
  timezone: string;
  freightDensity: 'High' | 'Medium' | 'Low';
  maxDeadhead: number;
}> = {
  "Indianapolis": { state: "IN", lat: 39.7684, lng: -86.1581, timezone: "America/Indiana/Indianapolis", freightDensity: 'High', maxDeadhead: 30 },
  "Chicago": { state: "IL", lat: 41.8781, lng: -87.6298, timezone: "America/Chicago", freightDensity: 'High', maxDeadhead: 25 },
  "Louisville": { state: "KY", lat: 38.2527, lng: -85.7585, timezone: "America/Kentucky/Louisville", freightDensity: 'Medium', maxDeadhead: 50 },
  "Cincinnati": { state: "OH", lat: 39.1031, lng: -84.5120, timezone: "America/New_York", freightDensity: 'High', maxDeadhead: 30 },
  "Columbus": { state: "OH", lat: 39.9612, lng: -82.9988, timezone: "America/New_York", freightDensity: 'High', maxDeadhead: 30 },
  "Dayton": { state: "OH", lat: 39.7589, lng: -84.1916, timezone: "America/New_York", freightDensity: 'Medium', maxDeadhead: 50 },
  "Fort Wayne": { state: "IN", lat: 41.0793, lng: -85.1394, timezone: "America/Indiana/Indianapolis", freightDensity: 'Medium', maxDeadhead: 50 },
  "Evansville": { state: "IN", lat: 37.9716, lng: -87.5711, timezone: "America/Chicago", freightDensity: 'Low', maxDeadhead: 75 },
  "Bloomington": { state: "IN", lat: 39.1653, lng: -86.5264, timezone: "America/Indiana/Indianapolis", freightDensity: 'Low', maxDeadhead: 75 },
  "Terre Haute": { state: "IN", lat: 39.4667, lng: -87.4139, timezone: "America/Indiana/Indianapolis", freightDensity: 'Low', maxDeadhead: 75 },
  "South Bend": { state: "IN", lat: 41.6764, lng: -86.2520, timezone: "America/Indiana/Indianapolis", freightDensity: 'Medium', maxDeadhead: 50 },
  "Peoria": { state: "IL", lat: 40.6936, lng: -89.5889, timezone: "America/Chicago", freightDensity: 'Low', maxDeadhead: 90 },
  "Lexington": { state: "KY", lat: 38.0406, lng: -84.5037, timezone: "America/New_York", freightDensity: 'Medium', maxDeadhead: 50 }
};

export const equipmentTypes = {
  'Dry Van': { minRPM: 1.50, maxRPM: 2.20 },
  'Reefer': { minRPM: 1.80, maxRPM: 2.50 },
  'Flatbed': { minRPM: 1.90, maxRPM: 2.70 }
} as const;

export const companies = ['Circle Logistics Inc', 'ABC Freight', 'XYZ Transport'];

// Constants for graph construction
export const AVERAGE_SPEED_MPH = 50;
export const MINIMUM_REST_TIME_MINUTES = 30;
export const DEADHEAD_COST_PER_MILE = 0.50; // Cost per mile for deadhead
export const OPPORTUNITY_COST_PER_HOUR = 25; // Cost per hour of waiting time 