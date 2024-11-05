import React, { useState, useEffect, useRef } from 'react';
import Task from './Task';
import styles from './TasksList.module.css';
import ControlSubtasksToggle from './ControlSubtasksToggle';
import { SortableContext } from '@dnd-kit/sortable';
import SubtaskForm from './SubtaskForm';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate, deleteTask, addSubtask, updateTask, setTasks }) => {
  const [openSubtasks, setOpenSubtasks] = useState({});
  const [toggleAllSubtasksVisibility, setToggleAllSubtasksVisibility] = useState(false);

  const [focused, setFocused] = useState(null);
  const [focusedTask, setFocusedTask] = useState(null);
  
  const [isSubtaskFormVisibleParent, setIsSubtaskFormVisibleParent] = useState(false);
  const [subtaskFormTaskId, setSubtaskFormTaskId] = useState(null);
  const [subtaskFormPosition, setSubtaskFormPosition] = useState({ top: 0, left: 0 });

  const [focusedSubtaskId, setFocusedSubtaskId] = useState(null);

  const taskRefs = useRef({});


  useEffect(() => {
    // Update focusedTask whenever the focused ID changes
    const task = tasks.find((task) => task.id === focused);
    setFocusedTask(task || null); // Set to null if no task is focused
  }, [focused, tasks]);



  // Sync the openSubtasks state with toggleAllSubtasksVisibility
  useEffect(() => {
    const newOpenSubtasks = {};
    tasks.forEach((task) => {
      newOpenSubtasks[task.id] = toggleAllSubtasksVisibility; // Set to true if globally toggled, otherwise false
    });
    setOpenSubtasks(newOpenSubtasks);
  }, [toggleAllSubtasksVisibility]);

  // Toggles the visibility of subtasks for a particular task
  const toggleSubtasks = (taskId) => {
    setOpenSubtasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };


  const updateSubtasksOrder = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };




// Focuse for binding keys
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        if(focused === null){
          setFocused(tasks[0].id);
        } else {
          const currentIndex = tasks.findIndex(task => task.id === focused);
          const nextIndex = (currentIndex + 1) % tasks.length; // Wrap around to the first task if at the end
          setFocused(tasks[nextIndex]?.id);
        }
      } else if (event.key === "ArrowUp") {
        if (focused === null) {
          const lastIndex = tasks.length - 1;
          setFocused(tasks[lastIndex]?.id);
        } else {
          // Find the index of the currently focused task
          const currentIndex = tasks.findIndex(task => task.id === focused);
          const previousIndex = (currentIndex - 1 + tasks.length) % tasks.length; // Wrap around to the last task if at the beginning
          setFocused(tasks[previousIndex]?.id);
        }
      } else if (event.key === "c") {
        // Toggle check-off for the focused task
        if (focused !== null) {
          const taskIndex = tasks.findIndex((task) => task.id === focused);
          if (taskIndex !== -1) {
            const updatedTask = { ...tasks[taskIndex], isChecked: !tasks[taskIndex].isChecked };
            taskUpdate(updatedTask); // Call taskUpdate to save the change
          }
        }
      } else if (event.key === "s") {
        // Toggle subtasks for the focused task
        if (focused !== null) {
          setOpenSubtasks((prevOpenSubtasks) => ({
            ...prevOpenSubtasks,
            [focused]: !prevOpenSubtasks[focused], // Toggle the focused task's subtasks
          }));
        }
      } else if (event.key === "d") {
        if (focused !== null) {
          const taskIndex = tasks.findIndex((task) => task.id === focused);
          if (taskIndex !== -1) {
            const deletingTask = tasks[taskIndex];
            // Show confirmation prompt
            const confirmDelete = window.confirm("Are you sure you want to delete this task?");
            if (confirmDelete) {
              // Call deleteTask with deletingTask and isSub=false
              deleteTask(deletingTask, false);
              setFocused(null); // Clear focus after deletion
            }
          }
        }
      } else if (event.key === "a" && focused) {
        setSubtaskFormTaskId(focused);
        setIsSubtaskFormVisibleParent(true);
        
      } else if (event.key === "ArrowRight"){
        if (focused !== null) {
          const task = tasks.find((t) => t.id === focused);
          if (task) {
            if (!openSubtasks[task.id]) {
              toggleSubtasks(task.id);
            }

            if (task.subtasks && task.subtasks.length > 0) {
              setFocusedSubtaskId(task.subtasks[0].id);
            }
          }
        }
      } else if (event.key === "ArrowLeft") {
        // toggleSubtasks(focused);
        setFocusedSubtaskId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tasks, focused]);

  console.log(focused);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click target is outside of the task list
      if (!event.target.closest(`.${styles.taskList}`)) {
        setFocused(null); // Set focused to null if clicked on whitespace
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  return (
    <>
      <div style={{ position: 'relative' }}>
        <ControlSubtasksToggle subtasksVisibility={toggleAllSubtasksVisibility} setSubtasksVisibility={setToggleAllSubtasksVisibility}/>
        <ul className={styles.taskList}>
          <SortableContext items={tasks.map(task => task.id)}>
            {tasks.map((task) => (
              <React.Fragment key={task.id}>  
                <Task
                  task={task}
                  onChange={taskUpdate}
                  subtaskChange={subtaskUpdate}
                  showSubtasks={openSubtasks[task.id]} // Use openSubtasks state to control visibility
                  toggleSubtasks={() => toggleSubtasks(task.id)} // Pass the toggle function to each task
                  deleteTask={deleteTask}
                  addSubtask={addSubtask}
                  updateTask={updateTask}
                  updateSubtasksOrder={updateSubtasksOrder}
                  setFocused={setFocused}
                  focused={focused === task.id ? task.id : null}
                  focusedSubtaskId={focusedSubtaskId}
                  />
              </React.Fragment>
            ))}
          </SortableContext>
        </ul>
            {
              isSubtaskFormVisibleParent && 
              // <div
              //   style={{
              //     position: 'absolute',
              //     top: subtaskFormPosition.top + 'px',
              //     left: subtaskFormPosition.left + 'px',
              //     zIndex: 1000,
              //     backgroundColor: 'black',
              //   }}
              // >
                <SubtaskForm
                  taskId={subtaskFormTaskId}
                  addSubtask={addSubtask}
                  setIsSubtaskFormVisible={setIsSubtaskFormVisibleParent}
                  subtasks={focusedTask?.subtasks || []}
                />
              // </div>
            }
      </div>
    </>
    );
};

export default TasksList;
