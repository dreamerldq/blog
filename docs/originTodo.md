# 用原生JS实现todolist
todolist具备以下几个功能点：
+ 拥有一个输入框，可以输入待办事项
+ 添加按钮，将输入框中的待办事项添加到待办数组中
+ 列表展示待办项目。
+ 每一条待办项目都可以完成或者取消（ui效果是完成，checkbox为true，文案添加中划线， 取消，checkbox为false，文案正常显示）
+ 每一条待办项目都有编辑和删除两个按钮，点击删除，从待办事项列表中删除此条待办项目，点击编辑，可直接编辑此条待办项目，
+ 添加搜索框，搜索到匹配的待办项目后，在列表中展示。

```
class Page {

  constructor() {
    this.todolist = []; //初始化待办项目列表
    this.searchlist = [];//初始化搜索列表
    this.bottom = document.getElementsByClassName('bottom')[0]; // 获取待办事项列表ul
    this.searchInput = document.getElementsByClassName('search-input')[0]; //获取搜索框
  }
  // 初始化
  init() {
    const addBtn = document.getElementsByClassName('add')[0]; //获取到添加按钮
    const searchBtn = document.getElementsByClassName('search-btn')[0]; //获取到搜索按钮
    addBtn.addEventListener('click', this.handleAddClick.bind(this));// 给添加按钮添加click事件
    this.bottom.addEventListener('click', this.handleItemClick.bind(this));//给待办事项列表添加事件委托
    searchBtn.addEventListener('click', this.handleSearchClick.bind(this));//给搜索按钮添加click事件
  }
  // 处理新增事项
  handleAddClick() {
    this.searchInput.value = '';
    let input = document.getElementsByClassName('input')[0]; //获取输入框的值
    let inputVal = input.value;
    if (!inputVal) {
      alert('输入值为空，请重新输入');
      return;
    }
    this.todolist.push({ inputVal, checked: false }); //如果输入框的值非空，则添加数据对象至待办事项列表中
    this.handleHtml(this.todolist); // 调用渲染html的方法，将待办事项列表渲染在界面中
    input.value = '';
  }
  // 为listItem添加监听事件
  handleItemClick(e) {
    const index = e.target.parentNode.getAttribute('data-key'); //获取到事件委托对象的data-key值，作为被点击的待办事项的index值
    switch(e.target.className) { // 根据被点击的元素的classname值，做出相应的处理
      case 'del': 
        this.handleDelClick(index);
        break;
      case 'edit':
        this.handleEditClick(e.target, index);
        break;
      case 'checkbox':
        this.handleDoneClick(e.target, index);
      case 'default':
        break;
    }
  }
  // 处理多选框点击事件 done
  handleDoneClick(el, index) {
    if (el.checked) {
      el.nextElementSibling.classList.add("line-through");
      this.todolist.splice(index, 1, {...this.todolist[index], checked: true});
    } else {
      el.nextElementSibling.classList.remove("line-through");
      this.todolist.splice(index, 1, {...this.todolist[index], checked: false});
    }
  }
  // 处理删除事件
  handleDelClick(index) { //将被点击的元素删除，并重新渲染界面
    this.todolist.splice(index, 1);
    this.handleHtml(this.todolist);
  }
  // 处理编辑事件
  handleEditClick(el, index) {
    // 虚拟一个input框在span上面
    let input = document.createElement('input'); //创建一个新的input节点
    input.className = 'text-input'; // 给新创建的input节点添加classname
    let textElement = el.previousElementSibling.previousElementSibling; //将待办事项的内容作为输入框的默认内容， 、、// 、、//previousElementSibling可以获取到同层级下，当前结点的上一个结点
    input.value = textElement.innerHTML;
    textElement.classList.add('display');
    el.parentNode.insertBefore(input, el); //将当前的输入框插入到编辑元素的前边
    input.focus(); //自动获取焦点
    input.addEventListener('blur', () => { //设置当失去焦点后的回调
      textElement.innerHTML = input.value; // 将编辑的值改成输入框中的值
      this.todolist.splice(index, 1, {...this.todolist[index], inputVal: input.value}); 
      textElement.classList.remove('display');
      el.parentNode.removeChild(input); // 删除掉输入框
    });
    return;
  }
  // 处理搜索事件
  handleSearchClick() {
    let inputVal = this.searchInput.value;
    if (this.todolist.length === 0) {
      alert('当前无事项，请添加事项……');
      return;
    }
    if (!inputVal) {
      alert('匹配值不能为空，请输入具体内容……');
      return;
    }
    const reg = new RegExp(inputVal);
    this.searchlist = this.todolist.filter( ({inputVal})=>{
      return reg.test(inputVal);
    }); //筛选数组，获取到可以匹配指定搜索内容的待办事项
    this.handleHtml(this.searchlist);
  }
  // 处理html;
  handleHtml(list) {
    let html = '';
    list.forEach(({inputVal, checked}, index) => {
      html += `
      <li data-key="${index}">
        <input class="checkbox" type="checkbox" name="checkbox" ${checked ? 'checked' : ''}>
        <span class="text ${checked ? 'line-through' : ''}">${inputVal}</span>
        <a class="del">删除</a>
        <a class="edit">编辑</a>
      </li>
    `
    });
    this.bottom.innerHTML = html;
  }
}
var page = new Page()
page.init();
```

### HTML
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>todoList-youran</title>
  <link rel="stylesheet" type="text/css" href="./todoList.css">
</head>
<body>
  <div class="todoList">
    <div class="top">
      <input class="input" type="text" value="" placeholder="请输入……"/>
      <a class="add" href="javascript:;">点击添加新事项</a>
    </div>
    <ul class="bottom"></ul>
    <div class="search">
      <input class="search-input" type="text" value="" placeholder="请输入关键字……"/>
      <a class="search-btn" href="javascript:;">过滤</a>
    </div>
  </div>
  <script src="./todoList.js"></script>
</body>
</html>
```
### CSS
```
* {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
a {
  color: #000;
  text-decoration: none;
}
a:hover {
  color: #fff;
}
input {
  background: none;  
	outline: none;  
	border: 0px;
}
html, body {
  background: #f7f7f7;
  font-size: 14px;
  font-style: normal;
}
.todoList {
  width: 500px;
  height: 440px;
  margin: 20px auto;
  background: #ddd;
  /* border: 1px solid salmon; */
  border-radius: 3px;
}
.top,
.search {
  height: 50px;
  line-height: 50px;
  /* background: #ff5200; */
  background: salmon;
  border-radius: 3px;
  padding: 0 10px;
}
.search {
  margin-top: -3px;
}
.top .input,
.search-input {
  width: 300px;
  height: 30px;
  background: #fff;
  border-radius: 3px;
  padding-left: 10px;
}
.add,
.search-btn {
  float: right;
  width: 120px;
  padding: 0 10px;
}
.bottom {
  height: 380px;
  /* overflow: hidden; */
  overflow: scroll;
  padding-top: 10px;
  /* padding: 10px 0; */
}
.bottom li {
  padding: 10px;
  margin-bottom: 10px;
  line-height: 24px;
  border-radius: 3px;
  color: #fff;
  background: salmon;
}
.bottom .text-input {
  font-size: 16px;
  width: 380px;
  color: #fff;
  background: salmon;
}
.bottom li:nth-child(2n-1),
.bottom li:nth-child(2n-1) .text-input{
  background: #fff;
  color: salmon;
}
.edit,
.del {
  float: right;
  margin-left: 10px;
  cursor: pointer;
}
.edit:hover,
.del:hover {
  color: #409eff;
}
.display {
  display: none;
}
.line-through {
  text-decoration: line-through;
}

```