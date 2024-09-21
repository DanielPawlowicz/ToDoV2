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

  return (
    <div className={styles.container}>
        <Form addTask={addTask}/>
        <TasksList tasks={tasks}/>
    </div>
  )
}

export default ToDoList