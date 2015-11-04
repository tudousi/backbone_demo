$(function() {
    var Model = Backbone.Model.extend({
        url: '/url/save',
        initialize: function() {
            console.log('create');
            this.bind('change:name', function() {
                var name = this.get('name');
                console.log('change value: ' + name);
            });
            this.bind('invalid', function(model, error) {
                console.log('error: ', model, error);
            });
        },
        showInfo: function() {
            console.log('info: ' + this.get('name'));
        },
        validate: function(attributes) {
            console.log('call validate');
            if(attributes.name == '') {
                return 'name not null';
            }
        }
    });
    var model = new Model();
    model.set({name: 'td'}, {validate: true});
    model.showInfo();
    //model.save();
    model.fetch({
        url:'http://localhost:8082/data/name.json',
        success: function(model, response) {
            console.log('ok', model, response);
        },
        error: function() {
            console.log('error: ', arguments);
        }
    });
    //model.save()
    //console.log(model.get('name'));


})
