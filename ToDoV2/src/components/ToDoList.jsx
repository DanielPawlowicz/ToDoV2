import React, { useState, useEffect } from 'react'
import Form from './Form'
import TasksList from './TasksList'
import styles from './ToDoList.module.css'

import { DndContext, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const ToDoList = () => {
    

    const [tasks, setTasks] = useState([]);
 

    // GET tasks and Subtasks during render
    useEffect(() => {
      const fetchTasksAndSubtasks = async () => {
        try {
          // Fetch tasks and subtasks from the correct endpoints
          const tasksRes = await fetch('http://localhost:8000/tasks?_sort=order&_order=asc');
          const subtasksRes = await fetch('http://localhost:8000/subtasks?_sort=order&_order=asc');
          
          const tasksData = await tasksRes.json();
          const subtasksData = await subtasksRes.json();
    
          // Combine tasks and their corresponding subtasks
          const tasksWithSubtasks = tasksData.map((task) => ({
            ...task,
            subtasks: subtasksData.filter((subtask) => subtask.taskId === task.id) || [], 
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
      try{
        const res = await fetch("http://localhost:8000/tasks", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
        });

        if (res.ok) {
          setTasks((prevTasks) => [
            ...prevTasks,
            { ...newTask, subtasks: [] }
          ]);
        } else {
          console.error("Failed to add subtask: " + res.status);
        }

      } catch (error) {
        console.error("Error adding subtask: ", error);
      }

    };


    // POST new subtask to the subtasks
  const addSubtask = async (newSubtask) => {
    try {
      const res = await fetch("http://localhost:8000/subtasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubtask),
      });

      if (res.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === newSubtask.taskId
              ? { ...task, subtasks: [...task.subtasks, newSubtask] }
              : task
          )
        );
      } else {
        console.error("Failed to add subtask: " + res.status);
      }
    } catch (error) {
      console.error("Error adding subtask: ", error);
    }
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


    // delete task or subtask
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
        if (isSub) {
          // Remove the deleted subtask from the state
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === deletingTask.taskId
                ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== deletingTask.id) }
                : task
            )
          );
        } else {
          // After deleting, filter out the task from the tasks array
          const updatedTasks = tasks.filter((task) => task.id !== deletingTask.id);

          // Reorder the remaining tasks to ensure continuous order starting from 1
          const reorderedTasks = updatedTasks.map((task, index) => ({
            ...task,
            order: index + 1, // Set new order starting from 1
          }));

          setTasks(reorderedTasks);  // Update state with reordered tasks
          saveTaskOrderToDatabase(reorderedTasks);  // Persist changes to the server
        }
      } else {
        console.error("Error deleting task: " + res.status);
      }
    } catch (error) {
      console.error("Error deleting task: " + error);
    }
  };



    // UPDATE task
  const updateTask = async (updatedTask, isSub) => {

    let taskType = isSub ? 'subtasks' : 'tasks';

    try {
      const res = await fetch(`http://localhost:8000/${taskType}/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask), 
      });
    
      if (res.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (!isSub && task.id === updatedTask.id) {
              return { ...task, ...updatedTask };
            } else if (isSub && task.id === updatedTask.taskId) {
              return {
                ...task,
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === updatedTask.id
                    ? { ...subtask, ...updatedTask }
                    : subtask
                ),
              };
            }
            return task;
          })
        );
      } else {
        console.error(`Error updating ${isSub ? 'subtask' : 'task'}: ` + res.status);
      }
    } catch (error) {
      console.error(`Error updating ${isSub ? 'subtask' : 'task'}: ` + error);
    }
  };


  // Drag N Drop

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex(task => task.id === active.id);
    const newIndex = tasks.findIndex(task => task.id === over.id);

    const updatedTasks = arrayMove(tasks, oldIndex, newIndex);  // Move task in array

    // Update the order based on new index positions
    const tasksWithNewOrder = updatedTasks.map((task, index) => ({
      ...task,
      order: index + 1, // Set new order value
    }));

    console.log(tasksWithNewOrder);

    setTasks(tasksWithNewOrder);  // Update state with reordered tasks
    saveTaskOrderToDatabase(tasksWithNewOrder);  // Persist changes to the server
  };

  const saveTaskOrderToDatabase = async (tasks) => {
    for (const task of tasks) {
      const taskWithoutSubtasks = { ...task };
      delete taskWithoutSubtasks.subtasks;
      try {
        await fetch(`http://localhost:8000/tasks/${taskWithoutSubtasks.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskWithoutSubtasks),  // Send updated task with new order
        });
      } catch (error) {
        console.error('Error updating task order:', error);
      }
    }
  };

    


  return (
      <div className={styles.container}>
          <Form addTask={addTask} tasks={tasks}/>
          <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <TasksList tasks={tasks} taskUpdate={taskUpdate} subtaskUpdate={updateSubtask} deleteTask={deleteTask} addSubtask={addSubtask} updateTask={updateTask} setTasks={setTasks}/>
          </DndContext>
      </div>
  )
}

export default ToDoList