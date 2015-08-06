// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/upload-another.html", "views/Head",  "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Model, template, HeadView, OC_Utils, OC_MessageSaver){
        
        var ChooseVideo = Backbone.View.extend({

          // The DOM Element associated with this view
          el: "#upload-another-container",
          
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
            'click #add':'onAddClicked',
            'click #watch-video':'onNextClicked',
            'click #clear-all':'onClearClicked'
          },            

          onClearClicked: function(e) {
            var self = this;
            var head;
            while (head = self.model.heads.first()) {
              head.destroy();
            };
            
          },

          onNextClicked: function(e) {
            e.preventDefault();
            var self = this;
            $('#main-loading-spinner').show();
            self.$el.hide();
            //self.model.createFinalSharedVideo();
            self.model.fetchVideoLink(function(){
              
              window.router.navigate('landing', true);  
              $('#main-loading-spinner').hide();
            });
            
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
              var numHeads = 'zero';
              switch(self.model.heads.length){
                case 1: 
                  numHeads = 'one';
                  break;
                case 2: 
                  numHeads = 'two';
                  break;
                case 3: 
                  numHeads = 'three';
                  break;
                case 4: 
                  numHeads = 'four';
                  break;
                case 5: 
                  numHeads = 'five';
                  break;
                default: 
                  numHeads = 'one';                  
              };
              
              // Setting the view's template using the template method
              this.template = _.template(template, {'numberOfHeads':numHeads});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template).fadeIn();
              this.renderHeads();

              return this;
          },     

          renderHeads: function() {

              var self = this;
              var $heads  = $('#heads');
              

              self.model.heads.each(function(head,index) {  
                 
                  var h = new HeadView({model:head});//_.template(headTemplate, head.toJSON());                   
                 
                  // preload images (in case we aren't visible yet)
                  var img = new Image();
                  // load the image
                  img.src = head.get('src');
                
                  $heads.append(h.$el);
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