import { type Application, Graphics } from "pixi.js";
import type { DemoContext, MechanicDemo } from "../../app/types";
import { clamp } from "../../helpers";

let appRef: Application | undefined;
let player: Graphics | undefined;
const playerRadius = 24;
let velocityX = 0;
let velocityY = 0;

const acceleration = 5;
const maxSpeed = 8;
const friction = 0.88;

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
};

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    keys.up = true;
  }

  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
    keys.down = true;
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = true;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = true;
  }
}

function handleKeyUp(event: KeyboardEvent) {
  if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
    keys.up = false;
  }

  if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
    keys.down = false;
  }

  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    keys.left = false;
  }

  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    keys.right = false;
  }
}

export const BasicMovementDemo: MechanicDemo = {
  id: "basic-movement",
  title: "Basic Movement",

  setup({ app, stage }: DemoContext) {
    appRef = app;

    player = new Graphics().circle(0, 0, playerRadius).fill("#f5c542");

    player.position.set(200, 200);
    stage.addChild(player);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  },

  update(deltaTime: number) {
    if (!player) {
      return;
    }

    const inputX = Number(keys.right) - Number(keys.left);
    const inputY = Number(keys.down) - Number(keys.up);

    const length = Math.hypot(inputX, inputY);

    const directionX = length > 0 ? inputX / length : 0;
    const directionY = length > 0 ? inputY / length : 0;

    velocityX += directionX * acceleration * deltaTime;
    velocityY += directionY * acceleration * deltaTime;

    const speed = Math.hypot(velocityX, velocityY);

    if (speed > maxSpeed) {
      velocityX = (velocityX / speed) * maxSpeed;
      velocityY = (velocityY / speed) * maxSpeed;
    }

    velocityX *= friction;
    velocityY *= friction;

    player.x += velocityX * deltaTime;
    player.y += velocityY * deltaTime;

    if (appRef) {
      const minX = playerRadius;
      const maxX = appRef.screen.width - playerRadius;
      const minY = playerRadius;
      const maxY = appRef.screen.height - playerRadius;

      const clampedX = clamp(player.x, minX, maxX);
      const clampedY = clamp(player.y, minY, maxY);

      if (clampedX !== player.x) {
        velocityX = 0;
      }

      if (clampedY !== player.y) {
        velocityY = 0;
      }

      player.position.set(clampedX, clampedY);
    }
  },

  destroy() {
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    player = undefined;
    velocityX = 0;
    velocityY = 0;
    keys.up = false;
    keys.down = false;
    keys.left = false;
    keys.right = false;
    appRef = undefined;
  },
};
