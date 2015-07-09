// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/choose-video.html", 'views/ShareTwitter', 'views/ShareEmail', 'views/ShareFacebook', "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Model, template, ShareTwitter, ShareEmail, ShareFacebook, OC_Utils, OC_MessageSaver){
        
        var ChooseVideo = Backbone.View.extend({

          // The DOM Element associated with this view
          el: "#choose-video-container",
          
          // View constructor
          initialize: function() {
              
              var self = this;
           
              self.render();
          },
            
          // View Event Handlers
          events: {        
            'click .close-x': 'onCloseXClicked',
            'click .video-select': 'onVideoSelectClicked',   
          },            

          close: function() {
            this.$el.fadeOut().empty();
          },

          onCloseXClicked: function(e) {        
            e.preventDefault();
            window.router.navigate('landing', true);
          },   

          onVideoSelectClicked: function(e) {        
            e.preventDefault();
            console.log(e);
            // window.router.navigate('landing', true);
          },     
          // Renders the view's template to the UI
          render: function() {
              
              // Setting the view's template using the template method
              this.template = _.template(template, {});

              // Dynamically updates the UI with the view's template
              this.$el.html(this.template).fadeIn();
            
              return this;
          },           
         
          getVideoLink: function(shareView){
              var self = this;              
              var videoURL = self.model.get('videoURL');
              var hasChanged = self.model.get('hasChanged');

              var onGotVideoLink = function(link){
                  if(OC_Utils.isUndefined(link)) {
                    // try again... the server may have given an initial false response... 
                    //self.getVideoLink(shareView);
                  } else {
                    self.getMID(shareView);            
                  }
                  
              }
              // if we received a previous bad response, it's undefined
              if(OC_Utils.isUndefined(videoURL)) videoURL = '';

              if( videoURL.indexOf('http') >= 0 && !hasChanged ) {                  
                  onGotVideoLink(videoURL);
              } else {
                 //lock the screen
                $('#main-loading-spinner').fadeIn();
                self.model.fetchVideoLink(onGotVideoLink);
              }
             
          },

          
          
        });

        // Returns the View class
        return ChooseVideo;

    }

);