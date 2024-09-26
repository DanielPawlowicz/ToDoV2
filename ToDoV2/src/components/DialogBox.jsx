import React from 'react'
import styles from './DialogBox.module.css'

const DialogBox = ({task}) => {
  return (
    <div className={styles.dialog_box}>DialogBox{task.title}</div>
  )
}

export default DialogBox