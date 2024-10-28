import React, { useState, useRef, useEffect } from 'react'
import styles from './SubtaskForm.module.css';

const SubtaskForm = ({ taskId, addSubtask, setIsSubtaskFormVisible, subtasks }) => {

    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    const newSubtaskSubmit = (e) => {
        e.preventDefault();

        const subtask = {
            id: crypto.randomUUID(),
            taskId: taskId,
            order: subtasks.length + 1,
            title: newSubtaskTitle,
            isChecked: false
        }

        addSubtask(subtask);
        setNewSubtaskTitle('');
        setIsSubtaskFormVisible(false);
    }

  return (
    <div className={styles.subtask_form}>
      <form onSubmit={newSubtaskSubmit}>
          <input
              id="subtask_title_input"
              type="text"
              className="form_title_subtask"
              name="form_title_subtask"
              size={50}
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              ref={inputRef}
          />
          <button type="submit">Add Subtask</button>
      </form>
    </div>
  )
}

export default SubtaskForm