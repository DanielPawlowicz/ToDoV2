import React, { useState } from 'react';
import Task from './Task';
import styles from './TasksList.module.css';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate, deleteTask, addSubtask, updateTask }) => {
  // This state keeps track of which tasks have their subtasks shown
  const [openSubtasks, setOpenSubtasks] = useState({});

  // Toggles the visibility of subtasks for a particular task
  const toggleSubtasks = (taskId) => {
    setOpenSubtasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  return (
    <ul className={styles.taskList}>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <Task
            task={task}
            onChange={taskUpdate}
            subtaskChange={subtaskUpdate}
            showSubtasks={openSubtasks[task.id] || false} // Use openSubtasks state to control visibility
            toggleSubtasks={() => toggleSubtasks(task.id)} // Pass the toggle function to each task
            deleteTask={deleteTask}
            addSubtask={addSubtask}
            updateTask={updateTask}
          />
        </React.Fragment>
      ))}
    </ul>
  );
};

export default TasksList;
