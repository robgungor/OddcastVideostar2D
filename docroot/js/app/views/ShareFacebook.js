// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/share-facebook.html", "text!templates/friend.html", 'collections/Friends', "utils/OC_Utils"],

    function($, Backbone, Model, template, friendTemplate, Friends, OC_Utils){
        
        var ShareTwitter = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#sharing-facebook-container",
            thumbPageIndex        : 0,
            shifting              : null,
            scrolling             : false,
            animating             : false,
            currentSwipeDirection : 'none',

            // View constructor
            initialize: function() {   
                var self = this;  
                
                //facebook api loading in... 
                self.model.facebook.loadSDK();
                this.render();      
            },
            
            // View Event Handlers
            events: {
                'click .friend'             :'onFriendClick',
                'click #move-right'         :'onRightClick',
                'click #move-left'          :'onLeftClick',
                'click #back'               :'onBackClick',                
                'swipe'                     :'onSwipe',
                'dragEnd'                   :'onSwipe'                
            },            

            // Renders the view's template to the UI
            render: function() {
                
               var self = this;

                // self.$el = $('#sharing-facebook');
                // Setting the view's template using the template method
                self.template = _.template(template, {shareMethod:'Facebook'});

                // Dynamically updates the UI with the view's template
                self.$el.html(self.template).fadeIn();

                $('.share-result').hide();

                $('#ok').on("click", function(e){
                    self.onOKClick(e);
                });

                
                return this;
            },
            
            
            share: function(mId){
                var self = this;
                //self.render();

                self.$el.fadeIn();
                $('#friend-selection').fadeIn();
                $('.share-result').fadeOut();
                
                // we arlready have friends, hide the spinner
                if(this.model.get('FBuserId') && this.model.get('friends')) {
                    $('#main-loading-spinner').fadeOut(300);                
                } else {
                    $('#main-loading-spinner').fadeIn(300);
                }     

                self.updateNavArrows();
            },          

            onOKClick : function(e){
                e.preventDefault();
                this.postToFacebook();

                $('.share-in').fadeOut();
                $('.share-result').fadeIn();
            },

            onOKAfterClick : function(e){
                e.preventDefault();
               
                this.$el.fadeOut(200);
                $('main').fadeIn();
                OC_ET.event("ce12");
            },            
            
           


            
        });

        // Returns the View class
        return ShareTwitter;

    }

);