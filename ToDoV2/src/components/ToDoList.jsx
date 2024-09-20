import React, { useState } from 'react'
import Task from './Task'
import Form from './Form'
import taskList from '../assets/tasks.json'
import TasksList from './TasksList'
import styles from './ToDoList.module.css'

const ToDoList = () => {

    const [tasks, setTasks] = useState(taskList);
    console.log(tasks);

  return (
    <div className={styles.container}>
        <Form tasks={tasks} setTasks={setTasks}/>
        <TasksList tasks={tasks}/>
    </div>
  )
}

export default ToDoList