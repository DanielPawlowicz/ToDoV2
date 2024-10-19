import React from 'react'
import styles from './ControlSubtasksToggle.module.css'

const ControlSubtasksToggle = ({ subtasksVisibility, setSubtasksVisibility }) => {
  return (
      <button className={styles.subtasksToggle} onClick={() => setSubtasksVisibility((prev) => !prev)}>{subtasksVisibility ? 'Hide All Subtasks' : 'Show All Subtasks'}</button>
  )
}

export default ControlSubtasksToggle