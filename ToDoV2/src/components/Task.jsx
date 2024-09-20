import React from 'react';
import styles from './Task.module.css';

const Task = ({ task, isSub }) => {
  return (
    <li className={isSub ? styles.subtask : styles.superiorTask}>
      <input type="checkbox" className={isSub ? styles.checkboxSub : styles.checkboxSup} />
      <span>{task.title}</span>
      {task.subtasks && (
        <ul>
          {task.subtasks.map((subtask) => (
            <Task key={subtask.id} task={subtask} isSub={true}/>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Task;