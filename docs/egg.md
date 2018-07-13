# egg 框架的使用
介绍egg框架的基本使用方法，如：
+ ### router配置
+ ### controller使用方法
+ ### model（squelize）关联数据库
+ ### plugin配置
+ ### config配置
+ ### Model创建

egg-squelize的使用方法
首先需要下载 `egg-sequelize 和 mysql2`包
然后在config文件中配置egg-sequelize
```
  exports.sequelize = {
    // 数据库类型
    dialect: "mysql",
    // host
    host: "localhost",
    // 端口号
    port: "3306",
    // 用户名
    username: "root",
    // 密码
    password: "***",
    // 数据库名
    database: "***"
  };
```
然后在plugin中配置
```
exports.sequelize = {
  enable: true,
  package: "egg-sequelize"
};
```

在egg-sequelize源码中
```
    const defaultConfig = {
    logging: app.logger,
    host: 'localhost',
    port: 3306,
    username: 'root',
    benchmark: true,
    define: {
      freezeTableName: false,
      underscored: true,
    },
  };
  const config = Object.assign(defaultConfig, app.config.sequelize);

  app.Sequelize = Sequelize;

  const sequelize = new Sequelize(config.database, config.username, config.password, config);

  // app.sequelize
  Object.defineProperty(app, 'model', {
    value: sequelize,
    writable: false,
    configurable: false,
  });

  loadModel(app);

  app.beforeStart(function* () {
    yield authenticate(app);
  });
};
```
给egg实例创建了一个model属性，这个属性的值就是根据上面在config中配置的mysql，来创建的sequelize对象。
+ sequelize对象具备很多实用的方法
+ find：搜索数据库中的一个特定元素，可以通过 findById 或 findOne；
+ findOrCreate：搜索特定元素或在不可用时创建它；
+ findAndCountAll：搜索数据库中的多个元素，返回数据和总数；
+ findAll：在数据库中搜索多个元素；
+ 复杂的过滤/ OR / NOT 查询；
+ 使用 limit(限制)，offset(偏移量)，order(顺序)和 group(组)操作数据集;
+ count：计算数据库中元素的出现次数；
+ max：获取特定表格中特定属性的最大值；
+ min：获取特定表格中特定属性的最小值；
+ sum：特定属性的值求和；
+ create：创建数据库 Model 实例；
+ update：更新数据库 Model 实例；
+ destroy：销毁数据库 Model 实例。

这样就可以在egg实例中使用app.model就能够获取到squeslize实例，并调用相关的方法

### Model创建
每一个数据表的创建应该都建立在一定的规范上面，下面这段代码实现了一些基本的规则配置
```
function defineModel(app, name, attributes) {
  let attrs = {};
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === "object" && value["type"]) {
      value.allowNull = value.allowNull && true;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
        allowNull: true
      };
    }
  }

  return app.model.define(name, attrs, {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
    version: true,
    freezeTableName: true
  });
}

module.exports = { defineModel };
```
下列这段代码是创建用户数据的实例， id这个字段标记了autoIncrement（默认自增从序列1开始，在创建的时候不用传入id参数），primaryKey标注此属性为主键。
插入一条新的数据用create方法`await ctx.model.Post.create(ctx.request.body)`
```
const db = require("../db");

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const User = db.defineModel(app, "users", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: { type: STRING, unique: true, allowNull: false }, // 用户名
    email: { type: STRING, unique: true, allowNull: false }, // 邮箱
    password: { type: STRING, allowNull: false }, // 密码
    name: STRING, // 姓名
    sex: INTEGER, // 用户性别：1男性, 2女性, 0未知
    age: INTEGER, // 年龄
    avatar: STRING, // 头像
    company: STRING, // 公司
    department: STRING, // 部门
    telePhone: STRING, // 联系电话
    mobilePhone: STRING, // 手机号码
    info: STRING, // 备注说明
    roleId: STRING, // 角色id
    status: STRING, // 用户状态
    token: STRING, // 认证 token
    lastSignInAt: DATE // 上次登录时间
  });

  return User;
};
```