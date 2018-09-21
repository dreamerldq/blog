# Django 踩坑记录
### 配置python环境
*** IDE使用pycharm
*** 全局安装python3版本
*** 使用 python3 自带的venv命令创建虚拟环境，这样可以将自己项目中所用到的所有的依赖包统一管理，不会和其他的python环境产生冲突
*** pip install django 安装django



### 微服务跨域问题
`django中每一个应用都可以通过一个python包来进行配置，比如在app包中创建一个middleware.py格式的文件，然后声明下面这个类`
```
from django.utils.deprecation import MiddlewareMixin

class DisableCSRF(MiddlewareMixin):
    def process_request(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
```
`在setting.py 的 MIDDLEWARE 中添加 app.middleware.DisableCSRF`

### json格式转换
Model.objects.all()等查询语句输出的都是QuerySet类型的值，需要将这个值转换成字典的格式, 引入django核心库中的serializers进行转换。
```
from django.core import serializers
data = json.loads(serializers.serialize('json', query_set))
```


### 数据表创建
django会在应用中寻找models文件， 所有继承models.Model的类都会被当做是一个数据表，类中的属性对应着表中的字段
在setting.py 的 INSTALLED_APPS 中进行表的数据表的注册
然后使用migrate命令进行数据表的迁移

```
from django.db import models
import  datetime
from django.utils import timezone
# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_datee = models.DateTimeField('date publish')
    def __str__(self):
        return self.question_text
    def was_published_recently(self):
        return self.pub_datee >= timezone.now() - datetime.timedelta(days=1)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    def __str__(self):
        return self.choice_text，

```