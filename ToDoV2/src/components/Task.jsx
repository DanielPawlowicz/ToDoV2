import React, { useState } from 'react';
import styles from './Task.module.css';
import {FaAngleDown, FaAngleUp, FaBars} from "react-icons/fa";

const Task = ({ task, isSub = false }) => {

  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <li 
      className={isSub ? styles.subtask : styles.superiorTask}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.inlineContainer}>
        <div className={styles.secondContainer}>
          <input type="checkbox" className={isSub ? styles.checkboxSub : styles.checkboxSup} />
          <span className={task.isChecked ? `${styles.title_checked} ${styles.task_title}` : styles.task_title }>{task.title}</span>
          {task.subtasks && (
            <button className={styles.toggle_button} onClick={() => setShowSubtasks(!showSubtasks)}>
              {showSubtasks ? <FaAngleUp/> : <FaAngleDown />}
            </button>
          )}
        </div>
        {isHovered && (
          <div className={styles.barsContainer}>
            <FaBars style={{fontSize: 15, color: '#aaa'}}/>
          </div>
        )}
      </div>
      {task.subtasks && showSubtasks && (
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