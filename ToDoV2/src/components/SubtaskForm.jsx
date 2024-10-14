import React, { useState } from 'react'
import styles from './SubtaskForm.module.css';

const SubtaskForm = ({ taskId, addSubtask, setIsSubtaskFormVisible }) => {

    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    const newSubtaskSubmit = (e) => {
        e.preventDefault();

        const subtask = {
            id: crypto.randomUUID(),
            taskId: taskId,
            title: newSubtaskTitle,
            isChecked: false
        }

        addSubtask(subtask);
        setNewSubtaskTitle('');
        setIsSubtaskFormVisible(false);
    }

  return (
      <form className={styles.SubtaskForm} onSubmit={newSubtaskSubmit}>
          <input
              id="subtask_title_input"
              type="text"
              className="form_title_subtask"
              name="form_title_subtask"
              size={50}
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
          />
          <button type="submit">Add Subtask</button>
      </form>
  )
}

export default SubtaskForm