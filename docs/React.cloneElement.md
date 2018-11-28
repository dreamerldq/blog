# React.cloneElement使用案例:实现单选框组
这个方法通常来为React组件添加属性和子元素。
比如要实现一个Radio列表：
```
<HuaRadio.RadioGroup
          value={this.state.currentRadio}
          onChange={this.radioGroupChange}
        >
          <HuaRadio value={1}>Radio</HuaRadio>
          <HuaRadio value={2}>Radio2</HuaRadio>
          <HuaRadio value={3}>Radio3</HuaRadio>
          <HuaRadio value={4}>Radio4</HuaRadio>
  </HuaRadio.RadioGroup>
```
当点击每一个HuaRadio组件的时候，都应该将currentRadio的值设置为被点击的HuaRadio的value值，并且当value的值和currentRadio的值对应是，HuaRadio组件被选中，但是在这里我们并没有对HuaRadio组件添加点击事件。接下来在HuaRadio.RadioGroup组件中，我们将对每一个Radio进行二次迭代开发，来实现上述的功能。
```
class RadioGroup extends React.Component{
    constructor(props){
        super(props)
    }
    enhanceChidren = () => {
        return this.props.children.map((child) => {
           return  React.cloneElement(child,
            {
                onRadioChange: this.props.onChange,
                currentValue: this.props.value,
                key: `radio-${child.props.value}`
            })
        })
    }
    render(){
        return(
           <React.Fragment>
               {this.enhanceChidren()}
           </React.Fragment>
        )
    }
}
```
对每一个HuaRadio组件添加onRadioChange、currentValue、key等属性。
React.cloneElement 接受3个参数，第一个是标签名（html元素标签，或者React组件名），第二个是属性props对象，第三个是children。
```
export default class HuaRdio extends React.Component{
    constructor(props){
        super(props)
    }
    onChange = (value) => {
        this.props.onRadioChange(value)
    }
    render(){
        const checked = this.props.currentValue === this.props.value
        return(
            <div className={styles.container}>
                <label htmlFor={this.props.children}>
                    <div className={styles.radioLabel}>
                        {checked ? <div className={styles.checkedRadio}></div> :
                        null}
                    </div>
                </label>
                {this.props.currentValue ?
                    <input className={styles.radio} onChange={this.onChange.bind(this, this.props.value)} id={this.props.children} type='radio' checked={checked }/> :
                    <input className={styles.radio}  type='radio' />}
                
                <span>{this.props.children}</span>
            </div>
        )
    }
}
```