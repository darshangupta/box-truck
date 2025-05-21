import { addDays, addMinutes } from 'date-fns';

// Example city data (expand as needed)
const cities = [
  { id: 'indy', city: 'Indianapolis', state: 'IN', lat: 39.7684, lng: -86.1581, timezone: 'America/Indiana/Indianapolis' },
  { id: 'decatur', city: 'Decatur', state: 'IN', lat: 40.8306, lng: -84.9294, timezone: 'America/Indiana/Indianapolis' },
  { id: 'jeffersonville', city: 'Jeffersonville', state: 'IN', lat: 38.2776, lng: -85.7372, timezone: 'America/Indiana/Indianapolis' },
  { id: 'plainfield', city: 'Plainfield', state: 'IN', lat: 39.7042, lng: -86.3994, timezone: 'America/Indiana/Indianapolis' },
  { id: 'winchester', city: 'Winchester', state: 'IN', lat: 40.1712, lng: -84.9816, timezone: 'America/Indiana/Indianapolis' },
  { id: 'cincinnati', city: 'Cincinnati', state: 'OH', lat: 39.1031, lng: -84.5120, timezone: 'America/New_York' },
  { id: 'monee', city: 'Monee', state: 'IL', lat: 41.4200, lng: -87.7414, timezone: 'America/Chicago' },
  { id: 'lebanon', city: 'Lebanon', state: 'IN', lat: 40.0484, lng: -86.4697, timezone: 'America/Indiana/Indianapolis' },
  // Add more as needed
];

const equipmentTypes = ['Dry Van', 'Reefer', 'Flatbed'];
const companies = ['Circle Logistics Inc', 'ABC Freight', 'XYZ Transport'];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

export interface Location {
  id: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  timezone: string;
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
  deadheadMiles: number;
}

export function generateLoads(count: number = 10): Load[] {
  const loads: Load[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const origin = randomChoice(cities);
    let destination = randomChoice(cities);
    while (destination.id === origin.id) {
      destination = randomChoice(cities);
    }
    const equipmentType = randomChoice(equipmentTypes);
    const company = randomChoice(companies);
    const weight = randomInt(20000, 48000); // lbs
    const miles = randomInt(100, 600);
    const rate = randomInt(400, 1500);
    const rpm = parseFloat((rate / miles).toFixed(2));
    const pickupStart = addDays(today, randomInt(0, 7));
    const pickupEnd = addMinutes(pickupStart, randomInt(30, 120));
    const deliveryStart = addMinutes(pickupEnd, randomInt(120, 600));
    const deliveryEnd = addMinutes(deliveryStart, randomInt(30, 120));
    const deadheadMiles = randomInt(0, 150);
    loads.push({
      id: `load_${i}_${Date.now()}`,
      origin,
      destination,
      pickupWindow: { start: pickupStart, end: pickupEnd },
      deliveryWindow: { start: deliveryStart, end: deliveryEnd },
      rate,
      miles,
      rpm,
      equipmentType,
      weight,
      brokerId: `${company.replace(/\s/g, '').toLowerCase()}_id`,
      source: 'test',
      company,
      deadheadMiles,
    });
  }
  return loads;
}

if (require.main === module) {
  // Only run if executed directly
  const fs = require('fs');
  const path = require('path');
  const loads = generateLoads(10);
  const ts = Date.now();
  const outDir = path.resolve(__dirname, '../../test-data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `test-data-${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(loads, null, 2));
  console.log(`Generated test data at ${outPath}`);
} 