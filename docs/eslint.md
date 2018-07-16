### eslint 小程序配置
目前比较热门的eslint配置文件是`airbnb`出的一套完善的代码检查配置。在github上已经有了高达7W个start，所以还是比较受业界认同。
+ 首先下载需要下载的npm包有 `eslint、eslint-config-airbnb-base、eslint-plugin-import`
+ 然后在vscode中安装eslint插件
+ 配置`.eslintrc.json`文件
```
{
    "extends": "eslint-config-airbnb-base",
    "rules": {
      "no-console": "off",
      "no-unused-vars": [0],
      "no-underscore-dangle": [0]
    },
    "globals": {
      "wx": true,
      "App": true,
      "Page": true,
      "getApp": true,
      "Component": true
    }
    }
  
```