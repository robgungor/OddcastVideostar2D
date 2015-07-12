// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/share-facebook.html", "text!templates/friend.html", 'collections/Friends'],

    function($, Backbone, Model, template, friendTemplate, Friends){
        
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
                'click #sharing-nav .email' :'onEmailShareClick',
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
                self.$el.html(self.template);

                $('.share-result').hide();

                $('#ok').on("click", function(e){
                    self.onOKClick(e);
                });

                $('#ok-after').on("click", function(e){
                    self.onOKAfterClick(e);
                });

                $('#friend-wrap').on('scrollstop', function(e){ self.onScrollStop(e); });
                $('#friend-wrap').on('scroll', function(e){ self.onScroll(e); });
                $('.snuggledotcom-logo').on('click', function(e){
                    OC_ET.event("ce17");
                });
                return this;
            },
            
            onGotFriendsInfo : function(result){
                var self = this;
                
                var friends = new Friends();
                friends.set(result);
                var userID = self.model.get('FBuserId');
                friends.moveUserToTopOfList(userID);

                self.model.set({'friends':friends});
                self.renderFriends();
            },

            renderFriends: function() {

                var self = this, col = 0, row = 0, index = -1, page = 0, prevCol,
                    $colEl = $('<div class="col"></div>'),
                    $pageEl = $('<div class="page"></div>');

                $('#friend-container').empty();
                
                $('#friend-container').append($pageEl);

                self.model.get('friends').each(function(friend) {  
                    var f = _.template(friendTemplate, friend.toJSON());                   
                    index++;
                    row  = index % 5;
                    col  = Math.floor(index / 5);
                    page = col % 3;

                    // preload images (in case we aren't visible yet)
                    var img = new Image();
                    // load the image
                    img.src = friend.get('pic_big');

                    if(row == 0) {
                        $colEl = $('<div class="col"></div>');
                    }

                    if( page == 0 & col > prevCol  ) {
                        $pageEl = $('<div class="page"></div>');
                        $('#friend-container').append($pageEl);
                    }

                    prevCol = col;
                   
                    // Dynamically updates the UI with the view's template
                    $pageEl.append($colEl);
                    $colEl.append(f);
                });
                
                self.onResize();

                $('#main-loading-spinner').fadeOut(300);                
                
            },
            
            onResize: function(){
                var perPage    = 9,
                    total       = this.model.get('friends').length;

                var totalPages = Math.floor(total/perPage);
                var $container = $('#friend-container');
                $container.css({'width':totalPages * ($container.find('.page').width()-25) });

                $('body').css({'min-height':$(window).height()});   
                $('#sharing-facebook').css({'min-height':$(window).height()});   
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
            
            onFriendClick: function(e) {                
                var self = this;
                var friendID = $(e.currentTarget).attr('data-id');
                self.postToFacebook(friendID);
                $('#friend-selection').fadeOut();
                $('.share-result').fadeIn();
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
            
            onLeftClick : function(e){
                this.shiftThumbs('left');
            },

            onRightClick : function(e){
                this.shiftThumbs('right');            
            },

            onBackClick : function(e) {
                this.$el.fadeOut(200);
                $('main').fadeIn();
            },

            onScrollStop: function(e) {
                
                var self = this;
                                
                self.scrolling = false;

                if( self.animating  ) return;

                if(self.currentSwipeDirection != undefined && self.currentSwipeDirection != 'none') {
                    self.shiftThumbs(self.currentSwipeDirection);
                } else {
                    self.thumbPageIndex = self.updateCurrentPageIndex();
                    var targX = $($('#friend-container').find('.page')[self.thumbPageIndex]).position().left;
                    self.thumbsTargetX = Math.ceil(targX);                   
                    self.animating = true;
                    $('#friend-wrap').animate({ 'scrollLeft' : self.thumbsTargetX }, 300, function(){ 
                        self.animating = false;
                        self.updateNavArrows();
                    });
                    
                }
            },
            
            onScroll: function(e) {
                this.scrolling = true;
            },
            
            onSwipe: function(e){ 
                var self = this;               
                var direction = e.swipestart.coords[0] > e.swipestop.coords[0] ? 'right' : 'left'; 
                self.currentSwipeDirection = direction;
                if(! this.scrolling ) self.shiftThumbs(direction);
            },

            
            // update the current page index according to where the thumbs are in X position
            updateCurrentPageIndex: function() {
                var $container = $('#friend-container');
                
                // update current page by X position (if they swiped a big swipe)
                var curX = $('#friend-wrap').scrollLeft();
                
                if (curX == 0) return 0;

                var candidates = [],
                    pageIndex = 0;

                $container.find('.page').each(function() {
                    var x = $(this).position().left;     
                    pageIndex ++;
                   
                    if( Math.abs( x-curX ) <= $(this).width() ) {                        
                        candidates.push({$el:$(this), index:pageIndex});
                    }
                });

                _.sortBy(candidates, function(obj) {                    
                    return obj.$el.position().left;
                });
                
                var targX = $(candidates[0].$el).position().left;                                
                self.thumbPageIndex = candidates[0].index;    
                
                return self.thumbPageIndex;        
            },           

            shiftThumbs : function( direction ) {
        
                var self        = this,
                    $container  = $('#friend-container'),
                    $wrap       = $('#friend-wrap'),
                    targX       = 0,
                    pageW       = Math.ceil($wrap.width())+16,
                    perPage     = 9;

                var total = this.model.get('friends').length;
                var totalPages = $container.find('.page').length;//Math.floor(total/perPage);
                var lastPageIndex = totalPages-1;
                
                self.thumbPageIndex = self.updateCurrentPageIndex();
                
                // set our thumb index to go to
                self.thumbPageIndex = direction === 'right' ? Math.min(self.thumbPageIndex + 1, lastPageIndex) : Math.max(self.thumbPageIndex - 1, 0);

                // find our target via the thumb position
                targX = $($container.find('.page')[self.thumbPageIndex]).position().left;

                self.thumbsTargetX = Math.ceil(targX);
                self.animating = true;
                // on complete update the arrows
                $wrap.animate({ 'scrollLeft' : self.thumbsTargetX }, 300, function(){
                    // set a timeout to avoid onScrollStop
                    setTimeout(function(){
                        self.animating = false;
                    }, 100);
                });
                //$container.animate({ 'left' : self.thumbsTargetX }, 300);
                
                self.currentSwipeDirection = 'none';

                self.updateNavArrows();
            },

            updateNavArrows: function() {
                var self          = this,
                    perPage       = 9;

                var totalFriends  = this.model.get('friends').length;
                var totalPages    = $('#friend-container').find('.page').length;//Math.floor(totalFriends/perPage);
                var lastPageIndex = totalPages;

                if( self.thumbPageIndex < 1 ) $('#move-left').hide();
                else $('#move-left').show();

                if( self.thumbPageIndex > lastPageIndex-2 ) $('#move-right').hide();
                else $('#move-right').show();
            },

            
        });

        // Returns the View class
        return ShareTwitter;

    }

);