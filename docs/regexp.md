### 正则表示的使用
+ 微信支付正则表达式： 只能展示小数点后两位，首位输入‘.’自动补全0
```
    if (/^\./.test(inputValue)) {  //如果输入的第一位是'.',则自动在输入的前边补一个0
      inputValue = `0${inputValue}`;
      if (!/^\d+\.?\d{0,2}$/.test(inputValue)) { //这个正则表达式的意识是： 必须以数字开头，小数点可有可无，如果写了小数点，则后续的小数只能有两位。如果不满足这个条件的话，也就是当输入的小数点超过两位的时候， 
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }
    } else if (!/^\d+\.?\d{0,2}$/.test(inputValue)) {
      inputValue = inputValue.substring(0, inputValue.length - 1);
    }
```