import * as pc from "playcanvas";
import { PLAYER_START } from "./layout.js";
import { isInsideWalkableArea, intersectsCollider } from "./scene-builder.js";

export function updateCameraTransform(playerRig, cameraPitch, yaw, pitch) {
  playerRig.setEulerAngles(0, yaw, 0);
  cameraPitch.setEulerAngles(pitch, 0, 0);
}

export function getForward(camera) {
  return camera.forward.clone().normalize();
}

export function updatePlayerMovement(app, playerRig, camera, dt) {
  const move = new pc.Vec3();
  const forward = getForward(camera);
  forward.y = 0;
  forward.normalize();
  const right = new pc.Vec3();
  right.cross(forward, pc.Vec3.UP).normalize();

  if (app.keyboard.isPressed(pc.KEY_W)) move.add(forward);
  if (app.keyboard.isPressed(pc.KEY_S)) move.sub(forward);
  if (app.keyboard.isPressed(pc.KEY_D)) move.add(right);
  if (app.keyboard.isPressed(pc.KEY_A)) move.sub(right);

  if (move.lengthSq() === 0) {
    return;
  }

  move.normalize();
  const speed = app.keyboard.isPressed(pc.KEY_SHIFT) ? 5.5 : 3.6;
  move.scale(speed * dt);

  const candidate = playerRig.getPosition().clone().add(move);
  candidate.y = PLAYER_START.y;

  if (isInsideWalkableArea(candidate) && !intersectsCollider(candidate)) {
    playerRig.setPosition(candidate);
    return;
  }

  const xOnly = playerRig.getPosition().clone();
  xOnly.x += move.x;
  if (isInsideWalkableArea(xOnly) && !intersectsCollider(xOnly)) {
    playerRig.setPosition(xOnly);
  }

  const zOnly = playerRig.getPosition().clone();
  zOnly.z += move.z;
  if (isInsideWalkableArea(zOnly) && !intersectsCollider(zOnly)) {
    playerRig.setPosition(zOnly);
  }
}
