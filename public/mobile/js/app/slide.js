define(['zepto', 'touch'], function(zepto, touch) {
    var slide = function(opts) {
        this.opts = {
            speed: 0.15625,                            // 滑动切换slide的距离
            change: function(){}
        };
        $.extend(this.opts, opts);
        opts = this.opts;
        if(typeof opts.el == 'string') {
            opts.el = $(opts.el);
        }

        this.cx = 0;
        this.index = 0;

        // 私有变量
        var change = false;
        var self = this;

        this.init = function() {
            var container = $('<div/>').addClass('slide-container');
            var wrap = $('<div/>').addClass('slide-wrap slide-effect');
            var nav = $('<ul/>').addClass('nav-container');
            opts.data.forEach(function(data) {
                var aLink = $('<a/>').addClass('slide-item').attr('href', data.href);
                var img = $('<img/>').attr('src', data.src).css({width: '100%'});
                var navLi = $('<li/>');
                aLink.append(img);
                wrap.append(aLink);
                nav.append(navLi);
            });
            nav.find('li').eq(0).addClass('current')
            container.append(wrap);
            opts.el.append(container);
            container.append(nav);

            this.slideWidth = opts.el.find('.slide-wrap').width();
            this.wrap = opts.el.find('.slide-wrap')[0];
            this.slideItemCount = opts.el.find('.slide-item').length;
            this.nav = opts.el.find('.nav-container li');
        };
        // 绑定各种事件
        this.bindEvents = function() {
            touch.on(self.wrap, 'toushstart', function(ev) {
                ev.preventDefault();
            });
            touch.on(self.wrap, 'drag', function(ev) {
                var offx = self.cx + ev.x;
                duration(self.wrap, 0);
                transform(self.wrap, offx);
            });
            touch.on(self.wrap, 'dragend', function(ev) {
                var offx = ev.x;
                change = Math.abs(offx) > self.slideWidth * opts.speed;
                // 设置过度时间为 350ms
                duration(self.wrap, 350);

                if(offx < 0 && change) {          // 向左负数
                    next();
                } else if(offx > 0 && change) {
                    prev();
                } else {
                    reset();
                }
            });
        }
        // 初始化
        this.init();
        this.bindEvents();

        // 重置位置为索引处
        function reset() {
            var offx = self.index * self.slideWidth;
            transform(self.wrap, self.cx);
        }
        // 向右切换，上一个slide
        function prev() {
            if(self.index == 0) {
                reset();
                return;
            }
            self.index --;
            self.cx += self.slideWidth;
            setNav();
            transform(self.wrap, self.cx);
            opts.change.call(self, self.index);
        }
        // 向左切换，下一个slide
        function next() {
            if(self.index >= self.slideItemCount - 1) {
                reset();
                return;
            }
            self.index ++;
            self.cx -= self.slideWidth;
            setNav();
            transform(self.wrap, self.cx);
            opts.change.call(self, self.index);
        }
        /**
        * 设置元素过度时间
        * elem              需要过度的元素
        * num               过度时间，毫秒
        */
        function duration(elem, num) {
            elem.style.transitionDuration = num + "ms";
        }
        /**
        * 设置元素平移位置
        * elem              平移元素
        * num               移动距离
        */
        function transform(elem, num) {
            elem.style.transform = 'translate3d(' + num + 'px, 0px, 0px)';
        }
        function setNav() {
            self.nav.removeClass('current');
            self.nav.eq(self.index).addClass('current');
        }
    }
    return slide;
});
