import React from 'react'
import styles from './DialogBox.module.css'
import {FaDeleteLeft, FaSquarePlus} from "react-icons/fa6";

const DialogBox = ({ task, isSub, deleteTask, setIsSubtaskFormVisible}) => {

  return (
    <div className={styles.dialog_box}>
      <FaDeleteLeft className={styles.delete_icon} onClick={() => deleteTask(task, isSub)}/>
      {
      !isSub &&  
      <FaSquarePlus onClick={() => setIsSubtaskFormVisible(true)}/>
      }
    </div>
  )
}

export default DialogBox