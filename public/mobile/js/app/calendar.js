define(['zepto'], function() {
    var calendar = function(opts) {
        /*
        {
            el: '#calendar',                    // 外层元素
            targetDate: new Date(),             // 目标时间
            otherMonthGray: true,               // 其他月份变灰色
            showToday: true,                    // 是否显示今天文本
            selectNextMont: function() {},      // 下一个月选择回调
            selectPrevMonth: function() {},     // 上一个月选择回调
            selectDay: function(){},            // 选择日期回调
            selectMonth: function(){}           // 选择月份。上月、下月、月份总览、选择的月份都会触发这个回调
        }
        */
        this.opts = {
            otherMonthGray: true,
            showToday: true,
            selectNextMont: function() {},
            selectPrevMonth: function() {},
            selectDay: function(){},
            selectMonth: function(){}
        };
        $.extend(this.opts, opts);
        if(typeof this.opts.targetDate == 'string') {
            this.opts.targetDate = new Date(this.opts.targetDate);
        } else {
            this.opts.targetDate = this.opts.targetDate || new Date();
        }
        this._currentDate();
        this._fillDate();
        this._bind();

        this.tmpl = [
            '<div class="calendar">',
                '<div class="calendar-head">',
                    '<div class="prev-month"><svg style="display:inline-block;height:24px;width:24px;fill:rgba(0, 0, 0, 0.87);-webkit-user-select:none;" viewBox="0 0 24 24" data-reactid=".0.$=12.0.0.1:1:1.0.1:5.1.0.$=10.0.1.0.1:1.0.$0.$=10.0.1:2:$/=10"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" data-reactid=".0.$=12.0.0.1:1:1.0.1:5.1.0.$=10.0.1.0.1:1.0.$0.$=10.0.1:2:$/=10.0"></path></svg></div>',
                    '<div class="next-month"><svg style="display:inline-block;height:24px;width:24px;fill:rgba(0, 0, 0, 0.87);-webkit-user-select:none;" viewBox="0 0 24 24" data-reactid=".0.$=12.0.0.1:1:1.0.1:5.1.0.$=10.0.1.0.1:1.0.$1.$=10.0.1:2:$/=10"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" data-reactid=".0.$=12.0.0.1:1:1.0.1:5.1.0.$=10.0.1.0.1:1.0.$1.$=10.0.1:2:$/=10.0"></path></svg></div>',
                '</div>',
                '<table class="calendar-body">',
                    '<tbody>',
                        '<tr class="weeks">',
                            '<th>周一</th>',
                            '<th>周二</th>',
                            '<th>周三</th>',
                            '<th>周四</th>',
                            '<th>周五</th>',
                            '<th class="weekend">周六</th>',
                            '<th class="weekend">周日</th>',
                        '</tr>',
                        '{$body}',
                    '</tbody>',
                '</table>',
                '<table class="calendar-month">',
                    '<tr>',
                        '<td class="select-month">一月</td><td>二月</td><td>三月</td><td>四月</td>',
                    '</tr>',
                    '<tr>',
                        '<td>五月</td><td>六月</td><td>七月</td><td>八月</td>',
                    '</tr>',
                    '<tr>',
                        '<td>九月</td><td>十月</td><td>十一月</td><td>十二月</td>',
                    '</tr>',
                '</table>',
            '</div>'
        ].join('');
    };
    calendar.prototype._bind = function() {
        var self = this;
        var opts = this.opts;
        $(opts.el).on('click', '.prev-month', function(e) {
            self.prevMonth();
        });
        $(opts.el).on('click', '.next-month', function(e) {
            self.nextMonth();
        });
        // 点击日期
        $(opts.el).on('click', '.calendar-body tbody td', function(e) {
            var selectDay = $(this).find('.daylist').text();

            opts.targetDate.setDate(selectDay);
            self._currentDate();
            $('.selectDay').removeClass('selectDay');
            $(this).addClass('selectDay');

            opts.selectDay(self._getCbParams());
        });
        // 显示月份
        $(opts.el).on('click', '.calendar-head h5', function(e) {
            var height = $(opts.el).find('.calendar-body').height();
            var currentMonth = opts.targetDate.getMonth();                 // dom 顺序要减1，所以月份不做加1

            $(opts.el).find('.select-month').removeClass('select-month');
            $(opts.el).find('.calendar-month td').eq(currentMonth).addClass('select-month');
            $(opts.el).find('.calendar-body').css({opacity: 0});
            $(opts.el).find('.calendar-month').css({display: 'table', height: height});
        });
        // 点击月份响应事件
        $(opts.el).on('click', '.calendar-month tbody td', function(e) {
            var month = $(opts.el).find('.calendar-month tbody td').index(this);    // + 1; 月份从0开始
            opts.targetDate.setMonth(month);
            self.render();

            // 隐藏月份显示日期
            $(opts.el).find('.calendar-body').css({opacity: 1});
            $(opts.el).find('.calendar-month').css({display: 'none'});

            opts.selectMonth(self._getCbParams());
        });
    };
    // 重置 currentDate
    calendar.prototype._currentDate = function() {
        this.opts.currentDate = [this.opts.targetDate.getFullYear(), this.opts.targetDate.getMonth() + 1, this.opts.targetDate.getDate()];
    }
    // 填充日期
    calendar.prototype._fillDate = function() {
        this.weeks = getWeeks(this.opts.targetDate.getFullYear(), this.opts.targetDate.getMonth() + 1);
    }
    calendar.prototype.prevMonth = function() {
        var opts = this.opts;
        var month = opts.targetDate.getMonth() - 1;
        opts.targetDate.setMonth(month);
        this.render();

        opts.selectPrevMonth(this._getCbParams());
    };
    calendar.prototype.nextMonth = function() {
        var opts = this.opts;
        var month = opts.targetDate.getMonth() + 1;
        opts.targetDate.setMonth(month);
        this.render();

        opts.selectNextMont(this._getCbParams());
    }
    calendar.prototype._getCbParams = function() {
        var opts = this.opts;
        return {selectDay: opts.currentDate[2], currentDate: opts.currentDate};
    }
    calendar.prototype.render = function() {
        var tmplCopy = this.tmpl;
        // 生成日期
        var body = '';
        // 填充日期
        this._fillDate();
        for(var i = 0; i < this.weeks.length; i++) {
            body += '<tr>';
            for(var x = 0; x < this.weeks[i].length; x++) {
                var date =this.weeks[i][x];                             // 遍历填充时间的每个时间
                var cdate = new Date(date[0], date[1] - 1, date[2]);    // 当前时间对象
                var day = cdate.getDay();                               // 获取今天是星期几
                var className = [];                                     // 需要添加的类名
                var todayStr = '';                                      // 今天日期文本
                var istoday = this.isTody(cdate);                       // 判断今天
                var isNotMonth = this.isNotMonth(cdate);                // 为真不是本月
                var selectDay = this.selectDay(cdate);                  // 判断遍历的日期是否等于选中的日期

                todayStr = '<span class="daylist">' + date[2] + '</span>';
                // 周末啦
                if(day == 6 || day == 0) {
                    className.push('weekend');
                }
                // 本地时间今天
                if(istoday) {
                    className.push('today');
                    if(this.opts.showToday) {
                        todayStr += '<p>今天</p>';
                    }
                }
                // 不是当月的日期
                if(isNotMonth) {
                    className.push('notmonth');
                }
                // 选中的日期
                if(selectDay) {
                    className.push('selectDay');
                }
                body += '<td class="' + className.join(' ') + '" data-date="' + (date[0] + '-' + date[1] + '-' + date[2]) + '">' + todayStr + '</td>';
            }
            body += '</tr>';
        }
        tmplCopy = $(tmplCopy.replace('{$body}', body));
        // 日期月份标题
        tmplCopy.find('.calendar-head').append('<h5>' + this.opts.targetDate.getFullYear() + '年<span>' + (this.opts.targetDate.getMonth() + 1) + '月</span></h5>');
        $(this.opts.el).html(tmplCopy);
    };

    // 检测遍历的日历是否等于今天
    calendar.prototype.isTody = function(date) {
        var currentDate = new Date();
        if(
            (date.getFullYear() == currentDate.getFullYear()) &&
            (date.getMonth() + 1 == currentDate.getMonth() + 1) &&
            (date.getDate() == currentDate.getDate())
        ) {
            return true;
        }
        return false;
    };
    // 检测遍历的日历是否等于选择时间
    calendar.prototype.selectDay = function(date) {
        var currentDate = this.opts.currentDate;
        if(
            (date.getFullYear() == currentDate[0]) &&
            (date.getMonth() + 1 == currentDate[1]) &&
            (date.getDate() == currentDate[2])
        ) {
            return true;
        }
        return false;
    };
    // 检测不是本月的时间
    calendar.prototype.isNotMonth = function(date) {
        var targetDate = this.opts.targetDate;
        if(
            (date.getFullYear() == targetDate.getFullYear()) &&
            (date.getMonth() + 1 != targetDate.getMonth() + 1)
        ) {
            return true;
        }
        return false;
    };
    /**
    * 填充日期
    */
    function getWeeks(year, month) {
        var dates = [];
        var monthDays = new Date(year, month, 0).getDate();     // 当月时间
        // 生成时间
        for(var i = 1; i < monthDays; i++) {
            dates.push([year, month, i]);
        }
        // 按星期分组
        var week = [], weeks = [];
        while(dates.length > 0) {
            var date = dates.shift();
            week.push(date);
            if(new Date(date[0], date[1]- 1, date[2]).getDay() == 0) {
                weeks.push(week);
                week = [];
            }
        }
        if(week.length) {
            weeks.push(week);
        }
        // 补充第一个字段
        var firsWeek = weeks[0];
        if(firsWeek.length < 7) {
            // 未满一周
            while(firsWeek.length < 7) {
                // 获取按星期分组的第一组数据的第一个日期
                var firstDate = firsWeek[0];
                var date = new Date(firstDate[0], firstDate[1] - 1, firstDate[2] - 1);
                firsWeek.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
            }
        } else {
            // 刚好一周
            firstDate = firsWeek[0];
            week = [];
            for(var i = 1; i <= 7; i++) {
                var date = new Date(firstDate[0], firstDate[1] - 1, firstDate[2] - i);
                week.unshift([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
            }
            weeks.unshift(week);
        }
        var lastWeek = weeks[weeks.length - 1];
        while(lastWeek.length < 7) {
            var lastDate = lastWeek[lastWeek.length - 1];
            var date = new Date(lastDate[0], lastDate[1] - 1, lastDate[2] + 1);
            lastWeek.push([date.getFullYear(), date.getMonth() + 1, date.getDate()])
        }
        // 当然时间不能填充7组
        if(weeks.length < 6) {
            var lastDate = lastWeek[lastWeek.length - 1];
            week = [];
            for(var i = 1; i <= 7; i++) {
                var date = new Date(lastDate[0], lastDate[1] - 1, lastDate[2] + i);
                week.push([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
            }
            weeks.push(week);
        }
        return weeks;
    }

    return calendar;
});



//
