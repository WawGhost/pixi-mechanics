import { Text, Ticker, type Application } from "pixi.js";
import type { MechanicDemo } from "./types";
import { createPixiApp } from "./createPixiApp";
import { mechanics } from "../mechanics/registry";

class GameApp {
  private app?: Application;
  private activeDemo?: MechanicDemo;
  private activeDemoIndex = 0;

  constructor(
    private readonly pixiRoot: HTMLElement,
    private readonly panelRoot: HTMLElement,
  ) {}

  private createMechanicsButtons() {
    this.panelRoot.replaceChildren();

    mechanics.forEach((mechanic, index) => {
      const button = document.createElement("button");
      button.className = "mechanics-panel__button";
      button.type = "button";
      button.textContent = mechanic.title;

      if (index === this.activeDemoIndex) {
        button.classList.add("mechanics-panel__button--active");
      }

      button.addEventListener("click", () => {
        void this.startDemoByIndex(index);
      });

      this.panelRoot.appendChild(button);
    });
  }

  async init() {
    this.app = await createPixiApp(this.pixiRoot);
    this.pixiRoot.appendChild(this.app.canvas);
    this.app.ticker.add(this.update);

    const firstDemo = mechanics[this.activeDemoIndex];

    this.createMechanicsButtons();

    if (!firstDemo) {
      this.showEmptyState();
      return;
    }

    await this.startDemo(firstDemo);
  }

  private readonly update = (ticker: Ticker) => {
    this.activeDemo?.update?.(ticker.deltaTime);
  };

  private async startDemo(demo: MechanicDemo) {
    if (!this.app) {
      throw new Error("Pixi application is not init");
    }

    this.activeDemo?.destroy?.();
    this.app.stage.removeChildren();

    this.activeDemo = demo;

    await demo.setup({
      app: this.app,
      stage: this.app.stage,
    });
  }

  private showEmptyState() {
    if (!this.app) {
      return;
    }

    const message = new Text({
      text: "No mechanics registered",
      style: {
        fill: "#fff",
        fontSize: 24,
      },
      anchor: 0.5,
      position: {
        x: this.app.screen.width / 2,
        y: this.app.screen.height / 2,
      },
    });

    this.app.stage.addChild(message);
  }

  async startDemoByIndex(index: number) {
    const demo = mechanics[index];

    if (!demo) {
      return;
    }

    this.activeDemoIndex = index;
    await this.startDemo(demo);
    this.createMechanicsButtons();
  }
}

export default GameApp;
