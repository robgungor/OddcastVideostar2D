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
        "views/UploadAnother", 
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
            UploadAnother,
            Collection) {

        var MobileRouter = Backbone.Router.extend({
            model: null,
            views: null,

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();
                window.Preloader.loaded();
                if(this.views == null) this.views = new Backbone.Model();
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
                "upload-another":"uploadAnother",

            },

            index: function() {
                
                if(this.model == null) this.model = new AppModel({config:OC_CONFIG});
                if(this.views == null) this.views = new Backbone.Model();

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
                
                 // Instantiates a new view which will render the header text to the page                
                this.loadView('landing', LandingView);
            },

            bigShow: function() {
                // Instantiates a new view which will render the header text to the page                
                this.loadView('bigshow', BigShowView);
            },

            upload: function() {
                
                
                // Instantiates a new view which will render the header text to the page                
                this.loadView('upload', UploadView);
            },

            positioning: function() {
                
                this.loadView('positioning', PositioningView);             
            },

            sharing: function() {
                
              this.loadView('sharing', SharingView);                             
            },

            shareFacebook: function() {
            
                this.loadView('shareFacebook', ShareFacebookView);                    
            },

            shareEmail: function() {            
                this.loadView('shareEmail', ShareEmailView);     
            },

            shareTwitter: function() {                
                this.loadView('shareTwitter', ShareTwitterView);                   
            },

            shareYouTube: function() {            
              this.loadView('shareYouTube', ShareYouTubeView);                     
            },

            uploadFacebook: function() {
                this.loadView('uploadFacebook', UploadFacebookView);                                    
            },

            chooseVideo: function() {                
                this.loadView('chooseVideo', ChooseVideoView);                                                  
            },

            uploadAnother : function() {
                this.loadView('uploadAnother', UploadAnother);               
            },

            loadView : function(id, View) {
                if(this.view && _.isFunction(this.view.close)) this.view.close();
                if(this.model == null) return this.navigate('', true);
                var v;
                if(this.views.get(id)){
                    v = this.views.get(id);
                    if(_.isFunction(v.open)) v.open();
                    else v.render();
                } else {
                    v  = new View({model:this.model});
                    var attribute = {};
                    attribute[id] = v;                
                    this.views.set(attribute);
                }

                this.view = v;
                
            },


    
        });

        // Returns the MobileRouter class
        return MobileRouter;

    }

);