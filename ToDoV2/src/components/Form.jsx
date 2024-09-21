import React, { useState } from 'react'
import styles from './Form.module.css'

const Form = ({addTask}) => {

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const newTaskSubmit = (e) =>{

    e.preventDefault();

    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      isChecked: false
    }

    console.log(newTask);

    addTask(newTask);

    const input = document.getElementById("title_input");
    input.value = '';

  }


  return (
    <form onSubmit={(newTaskSubmit)}>
      <input id="title_input" type='text' className='form_title' name='form_title' size={50} onChange={(e) => setNewTaskTitle(e.target.value)}/>
      <button>Add Task</button> 
    </form>
  )
}

export default Form