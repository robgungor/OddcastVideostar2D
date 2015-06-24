// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/sharing.html",],

    function($, Backbone, Model, template){
        
        var ShareTwitter = Backbone.View.extend({

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
        return ShareTwitter;

    }

);