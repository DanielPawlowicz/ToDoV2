import React, { useState, useEffect } from 'react'
import Task from './Task'
import Form from './Form'
import taskList from '../assets/tasks.json'
import TasksList from './TasksList'
import styles from './ToDoList.module.css'

const ToDoList = () => {

    // const [tasks, setTasks] = useState(taskList);
    // console.log(tasks);
    
    const [tasks, setTasks] = useState([]);
    
    // Get the tasks from toDoList1
    useEffect(()=>{
      const fetchTasks = async () => {
        try {
          const res = await fetch('http://localhost:8000/toDoList1');
          const data = await res.json();
          setTasks(data);
        } catch (error) {
          console.error("Error fetching data: " + error)
        }
      }

      fetchTasks();
    },[]);

    // POST new task to the toDoList1
    const addTask = async (newTask) => {
      const res = await fetch("http://localhost:8000/toDoList1", {
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
      try {
        const res = await fetch(`http://localhost:8000/toDoList1/${updatedTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });
        
        if (res.ok) {
          // Update the local tasks state with the updated task
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            )
          );

          console.log(tasks);
        } else {
          console.error("Error updating task: " + res.status);
        }
      } catch (error) {
        console.error("Error updating task: " + error);
      }
    };

  return (
    <div className={styles.container}>
        <Form addTask={addTask}/>
        <TasksList tasks={tasks} taskUpdate={taskUpdate}/>
    </div>
  )
}

export default ToDoList