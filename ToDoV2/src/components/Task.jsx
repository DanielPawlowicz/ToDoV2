import React, { useState } from 'react';
import styles from './Task.module.css';
import {FaAngleDown, FaAngleUp, FaBars} from "react-icons/fa";
import DialogBox from './DialogBox';

const Task = ({ task, isSub = false, onChange, subtaskChange }) => {

  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState(false);


  // handle hover on the task li
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // handle hover on the hamburger icon
  const handleDialogBoxShow = () => {
    setShowDialogBox(true);
  }
  
  const handleDialogBoxHide = () => {
    setShowDialogBox(false);
  }


  // for checking off the checkbox in tasks and subtasks
  const handleCheckboxChange = (e, task) => {
    const updatedTask = {
      ...task,
      isChecked: e.target.checked,
    };
    if(isSub){
      subtaskChange(updatedTask);
    } else {
      onChange(updatedTask);
    }
  };


  return (
    <li 
      className={isSub ? styles.subtask : styles.superiorTask}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.inlineContainer}>
        <div className={styles.secondContainer}>
          <input type="checkbox" className={isSub ? styles.checkboxSub : styles.checkboxSup} checked={task.isChecked} onChange={(e) => handleCheckboxChange(e, task)} />
          <span className={task.isChecked ? `${styles.title_checked} ${styles.task_title}` : styles.task_title}>{task.title}</span>
          {/* Ensure that subtasks exist and are an array before rendering the button */}
          {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
            <button className={styles.toggle_button} onClick={() => setShowSubtasks(!showSubtasks)}>
              {showSubtasks ? <FaAngleUp /> : <FaAngleDown />}
            </button>
          )}
        </div>
        {isHovered && (
          <div className={styles.barsContainer} onMouseEnter={handleDialogBoxShow} onMouseLeave={handleDialogBoxHide} >
            <FaBars style={{ fontSize: 15, color: '#aaa' }} />
            {showDialogBox && 
              <DialogBox task={task}/>
            }
          </div>
        )}
      </div>
      {/* Safely render subtasks only if they are an array */}
      {Array.isArray(task.subtasks) && showSubtasks && (
        <ul>
          {task.subtasks.map((subtask) => (
            <Task key={subtask.id} task={subtask} isSub={true} onChange={subtaskChange} subtaskChange={subtaskChange}/>
          ))}
        </ul>
      )}
    </li>
  );
};

export default Task;