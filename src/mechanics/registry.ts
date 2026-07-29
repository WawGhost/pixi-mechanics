import type { MechanicDemo } from "../app/types";
import { BasicMovementDemo } from "./basicMovement/BasicMovementDemo";
import { PointerFollowDemo } from "./pointerFollow/PointerFollowDemo";
import { WheelRotationDemo } from "./wheelRotation/WheelRotationDemo";

export const mechanics: MechanicDemo[] = [
  BasicMovementDemo,
  PointerFollowDemo,
  WheelRotationDemo,
];
