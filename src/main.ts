import GameApp from "./app/GameApp";

(async () => {
  const pixiRoot = document.getElementById("pixi-container");
  const panelRoot = document.getElementById("mechanics-panel");

  if (!pixiRoot) {
    throw new Error("Pixi container is undefined");
  }

  if (!panelRoot) {
    throw new Error("Panel is undefined");
  }

  const game = new GameApp(pixiRoot, panelRoot);
  await game.init();
})();
