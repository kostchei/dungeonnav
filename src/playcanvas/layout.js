export const ROOM_RECTS = {
  A2: { minX: -1.5, maxX: 1.5, minZ: 4, maxZ: 9 },
  A3: { minX: -10.5, maxX: -3.5, minZ: 5.5, maxZ: 13.5 },
  A5: { minX: 3.5, maxX: 10.5, minZ: 7, maxZ: 13 },
  A4: { minX: 5.5, maxX: 14.5, minZ: 8.5, maxZ: 19.5 }
};

export const WALKABLE_AREAS = [
  { id: "A2", material: "corridor", rect: ROOM_RECTS.A2 },
  { id: "A3", material: "floor", rect: ROOM_RECTS.A3 },
  { id: "A5", material: "floor", rect: ROOM_RECTS.A5 },
  { id: "A4", material: "floor", rect: ROOM_RECTS.A4 },
  { id: "A2-A3", material: "corridor", rect: { minX: -3.5, maxX: -1.5, minZ: 7, maxZ: 9.5 } },
  { id: "A2-A5", material: "corridor", rect: { minX: 1.5, maxX: 3.5, minZ: 8.5, maxZ: 10.5 } },
  { id: "A5-A4", material: "corridor", rect: { minX: 10.5, maxX: 12, minZ: 10, maxZ: 12.5 } }
];

export const WALL_SEGMENTS = [
  { x: 0, z: 3.4, hx: 2.5, hz: 0.6, h: 2.8 },
  { x: -2.1, z: 5.8, hx: 0.6, hz: 1.8, h: 2.8 },
  { x: 2.1, z: 6.2, hx: 0.6, hz: 2.3, h: 2.8 },
  { x: -7.2, z: 4.9, hx: 4.3, hz: 0.6, h: 2.8 },
  { x: -11.1, z: 9.5, hx: 0.7, hz: 4.8, h: 2.8 },
  { x: -7.2, z: 14.1, hx: 4.1, hz: 0.6, h: 2.8 },
  { x: 7.2, z: 6.4, hx: 4.2, hz: 0.6, h: 2.8 },
  { x: 11.1, z: 8.6, hx: 0.7, hz: 1.6, h: 2.8 },
  { x: 2.8, z: 12.1, hx: 0.7, hz: 1.7, h: 2.8 },
  { x: 6.4, z: 13.6, hx: 1.8, hz: 0.7, h: 2.8 },
  { x: 14.9, z: 14, hx: 0.7, hz: 5.8, h: 2.8 },
  { x: 9.9, z: 20.1, hx: 4.8, hz: 0.7, h: 2.8 },
  { x: 4.9, z: 16.4, hx: 0.7, hz: 3.8, h: 2.8 },
  { x: -8.9, z: 11.4, hx: 1, hz: 1, h: 2.2 },
  { x: -5.8, z: 7.8, hx: 1.2, hz: 0.8, h: 2.2 },
  { x: 6.5, z: 10.1, hx: 0.9, hz: 1.1, h: 2.2 },
  { x: 9.2, z: 12.2, hx: 1.1, hz: 0.8, h: 2.2 },
  { x: 8.7, z: 14.1, hx: 1.5, hz: 1.2, h: 2.3 }
];

export const ENCOUNTER_LAYOUT = {
  "a2-guard": [{ x: 0, z: 7.5, enemyId: "kobold" }],
  "a3-west-room": [
    { x: -7.5, z: 11.5, enemyId: "kobold" },
    { x: -6, z: 8, enemyId: "kobold" },
    { x: -9, z: 9.5, enemyId: "giantCentipede" }
  ],
  "a5-north-room": [
    { x: 6, z: 11, enemyId: "kobold" },
    { x: 8.5, z: 8.5, enemyId: "kobold" },
    { x: 4.8, z: 9.2, enemyId: "giantCentipede" }
  ],
  "a4-main-lair": [
    { x: 12, z: 11, enemyId: "kobold" },
    { x: 13, z: 13, enemyId: "kobold" },
    { x: 10.5, z: 16.5, enemyId: "kobold" },
    { x: 8, z: 17.5, enemyId: "giantCentipede" }
  ]
};

export const ENCOUNTER_TRIGGER_ROOMS = {
  "a2-guard": "A2",
  "a3-west-room": "A3",
  "a5-north-room": "A5",
  "a4-main-lair": "A4"
};

export const TREASURE_POSITION = { x: 13, y: 0.75, z: 10.5 };
export const PLAYER_START = { x: 0, y: 1.6, z: 4.9 };
