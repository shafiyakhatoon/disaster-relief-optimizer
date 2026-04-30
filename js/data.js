/**
 * data.js — Region dataset
 * Each region represents a disaster-affected area.
 *
 * Fields:
 *   id         — unique identifier
 *   name       — descriptive name
 *   urgency    — 1–10 (severity of situation)
 *   population — thousands of people affected
 *   distance   — km from supply center (delivery difficulty)
 *   resources  — units of resources required
 */

const REGIONS_DATA = [
  { id: 'R1',  name: 'Coastal Zone A',    urgency: 9,  population: 120, distance: 30,  resources: 15 },
  { id: 'R2',  name: 'Mountain Village',  urgency: 7,  population: 80,  distance: 60,  resources: 10 },
  { id: 'R3',  name: 'River Delta',       urgency: 8,  population: 200, distance: 20,  resources: 20 },
  { id: 'R4',  name: 'Urban District',    urgency: 6,  population: 350, distance: 80,  resources: 25 },
  { id: 'R5',  name: 'Remote Hills',      urgency: 10, population: 40,  distance: 150, resources: 8  },
  { id: 'R6',  name: 'Flood Plains',      urgency: 8,  population: 160, distance: 45,  resources: 18 },
  { id: 'R7',  name: 'Harbor Area',       urgency: 5,  population: 90,  distance: 35,  resources: 12 },
  { id: 'R8',  name: 'Northern Camp',     urgency: 9,  population: 70,  distance: 100, resources: 14 },
  { id: 'R9',  name: 'Valley Basin',      urgency: 7,  population: 130, distance: 55,  resources: 16 },
  { id: 'R10', name: 'Riverside Town',    urgency: 6,  population: 180, distance: 40,  resources: 22 },
  { id: 'R11', name: 'Desert Outpost',    urgency: 10, population: 25,  distance: 200, resources: 6  },
  { id: 'R12', name: 'Estuary Region',    urgency: 8,  population: 110, distance: 70,  resources: 19 },
];

/** Mutable working copy — user can add / remove regions at runtime */
let regions = [...REGIONS_DATA];
