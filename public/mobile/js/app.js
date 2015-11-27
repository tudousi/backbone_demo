require.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});
require(['app/timeaxis'], function(timeaxis) {

    var t = new timeaxis({
        el: '.timeaxis',
        time: [
            {time: '12:00', title: '已结束'},
            {time: '13:00', title: '进行中', select: true},
            {time: '14:00', title: '未开始'},
            {time: '15:00', title: '未开始'},
            {time: '16:00', title: '未开始'},
            {time: '17:00', title: '未开始'},
            {time: '18:00', title: '未开始'},
            {time: '19:00', title: '未开始'},
            {time: '20:00', title: '未开始'},
            {time: '21:00', title: '未开始'},
            {time: '22:00', title: '未开始'},
            {time: '23:00', title: '未开始'},
        ],
        select: function(index, time) {
            $('.log').append('<p>select事件发生 - 索引是：' + index + '</p>');
            console.log('select', index, time);
        },
        start: function(index, time) {
            $('.log').append('<p>start事件发生 - 索引是：' + index + '</p>');
            console.log('start', index, time);
        }
    });
    $('#goto').on('touchstart', function() {
        t.goTo(3);
    });
    $('#start').on('touchstart', function() {
        t.start('14:00');
    });
});
/*
require(['app/calendar'], function(calendar) {
    var c = new calendar({
        el:'#calendar',
        selectNextMont: function(args){
            console.log('select next month', args);
        },
        selectPrevMonth: function(args) {
            console.log('select prev month', args);
        },
        selectDay: function(args) {

        }
    });
    c.render();
})
*/

//
