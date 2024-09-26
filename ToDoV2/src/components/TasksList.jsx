import React from 'react';
import Task from './Task';
import styles from './TasksList.module.css';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <Task task={task} onChange={taskUpdate} subtaskChange={subtaskUpdate}/>
        </React.Fragment>
      ))}
    </ul>
  );
};

export default TasksList;