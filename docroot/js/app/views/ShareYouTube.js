// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/sharing.html",],

    function($, Backbone, Model, template){
        
        var ShareYouTube = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "sharing",

            // View constructor
            initialize: function() {                
            },
            
            // View Event Handlers
            events: {
                'click #ok': 'onOKClick'             
            },            

            // Renders the view's template to the UI
            render: function() {
                var self = this;

                self.$el = $('#sharing');
                // Setting the view's template using the template method
                self.template = _.template(template, {shareMethod:'Twitter'});

                // Dynamically updates the UI with the view's template
                self.$el.html(self.template);

                $('.share-result').hide();
                

                $('#ok').on("click", function(e){
                    self.onOKClick(e);
                });

                $('#ok-after').on("click", function(e){
                    self.onOKAfterClick(e);
                });
                $('.snuggledotcom-logo').on('click', function(e){
                    OC_ET.event("ce17");
                });
                return this;
            },
            
            onOKClick: function(e){
                e.preventDefault();
                this.postToTwitter();

                $('.share-in').fadeOut();
                $('.share-result').fadeIn();
            },

            onOKAfterClick: function(e){
                e.preventDefault();
               
                this.$el.fadeOut(200);
                $('main').fadeIn();
                OC_ET.event("ce12");
            },

            share: function(mId){                                
                this.render();                
                
                $('#main-loading-spinner').fadeOut(300);
                $('#sharing').fadeIn();
                $('.share-in').fadeIn();
            },
            postToYoutube: function(){ 
                
                precheck_saved_mid(postToYoutube_step2, postToYoutube_step1);
                
                function postToYoutube_step1(){
                    blocked_url_link=null;
                    blocked_url_action = postToYoutube_step2;
                    updateBlockedUrlTitle("yt_share_title", null);
                    openPopwin('popwin_blockedurl');
                }
                function postToYoutube_step2(){
                    startYoutube(1);
                }
            },
            setYoutubeSessionToken:function(_token){
                //alert(_token);
                postToYoutube_now(_token);
            },
            
            postToYoutube_now: function(_ytToken){ 
                var _data=new Object();
                _data.mId=(shareType=="shareVideo")?(savedMidObj.videoMid):(savedMidObj.photoMid);
                _data.yt_token=_ytToken;
                _data.doorId = this._wsSettings.doorId;
                _data.taskName="sendVideoToYoutube";
                var tmp = OC_Utilities.getUrl(OC._api_base_url+"/api/saveSchedularTask.php",_data, null, postToYoutube_now_DONE);
                //console.log(tmp);
                
                function postToYoutube_now_DONE(_responseText){
                    //console.log("===> "+_responseText);
                    if(_responseText=="ok"){
                        openAlertWin(OC.getDynamicErrorMessage("mobile011", "Thank you for posting."));
                        OC_ET.event("ce21");
                    }
                }
            },

            postToTwitter : function () {
              window.open(this.model.getTwitterLink(), '_blank');
              //OC_ET.event("ce12");
                OC_ET.event("uiebfb");
                OC_ET.event("ce10");
                try {
                    if(OC_CONFIG.messageId.length > 4) {
                        OC_ET.embed_session = 2;
                        OC_ET.event("uiebfb");
                    }
                } catch(e) {}
            },
            
            twLogin: function(cb) {
                var self = this;
                if (!cb) cb = self.twLoginCB;
                //window.open("//{baseURL}/api_misc/{doorId}/twitterApi.php?cb="+cb, "Sign in with Twitter", "width=500,height=400");
                window.open(self.model.config.get('curURL') + "/api_misc/{doorId}/twitterApi.php?cb=" + cb, "Sign in with Twitter", "width=500,height=400");
            },

            twLoginCB: function(response) {
                var self = this;
                if (twStatusCallback != null) {
                    twStatusCallback(response); //<== in custom_main.js
                } else {
                    if (response['error']) { //not logged in
                        console.log("error: " + response['error']);
                    } else { //Logged in
                        console.log(response);
                    }
                }
            },

            twUpdateProfileImage: function(imgsrc, cb) {
              var self = this;
              $.ajax({
                  url: self.model.config.get('curURL') + '/api_misc/{doorId}/twitterApi.php?f=UpdateProfileImage&image=' + encodeURIComponent(imgsrc), 
                  dataType: 'json',
                  success: function (result) {
                      if (cb) cb(result);
                      console.log(result);
                  }
                });
            },

            twUpdateStatus: function (status, imgsrc, cb) {
                var self = this;
                if (!imgsrc) imgsrc = "";

                $.ajax({
                
                  url: self.model.config.get('curURL')+'/api_misc/{doorId}/twitterApi.php?f=UpdateStatus&status=' + encodeURIComponent(status) + '&image=' + encodeURIComponent(imgsrc), 
                  dataType: 'json',
                  success: function (result) {
                    if (cb) cb(result);
                    console.log(result);
                  }
                });
            }

        });

        // Returns the View class
        return ShareYouTube;

    }

);