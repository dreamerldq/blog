# CSS in JS （react-jss）
由于CSS和JS相互独立，所以想要动态的根据JS中的变量来改变css中的值无法实现。除非将CSS写在JS中，例如： 写成行内样式或者React Style，但是在行内样式中，有存在很多的限制：不能操作伪类，不能使用css检查器等。

```下面会实现一个React Button 组件，通过props传递不同的眼神值，在hover或者active时，展现出不同的颜色和状态```

```
import injectSheet from 'react-jss';
const myStyles = {
  myButton: {
    background: ({ disabled, type }) => (disabled ? '#d9d9d9' : type ? colors[type].default : '#fff'),
    color: ({ type }) => type && '#fff',
    '&:hover': {
      background: ({ disabled, type }) => (disabled ? '#d9d9d9' : colors[type] ? colors[type].hover : '#fff'),
      border: ({ disabled, type }) => ( colors[type] ? 'none' : 'solid 1px #1890ff'),    },
    '&:active': {
      background: ({ disabled, type }) => (disabled ? '#d9d9d9' : colors[type] ? colors[type].click : '#fff'),
      color: ({ type }) => type && '#fff',
      border: ({ disabled, type }) => ( colors[type] ? 'none' : 'solid 1px #0058aa'),    },
  },
};
export default injectSheet(myStyles)(HuaButton);
```
React-jss是一个Css in Js 的库. 不止能够直接设置CSS的属性，还能够使用function values， 所接受到的参数就是React组件接收到的props。

```
import classnames from 'classnames';
class HuaButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onClick, disabled, children, classes,
    } = this.props;
    return (
          <button
              onClick={onClick}
              disabled={disabled}
              className={disabled ? classnames(styles.hua_button_disable, classes.myButton) : classnames(styles.hua_button_normal, classes.myButton)}
              >
              {children}
          </button>
    );
  }
}
```
classnames是一个用来连接多个class的库。