import React from 'react'
import styles from './DialogBox.module.css'
import {FaDeleteLeft} from "react-icons/fa6";

const DialogBox = ({ task, isSub, deleteTask }) => {

  return (
    <div className={styles.dialog_box}>
      <FaDeleteLeft className={styles.delete_icon} onClick={() => deleteTask(task, isSub)}/>
    </div>
  )
}

export default DialogBox