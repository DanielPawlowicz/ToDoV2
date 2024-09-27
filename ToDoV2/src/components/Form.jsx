import React, { useState, useRef, useEffect } from 'react';
import styles from './Form.module.css';

const Form = ({ addTask }) => {

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const inputRef = useRef(null);


  const newTaskSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      isChecked: false,
    };

    addTask(newTask);
    setNewTaskTitle('');
  };


  // Focus the input element after every render
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTaskTitle]);

  
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
