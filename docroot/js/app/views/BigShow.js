// LandingView.js
// -------
define(["jquery", "backbone", "models/Message", "text!templates/big-show.html",  "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Model, template, OC_Utils, OC_MessageSaver){
        
        var Sharing = Backbone.View.extend({

          // The DOM Element associated with this view
          el: "div#big-show",
         
          // View constructor
          initialize: function() {              
            var self = this;

            self.listenTo(self.model, 'change', self.onMessageDataLoaded);
            self.$el.fadeIn();
          },
            
          // View Event Handlers
          events: {    
            'mousedown #create-your-own':'onCreateYourOwnClicked'
          },            

          onMessageDataLoaded: function(data){            
            window.Preloader.loaded();
            
            this.render();
          },
          // Renders the view's template to the UI
          render: function() {
            // Setting the view's template using the template method
            this.template = _.template(template, this.model.toJSON());

            // Dynamically updates the UI with the view's template
            this.$el.html(this.template);
            $('.snuggledotcom-logo').on('click', function(e){
                OC_ET.event("ce17");
            });
            return this;
          },           

          // play video
          embedAndPlayVideo: function($parent) {                
            var self = this,                 
                $currentVid = $($('.video-wrapper')[0]),
                vidName = this.model.get('selectedVideo');
         
            self.model.set({'autoplay':'autoplay'});
            
            // render the new video
            $('#video-preview').html(_.template(previewTemplate, this.model.toJSON()));
            
            var $nextVidWrap = $('.video-wrapper.vid'+vidName);        
                                           
            // we do this so we don't reference an old video that is still hanging
            var $parent = $nextVidWrap || self.$el;

            // show the container of the player
            $parent.find("#video-container").addClass('active');
            
            var $video = $("#video-player");
            // on pause of video
            $video.on('pause', function(){                  
              self.onVideoPaused();
            });                
            // on end of video
            $video.on('ended', function(){self.onVideoEnded();});

            $video.on('playing', function(){
               // hide loading state
              $('#main-loading-spinner').hide();                  
            });

            $video.on('play', function(){
               // hide loading state
              // $('#main-loading-spinner').fadeOut();
              //$('#video-loading-spinner').fadeOut();
            });
            

            // play the video
            $video.get(0).load();
            //$video.get(0).play();
          },
            
          playVideo: function() {
            var $video = $("#video-player");
            $("#video-container").addClass('active');
            $video.get(0).play();
          },

          onVideoPaused: function(){              
            var video = $('.'+this.model.get('selectedVideo')).find("video#video-player").get(0);                
            // if we aren't in full screen, assume the video is ended...           
            this.onVideoEnded(); 
          },

          onVideoEnded: function(){
            // show poster image/thumbnail
            $('.poster-image').css({opacity:1});
            $("#video-container").removeClass('active');
          },

          onCreateYourOwnClicked: function(e) {
            $('#big-show-video').get(0).pause();
            this.$el.fadeOut();
            window.router.navigate('landing', {trigger: true});
            OC_ET.event("ce16");
          },

        });

        // Returns the View class
        return Sharing;

    }

);