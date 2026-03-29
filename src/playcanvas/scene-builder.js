import * as pc from "playcanvas";
import { ROOM_RECTS, WALKABLE_AREAS, WALL_SEGMENTS } from "./layout.js";

function createStandardMaterial(hexColor) {
  const material = new pc.StandardMaterial();
  const color = new pc.Color();
  color.fromString(hexColor);
  material.diffuse = color;
  material.metalness = 0.05;
  material.gloss = 0.25;
  material.update();
  return material;
}

export const materials = {
  floor: createStandardMaterial("#3a2f24"),
  wall: createStandardMaterial("#5d4734"),
  corridor: createStandardMaterial("#4c3b2d"),
  kobold: createStandardMaterial("#7d8c5d"),
  centipede: createStandardMaterial("#95614e"),
  playerProjectile: createStandardMaterial("#d4b16a"),
  treasure: createStandardMaterial("#d4aa52"),
  torch: createStandardMaterial("#ffca76"),
  accent: createStandardMaterial("#8a1f12")
};

export const colliders = [];

export function createBox(worldRoot, name, position, scale, material) {
  const entity = new pc.Entity(name);
  entity.addComponent("render", { type: "box", material });
  entity.setPosition(position.x, position.y, position.z);
  entity.setLocalScale(scale.x, scale.y, scale.z);
  worldRoot.addChild(entity);
  return entity;
}

export function createSphere(worldRoot, name, position, scale, material) {
  const entity = new pc.Entity(name);
  entity.addComponent("render", { type: "sphere", material });
  entity.setPosition(position.x, position.y, position.z);
  entity.setLocalScale(scale.x, scale.y, scale.z);
  worldRoot.addChild(entity);
  return entity;
}

function buildRectFloor(worldRoot, rect, y, material) {
  const centerX = (rect.minX + rect.maxX) / 2;
  const centerZ = (rect.minZ + rect.maxZ) / 2;
  const width = rect.maxX - rect.minX;
  const depth = rect.maxZ - rect.minZ;
  createBox(worldRoot, "floor", { x: centerX, y, z: centerZ }, { x: width, y: 0.2, z: depth }, material);
}

export function buildLevelGeometry(worldRoot) {
  colliders.length = 0;

  for (const area of WALKABLE_AREAS) {
    buildRectFloor(worldRoot, area.rect, -0.1, materials[area.material]);
  }

  for (const wall of WALL_SEGMENTS) {
    createBox(
      worldRoot,
      "wall",
      { x: wall.x, y: wall.h / 2, z: wall.z },
      { x: wall.hx * 2, y: wall.h, z: wall.hz * 2 },
      materials.wall
    );

    colliders.push({
      minX: wall.x - wall.hx,
      maxX: wall.x + wall.hx,
      minZ: wall.z - wall.hz,
      maxZ: wall.z + wall.hz
    });
  }

  createBox(worldRoot, "altar", { x: 12.6, y: 0.4, z: 10.8 }, { x: 1.8, y: 0.8, z: 1.2 }, materials.accent);
}

export function buildLights(app, worldRoot) {
  const sun = new pc.Entity("sun");
  sun.addComponent("light", {
    type: "directional",
    intensity: 1.2,
    color: new pc.Color(1, 0.92, 0.82),
    castShadows: false
  });
  sun.setEulerAngles(45, 30, 0);
  app.root.addChild(sun);

  const torchPositions = [
    { x: -1.4, y: 1.9, z: 0.4 },
    { x: -1.4, y: 1.9, z: 8 },
    { x: -8, y: 1.9, z: 11 },
    { x: 8, y: 1.9, z: 11 },
    { x: 0, y: 1.9, z: 17.75 }
  ];

  for (const position of torchPositions) {
    createSphere(worldRoot, "torch", position, { x: 0.2, y: 0.2, z: 0.2 }, materials.torch);
    const light = new pc.Entity("torchLight");
    light.addComponent("light", {
      type: "omni",
      color: new pc.Color(1, 0.62, 0.32),
      intensity: 1.6,
      range: 9
    });
    light.setPosition(position.x, position.y, position.z);
    worldRoot.addChild(light);
  }
}

export function isInsideWalkableArea(position) {
  return WALKABLE_AREAS.some(({ rect }) => (
    position.x >= rect.minX + 0.45 &&
    position.x <= rect.maxX - 0.45 &&
    position.z >= rect.minZ + 0.45 &&
    position.z <= rect.maxZ - 0.45
  ));
}

export function intersectsCollider(position, radius = 0.35) {
  return colliders.some((collider) => (
    position.x + radius > collider.minX &&
    position.x - radius < collider.maxX &&
    position.z + radius > collider.minZ &&
    position.z - radius < collider.maxZ
  ));
}

export function getCurrentRoom(position) {
  for (const [name, rect] of Object.entries(ROOM_RECTS)) {
    if (position.x >= rect.minX && position.x <= rect.maxX && position.z >= rect.minZ && position.z <= rect.maxZ) {
      return name;
    }
  }

  return "void";
}
