// import React from 'react'
// import Task from './Task'
// import styles from './TasksList.module.css'

// const TasksList = ({ tasks, taskUpdate }) => {

//   return (
//     <>
//         <ul>
//             {tasks.map((task) => (
//                 <Task key={task.id} task={task} onChange={taskUpdate}/>
//             ))}
//         </ul>
//     </>
//   )
// }

// export default TasksList

import React from 'react';
import Task from './Task';
import styles from './TasksList.module.css';

const TasksList = ({ tasks, taskUpdate, subtaskUpdate }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <React.Fragment key={task.id}>
          <Task task={task} onChange={taskUpdate} />
          {task.subtasks && (
            <ul>
              {task.subtasks.map((subtask) => (
                <Task key={subtask.id} task={subtask} isSub={true} onChange={subtaskUpdate} />
              ))}
            </ul>
          )}
        </React.Fragment>
      ))}
    </ul>
  );
};

export default TasksList;