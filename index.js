
(function (win, doc) {
    var win = win;
    var doc = doc;
    //简单封装通过id获取dom元素
    function $id(id) {
        return doc.getElementById(id);
    }
    //简单封装通过class获取dom元素
    function $class(name) {
        return doc.getElementsByClassName(name);
    }
    //对循环函数做一个简单的封装
    function loop(start, end, func) {
        for(var i = start; i < end; i++) {
            if(func(i)) break;   //如果函数有返回值,则退出循环
        }
  
    }
    //初始化相关参数配置
    function PickerSelector(config) {
        this.param = config.param || [1,1,1,1,1];
        this.container = config.container;
        this.type = (config.type !== '2' && config.type !== '1' && config.type !== '0') ? 2 : config.type;
        this.dateBtn = config.dateBtn;
        this.startYear = config.startYear || 1990;
        this.endYear = config.endYear + 1 || new Date().getFullYear();
        this.startTime = config.startTime || new Date();
        this.totalResult = '';
        this.success = config.success;
  
        this.ulCount = 0;
        this.yearArray = [];
        this.monthArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        this.dayArray = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
        this.hourArray = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12','13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
        this.secondArray = [
            '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60'
        ];
  
        this.start = {
            Y: 0,
            time: ''
        };
        this.end = {
            Y: 0,
            index: 0
        };
        this.move = {
            Y:0,
            speed: []
        };
  
        this.position = [];
        this.distance=0;
        this.lineHeight = 40;
        this.maxHeight = [];
        this.index = 0;
        this.idxArr = [];
        this.result = [];
        this.initDomUl();
        this.startUp();
        this.initEventsBind();
    }
    PickerSelector.prototype = {
        constructor: PickerSelector,
        //根据param参数动态产生对应的ul元素
        initDomUl: function () {
            var html = '';
            var initDom = '';
            var _this = this;
            initDom += '<div class="datetime-picker-box" id="datetime-picker-box-'+ _this.container + '">\n' +
                '    <div class="datetime-picker-container" id="datetime-picker-container-'+ _this.container + '">\n' +
                '        <div class="datetime-picker-content" id="datetime-picker-content-'+ _this.container +'">\n' +
                '           <div class="datetime-selected-line"></div>\n' +
                '           <div class="datetime-select-shadow-top"></div>\n' +
                '           <div class="datetime-select-shadow-bottom"></div>\n' +
                '           <div class="datetime-select-text" id="datetime-select-text-'+ _this.container +'0" >年</div>\n' +
                '           <div class="datetime-select-text" id="datetime-select-text-'+ _this.container +'1" >月</div>\n' +
                '           <div class="datetime-select-text" id="datetime-select-text-'+ _this.container +'2" >日</div>\n' +
                '           <div class="datetime-select-text" id="datetime-select-text-'+ _this.container +'3" >时</div>\n' +
                '           <div class="datetime-select-text" id="datetime-select-text-'+ _this.container +'4" >分</div>\n' +
                '        </div>\n' +
                '        <div class="datetime-picker-top">\n' +
                '            <div class="datetime-select-btn" id="datetime-select-cancel-'+ _this.container + '">取消</div>\n' +
                '            <div class="datetime-select-btn datetime-select-ok" id="datetime-select-ok-'+ _this.container + '">确定</div>\n' +
                '        </div>\n' +
                '</div>\n' +
                '</div>';
            $class(_this.container)[0].innerHTML += initDom;
            loop(0, _this.param.length, function (i) {
                _this.position.push(0);
                _this.maxHeight.push(0);
                if(_this.param[i] == 1) {
                    _this.idxArr.push(i);
                    _this.ulCount++;
                    _this.move.speed.push(0);
                    html += '<div class="datetime-select-box datetime-select-box-left" id="datetime-select-box-' + _this.container + i + '">\n' +
                        '    <ul class="datetime-select-container" id="datetime-select-container-' + _this.container + i + '">\n' +
                        '    </ul>\n' +
                        '</div>';
                }
            })
            $id('datetime-picker-content-'+ _this.container).innerHTML += html;
            loop(_this.startYear, _this.endYear, function (i) {
                _this.yearArray.push(i);
            })
            loop(0, _this.ulCount, function (i) {
                _this.ulWidth = (100 / _this.ulCount).toFixed(2);
                $id('datetime-select-box-' + _this.container + _this.idxArr[i]).style.width = _this.ulWidth + '%';
            })
  
  
        },
        //触摸开始的回调函数
        startUp: function () {
            var _this = this;
            var idx = 0;
            var min=0;
            var max = 0;
            var dataArray = [];
            loop(0, _this.ulCount, function (i) {
                idx = _this.idxArr[i];
                var tempDomUl = $id('datetime-select-container-' + _this.container + idx);
                tempDomUl.index = _this.idxArr[i];
                switch(idx) {
                    case 0:
                        max = _this.yearArray.length;
                        dataArray = _this.yearArray;
                        _this.position[idx] = (_this.startTime.getFullYear() - _this.startYear) * _this.lineHeight;
                        _this.initLists(tempDomUl, min, max,dataArray, 0);
                        if(_this.ulCount == 1) {
                            doc.getElementById("datetime-select-text-"+ _this.container + idx).style.left = '56%';
                        } else {
                            doc.getElementById("datetime-select-text-"+ _this.container + idx).style.left = (_this.ulWidth - 5) + '%';
                        }
                        break
                    case 1:
                        max = _this.monthArray.length
                        dataArray = _this.monthArray;
                        _this.position[idx] = _this.startTime.getMonth() * _this.lineHeight;
                        _this.initLists(tempDomUl, min, max,dataArray, 1);
                        doc.getElementById("datetime-select-text-"+ _this.container + 1).style.left = (2 * _this.ulWidth - 5) + '%';
                        break
                    case 2:
                        max = _this.dayArray.length
                        dataArray = _this.dayArray;
                        _this.position[idx] = (_this.startTime.getDate() - 1) * _this.lineHeight;
                        _this.initLists(tempDomUl, min, max,dataArray, 2);
                        doc.getElementById("datetime-select-text-"+ _this.container + 2).style.left = (3 * _this.ulWidth - 6) + '%';
                        break
                    case 3:
                        max = _this.hourArray.length;
                        dataArray = _this.hourArray;
                        _this.position[idx] = _this.startTime.getHours() * _this.lineHeight;
                        _this.initLists(tempDomUl, min, max,dataArray, 3);
                        doc.getElementById("datetime-select-text-"+ _this.container + 3).style.left = (4 * _this.ulWidth - 6) + '%';
                        break
                    case 4:
                        max = _this.secondArray.length;
                        dataArray = _this.secondArray;
                        _this.position[idx] = _this.startTime.getMinutes() * _this.lineHeight;
                        _this.initLists(tempDomUl, min, max,dataArray, 4);
                        doc.getElementById("datetime-select-text-"+ _this.container + 4).style.left = (5 * _this.ulWidth - 7) + '%';
                        break
                }
                tempDomUl.addEventListener('touchstart', function () {
                    _this.touch(event,_this, tempDomUl, this.index);
                }, false)
                tempDomUl.addEventListener('touchend', function () {
                    _this.touch(event,_this, tempDomUl, this.index);
                }, false)
                tempDomUl.addEventListener('touchmove', function () {
                    _this.touch(event,_this, tempDomUl, this.index);
                }, false)
                tempDomUl.addEventListener('touchcancel', function () {
                    _this.touch(event,_this, tempDomUl, this.index);
                }, false)
            })
        },
        initLists: function (tempDomUl, min, max, dataArray, idx) {
            var html = '';
            var _this = this;
            html ='<li></li><li></li>';
            loop(min, max, function(i) {
                html += '<li>'+ dataArray[i] + '</li>';
            })
            html += '<li></li><li></li>';
            tempDomUl.innerHTML = html;
            _this.maxHeight[idx] = (max - 1) * _this.lineHeight;
            if(_this.position[idx] >= _this.maxHeight[idx]) {
                _this.position[idx] = _this.maxHeight[idx];
            } else if(_this.position[idx] <= 0) {
                _this.position[idx] = 0;
            }
  
            tempDomUl.style.transform = 'translate3d(0, -'+ _this.position[idx] + 'px, 0)';
            tempDomUl.style.webkitTransform = 'translate3d(0, -'+ _this.position[idx] + 'px, 0)';
            tempDomUl.style.msTransform = 'translate3d(0, -'+ _this.position[idx] + 'px, 0)';
            tempDomUl.style.mozTransform = 'translate3d(0, -'+ _this.position[idx] + 'px, 0)';
        },
        initEventsBind: function () {
            var _this = this
            //时间选择输入框
            var selectInput = $class(_this.dateBtn)[0]
            selectInput.addEventListener('touchstart', function () {
                $id('datetime-picker-box-' + _this.container ).classList.add('active')
                $id('datetime-picker-container-' + _this.container ).classList.add('datetime-picker-container-up')
            }, false)
            //确定按钮
            var sureBtn = $id('datetime-select-ok-' + _this.container )
            sureBtn.addEventListener('touchstart', function () {
                _this.result = []
                for(var i=0; i < _this.idxArr.length; i++ ) {
                    _this.index = _this.position[_this.idxArr[i]] / _this.lineHeight
                    switch(_this.idxArr[i]) {
                        case 0:
                            _this.result.push(_this.yearArray[_this.index])
                            break
                        case 1:
                            _this.result.push(_this.monthArray[_this.index])
                            break
                        case 2:
                            _this.result.push(_this.dayArray[_this.index])
                            break
                        case 3:
                            _this.result.push(_this.hourArray[_this.index])
                            break
                        case 4:
                            _this.result.push(_this.secondArray[_this.index])
                            break
                    }
                }
                if(_this.type === 0) {
                    _this.totalResult = _this.result[0] + '-' + _this.result[1] + '-' + _this.result[2]
                } else if(_this.type === 1) {
                    _this.totalResult = _this.result[0] + ':' + _this.result[1]
                } else if(_this.type === 2) {
                    _this.totalResult = _this.result[0] + '-' + _this.result[1] + '-' + _this.result[2] + ' '+ _this.result[3] + ':' + _this.result[4]
                }
                if(selectInput.value == '' || selectInput.value) {
                   selectInput.value = _this.totalResult
                } else {
                   selectInput.innerHTML = _this.totalResult
                }
                
                _this.success(selectInput.value)
                $id('datetime-picker-box-' + _this.container).classList.remove('active')
                $id('datetime-picker-container-' + _this.container).classList.remove('datetime-picker-container-up')
            }, false)
            //取消按钮
            var cancleBtn = $id('datetime-select-cancel-' + _this.container)
            cancleBtn.addEventListener('touchstart', function () {
                $id('datetime-picker-box-' + _this.container).classList.remove('active')
                $id('datetime-picker-container-' + _this.container).classList.remove('datetime-picker-container-up')
            }, false)
  
        },
        touch: function (event, that, domUl, idx) {
            event = event || window.event;
            event.preventDefault();
            switch(event.type) {
                case "touchstart":
                    that.start.Y = event.touches[0].clientY;
                    that.start.time = Date.now();
                    break
                case "touchend":
                    that.end.Y = event.changedTouches[0].clientY;
                    that.distance = that.end.Y - that.start.Y;
                    var moveLength = Math.abs(that.distance % that.lineHeight);
                    var moveDistance;
                    if(moveLength >= that.lineHeight / 2) {
                        moveDistance = Math.ceil(Math.abs(that.distance) / that.lineHeight) < 1 ? that.lineHeight : Math.ceil(Math.abs(that.distance) / that.lineHeight) * that.lineHeight;
                    } else if(moveLength < that.lineHeight / 2) {
                        moveDistance = Math.floor(Math.abs(that.distance) / that.lineHeight) < 1 ? that.lineHeight : Math.floor(Math.abs(that.distance) / that.lineHeight) * that.lineHeight;
                    }
                    if(that.distance < 0) {
                        that.position[idx] = (that.position[idx] + moveDistance) >= that.maxHeight[idx] ? that.maxHeight[idx] : that.position[idx] + moveDistance;
                    } else {
                        that.position[idx] = (that.position[idx] - moveDistance) <= 0 ? 0 : that.position[idx] - moveDistance;
                    }
                    domUl.style.transform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.webkitTransform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.msTransform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.mozTransform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.transition = 'transform 0.3s linear';
                    domUl.style.webkitTransition = '-webkit-transform 0.3s linear';
                    domUl.style.msTransition = '-ms-transform 0.3s linear';
                    domUl.style.mozTransition = '-moz-transform 0.3s linear';
                    if((idx == 1 || idx == 0) && that.ulCount > 2) {
                        var selectYear = that.yearArray[that.position[0] / that.lineHeight ];
                        var selectMonth = that.monthArray[that.position[1] / that.lineHeight ];
                        var daysLenth = new Date(selectYear, selectMonth, 0).getDate();
                        that.initLists($id('datetime-select-container-'+ that.container +'2'), 0, daysLenth, that.dayArray, 2);
                        doc.getElementById("datetime-select-text-"+ that.container + 2).style.left = (3 * that.ulWidth - 8) + '%';
                    }
                    break
                case "touchmove":
                    that.move.Y = event.changedTouches[0].clientY;
                    var offset = that.move.Y - that.start.Y;
                    var moveDistance = that.position[idx];
                    if(offset < 0) {
                        moveDistance = that.position[idx] - offset;
                    } else {
                        moveDistance = that.position[idx] - offset;
                    }
                    domUl.style.transform = 'translate3d(0, '+ (-moveDistance) + 'px, 0)';
                    domUl.style.webkitTransform = 'translate3d(0, '+ (-moveDistance) + 'px, 0)';
                    domUl.style.msTransform = 'translate3d(0, -'+ (-moveDistance) + 'px, 0)';
                    domUl.style.mozTransform = 'translate3d(0, -'+ (-moveDistance) + 'px, 0)';
                    domUl.style.transition = 'transform 0.3s linear';
                    domUl.style.webkitTransition = '-webkit-transform 0.3s linear';
                    domUl.style.msTransition = '-ms-transform 0.3s linear';
                    domUl.style.mozTransition = '-moz-transform 0.3s linear';
                    break
                case "touchcancel":
                    event.preventDefault()
                    if(that.position[idx] >= that.maxHeight[idx]) {
                        that.position[idx] = that.maxHeight[idx];
                    } else if(that.position[idx] <= 0) {
                        that.position[idx] = 0;
                    }
                    domUl.style.transform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.webkitTransform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.webkitTransform = 'translate3d(0, '+ that.position[idx] + 'px, 0)';
                    domUl.style.msTransform = 'translate3d(0, -'+ that.position[idx] + 'px, 0)';
                    domUl.style.transition = 'transform 0.2s linear';
                    domUl.style.webkitTransition = '-webkit-transform 0.2s linear';
                    domUl.style.msTransition = '-ms-transform 0.2s linear';
                    domUl.style.mozTransition = '-moz-transform 0.2s linear';
                    break
            }
        }
  
    }
    if(typeof exports == 'object') {
        module.exports = PickerSelector;
    } else if(typeof define == 'function' && define.amd) {
        define([],function () {
            return PickerSelector;
        })
    } else {
        win.PickerSelector = PickerSelector;
    }
  })(window, document)
  