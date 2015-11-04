$(function() {
    // view.$el属性等同于$(view.el) ，view.$(selector)等同于$(view.el).find(selector)。
    var button1 = $('<button></button>');
    var button2 = $('<button></button>');

    var ListView = Backbone.View.extend({
        events: {},
        render: function() {
            this.$el.html(this.model.toJSON());
            return this;
        }
    })

})
