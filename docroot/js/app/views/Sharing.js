// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/sharing.html", 'views/ShareTwitter', 'views/ShareEmail', 'views/ShareFacebook', "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Model, template, ShareTwitter, ShareEmail, ShareFacebook, OC_Utils, OC_MessageSaver){
        
        var Sharing = Backbone.View.extend({

          // The DOM Element associated with this view
          el: "#sharing-container",
          twitterShare: null,
          emailShare: null,
          facebookShare: null,
          // View constructor
          initialize: function() {
              
              var self = this;

              //MAKE SURE TO REMOVE THIS AFTER BETA
              self.model.set({'mId':'123456'});
              self.render();
          },
            
          // View Event Handlers
          events: {        
            'click .close-x'  : 'onCloseXClicked',
            'click #facebook' : 'onFbShareClick',   
            'click #email'    : 'onEmailShareClick',   
            'click #twitter'    : 'onTwitterShareClick',   
            //'click #youtube'    : 'onEmailShareClick',   
          },            

          close: function() {
            this.$el.fadeOut().empty();
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
            
              return this;
          },   

          MIDisValid: function() {
            console.log('MID: '+this.model.get('mId'));
            return !this.model.hasChanged('videoURL') && !OC_Utils.isUndefined(this.model.get('mId'));
          },

          onEmailShareClick: function(e) {              
            var self = this;              
            
            if(this.MIDisValid()) {
              self.model.sendEmail();
            } else {
              self.model.getMID(_.bind(self.model.sendEmail, self.model));
            }
            // } else {
            //   self.getVideoLink(function(){
            //     window.router.navigate('share-email', true);
            //   });
            // }
          },

          onFbShareClick: function(e) {
            var self = this;
            
            if(this.MIDisValid()) {              
              window.router.navigate('share-facebook', true);
            } else {
              self.model.getMID(function() {
                window.router.navigate('share-facebook', true);
              });
            }
            //self.shareFacebookInit();
            
          },

          onTwitterShareClick: function(e) {
            var self = this;        
            //self.shareTwitterInit();
             if(this.MIDisValid()) {
              self.model.postToTwitter();
            }
            window.router.navigate('share-twitter', true);
          },

          shareFacebookInit: function(){
              var self = this;        
              self.facebookShare.login();    
              self.getVideoLink(self.facebookShare);
          },          
          
          shareTwitterInit: function(){
              var self = this;
              self.getVideoLink(self.twitterShare);
          },
          
          shareEmailInit: function(){
              var self = this;
              self.getVideoLink(self.emailShare);
          },        
                  
          getVideoLink: function(callback){
              var self = this;              
              var videoURL = self.model.get('videoURL');
              var hasChanged = self.model.hasChanged('croppedImage');

              var onGotVideoLink = function(link){
                  if(OC_Utils.isUndefined(link)) {
                    // try again... the server may have given an initial false response... 
                    //self.getVideoLink(shareView);
                  } else {
                    self.getMID(callback);            
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
        return Sharing;

    }

);