import { addMinutes } from 'date-fns';
import type { Location, TimeWindow } from './types';

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

export function randomFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Calculate distance between two points using the Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate time window overlap
export function calculateTimeWindowOverlap(window1: TimeWindow, window2: TimeWindow): number {
  const start = Math.max(window1.start.getTime(), window2.start.getTime());
  const end = Math.min(window1.end.getTime(), window2.end.getTime());
  return Math.max(0, end - start) / (1000 * 60); // Convert to minutes
}

// Calculate if there's enough time between two time windows
export function hasEnoughTimeBetween(
  firstWindow: TimeWindow,
  secondWindow: TimeWindow,
  requiredMinutes: number
): boolean {
  const timeBetween = (secondWindow.start.getTime() - firstWindow.end.getTime()) / (1000 * 60);
  return timeBetween >= requiredMinutes;
}

// Calculate drive time in minutes based on distance
export function calculateDriveTime(distance: number, speedMph: number): number {
  return Math.round((distance / speedMph) * 60);
}

// Calculate deadhead between two locations
export function calculateDeadhead(from: Location, to: Location): number {
  return calculateDistance(from.lat, from.lng, to.lat, to.lng);
} 