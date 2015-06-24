// MobileRouter.js
// ---------------
define(["jquery", "backbone", "models/App", "models/Message", "views/Landing", "views/BigShow", "collections/Collection"],
        
    function($, Backbone, AppModel, MessageModel, LandingView, BigShowView, Collection) {

        var MobileRouter = Backbone.Router.extend({

            initialize: function() {

                // Tells Backbone to start watching for hashchange events
                Backbone.history.start();

            },

            // All of your Backbone Routes (add more)
            routes: {
                
                // When there is no hash bang on the url, the home method is called
                "": "index",
                "landing":"landing",
                "bigshow":"bigshow"

            },

            index: function() {
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
                //hacky but it brute
                //$('#bigshow').html();
                 // Instantiates a new view which will render the header text to the page                
                new LandingView({model:new AppModel({config:OC_CONFIG})});
            },

            bigShow: function() {
                // Instantiates a new view which will render the header text to the page                
                new BigShowView({model:new MessageModel({config:OC_CONFIG})});
            },
    
        });

        // Returns the MobileRouter class
        return MobileRouter;

    }

);