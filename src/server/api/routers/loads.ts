import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { generateLoads } from '../../../lib/scripts/generateLoads';
import { buildLoadGraph, findOptimalPath } from '../../../lib/loads/graph';
import type { Load, LoadGraph } from '../../../lib/loads/types';

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
  generate: publicProcedure
    .input(z.object({
      count: z.number().min(1).max(1000).default(200)
    }))
    .mutation(async ({ input }) => {
      const loads = generateLoads(input.count);
      return loads;
    }),

  buildGraph: publicProcedure
    .input(z.object({
      loads: z.array(z.custom<Load>())
    }))
    .mutation(async ({ input }) => {
      const graph = buildLoadGraph(input.loads);
      return graph;
    }),

  findPath: publicProcedure
    .input(z.object({
      graph: z.custom<LoadGraph>(),
      startLoadId: z.string(),
      maxLoads: z.number().min(1).max(10).default(5)
    }))
    .mutation(async ({ input }) => {
      const startLoad = input.graph.nodes.find(load => load.id === input.startLoadId);
      if (!startLoad) throw new Error('Start load not found');
      return findOptimalPath(input.graph, startLoad, input.maxLoads);
    }),

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