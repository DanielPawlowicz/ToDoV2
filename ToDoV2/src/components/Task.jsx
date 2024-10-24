import React, { useState } from 'react';
import styles from './Task.module.css';
import { FaAngleDown, FaAngleUp, FaBars } from 'react-icons/fa';
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import DialogBox from './DialogBox';
import SubtaskForm from './SubtaskForm';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const Task = ({ task, isSub = false, onChange, subtaskChange, showSubtasks, toggleSubtasks, deleteTask, addSubtask, updateTask }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [isTaskUpdating, setIsTaskUpdating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleDialogBoxShow = () => setShowDialogBox(true);
  const handleDialogBoxHide = () => setShowDialogBox(false);

  const [isSubtaskFormVisible, setIsSubtaskFormVisible] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


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

  const handleTitleChange = (e, task) => {
    e.preventDefault();

    const updatedTitle = newTaskTitle.trim() === '' ? task.title : newTaskTitle;

    const updatedTask = {
      ...task,
      title: updatedTitle,
    };

    setIsTaskUpdating(false);

    updateTask(updatedTask, isSub);
    setNewTaskTitle('');
  };


  return (
    <li
      ref={setNodeRef} style={style} {...attributes}
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
          {!isTaskUpdating 
          ? <>
            <span onClick={() => setIsTaskUpdating(true)} className={task.isChecked ? `${styles.title_checked} ${styles.task_title}` : styles.task_title}>
              {task.title}
            </span>
          </>
          : <>
              <form onSubmit={(e) => handleTitleChange(e, task)}>
                <input type='text' defaultValue={task.title} onChange={(e) => setNewTaskTitle(e.target.value)}/>
                <button type="submit">Save</button>
            </form>
          </>
          }
          {/* Ensure that subtasks exist before rendering the toggle button */}
          {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
            <button className={styles.toggle_button} onClick={(e) => {
              e.stopPropagation(); // Prevent the drag event from firing
              toggleSubtasks();
            }}>
              {showSubtasks ? <FaAngleUp className={styles.arrows} /> : <FaAngleDown className={styles.arrows} />}
            </button>
          )}
        </div>
        {isHovered && (
          <>
            <div {...listeners} className={styles.dragHandle}>
              <FaArrowRightArrowLeft />
            </div>
            <div className={styles.barsContainer} onMouseEnter={handleDialogBoxShow} onMouseLeave={handleDialogBoxHide}>
              <FaBars className={styles.FaBars}/>
              {/* <FaBars className={styles.FaBars} style={{ fontSize: 13, color: '#aaa' }} /> */}
              {showDialogBox && <DialogBox task={task} isSub={isSub} deleteTask={deleteTask} setIsSubtaskFormVisible={setIsSubtaskFormVisible}/>}
            </div>
          </>
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
              updateTask={updateTask}
            />
          ))}
        </ul>
      )}
      {
      isSubtaskFormVisible && 
        <SubtaskForm taskId={task.id} addSubtask={addSubtask} setIsSubtaskFormVisible={setIsSubtaskFormVisible}/>
      }
    </li>
  );
};

export default Task;
