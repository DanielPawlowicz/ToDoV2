import React, { useState, useRef, useEffect } from 'react';
import styles from './Form.module.css';

const Form = ({ addTask, tasks }) => {

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const inputRef = useRef(null);


  const newTaskSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      isChecked: false,
      order: tasks.length + 1
    };

    addTask(newTask);
    setNewTaskTitle('');
  };

// Focus on key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "f"){
        event.preventDefault()

        inputRef.current.focus();
      } else if (event.key === "Escape") {
        inputRef.current.blur(); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [])
  

  
  return (
    <form onSubmit={newTaskSubmit}>
      <input
        id="title_input"
        type="text"
        className="form_title"
        name="form_title"
        size={50}
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        ref={inputRef}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

export default Form;
