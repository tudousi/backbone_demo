define(['zepto', 'touch'], function(x, touch) {
    var timeaxis = function(opts) {
        /*
        {
            el: '.timeaxis',
            time: [
                {time: '12:00', title: '进行中', select: true},
                {time: '13:00', title: '未开始'},
                {time: '14:00', title: '未开始'}
            ],
            select: function(index, time) {

            },
            start: function(index, time) {

            }
        }
        t.goTo(index);
        t.start(2);
        t.start('16:00');
        */
        this.opts = {
            dx: 0,
            index: 0
        };
        $.extend(this.opts, opts);

        this.time = false;
        this.tmpl = [
            '<div class="timeaxis-wrap">',
                '<div class="timeaxis-bar" style="width: 3750px; transform: translate3d(0px, 0px, 0px);">',
                    '<div class="timeaxis-item timeaxis-item-padding"></div>',
                    '<div class="timeaxis-item timeaxis-item-padding"></div>',
                    '{$body}',
                '</div>',
                '<div class="timeaxis-current"></div>',
            '</div>'
        ].join('');

        this._init();
        this._logic();
        this._bind();
    }
    /**
    * @public   跳转到指定的time
    * index     指定索引位置
    */
    timeaxis.prototype.goTo = function(index) {
        var opts = this.opts;
        var timeaxisBar = $(opts.el).find('.timeaxis-bar')[0];
        var indexElem = -1;

        this._findSi(index * opts.firstTimeaxisWidth);
        this._switchTime(timeaxisBar, true);

        indexElem = $(opts.el).find('.timeaxis-item').eq(opts.index + 2);
        opts.select.call(this, opts.index, this._getTime(indexElem));
    };
    /**
    * @public       开始一个time
    * index         开始的索引或者时间
    */
    timeaxis.prototype.start = function(position) {
        var opts = this.opts;
        var startElem = null;
        var index = -1;
        if(typeof position == 'string') {
            $(opts.el).find('.timeaxis-item').each(function(i, item) {
                var timeaxisTime = $(item).find('.timeaxis-time');
                var timeaxisInfo = $(item).find('.timeaxis-info');

                // 指定start元素
                if(timeaxisTime.text() == position) {
                    startElem = item;
                }
                // 更新进行中状态为结束
                if(timeaxisInfo.text() == '进行中') {
                    timeaxisInfo.text('已结束');
                }

            });
        } else {
            startElem = $(opts.el).find('.timeaxis-item').eq(position + 2);
            $(opts.el).find('.timeaxis-item').each(function(i, item) {
                var timeaxisInfo = $(item).find('.timeaxis-info');
                // 更新进行中状态为结束
                if(timeaxisInfo.text() == '进行中') {
                    timeaxisInfo.text('已结束');
                }
            });
        }
        $(startElem).find('.timeaxis-info').text('进行中');
        index = ($(opts.el).find('.timeaxis-item').index(startElem) >= 2) ? $(opts.el).find('.timeaxis-item').index(startElem) - 2 : -1;
        this.goTo(index);
        opts.start.call(startElem, index, position);
    }
    // 内部初始化
    timeaxis.prototype._init = function() {
        var domStr = '';
        var opts = this.opts;


        for(var i = 0; i < opts.time.length; i++) {
            var time = opts.time[i];
            var sClass = '';

            if(time.select) {
                opts.index = i;
                sClass = 'timeaxis-active';
            }
            domStr += [
                '<div class="timeaxis-item ' + sClass + '">',
                    '<div class="timeaxis-item-inner">',
                        '<div class="timeaxis-time">' + time.time + '</div>',
                        '<div class="timeaxis-info">' + time.title + '</div>',
                    '</div>',
                '</div>'
            ].join('');
        }
        domStr = this.tmpl.replace('{$body}', domStr);
        $(opts.el).append(domStr);
    };
    // 初始化逻辑
    timeaxis.prototype._logic = function() {
        var opts = this.opts;
        opts.taCount = $(opts.el).find('.timeaxis-item').length;                        // 总数
        opts.firstTimeaxisWidth = $(opts.el).find('.timeaxis-item').eq(0).width();      // 宽度
        opts.dx = -(opts.index * opts.firstTimeaxisWidth);                              // 计算初始化位置
        $(opts.el).find('.timeaxis-bar')[0].style.transform = 'translate3d(' + opts.dx + 'px, 0px, 0px)';
    };
    // 事件监听
    timeaxis.prototype._bind = function() {
        var self = this;
        var opts = this.opts;
        var el = $(opts.el);

        // 禁用默认事件
        touch.on(el.find('.timeaxis-bar'), 'toushstart', function(ev) {
            ev.preventDefault();
        });
        // 拖动元素
        touch.on(el.find('.timeaxis-bar'), 'drag', function(ev){
            var offx = opts.dx + ev.x;
            ev.currentTarget.style.transition = '-webkit-transform 0.2s ease 0s';
            ev.currentTarget.style.transform = 'translate3d(' + offx + 'px, 0px, 0px)';
        });
        // 元素拖动结束
        touch.on(el.find('.timeaxis-bar'), 'dragend', function(ev) {
            opts.dx = opts.dx + ev.x;
            var elemBar = ev.currentTarget;
            var indexElem = null;
            // 超出限制 左边
            if(opts.dx > 0) {
                elemBar.style.transform = 'translate3d(0px, 0px, 0px)';
                opts.dx = 0;
                index = 0;
            }

            // 修正后的位置
            if( (-(opts.taCount - 3) * opts.firstTimeaxisWidth ) > opts.dx ) {
                opts.dx = (-(opts.taCount - 3) * opts.firstTimeaxisWidth );
                //elemBar.style.transform = 'translate3d(' + opts.dx + 'px, 0px, 0px)';
            }
            //elemBar.style.transition = '-webkit-transform 0.4s ease 0s';
            self._findSi(opts.dx);
            self._switchTime(elemBar, false);
            // 调用回调
            indexElem = $(opts.el).find('.timeaxis-item').eq(opts.index + 2);
            opts.select.call(self, opts.index, self._getTime(indexElem));

            // 修正class
            self._setClass();

            setTimeout(function() {
                elemBar.style.transition = '';
            }, 500);
        });
        touch.on(el.find('.timeaxis-item'), 'tap', function(ev) {
            var elemBar = ev.currentTarget;
            var bar = el.find('.timeaxis-bar')[0];
            var index = (el.find('.timeaxis-item').index(elemBar) >= 2) ? el.find('.timeaxis-item').index(elemBar) - 2 : -1;

            if(self.time || index < 0) {
                return;
            }
            self._findSi(index * opts.firstTimeaxisWidth);
            self._switchTime(bar, true);
            // 调用回调
            opts.select.call(self, opts.index, self._getTime(elemBar));
        });
    };
    /*
    * 切换time
    * elem      item当前元素
    * offx      计算后的位置
    * openTime  是否开启定时器清空样式
    */
    timeaxis.prototype._switchTime = function(elem, openTime) {
        var opts = this.opts;
        var self = this;
        elem.style.transition = '-webkit-transform 0.4s ease 0s';
        elem.style.transform = 'translate3d(' + opts.dx + 'px, 0px, 0px)';

        if(openTime) {
            this.time = setTimeout(function() {
                elem.style.transition = '';
                clearTimeout(self.time);
                self.time = false;
            }, 500);
        } else {
            this.time = false;
        }
        this._setClass();
    }
    // 根据x坐标计算当前是第几个元素
    timeaxis.prototype._findSi = function(tdx){
        var opts = this.opts;
        tdx = Math.abs(tdx);
        opts.index = Math.round(tdx / opts.firstTimeaxisWidth);
        opts.dx = -(opts.index * opts.firstTimeaxisWidth);
    }
    // 对索引位置的元素进行高亮
    timeaxis.prototype._setClass = function() {
        var opts = this.opts;
        $(opts.el).find('.timeaxis-item').removeClass('timeaxis-active');
        $(opts.el).find('.timeaxis-item').eq(opts.index + 2).addClass('timeaxis-active');
    }
    // 获取选中元素的time
    timeaxis.prototype._getTime = function(elem) {
        return $(elem).find('.timeaxis-time').text();
    }

    return timeaxis;
});
