import type { MechanicDemo } from "../app/types";
import { BasicMovementDemo } from "./basicMovement/BasicMovementDemo";
import { PointerFollowDemo } from "./pointerFollow/PointerFollowDemo";

export const mechanics: MechanicDemo[] = [BasicMovementDemo, PointerFollowDemo];
