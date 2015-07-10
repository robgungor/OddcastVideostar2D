// MobileRouter.js
// ---------------
define(["jquery", 
        "backbone", 
        "models/App", 
        "models/Message", 
        "views/Landing", 
        "views/BigShow", 
        "views/Upload", 
        "views/Positioning", 
        "views/Sharing", 
        "views/ChooseVideo",         
        "views/UploadFacebook", 
        "views/ShareFacebook", 
        "views/ShareEmail",
        "views/ShareYouTube", 
        "views/ShareTwitter", 
        "collections/Collection"],
        
    function($, 
            Backbone, 
            AppModel, 
            MessageModel, 
            LandingView, 
            BigShowView, 
            UploadView, 
            PositioningView, 
            SharingView, 
            ChooseVideoView,             
            UploadFacebookView,
            ShareFacebookView, 
            ShareEmailView, 
            ShareYouTubeView, 
            ShareTwitterView, 
            Collection) {

        var MobileRouter = Backbone.Router.extend({
            model: null,

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
                window.Preloader.loaded();
                if(this.model == null) this.model = new AppModel({config:OC_CONFIG});
            },

            // All of your Backbone Routes (add more)
            routes: {
                
                // When there is no hash bang on the url, the home method is called
                "": "index",
                "landing":"landing",
                "bigshow":"bigshow",
                "upload":"upload",
                "positioning":"positioning",
                "sharing":"sharing",
                "choose-video":"chooseVideo",
                "share-facebook":"shareFacebook",
                "upload-facebook":"uploadFacebook",

            },

            index: function() {
                
                if(this.model == null) this.model = new AppModel({config:OC_CONFIG});
                if(OC_CONFIG.messageId >0){
                    //Visitor sources from Email
                    if(OC_CONFIG.messageId.slice(-2) == ".2" || OC_CONFIG.messageId.slice(-2) == ".1") {
                        OC_ET.embed_session = 1;
                        OC_ET.event("tss");
                    //Visitor sources from Get Url
                    } else if(OC_CONFIG.messageId.slice(-2) == ".3") {
                        OC_ET.embed_session = 2;
                        OC_ET.event("tss");
                        OC_ET.event("uiebws");
                    }

                    //Play Back event
                    OC_ET.event("pb",OC_CONFIG.messageId);
                    
                    //TODO - use real routes 


                    this.bigShow();
                }else {
                    this.landing();
                }
                

            },

            landing: function() {
                
                if(this.model == null) return this.navigate('', true);
               
                 // Instantiates a new view which will render the header text to the page                
                this.loadView(new LandingView({model:this.model}));
            },

            bigShow: function() {
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new BigShowView({model:new MessageModel({config:OC_CONFIG})}));
            },

            upload: function() {
                if(this.model == null) return this.navigate('', true);
                
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new UploadView({model:this.model}));
            },

            positioning: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new PositioningView({model:this.model}));
            },

            sharing: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new SharingView({model:this.model}));
            },

            shareFacebook: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new ShareFacebookView({model:this.model}));
            },

            shareEmail: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new ShareEmailView({model:this.model}));
            },

            shareTwitter: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new ShareTwitterView({model:this.model}));
            },

            shareYouTube: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new ShareYouTubeView({model:this.model}));
            },

            uploadFacebook: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new UploadFacebookView({model:this.model}));
            },

            chooseVideo: function() {
                if(this.model == null) return this.navigate('', true);
              
                // Instantiates a new view which will render the header text to the page                
                this.loadView(new ChooseVideoView({model:this.model}));
            },

            loadView : function(view) {
                //this.view && (this.view.close ? this.view.close() : this.view.remove());
                if(this.view && this.view.close) this.view.close();
                this.view = view;
            }
    
        });

        // Returns the MobileRouter class
        return MobileRouter;

    }

);