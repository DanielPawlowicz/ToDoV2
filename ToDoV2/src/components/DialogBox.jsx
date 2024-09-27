import { useContext } from 'react'
import React from 'react'
import styles from './DialogBox.module.css'
import {FaDeleteLeft} from "react-icons/fa6";
import { DeleteTaskContext } from './ToDoList';

const DialogBox = ({task}) => {

  const deleteTaskContext = useContext(DeleteTaskContext);

  return (
    <div className={styles.dialog_box}>
      <FaDeleteLeft className={styles.delete_icon} onClick={() => deleteTaskContext(task)}/>
    </div>
  )
}

export default DialogBox