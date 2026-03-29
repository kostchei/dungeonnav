export const ROOM_RECTS = {
  exterior: { minX: -8, maxX: 8, minZ: -14, maxZ: -2 },
  A1: { minX: -2, maxX: 2, minZ: -2, maxZ: 4 },
  A2: { minX: -2, maxX: 2, minZ: 4, maxZ: 12 },
  A3: { minX: -12, maxX: -2, minZ: 6, maxZ: 14 },
  A5: { minX: 2, maxX: 12, minZ: 6, maxZ: 14 },
  A4: { minX: -5, maxX: 5, minZ: 12, maxZ: 21 }
};

export const WALL_SEGMENTS = [
  { x: 0, z: -14, hx: 8, hz: 0.5, h: 2.5 },
  { x: 0, z: -2, hx: 2.5, hz: 0.5, h: 2.5 },
  { x: -8, z: -8, hx: 0.5, hz: 6, h: 2.5 },
  { x: 8, z: -8, hx: 0.5, hz: 6, h: 2.5 },
  { x: -2.5, z: 1, hx: 0.5, hz: 3, h: 2.5 },
  { x: 2.5, z: 1, hx: 0.5, hz: 3, h: 2.5 },
  { x: -2.5, z: 8, hx: 0.5, hz: 4, h: 2.5 },
  { x: 2.5, z: 8, hx: 0.5, hz: 4, h: 2.5 },
  { x: -7, z: 6, hx: 5, hz: 0.5, h: 2.5 },
  { x: -7, z: 14, hx: 5, hz: 0.5, h: 2.5 },
  { x: -12, z: 10, hx: 0.5, hz: 4, h: 2.5 },
  { x: 7, z: 6, hx: 5, hz: 0.5, h: 2.5 },
  { x: 7, z: 14, hx: 5, hz: 0.5, h: 2.5 },
  { x: 12, z: 10, hx: 0.5, hz: 4, h: 2.5 },
  { x: 0, z: 21, hx: 5, hz: 0.5, h: 2.5 },
  { x: -5.5, z: 16.5, hx: 0.5, hz: 4.5, h: 2.5 },
  { x: 5.5, z: 16.5, hx: 0.5, hz: 4.5, h: 2.5 }
];

export const ENCOUNTER_LAYOUT = {
  "a1-scout": [{ x: 0, z: 2.5, enemyId: "kobold" }],
  "a2-guard": [{ x: 0, z: 8, enemyId: "kobold" }],
  "a3-west-room": [
    { x: -8, z: 10, enemyId: "kobold" },
    { x: -5.5, z: 12, enemyId: "kobold" },
    { x: -9.5, z: 8.5, enemyId: "giantCentipede" }
  ],
  "a5-north-room": [
    { x: 8, z: 10, enemyId: "kobold" },
    { x: 5.5, z: 12, enemyId: "kobold" },
    { x: 9.5, z: 8.5, enemyId: "giantCentipede" }
  ],
  "a4-main-lair": [
    { x: -1.5, z: 16.5, enemyId: "kobold" },
    { x: 1.75, z: 17.25, enemyId: "kobold" }
  ]
};

export const ENCOUNTER_TRIGGER_ROOMS = {
  "a1-scout": "A1",
  "a2-guard": "A2",
  "a3-west-room": "A3",
  "a5-north-room": "A5",
  "a4-main-lair": "A4"
};

export const TREASURE_POSITION = { x: 0, y: 0.75, z: 19 };
export const PLAYER_START = { x: 0, y: 1.6, z: -10 };
