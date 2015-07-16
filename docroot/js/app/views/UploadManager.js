// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/upload-manager.html", "text!templates/head.html",  "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Model, template, headTemplate, OC_Utils, OC_MessageSaver){
        
        var ChooseVideo = Backbone.View.extend({

          // The DOM Element associated with this view
          el: "#upload-manager-container",
          
          // View constructor
          initialize: function() {
              
              var self = this;
           
              self.render();

              this.listenTo(this.model.heads, "update", self.render);
              this.listenTo(this.model.heads, "reset", self.render);
          },
            
          // View Event Handlers
          events: {        
            'click #close': 'onCloseXClicked',            
            'click #add':'onAddClicked'
          },            

          onAddClicked: function(e) {
            var self = this;
            var head = self.model.heads.addNew();
            self.model.heads.currentHead = head;
            window.router.navigate('upload', true);
          },

          onCloseXClicked: function(e) {        
            e.preventDefault();
            window.router.navigate('landing', true);
          },   
               
          // Renders the view's template to the UI
          render: function() {
              
              // Setting the view's template using the template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template).fadeIn();
              this.renderHeads();

              return this;
          },     

          renderHeads: function() {

              var self = this;
              var $heads  = $('#heads');
              self.model.heads.each(function(head,index) {  
                 
                  var h = _.template(headTemplate, head.toJSON());                   
                 
                  // preload images (in case we aren't visible yet)
                  var img = new Image();
                  // load the image
                  img.src = head.get('src');
                
                  $heads.append(h);
              });
                            
              $('#main-loading-spinner').fadeOut(300);
          },
          close: function() {
            this.$el.fadeOut().empty();
          },
        
        });

        // Returns the View class
        return ChooseVideo;

    }

);