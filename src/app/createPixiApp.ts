import { Application } from "pixi.js";

export async function createPixiApp(resizeTo: Window | HTMLElement) {
  const app = new Application();

  await app.init({
    background: "#101820",
    resizeTo,
    antialias: true,
  });

  return app;
}
