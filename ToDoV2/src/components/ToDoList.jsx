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

  return (
    <div className={styles.container}>
        <Form tasks={tasks} setTasks={setTasks}/>
        <TasksList tasks={tasks}/>
    </div>
  )
}

export default ToDoList