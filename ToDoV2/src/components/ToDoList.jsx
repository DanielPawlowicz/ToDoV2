import React, { useState, useEffect } from 'react'
import Form from './Form'
import TasksList from './TasksList'
import styles from './ToDoList.module.css'

const ToDoList = () => {
    

    const [tasks, setTasks] = useState([]);
 

    // GET tasks and Subtasks during render
    useEffect(() => {
      const fetchTasksAndSubtasks = async () => {
        try {
          // Fetch tasks and subtasks from the correct endpoints
          const tasksRes = await fetch('http://localhost:8000/tasks');
          const subtasksRes = await fetch('http://localhost:8000/subtasks');
          
          const tasksData = await tasksRes.json();
          const subtasksData = await subtasksRes.json();
    
          // Combine tasks and their corresponding subtasks
          const tasksWithSubtasks = tasksData.map((task) => ({
            ...task,
            subtasks: subtasksData.filter((subtask) => subtask.taskId === task.id),
          }));

          // console.log(subtasksData);
          // console.log(tasksWithSubtasks);
    
          setTasks(tasksWithSubtasks);
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
    
      fetchTasksAndSubtasks();
    }, []);
    

    // POST new task to the tasks
    const addTask = async (newTask) => {
      const res = await fetch("http://localhost:8000/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      return;
    };


    // PUT the task change isChecked
    const taskUpdate = async (updatedTask) => {
      // Remove subtasks from the task before sending to the server
      const taskWithoutSubtasks = { ...updatedTask };
      delete taskWithoutSubtasks.subtasks;
    
      try {
        const res = await fetch(`http://localhost:8000/tasks/${updatedTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskWithoutSubtasks), // Only send the task data without subtasks
        });
    
        if (res.ok) {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            )
          );
        } else {
          console.error("Error updating task: " + res.status);
        }
      } catch (error) {
        console.error("Error updating task: " + error);
      }
    };

    // PUT the subtask change isChecked
    const updateSubtask = async (updatedSubtask) => {
      // console.log("here in todolist it works")
      try {
        const res = await fetch(`http://localhost:8000/subtasks/${updatedSubtask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedSubtask),
        });
    
        if (res.ok) {
          // Update the tasks state with the updated subtask
          setTasks((prevTasks) => {
            return prevTasks.map((task) => {
              if (task.id === updatedSubtask.taskId) {
                return {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === updatedSubtask.id ? { ...subtask, ...updatedSubtask } : subtask
                  ),
                };
              }
              return task;
            });
          });
        } else {
          console.error("Error updating subtask: " + res.status);
        }
      } catch (error) {
        console.error("Error updating subtask: " + error);
      }
    };


    // delete task
  const deleteTask = async (deletingTask, isSub) => {
    let taskType = isSub ? 'subtasks' : 'tasks';

    if (!isSub && deletingTask.subtasks.length > 0) {
      // Delete subtasks before deleting the task
      try {
        const response = await fetch(`http://localhost:8000/subtasks?taskId=${deletingTask.id}`);
        const subtasks = await response.json();

        for (const subtask of subtasks) {
          await fetch(`http://localhost:8000/subtasks/${subtask.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
        }
      } catch (error) {
        console.error("Error deleting subtasks: ", error);
        return;
      }
    }

    try {
      const res = await fetch(`http://localhost:8000/${taskType}/${deletingTask.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (res.ok) {
        // After deleting, filter out the task from the tasks array
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== deletingTask.id)
        );
      } else {
        console.error("Error deleting task: " + res.status);
      }
    } catch (error) {
      console.error("Error deleting task: " + error);
    }
  };

    


  return (
      <div className={styles.container}>
          <Form addTask={addTask}/>
      <TasksList tasks={tasks} taskUpdate={taskUpdate} subtaskUpdate={updateSubtask} deleteTask={deleteTask}/>
      </div>
  )
}

export default ToDoList