// LandingView.js
// -------
define(["jquery", "backbone", "models/Head", "text!templates/head.html"],

    function($, Backbone, Model, template){
        
        var Head = Backbone.View.extend({

          // The DOM Element associated with this view
          className: "head",
          
          // View constructor
          initialize: function() {
              
              var self = this;
              
              self.render();

              self.listenTo(self.model, 'destroy', self.remove);
          },
            
          // View Event Handlers
          events: {        
            'click .close-x': 'onCloseXClicked',            
          },            

          close: function() {
            this.$el.fadeOut().empty();
          },

          onCloseXClicked: function(e) {        
            e.preventDefault();
            this.model.destroy();
            this.remove();
          },   

            
          // Renders the view's template to the UI
          render: function() {
              
              // Setting the view's template using the template method
              this.template = _.template(template, this.model.toJSON());
              
              // // preload images (in case we aren't visible yet)
              // var img = new Image();
              // // load the image
              // img.src = this.model.get('src');

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template);
            
              return this;
          },           

        });

        // Returns the View class
        return Head;

    }

);