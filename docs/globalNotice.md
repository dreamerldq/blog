# React全局通知（ReactDom.Render）
```
const Notifcations = ({message, description}) => {
  return(
    <div className={styles.container}>
        <div className={styles.title}>{message}</div>
        <div className={styles.des}>{description}</div>
    </div>
  )
}
```
使用函数创建React无状态组件。
```
const Notifcation = React.createElement( // 将传递的参数，以props的方式传递给通知组件
      Notifcations,
      {
        message,
        description
      }
    )
```
利用React.createElement动态创建全局通知的视图组件，传递相关的props属性。
```
    const node = document.createElement('div') // 创建一个盒子，用来渲染通知组件
    node.id=`notice${this.count}` // 给这个盒子标记id
    body.appendChild(node) // 添加在通知列表中
  ReactDOM.render(Notifcation, document.getElementById(`notice${this.count}`)); // 将React组件渲染在dom中
```
动态给dom元素中添加创建后的通知节点元素。ReactDom.render主要用来将React组件渲染在DOM中，并且在之后，还会监听react组件的更新。
一下为完整代码
```
import React from 'react'
import styles from './index.scss'
import ReactDOM from 'react-dom'

let body = null
const topBody = document.querySelector('body')
const notification = { // notification是一个对外的接口对象
  children: [],
  count: 0,
  open({message, description, duration}){
    const childLen = this.children.length
    if(childLen === 0){ // 当调用时，如果当前通知队列为空，则在root dom下创建通知元素
      body = document.createElement('div')
      body.id = 'notification'
      topBody.appendChild(body)
      // 组件的样式请自定义
    }
    this.count += 1
    const Notifcation = React.createElement( // 将传递的参数，以props的方式传递给通知组件
      Notifcations,
      {
        message,
        description
      }
    )
    const node = document.createElement('div') // 创建一个盒子，用来渲染通知组件
    node.id=`notice${this.count}` // 给这个盒子标记id
    body.appendChild(node) // 添加在通知列表中
    this.children.push(Notifcation)
    setTimeout(() => {
      body.removeChild(node)
      this.children.pop()
      const length = this.children.length
      if(length === 0){
        topBody.removeChild(body)
      }
    }, (duration || 4.5) * 1000);
  ReactDOM.render(Notifcation, document.getElementById(`notice${this.count}`)); // 将React组件渲染在dom中
  }
}
const Notifcations = ({message, description}) => { // 创建全局通知组件
  return(
    <div className={styles.container}>
        <div className={styles.title}>{message}</div>
        <div className={styles.des}>{description}</div>
    </div>
  )
}

```
```
  HuaNotification.open({
        message: 'Notification Title 1',
        description: 'I will never close automatically. I will be close automatically. I will never close automatically.',
        duration: 3
      })
```