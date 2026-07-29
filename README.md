# Pixi Mechanics

Pixi Mechanics - это растущий сборник небольших игровых механик на PixiJS v8.
Проект задуман как практическая лаборатория: каждая механика живет отдельной
демкой, которую можно открыть, изучить, изменить и использовать как основу для
будущих игровых прототипов.

Главная цель проекта - не собрать одну законченную игру, а накопить понятные
примеры распространенных PixiJS и gamedev-паттернов.

## Цели проекта

- Держать каждую механику изолированной и удобной для изучения.
- Использовать актуальные практики PixiJS v8, включая асинхронный
  `Application.init()`.
- На ранних этапах предпочитать `Graphics`, если отдельные ассеты не нужны.
- Сделать переключение между механиками простым и предсказуемым.
- Оставить архитектуру готовой для новых демо, debug-инструментов, настроек и
  ассетов.

## Реализованные механики

### Basic Movement

Базовая механика движения игрока с клавиатуры. Используются velocity,
acceleration и friction. Объект ограничен видимой областью Pixi-сцены и не может
улететь за пределы canvas.

### Pointer Follow

Механика слежения за указателем мыши. Pixi-объект плавно движется к текущей
позиции курсора. Демка показывает работу pointer events, target position и
покадрового `update`.

### Wheel Rotation

Прототип вращающегося колеса в духе casino wheel. Колесо собрано из секторов на
`Graphics`, содержит подписи, внешний обод, центральную кнопку `Spin`, стрелку и
анимацию вращения через GSAP.

## Архитектура

Приложение разделено на небольшой app shell и независимые модули механик:

```txt
src/
  app/
    createPixiApp.ts
    GameApp.ts
    types.ts

  mechanics/
    registry.ts
    basicMovement/
    pointerFollow/
    wheelRotation/
```

Каждая механика реализует общий контракт `MechanicDemo`:

```ts
export interface MechanicDemo {
  id: string;
  title: string;
  setup(context: DemoContext): void | Promise<void>;
  update?(deltaTime: number): void;
  destroy?(): void;
}
```

`setup()` создает сцену демки, `update()` вызывается каждый кадр, а `destroy()`
чистит обработчики, анимации и состояние модуля перед переключением на другую
механику.

## Как добавить новую механику

1. Создать новую папку внутри `src/mechanics`.
2. Экспортировать из файла объект `MechanicDemo`.
3. Добавить механику в `src/mechanics/registry.ts`.
4. Все event listeners, внешние анимации и состояние очищать через `destroy()`.

## Команды

```sh
npm run dev
npm run lint
npm run build
```

`npm run dev` запускает локальный dev-сервер Vite.

## GitHub Pages

Проект подготовлен к деплою на GitHub Pages через GitHub Actions.

Workflow находится в `.github/workflows/deploy-pages.yml`. При push в ветку
`main` он устанавливает зависимости, запускает `npm run build`, загружает папку
`dist` как Pages artifact и публикует ее.

Для корректных путей на GitHub Pages в `vite.config.ts` используется production
base:

```ts
base: command === "build" ? "/pixi-mechanics/" : "/";
```

Локально проект продолжает открываться от корня dev-сервера.
