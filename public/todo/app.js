var app = {}; // create namespace for our app
$(function() {
    // http://adrianmejia.com/blog/2012/09/13/backbone-js-for-absolute-beginners-getting-started-part-2/
    // 基础数据
    app.Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false
        }
    });
    // 基础数据集合
    app.TodoList = Backbone.Collection.extend({
        model: app.Todo,
        localStorage: new Store("backbone-todo")
    });

    // instance of the Collection
    // 保存数据集合
    app.todoList = new app.TodoList();

    // renders individual todo items list (li)
    // list视图 创建虚拟dom li
    app.TodoView = Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#item-template').html()),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this; // enable chained calls
        }
    });

    // var view = new app.TodoView({model: todo});
    // renders the full list of todo items calling TodoView for each one.
    app.AppView = Backbone.View.extend({
        el: '#todoapp',
        initialize: function() {
            // 获取输入元素
            this.input = this.$('#new-todo');
            // when new elements are added to the collection render then with addOne
            app.todoList.on('add', this.addOne, this);
            app.todoList.on('reset', this.addAll, this);
            app.todoList.fetch(); // Loads list from local storage
        },
        events: {
            'keypress #new-todo': 'createTodoOnEnter'
        },
        createTodoOnEnter: function(e) {
            if (e.which !== 13 || !this.input.val().trim()) { // ENTER_KEY = 13
                return;
            }
            app.todoList.create(this.newAttributes());
            this.input.val(''); // clean input box
        },
        addOne: function(todo) {
            var view = new app.TodoView({
                model: todo
            });
            $('#todo-list').append(view.render().el);
        },
        addAll: function() {
            this.$('#todo-list').html(''); // clean the todo list
            app.todoList.each(this.addOne, this);
        },
        newAttributes: function() {
            return {
                title: this.input.val().trim(),
                completed: false
            }
        }
    });

    //--------------
    // Initializers
    //--------------

    app.appView = new app.AppView();
})
