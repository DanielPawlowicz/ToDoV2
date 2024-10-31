import React, { useState, useEffect } from 'react';
import Task from './Task';
import styles from './TasksList.module.css';
import ControlSubtasksToggle from './ControlSubtasksToggle';
import { SortableContext } from '@dnd-kit/sortable';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate, deleteTask, addSubtask, updateTask, setTasks }) => {
  const [openSubtasks, setOpenSubtasks] = useState({});
  const [toggleAllSubtasksVisibility, setToggleAllSubtasksVisibility] = useState(false);

  const  [focused, setFocused] = useState(null);

  const [isSubtaskFormVisible, setIsSubtaskFormVisible] = useState(false);

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
        const taskIndex = tasks.findIndex((task) => task.id === focused);
        if (taskIndex !== -1) {
          const taskId = tasks[taskIndex].id;
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, isSubtaskFormVisible: true } : task
            )
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tasks, focused]);


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
                />
            </React.Fragment>
          ))}
        </SortableContext>
      </ul>
    </>
    );
};

export default TasksList;
