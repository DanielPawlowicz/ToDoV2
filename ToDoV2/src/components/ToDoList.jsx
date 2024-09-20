import React, { useState } from 'react'
import Task from './Task'
import Form from './Form'
import taskList from '../assets/tasks.json'
import TasksList from './TasksList'

const ToDoList = () => {

    const [tasks, setTasks] = useState(taskList);
    console.log(tasks);

  return (
    <>
        <Form tasks={tasks} setTasks={setTasks}/>
        <TasksList tasks={tasks}/>
        
    </>
  )
}

export default ToDoList