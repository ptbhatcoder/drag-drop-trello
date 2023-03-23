import "./styles.css";
import { useState } from "react";

const tasks1 = {
  id: "tasks1",
  name: "tasks1",
  tasks: [
    { id: "t11", title: "Task11" },
    { id: "t12", title: "Task12" },
    { id: "t13", title: "Task13" }
  ]
};
const tasks2 = {
  id: "tasks2",
  name: "tasks3",
  tasks: [
    { id: "t21", title: "Task21" },
    { id: "t22", title: "Task22" },
    { id: "t23", title: "Task23" }
  ]
};
const tasks3 = {
  id: "tasks3",
  name: "tasks3",
  tasks: [
    { id: "t31", title: "Task31" },
    { id: "t32", title: "Task32" },
    { id: "t33", title: "Task33" }
  ]
};
const initialAllTasks = [tasks1, tasks2, tasks3];

const Task = (props) => {
  const { task, onDragStart, src, onEditTask, onDeleteTask } = props;
  const { title, id } = task;
  function handleDragStart(e) {
    e.target.style.opacity = "0.4";
    onDragStart(e, id, src);
  }

  function handleDragEnd(e) {
    e.target.style.opacity = "1";
  }

  const [isEditable, setIsEditable] = useState(false);
  function handleDoubleClick() {
    setIsEditable(!isEditable);
  }

  function onTaskEdit(e) {
    onEditTask(src, { ...task, title: e.target.value });
  }

  function onDelete() {
    onDeleteTask(src, task);
  }

  return isEditable ? (
    <input
      className="task"
      autoFocus
      onDoubleClick={handleDoubleClick}
      value={title}
      onChange={onTaskEdit}
    />
  ) : (
    <div
      onDoubleClick={handleDoubleClick}
      draggable
      className="task"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {title}
      <button onClick={onDelete}>X</button>
    </div>
  );
};

const TaskList = (props) => {
  const { tasks, onMoveTask, id, name, onEditTask, onDeleteTask } = props;
  function onTaskDragStart(e, id, src) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ task: tasks.find((task) => task.id === id), src })
    );
  }
  function handleDragOver(e) {
    e.preventDefault();
    return false;
  }

  function handleDragEnter(e) {
    e.target.classList.add("over");
  }

  function handleDragLeave(e) {
    e.target.classList.remove("over");
  }

  function handleDrop(e) {
    e.stopPropagation();
    const data = JSON.parse(e.dataTransfer.getData("text"));
    if (data.src !== id) {
      onMoveTask(data.src, id, data.task);
    }
    e.target.classList.remove("over");
    return false;
  }
  return (
    <div className="tlContainer">
      <h2>{name}</h2>
      <div
        className="list"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {tasks.map((task) => (
          <Task
            src={id}
            task={task}
            key={task.id}
            onDragStart={onTaskDragStart}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [allTasks, setAllTasks] = useState(initialAllTasks);
  function handleEditTask(src, task) {
    setAllTasks((allTasks) => {
      const srcIndex = allTasks.findIndex((tasksList) => tasksList.id === src);
      let srcList = { ...allTasks[srcIndex] };
      const index = srcList.tasks.findIndex((t) => t.id === task.id);
      if (index > -1) {
        srcList.tasks[index] = task;
      }

      allTasks[srcIndex] = srcList;
      return [...allTasks];
    });
  }
  function handleDeleteTask(src, task) {
    setAllTasks((allTasks) => {
      const srcIndex = allTasks.findIndex((tasksList) => tasksList.id === src);
      let srcList = { ...allTasks[srcIndex] };
      const index = srcList.tasks.findIndex((t) => t.id === task.id);
      if (index > -1) {
        srcList.tasks.splice(index, 1);
      }

      allTasks[srcIndex] = srcList;
      return [...allTasks];
    });
  }
  function handleMoveTask(src, dest, task) {
    setAllTasks((allTasks) => {
      const srcIndex = allTasks.findIndex((tasksList) => tasksList.id === src);
      let srcList = { ...allTasks[srcIndex] };

      const destnIndex = allTasks.findIndex(
        (tasksList) => tasksList.id === dest
      );
      let destnList = { ...allTasks[destnIndex] };
      const index = srcList.tasks.findIndex((t) => t.id === task.id);
      if (index > -1) {
        srcList.tasks = [
          ...srcList.tasks.slice(0, index),
          ...srcList.tasks.slice(index + 1)
        ];
        destnList.tasks = [...destnList.tasks, task];
      }

      allTasks[srcIndex] = srcList;
      allTasks[destnIndex] = destnList;
      return [...allTasks];
    });
  }
  return (
    <div className="App">
      <h1>Project</h1>
      <div className="container">
        {allTasks.map((tasksList) => (
          <TaskList
            name={tasksList.name}
            id={tasksList.id}
            tasks={tasksList.tasks}
            key={tasksList.id}
            onMoveTask={handleMoveTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}
