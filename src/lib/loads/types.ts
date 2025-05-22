export interface Location {
  city: string;
  state: string;
  lat: number;
  lng: number;
  timezone: string;
  freightDensity: 'High' | 'Medium' | 'Low';
  maxDeadhead: number;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface Load {
  id: string;
  origin: Location;
  destination: Location;
  pickupWindow: TimeWindow;
  deliveryWindow: TimeWindow;
  rate: number;
  miles: number;
  rpm: number;
  equipmentType: string;
  weight: number;
  brokerId: string;
  source: string;
  company: string;
}

export interface LoadTransition {
  fromLoad: Load;
  toLoad: Load;
  deadheadMiles: number;
  deadheadTime: number; // in minutes
  totalCost: number; // deadhead cost + opportunity cost
  isValid: boolean;
}

export interface LoadGraph {
  nodes: Load[];
  edges: LoadTransition[];
} 