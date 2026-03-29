import * as pc from "playcanvas";

let appRef = null;
let worldRootRef = null;

// Generate simple 4x4 white texture for particles to tint
function createParticleTexture(device) {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 4, 4);

  const texture = new pc.Texture(device, {
    format: pc.PIXELFORMAT_R8_G8_B8_A8,
    autoMipmap: false
  });
  texture.setSource(canvas);
  return texture;
}

let sharedTexture = null;

export const VfxManager = {
  init(app, worldRoot) {
    appRef = app;
    worldRootRef = worldRoot;
    sharedTexture = createParticleTexture(app.graphicsDevice);
  },

  spawnBloodBurst(position) {
    if (!appRef) return;
    
    const entity = new pc.Entity();
    entity.setPosition(position.x, position.y + 0.5, position.z);
    
    entity.addComponent('particlesystem', {
      numParticles: 15,
      lifetime: 0.6,
      rate: 0.1,
      rate2: 0.1,
      startAngle: 0,
      startAngle2: 360,
      colorMap: sharedTexture,
      colorGraph: new pc.CurveSet([
        [0, 150/255], // R
        [0, 20/255],  // G
        [0, 20/255],  // B
      ]),
      colorGraph2: new pc.CurveSet([
        [0, 200/255], // R
        [0, 40/255],  // G
        [0, 40/255],  // B
      ]),
      alphaGraph: new pc.Curve([0, 1, 0.8, 1, 1, 0]),
      scaleGraph: new pc.Curve([0, 0.1, 1, 0]),
      velocityGraph: new pc.CurveSet([
        [0, -1, 1, 1],
        [0, 0, 1, 3],
        [0, -1, 1, 1]
      ]),
      velocityGraph2: new pc.CurveSet([
        [0, 1, 1, -1],
        [0, 3, 1, 0],
        [0, 1, 1, -1]
      ]),
      autoPlay: true,
      loop: false
    });
    
    worldRootRef.addChild(entity);
    entity.particlesystem.reset();
    entity.particlesystem.play();
    
    // Cleanup
    setTimeout(() => {
      if (entity && !entity._destroyed) {
        entity.destroy();
      }
    }, 1000);
  },

  spawnDustHit(position) {
    if (!appRef) return;
    
    const entity = new pc.Entity();
    entity.setPosition(position.x, position.y + 0.5, position.z);
    
    entity.addComponent('particlesystem', {
      numParticles: 10,
      lifetime: 0.8,
      rate: 0.1,
      rate2: 0.1,
      startAngle: 0,
      startAngle2: 360,
      colorMap: sharedTexture,
      colorGraph: new pc.CurveSet([
        [0, 120/255], // R
        [0, 100/255], // G
        [0, 80/255],  // B
      ]),
      alphaGraph: new pc.Curve([0, 0.8, 1, 0]),
      scaleGraph: new pc.Curve([0, 0.1, 1, 0.3]),
      velocityGraph: new pc.CurveSet([
        [0, -0.5, 1, 0.5],
        [0, 0, 1, 1],
        [0, -0.5, 1, 0.5]
      ]),
      velocityGraph2: new pc.CurveSet([
        [0, 0.5, 1, -0.5],
        [0, 1, 1, 0],
        [0, 0.5, 1, -0.5]
      ]),
      autoPlay: true,
      loop: false
    });
    
    worldRootRef.addChild(entity);
    entity.particlesystem.reset();
    entity.particlesystem.play();
    
    // Cleanup
    setTimeout(() => {
      if (entity && !entity._destroyed) {
        entity.destroy();
      }
    }, 1200);
  }
};
