import React, { useState, useEffect } from 'react';
import Task from './Task';
import styles from './TasksList.module.css';
import ControlSubtasksToggle from './ControlSubtasksToggle';
import { SortableContext } from '@dnd-kit/sortable';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate, deleteTask, addSubtask, updateTask }) => {
  const [openSubtasks, setOpenSubtasks] = useState({});
  const [toggleAllSubtasksVisibility, setToggleAllSubtasksVisibility] = useState(false);

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
                />
            </React.Fragment>
          ))}
        </SortableContext>
      </ul>
    </>
    );
};

export default TasksList;
