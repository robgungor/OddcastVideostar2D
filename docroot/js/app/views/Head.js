// LandingView.js
// -------
define(["jquery", "backbone", "models/Head", "text!templates/head.html"],

    function($, Backbone, Model, template){
        
        var Head = Backbone.View.extend({

          // The DOM Element associated with this view
          el: ".head",
          
          // View constructor
          initialize: function() {
              
              var self = this;
              
              self.render();
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

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template).fadeIn();
            
              return this;
          },           

        });

        // Returns the View class
        return Head;

    }

);