require.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

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

//
