// LandingView.js
// -------
define(["jquery", 
        "backbone", 
        "models/App", 
        "text!templates/landing.html", 
        "text!templates/video-preview.html", 
        "text!templates/alert.html", 
        "text!templates/upload.html",
        "utils/OC_Utils", 
        "utils/OC_MessageSaver", 
        "views/Sharing", 
        "jqueryui"],

    function($, Backbone, Model, template, previewTemplate, alertTemplate, uploadTemplate, OC_Utils, OC_MessageSaver, Sharing) {
        
        var Landing = Backbone.View.extend( {

            // The DOM Element associated with this view
            el: "main#landing-container",
            sharing: null,
            // View constructor
            initialize: function() {
                var self = this;

                // self.model.set( {'selectedVideo':'1', 'autoplay':''} );
                // self.model.set( {'hasChanged':true, 'namesHaveChanged':true} );                
                
                //self.model.set({'videoURL':'http://host-vd.oddcast.com/ccs7/tmp/APS/video/75/c6/75c622f1465ba12c3d297fe22ac056fb/75c622f1465ba12c3d297fe22ac056fb.mp4'});

                self.render();

                //fade in
                setTimeout(function() {                  
                  self.$el.css({'display':'block', 'opacity':'1'});
                  self.$el.addClass('loaded');                  
                }, 300);
                
            },
            
            close: function() {
              this.$el.fadeOut().empty();
            },

            // View Event Handlers
            events: {
              'click #star-in-this-video': 'onStarInThisVideoClicked',
              'click #share-video': 'onShareVideoClicked',
              'click #choose-video': 'onChooseVideoClicked',

              'orientationchange':'onOrientationChange'
            },     

            // Renders the view's template to the UI
            render: function() {
                var self = this;
                // Setting the view's template using the template method
                this.template = _.template(template, {});

                // Dynamically updates the UI with the view's template
                this.$el.html(this.template).fadeIn();
                              
                // $('#upload-container').html(_.template(uploadTemplate, this.model.toJSON()));
                $('#video-container').empty().html(_.template(previewTemplate, this.model.toJSON()));

                // first time, show this
              
               
                return this;
            },
            
            onStarInThisVideoClicked: function(e) {
              e.preventDefault();
              var self = this;

               // go to upload manager if any heads have been uploaded
              if(self.model.heads.models.length > 0) {
                window.router.navigate('upload-another', true);                
              } else {
                window.router.navigate('upload', true);
              }
            },

            onShareVideoClicked: function(e) {
              e.preventDefault();
              
              var self = this;
                          
              if( !self.model.videoIsValid() ) {
                self.model.fetchVideoLink(function(){
                  self.model.getMID(function() {
                    window.router.navigate('sharing', true);
                  });
                })
              } else if( !self.model.MIDisValid() ){
                self.model.getMID(function() {
                  window.router.navigate('sharing', true);
                });
              }  else {
                window.router.navigate('sharing', true);
              }
              
            },

            onChooseVideoClicked: function(e) {
              e.preventDefault();
              var self = this;
              window.router.navigate('choose-video', true);
            },
                       
            loadAndPlayVideo: function() {
                var self = this;

               self.updateInputValues();

                // use local callback for scope
                var onGotPreviewVideoLink = function(){                  
                  self.embedAndPlayVideo();
                  self.model.set({'hasChanged':true, 'namesHaveChanged':false});
                }
                try{
                  $('video').get(0).pause();
                }catch(e){}
                
                $('video').remove();
                $('#video-container').remove();
                self.model.fetchVideoLink(onGotPreviewVideoLink);

                //lock the screen
                $('#main-loading-spinner').fadeIn();
            },
           
            // play video
            embedAndPlayVideo: function($parent) {                
                var self = this,                 
                    $currentVid = $($('.video-wrapper')[0]),
                    vidName = this.model.get('selectedVideo');
             
                self.model.set({'autoplay':'autoplay'});
                
                $('#video-preview').empty();

                // render the new video
                $('#video-preview').html(_.template(previewTemplate, this.model.toJSON()));
                
                var $nextVidWrap = $('.video-wrapper.vid'+vidName);        
                                               
                // we do this so we don't reference an old video that is still hanging
                var $parent = $nextVidWrap || self.$el;

                // show the container of the player
                $parent.find("#video-container").addClass('active');
                
                //var $video = $("#video-player");
                var $video = $($parent.find("video#video-player").get(0));
              
                // on pause of video
                $video.on('pause', function(){self.onVideoPaused();});                
                // on end of video
                $video.on('ended', function(){self.onVideoEnded();});

                $video.on('playing', function(){
                   // hide loading state
                  $('#main-loading-spinner').fadeOut();
                });

                $video.on('play', function(){
                   // hide loading state
                  $('#main-loading-spinner').fadeOut();
                });

                $video.get(0).oncanplay = function() {
                    //alert("Can start playing video");
                    $video.get(0).play();
                    $('#main-loading-spinner').hide();
                };                

                $video.get(0).load();
                $('#main-loading-spinner').hide();
                //Video Generated (Should occur when the custom video is displayed on the preview screen)
                OC_ET.event("edvscr");
                // play the video
                //$video.get(0).play();
            },
            
            playVideo: function() {
                var $video = $("#video-player");
                $("#video-container").addClass('active');
                $video.get(0).play();
            },

            onVideoPaused: function() {              
                var video = $('.'+this.model.get('selectedVideo')).find("video#video-player").get(0);                
                // if we aren't in full screen, assume the video is ended... 
                //if (!video.webkitDisplayingFullscreen) 
                this.onVideoEnded(); 

            },

            onVideoEnded: function() {
              // show poster image/thumbnail
              //$('.poster-image').css({opacity:1});
              //$("#video-container").removeClass('active');
            },
            
            onVideoSelectClick: function(e) {
                e.preventDefault();
                //if($(e.currentTarget).hasClass('selected')) return;

                var self = this,
                    $currentVid = $($('.video-wrapper')[0]),
                    vidName = $(e.currentTarget).attr('data-video-name');

                //tracking
                OC_ET.event("ce"+(3+parseInt(vidName)));
                
                // pause current video
                $("#video-player")[0].pause();
                // set the selected video name to the model
                this.model.set({'selectedVideo':vidName});

                 // update video selection nav
                self.updateSelectedButton();

                self.loadAndPlayVideo();
                     
            },

            updateSelectedButton: function() {
              var self = this;

              // deselect previous button
              $('#message-selection button.selected').removeClass('selected');
              // select current button
              $('button[data-video-name='+self.model.get('selectedVideo')+']').addClass('selected');
            },

            onEmailShareClick: function(e) {              
              var self = this;              
              self.sharing.shareEmailInit();
            },

            onFbShareClick: function(e) {
              var self = this;
              self.sharing.shareFacebookInit();
            },

            onTwitterShareClick: function(e) {
              var self = this;        
              self.sharing.shareTwitterInit();
            },
            // for tracking
            onToFocus: function(e) {
              OC_ET.event("ce1");
            },
            // for tracking
            onFromFocus: function(e) {
              OC_ET.event("ce2");
            }
        });

        // Returns the Landing class
        return Landing;

    }

);