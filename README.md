# date-picker

这是一个使用原生js编写的移动端防ios的时间选择器.
插件的安装方式:

> npm install date-time-picker

插件的引入方式:

(1) 直接引入: 通过在页面中创建script标签即可.

(2) AMD 方式引入:

在需要使用该插件的地方定义: 
> var DatePicker = require('PickerSelector');

(3) CMD方式引入:

在需要使用该插件的地方定义: 
> import DatePicker from 'PickerSelector';

具体使用方法,绑定相应dom结构,然后实例化该插件的方法,示例代码如下:

    `new DatePicker({
        dateBtn:'datetime-select-datebtn',  //必选项, 触发时间弹窗的元素,可以是任何元素
        container: 'datetimeContainer',   //必选项, 存放时间弹窗的容器
        type: 5,  //可选项,我是用来配置年月日 or 时分 or 年月日时分的,他们分别是0,1,2
        startTime: new Date(),  //可选项
        param: [1,1,1,1,1], //可选项
        success: function (result) { //可选项
            
        }
    })`