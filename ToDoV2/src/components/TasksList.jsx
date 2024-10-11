import React from 'react';
import Task from './Task';
import styles from './TasksList.module.css';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate, deleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <Task task={task} onChange={taskUpdate} subtaskChange={subtaskUpdate} deleteTask={deleteTask} />
        </React.Fragment>
      ))}
    </ul>
  );
};

export default TasksList;