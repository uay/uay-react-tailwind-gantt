import type { Task } from 'uay-react-tailwind-gantt';
import { Gantt, ViewMode } from 'uay-react-tailwind-gantt';
import { ViewSwitcher } from './components/ViewSwitcher';
import { initTasks } from './helper/initTasks';
import { getStartEndDateForProject } from './helper/getStartEndDateForProject';
import { useState } from 'react';

// Init
export const App = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = useState(true);

  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log('handleTaskChange:', task.id, task.project);

    const newTasks: Task[] = tasks.map(t => (t.id === task.id ? task : t));

    if (!task.project) {
      setTasks(newTasks);

      return;
    }

    const [start, end] = getStartEndDateForProject(newTasks, task.project);

    const project = newTasks[newTasks.findIndex(t => t.id === task.project)];

    if (project.start?.getTime() === start && project.end?.getTime() === end) {
      setTasks(newTasks);

      return;
    }

    const changedProject: Task = {
      ...project,
      start: new Date(start),
      end: new Date(end),
    };

    setTasks(newTasks.map(t =>
      t.id === task.project ? changedProject : t,
    ));
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm('Are you sure about ' + task.name + ' ?');
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log('On progress change Id:' + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert('On Double Click event Id:' + task.id);
  };

  const handleClick = (task: Task) => {
    console.log('On Click event Id:' + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + ' has ' + (isSelected ? 'selected' : 'unselected'));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log('On expander click Id:' + task.id);
  };

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">uay-react-tailwind-gantt-example</h1>
        <ViewSwitcher
          viewMode={view}
          onViewModeChange={viewMode => setView(viewMode)}
          onViewListChange={setIsChecked}
          isChecked={isChecked}
        />
        <h2 className="text-xl font-bold">Gantt With Unlimited Height</h2>
        <Gantt
          tasks={tasks}
          displayOptions={{
            viewMode: view,
          }}
          stylingOptions={{
            listCellWidth: isChecked ? '155px' : '',
            columnWidth: columnWidth,
          }}
          eventOptions={{
            onTaskChange: handleTaskChange,
            onTaskDelete: handleTaskDelete,
            onProgressChange: handleProgressChange,
            onDoubleClick: handleDblClick,
            onClick: handleClick,
            onSelect: handleSelect,
            onExpanderClick: handleExpanderClick,
          }}
        />
        <h2>Gantt With Limited Height</h2>
        <Gantt
          tasks={tasks}
          displayOptions={{
            viewMode: view,
          }}
          stylingOptions={{
            ganttHeight: 300,
            listCellWidth: isChecked ? '155px' : '',
            columnWidth: columnWidth,
          }}
          eventOptions={{
            onTaskChange: handleTaskChange,
            onTaskDelete: handleTaskDelete,
            onProgressChange: handleProgressChange,
            onDoubleClick: handleDblClick,
            onClick: handleClick,
            onSelect: handleSelect,
            onExpanderClick: handleExpanderClick,
          }}
        />
      </div>
    </div>
  );
};
