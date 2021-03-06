# time-date-picker

这是一个使用原生js编写的移动端防ios的时间选择器.
插件的安装方式:

> npm install date-time-picker

插件的引入方式:

(1) 直接引入: 通过在页面中创建script标签即可.

(2) AMD 方式引入:

在需要使用该插件的地方定义: 
> var DatePicker = require('time-date-picker');

(3) CMD方式引入:

在需要使用该插件的地方定义: 
> import DatePicker from 'time-date-picker';

具体使用方法,绑定相应dom结构,然后实例化该插件的方法,示例代码如下:

    new DatePicker({
        dateBtn:'datetime-select-datebtn',  //必选项, 触发时间弹窗的元素,可以是任何元素
        container: 'datetimeContainer',   //必选项, 存放时间弹窗的容器
        type: 5,  //可选项,我是用来配置年月日 or 时分 or 年月日时分的,他们分别是0,1,2
        startTime: new Date(),  //可选项
        startYear: 2018,        // 可选项, 开始的年份,默认1990
        endYear: 2018,          // 可选项, 结束的年份,默认当年
        param: [1,1,1,1,1], //可选项, type确定的话,param也会跟着确定,如果想要定义年月日 or 时分 or 年月日时分 这三个类型之外的选择器,则不设置type,通过数组配置即可.
        success: function (result) { //可选项, result就是选择的最终结果, 我们可以在成功后的回调函数里设置绑定的值=result
            bindVariable = result;
        }
    })

## 效果演示 ##

#### 时间选择器 ####
![时间选择器](https://github.com/muzishuiji/Picker/blob/master/images/datetime.png "时间选择器的演示")  

#### 单列选择器 ####
![单列选择器](https://github.com/muzishuiji/Picker/blob/master/images/singlePicker.png "单列选择器的演示") 

#### 三级联动选择器 ####
![三级联动选择器](https://github.com/muzishuiji/Picker/blob/master/images/address.png "三级联动选择器的演示") 

**注意**
在使用这个插件的时候如果遇到样式错乱的问题,需要在全局设置样式,具体原因我还不是很清楚,可能样式是因为被某个地方设置的样式覆盖导致.
  
  * {
    margin: 0;padding:0;
  }

> 如果觉得这个插件对你有所帮助,欢迎star~ 如果你在使用的过程中遇到任何疑问,可以随时联系我奥~
