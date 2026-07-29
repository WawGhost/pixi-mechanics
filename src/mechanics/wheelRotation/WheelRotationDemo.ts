import { Container, Graphics, Text } from "pixi.js";
import gsap from "gsap";
import type { DemoContext, MechanicDemo } from "../../app/types";

const GAME_STATES = {
  START: "START",
  PLAYING: "PLAYING",
  END: "END",
} as const;

const wheelSlots = ["1", "2", "3", "4", "5", "6", "7", "8"];
const wheelColors = [
  "#b91c1c",
  "#111827",
  "#d97706",
  "#0f766e",
  "#7f1d1d",
  "#1f2937",
  "#ca8a04",
  "#115e59",
];

let gameState: (typeof GAME_STATES)[keyof typeof GAME_STATES] =
  GAME_STATES.START;
let wheelContainerRef: Container | undefined;
let spinButtonRef: Container | undefined;

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);

  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getTotalAngleToSpin(
  targetIndex: number,
  sectors: number,
  { deltaAngle: { min = 18, max = 42 } = {} } = {},
) {
  const minSpins = getRandomInt(5, 9);
  const randAngle = getRandomInt(min, max);
  const slotAngle = 360 / sectors;
  const targetStart = slotAngle * targetIndex;
  const deltaAngle = targetStart + randAngle;

  return 360 * minSpins + deltaAngle;
}

function createSector(
  index: number,
  sectorsCount: number,
  radius: number,
  color: string,
) {
  const sector = new Graphics();
  const sectorAngle = (Math.PI * 2) / sectorsCount;
  const startAngle = index * sectorAngle - Math.PI / 2;
  const endAngle = startAngle + sectorAngle;

  sector
    .moveTo(0, 0)
    .arc(0, 0, radius, startAngle, endAngle)
    .lineTo(0, 0)
    .fill(color)
    .stroke({ color: "#f8fafc", width: 3, alpha: 0.78 });

  return sector;
}

function createSlotLabel(text: string, index: number, sectorsCount: number) {
  const labelContainer = new Container();
  const slotAngle = (Math.PI * 2) / sectorsCount;
  const angle = index * slotAngle + slotAngle / 2 - Math.PI / 2;
  const textRadius = 138;

  labelContainer.position.set(
    Math.cos(angle) * textRadius,
    Math.sin(angle) * textRadius,
  );
  labelContainer.rotation = angle + Math.PI / 2;

  const label = new Text({
    text,
    style: {
      fill: "#fff7ed",
      fontSize: 28,
      fontWeight: "700",
      align: "center",
      dropShadow: {
        color: "#000000",
        blur: 2,
        distance: 2,
        alpha: 0.5,
      },
    },
  });

  label.anchor.set(0.5);
  labelContainer.addChild(label);

  return labelContainer;
}

function createPointer() {
  const pointer = new Graphics()
    .poly([0, 0, 22, -38, -22, -38])
    .fill("#facc15")
    .stroke({ color: "#fff7ed", width: 3 });

  pointer.position.set(0, -202);

  return pointer;
}

function createSpinButton(onSpin: () => void) {
  const buttonContainer = new Container();
  buttonContainer.eventMode = "static";
  buttonContainer.cursor = "pointer";
  buttonContainer.onpointertap = onSpin;

  const outer = new Graphics()
    .circle(0, 0, 58)
    .fill("#facc15")
    .stroke({ color: "#fff7ed", width: 5 });
  const inner = new Graphics().circle(0, 0, 47).fill("#ef4444");

  const label = new Text({
    text: "Spin",
    style: {
      fontSize: 24,
      fontWeight: "800",
      fill: "#ffffff",
      align: "center",
    },
  });

  label.anchor.set(0.5);
  buttonContainer.addChild(outer, inner, label);

  return buttonContainer;
}

export const WheelRotationDemo: MechanicDemo = {
  id: "wheel-rotation",
  title: "Wheel Rotation",

  setup({ app, stage }: DemoContext) {
    gameState = GAME_STATES.START;

    const mechanicContainer = new Container();
    mechanicContainer.position.set(app.screen.width / 2, app.screen.height / 2);

    const wheelContainer = new Container();
    wheelContainerRef = wheelContainer;
    mechanicContainer.addChild(wheelContainer);

    const radius = 190;

    for (let i = 0; i < wheelSlots.length; i += 1) {
      wheelContainer.addChild(
        createSector(i, wheelSlots.length, radius, wheelColors[i]),
      );
      wheelContainer.addChild(
        createSlotLabel(wheelSlots[i], i, wheelSlots.length),
      );
    }

    const rim = new Graphics()
      .circle(0, 0, radius + 8)
      .stroke({ color: "#fde68a", width: 12 })
      .circle(0, 0, radius - 4)
      .stroke({ color: "#7c2d12", width: 4 });

    wheelContainer.addChild(rim);

    const pointer = createPointer();
    mechanicContainer.addChild(pointer);

    const spinButton = createSpinButton(() => {
      if (gameState === GAME_STATES.PLAYING || !wheelContainerRef) {
        return;
      }

      gameState = GAME_STATES.PLAYING;
      spinButton.cursor = "not-allowed";

      gsap.to(spinButton.scale, {
        x: 0.9,
        y: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power1.out",
      });

      const targetIndex = getRandomInt(0, wheelSlots.length);
      const totalAngle =
        wheelContainerRef.angle +
        getTotalAngleToSpin(targetIndex, wheelSlots.length);

      gsap.to(wheelContainerRef, {
        angle: totalAngle,
        duration: 4.5,
        ease: "expo.out",
        onComplete: () => {
          gameState = GAME_STATES.END;
          spinButton.cursor = "pointer";
        },
      });
    });

    spinButtonRef = spinButton;
    mechanicContainer.addChild(spinButton);

    stage.addChild(mechanicContainer);
  },

  destroy() {
    if (wheelContainerRef) {
      gsap.killTweensOf(wheelContainerRef);
    }

    if (spinButtonRef) {
      gsap.killTweensOf(spinButtonRef.scale);
    }

    wheelContainerRef = undefined;
    spinButtonRef = undefined;
    gameState = GAME_STATES.START;
  },
};
