import React, { useState } from 'react';
import styles from './Task.module.css';
import { FaAngleDown, FaAngleUp, FaBars } from 'react-icons/fa';
import DialogBox from './DialogBox';
import SubtaskForm from './SubtaskForm';

const Task = ({ task, isSub = false, onChange, subtaskChange, showSubtasks, toggleSubtasks, deleteTask }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleDialogBoxShow = () => setShowDialogBox(true);
  const handleDialogBoxHide = () => setShowDialogBox(false);

  const [isSubtaskFormVisible, setIsSubtaskFormVisible] = useState(false);

  // Handle checking/unchecking of tasks and subtasks
  const handleCheckboxChange = (e, task) => {
    const updatedTask = {
      ...task,
      isChecked: e.target.checked,
    };
    if (isSub) {
      subtaskChange(updatedTask);
    } else {
      onChange(updatedTask);
    }
  };

  const addSubtask = (taskId) => {

  }

  return (
    <li
      className={isSub ? styles.subtask : styles.superiorTask}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.inlineContainer}>
        <div className={styles.secondContainer}>
          <input
            type="checkbox"
            className={isSub ? styles.checkboxSub : styles.checkboxSup}
            checked={task.isChecked}
            onChange={(e) => handleCheckboxChange(e, task)}
          />
          <span className={task.isChecked ? `${styles.title_checked} ${styles.task_title}` : styles.task_title}>
            {task.title}
          </span>
          {/* Ensure that subtasks exist before rendering the toggle button */}
          {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
            <button className={styles.toggle_button} onClick={toggleSubtasks}>
              {showSubtasks ? <FaAngleUp /> : <FaAngleDown />}
            </button>
          )}
        </div>
        {isHovered && (
          <div className={styles.barsContainer} onMouseEnter={handleDialogBoxShow} onMouseLeave={handleDialogBoxHide}>
            <FaBars className={styles.FaBars}/>
            {/* <FaBars className={styles.FaBars} style={{ fontSize: 13, color: '#aaa' }} /> */}
            {showDialogBox && <DialogBox task={task} isSub={isSub} deleteTask={deleteTask} setIsSubtaskFormVisible={setIsSubtaskFormVisible}/>}
          </div>
        )}
      </div>
      {/* Render subtasks if the toggle state is true */}
      {Array.isArray(task.subtasks) && showSubtasks && (
        <ul>
          {task.subtasks.map((subtask) => (
            <Task
              key={subtask.id}
              task={subtask}
              isSub={true}
              onChange={subtaskChange}
              subtaskChange={subtaskChange}
              showSubtasks={false} // Subtasks within subtasks are collapsed by default
              toggleSubtasks={null} // Subtasks shouldn't have a toggle button
              deleteTask={deleteTask}
            />
          ))}
        </ul>
      )}
      {
      isSubtaskFormVisible && 
      <SubtaskForm taskId={task.Id}/>
      }
    </li>
  );
};

export default Task;
