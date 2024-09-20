import React from 'react'

const Task = ({task}) => {

  return (
    <li>
        <input type="checkbox"/>{task.title}
    </li>
  );
}

export default Task;