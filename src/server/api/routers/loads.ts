import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Schema definitions
const locationSchema = z.object({
  id: z.string(),
  city: z.string(),
  state: z.string(),
  lat: z.number(),
  lng: z.number(),
  timezone: z.string(),
});

const timeWindowSchema = z.object({
  start: z.date(),
  end: z.date(),
});

const loadSchema = z.object({
  id: z.string(),
  origin: locationSchema,
  destination: locationSchema,
  pickupWindow: timeWindowSchema,
  deliveryWindow: timeWindowSchema,
  rate: z.number(),
  miles: z.number(),
  rpm: z.number(),
  equipmentType: z.string(),
  weight: z.number(),
  brokerId: z.string(),
  source: z.string(),
});

const routeSchema = z.object({
  loads: z.array(loadSchema),
  totalMiles: z.number(),
  totalRate: z.number(),
  totalRpm: z.number(),
  deadheadMiles: z.number(),
  startTime: z.date(),
  endTime: z.date(),
});

export const loadsRouter = createTRPCRouter({
  // Generate test data
  generateTestData: publicProcedure
    .input(z.object({
      baseLoad: loadSchema,
      possibleLoads: z.array(loadSchema),
      origin: locationSchema,
      maxMiles: z.number(),
      maxLoads: z.number(),
    }))
    .mutation(async ({ input }) => {
      // Test data generation logic will go here
      return {
        // ... generated test data
      };
    }),

  // Find optimal route
  findOptimalRoute: publicProcedure
    .input(z.object({
      baseLoad: loadSchema,
      possibleLoads: z.array(loadSchema),
      origin: locationSchema,
      maxMiles: z.number().default(500),
      maxLoads: z.number().default(4),
    }))
    .query(async ({ input }) => {
      // Route finding logic will go here
      return {
        // ... optimal route
      };
    }),
}); 