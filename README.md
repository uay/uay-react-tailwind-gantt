# uay-react-tailwind-gantt

This project is based on [MaTeMaTuK/gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react).
The original library was no longer maintained. Also, we wanted to move from css to tailwindcss.

It provides React components with tailwind styles for building Gantt charts.

**IMPORTANT**: This library is meant to be styled by tailwindcss. Therefore, a tailwindcss configuration is required in your project.

## Original Live Demo

Since we do not yet have our own live demo, you can check the original live demo here:

[matematuk.github.io/gantt-task-react/](https://matematuk.github.io/gantt-task-react/)

## Features

- [x] Gantt chart
  - [x] Date view mode
  - [x] Task list toggle
  - [x] Tasks
    - [x] Task progress
    - [x] Task dependencies
    - [x] Move tasks
    - [x] Resize tasks
  - [x] Milestones
    - [x] Move milestones
  - [x] Projects
    - [x] Project progress
    - [x] Automatically size and move project
- [x] Tailwind support
- [ ] Customize styling

## Install

```
npm install uay-react-tailwind-gantt
yarn install uay-react-tailwind-gantt
pnpm install uay-react-tailwind-gantt
```

## Usage

```javascript
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'uay-react-tailwind-gantt';

let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: 'Idea',
      id: 'Task 0',
      type:'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    ...
];
<Gantt tasks={tasks} />
```

You may handle actions

```javascript
<Gantt
  tasks={tasks}
  viewMode={view}
  onDateChange={onTaskChange}
  onTaskDelete={onTaskDelete}
  onProgressChange={onProgressChange}
  onDoubleClick={onDblClick}
  onClick={onClick}
/>
```

## How to run example

```
cd ./example
npm install
npm start
```

## Configuration

You find the configuration docs here: [./docs/Configuration.md](./docs/Configuration.md)

## Guidelines

You find the guidelines for contributions and code here: [./docs/Guidelines.md](./docs/Guidelines.md)

## Roadmap

You find the roadmap docs here: [./docs/Roadmap.md](./docs/Roadmap.md)

## License

[MIT](./LICENSE)
