import React from 'react'
import Task from './Task'
import styles from './TasksList.module.css'

const TasksList = ({ tasks }) => {
  return (
    <>
        <ul>
            {tasks.map((task) => (
                <Task key={task.id} task={task}/>
            ))}
        </ul>
    </>
  )
}

export default TasksList