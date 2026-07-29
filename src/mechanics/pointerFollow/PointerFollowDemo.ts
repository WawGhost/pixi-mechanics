import { type FederatedPointerEvent, Graphics } from "pixi.js";
import type { DemoContext, MechanicDemo } from "../../app/types";

let follower: Graphics | undefined;
let targetX = 0;
let targetY = 0;
let stageRef: DemoContext["stage"] | undefined;

const handlePointerMove = (event: FederatedPointerEvent) => {
  targetX = event.global.x;
  targetY = event.global.y;
};

export const PointerFollowDemo: MechanicDemo = {
  id: "pointer-follow",
  title: "Pointer Follow",

  setup({ app, stage }: DemoContext) {
    follower = new Graphics().circle(0, 0, 22).fill("#7dd3fc");

    follower.position.set(app.screen.width / 2, app.screen.height / 2);
    targetX = follower.x;
    targetY = follower.y;

    stageRef = stage;
    stage.eventMode = "static";
    stage.hitArea = app.screen;
    stage.on("pointermove", handlePointerMove);

    stage.addChild(follower);
  },

  update(deltaTime: number) {
    if (!follower) {
      return;
    }

    const followSpeed = 0.12;

    follower.x += (targetX - follower.x) * followSpeed * deltaTime;
    follower.y += (targetY - follower.y) * followSpeed * deltaTime;
  },

  destroy() {
    stageRef?.off("pointermove", handlePointerMove);
    stageRef = undefined;
    follower = undefined;
  },
};
