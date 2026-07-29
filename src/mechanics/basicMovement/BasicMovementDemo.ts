import { Graphics } from "pixi.js";
import type { DemoContext, MechanicDemo } from "../../app/types";

export const BasicMovementDemo: MechanicDemo = {
  id: "basic-movement",
  title: "Basic Movement",

  setup({ stage }: DemoContext) {
    const player = new Graphics().circle(0, 0, 24).fill("#f5c542");

    player.position.set(200, 200);
    stage.addChild(player);
  },
};
