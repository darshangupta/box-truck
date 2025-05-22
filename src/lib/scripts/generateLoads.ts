import { addDays, addMinutes } from 'date-fns';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { cityMetadata, equipmentTypes, companies } from '../loads/constants.js';
import { randomChoice, randomFloat, calculateDistance } from '../loads/utils.js';
import type { Load } from '../loads/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateLoads(count: number = 200): Load[] {
  const loads: Load[] = [];
  const today = new Date();
  const cityNames = Object.keys(cityMetadata);
  
  for (let i = 0; i < count; i++) {
    const originCity = randomChoice(cityNames);
    let destinationCity = randomChoice(cityNames);
    while (destinationCity === originCity) {
      destinationCity = randomChoice(cityNames);
    }
    
    const origin = { city: originCity, ...cityMetadata[originCity] };
    const destination = { city: destinationCity, ...cityMetadata[destinationCity] };
    
    // Calculate actual distance using coordinates
    const miles = calculateDistance(
      origin.lat, origin.lng,
      destination.lat, destination.lng
    );
    
    const equipmentType = randomChoice(Object.keys(equipmentTypes)) as keyof typeof equipmentTypes;
    const rpm = randomFloat(
      equipmentTypes[equipmentType].minRPM,
      equipmentTypes[equipmentType].maxRPM
    );
    const rate = Math.round(rpm * miles);
    
    const company = randomChoice(companies);
    const weight = randomInt(20000, 48000); // lbs
    
    // Generate realistic time windows
    const pickupStart = addDays(today, randomInt(0, 7));
    const pickupEnd = addMinutes(pickupStart, randomInt(30, 120));
    
    // Calculate delivery time based on distance (assuming 50 mph average speed)
    const driveTimeMinutes = Math.round((miles / 50) * 60);
    const deliveryStart = addMinutes(pickupEnd, driveTimeMinutes);
    const deliveryEnd = addMinutes(deliveryStart, randomInt(30, 120));
    
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
    });
  }
  return loads;
}

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const loads = generateLoads(200);
  const ts = Date.now();
  const outDir = path.resolve(__dirname, '../../test-data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, `test-data-${ts}.json`);
  fs.writeFileSync(outPath, JSON.stringify(loads, null, 2));
  console.log(`Generated test data at ${outPath}`);
} 