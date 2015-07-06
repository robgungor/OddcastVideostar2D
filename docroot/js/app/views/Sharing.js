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

              // self.twitterShare   = new ShareTwitter({model:self.model});
              // self.emailShare     = new ShareEmail({model:self.model});
              // self.facebookShare  = new ShareFacebook({model:self.model});
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
          onEmailShareClick: function(e) {              
            var self = this;              
            //self.shareEmailInit();
            window.router.navigate('share-email', true);
          },

          onFbShareClick: function(e) {
            var self = this;
            //self.shareFacebookInit();
            window.router.navigate('share-facebook', true);
          },

          onTwitterShareClick: function(e) {
            var self = this;        
            //self.shareTwitterInit();
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

          getMID: function(shareView){
              var self = this;
              var mId = self.model.get('mId');              

              $('main').fadeOut();
              
              if( !OC_Utils.isUndefined(mId) && !self.model.get('hasChanged') ) {
                // if we have an mId, reuse it
                if(shareView) shareView.share.apply(shareView, [mId]);
              } else {
                  var onMessageSaveComplete = function(mId){
                    // set the mId to our model so it is not forgetten about                    
                    self.model.set({'mId': mId});                       
                    self.model.set({'hasChanged': false});  
                    $('#main-loading-spinner').fadeOut(300);
                    
                    OC_ET.event("edsv");//Messages created

                    // pass along to next step, use apply for scope and inheritance
                    if(shareView) shareView.share.apply(shareView, [mId]);
                  }
                  $('#main-loading-spinner').fadeIn(300);
                  // save our message
                  OC_MessageSaver.saveMessage(self.model, {}, onMessageSaveComplete);
              }

          },

          
        });

        // Returns the View class
        return Sharing;

    }

);