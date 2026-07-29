import type { Application, Container } from "pixi.js";

export interface DemoContext {
  app: Application;
  stage: Container;
}

export interface MechanicDemo {
  id: string;
  title: string;
  setup(context: DemoContext): void | Promise<void>;
  update?(deltaTime: number): void;
  destroy?(): void;
}
