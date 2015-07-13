// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/upload-facebook.html", "text!templates/photo.html", 'collections/FBPhotos'],

    function($, Backbone, Model, template, friendTemplate, Friends){
        
        var UploadFacebook = Backbone.View.extend({

            // The DOM Element associated with this view
            el                    : "#upload-facebook-container",
            thumbPageIndex        : 0,
            shifting              : null,
            scrolling             : false,
            animating             : false,
            currentSwipeDirection : 'none',

            // View constructor
            initialize: function() {   
                var self = this;  
                
                self.listenTo(self.model.facebook, 'change:photos', self.render);

                //facebook api loading in... 
                
                
                this.render();      
            },
            
            // View Event Handlers
            events: {
                'click #sharing-nav .email' :'onEmailShareClick',
                'click .photo'              :'onPhotoClick',
                'click #move-right'         :'onRightClick',
                'click #move-left'          :'onLeftClick',
                'click .back'               :'onBackClick',                
                'swipe'                     :'onSwipe',
                'dragEnd'                   :'onSwipe',
                'click #test'               : 'testPhotoUpload',
            },            

            // Renders the view's template to the UI
            render: function() {
                
               var self = this;

                //self.$el = $('#sharing-facebook');
                // Setting the view's template using the template method
                self.template = _.template(template, {shareMethod:'Facebook'});

                // Dynamically updates the UI with the view's template
                self.$el.html(self.template).fadeIn();                

                $('#ok').on("click", function(e){
                    self.onOKClick(e);
                });

                $('#ok-after').on("click", function(e){
                    self.onOKAfterClick(e);
                });

                $('#photo-wrap').on('scrollstop', function(e){ self.onScrollStop(e); });
                $('#photo-wrap').on('scroll', function(e){ self.onScroll(e); });
                
                if(self.model.facebook.get('photos')) self.renderPhotos();

                return this;
            },
            
            testPhotoUpload: function(e) {
                var url ="https://scontent-dfw1-1.xx.fbcdn.net/hphotos-xtp1/v/t1.0-9/11665498_10152810240946895_8821017623086265598_n.jpg?oh=8df975a6e306e1d46b23446e395b0772&oe=560F4F2A";
                this.model.set({'tempImageURL':url, 'uploadSource':'facebook'});
                window.router.navigate('positioning', true);
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

            renderPhotos: function() {

                var self = this, col = 0, row = 0, index = -1, page = 0, prevCol,
                    $colEl = $('<div class="col"></div>'),
                    $pageEl = $('<div class="page"></div>');

                $('#photo-container').empty();
                
                $('#photo-container').append($pageEl);
               
                self.model.facebook.get('photos').each(function(photo) {  
                   
                    var f = _.template(friendTemplate, photo.toJSON());                   
                    index++;
                    row  = index % 4;
                    col  = Math.floor(index / 4);
                    page = col % 2;

                    // preload images (in case we aren't visible yet)
                    var img = new Image();
                    // load the image
                    img.src = photo.get('src');

                    if(row == 0) {
                        $colEl = $('<div class="col"></div>');
                    }

                    if( page == 0 & col > prevCol  ) {
                        $pageEl = $('<div class="page"></div>');
                        $('#photo-container').append($pageEl);
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
                var perPage    = 8,
                    total       = this.model.facebook.get('photos').length;

                var totalPages = Math.ceil(total/perPage);
                var $container = $('#photo-container');
                $container.css({'width':totalPages * ($container.find('.page').width()) });

                $('body').css({'min-height':$(window).height()});   
                $('#fb-photo-selection').css({'min-height':$(window).height()});   
            },

            share: function(mId){
                var self = this;
                //self.render();

                self.$el.fadeIn();
                $('#photo-selection').fadeIn();
                $('.share-result').fadeOut();
                
                // we arlready have friends, hide the spinner
                if(this.model.get('FBuserId') && this.model.facebook.get('photos')) {
                    $('#main-loading-spinner').fadeOut(300);                
                } else {
                    $('#main-loading-spinner').fadeIn(300);
                }     

                self.updateNavArrows();
            },
            
            onPhotoClick: function(e) {                
                var self = this;
                var id = $(e.currentTarget).attr('data-id');
                // self.postToFacebook(friendID);
                
                var selected = this.model.facebook.get('photos').find(function(model) { return model.get('pid') == id; });

                self.model.set({'tempImageURL':selected.get('src_big'), 'uploadSource':'facebook'});

                window.router.navigate('positioning', true);
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
                window.navigate('upload', true);
            },

            onScrollStop: function(e) {
                
                var self = this;
                                
                self.scrolling = false;

                if( self.animating  ) return;

                if(self.currentSwipeDirection != undefined && self.currentSwipeDirection != 'none') {
                    self.shiftThumbs(self.currentSwipeDirection);
                } else {
                    self.thumbPageIndex = self.updateCurrentPageIndex();
                    var targX = $($('#photo-container').find('.page')[self.thumbPageIndex]).position().left;
                    self.thumbsTargetX = Math.ceil(targX);                   
                    self.animating = true;
                    $('#photo-wrap').animate({ 'scrollLeft' : self.thumbsTargetX }, 300, function(){ 
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
                var $container = $('#photo-container');
                
                // update current page by X position (if they swiped a big swipe)
                var curX = $('#photo-wrap').scrollLeft();
                
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
                    $container  = $('#photo-container'),
                    $wrap       = $('#photo-wrap'),
                    targX       = 0,
                    pageW       = Math.ceil($wrap.width())+16,
                    perPage     = 9;

                var total = this.model.facebook.get('photo').length;
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
                    perPage       = 8;

                var totalFriends  = this.model.facebook.get('photos').length;
                var totalPages    = $('#photo-container').find('.page').length;//Math.floor(totalFriends/perPage);
                var lastPageIndex = totalPages;

                if( self.thumbPageIndex < 1 ) $('#move-left').hide();
                else $('#move-left').show();

                if( self.thumbPageIndex > lastPageIndex-2 ) $('#move-right').hide();
                else $('#move-right').show();
            },

            close: function() {
                this.$el.fadeOut().empty();
            },
            
        });

        // Returns the View class
        return UploadFacebook;

    }

);















// var curFirstCol_fb=1;
// var curFirstCol_gp=1;
// var totalCols_fb=0;
// var totalCols_gp=0;
// var maxCols=3;
// var maxRows=3;

// function createSelectPhotos(_fromWhichSN, _callback){ //"fb", "gp"
//     var photos=(_fromWhichSN=="fb")?(fbPhotos):(gpPhotos);
//     createSelectPhotos_step1();
    
//     function createSelectPhotos_step1(){ //<=== createAllPhotoThumbs
//         var myDiv = document.getElementById("photoThumbs_"+_fromWhichSN);
//         var newHTML = '';
//         for(var i=1; i<=photos.length; i++){
//             newHTML += '<div class="photoThumb photoThumb_'+i+'" onclick="choosePhotoThumb('+i+', \''+_fromWhichSN+'\')">';
//             newHTML += '  <div class="photoThumbBG photoThumbBG_'+curLang+'"></div>';
//             newHTML += '  <div class="photoThumbImg" id="photoThumbImg_'+_fromWhichSN+'_'+i+'"></div>';
//             newHTML += '  <div class="photoThumbCover"></div>';
//             newHTML += '</div>';
//         }
//         myDiv.innerHTML =newHTML;
//         displayAllPhotoThumbs(_fromWhichSN, maxCols, maxRows, createSelectPhotos_done);
//     } 
//     function createSelectPhotos_done(){
//         if(_callback !=null) _callback();
//     }
// }
// function displayAllPhotoThumbs(_fromWhichSN, _maxCols, _maxRows, _callback){ //"fb", "gp"
//     maxCols=_maxCols;
//     maxRows=_maxRows;
//     if(_fromWhichSN=="fb"&&fbPhotos==null) return;
//     if(_fromWhichSN=="gp"&&gpPhotos==null) return;
//     var photos=(_fromWhichSN=="fb")?(fbPhotos):(gpPhotos);
//     this["totalCols_"+_fromWhichSN]=(photos.length%_maxRows==0)?(photos.length)/_maxRows:(photos.length+(_maxRows-photos.length%_maxRows))/_maxRows;
    
//     var totalCols=(_fromWhichSN=="fb")?(totalCols_fb):(totalCols_gp);
//     $("#selPhotoArrow_back_"+_fromWhichSN).css("display", "block"); 
//     $("#selPhotoArrow_back_"+_fromWhichSN).css("opacity", "0.5"); 
//     $("#selPhotoArrow_back_"+_fromWhichSN).css("pointer-events", "none"); 
//     $("#selPhotoArrow_next_"+_fromWhichSN).css("display", "block");
//     $("#selPhotoArrow_next_"+_fromWhichSN).css("opacity", "1"); 
//     $("#selPhotoArrow_next_"+_fromWhichSN).css("pointer-events", "auto"); 
//     $("#selPhotoArrow_back_"+_fromWhichSN).css("margin-top", ((125*_maxRows+10*(_maxRows-1))-77)/2+"px"); 
//     $("#selPhotoArrow_next_"+_fromWhichSN).css("margin-top", ((125*_maxRows+10*(_maxRows-1))-77)/2+"px"); 
//     $("#selPhotoArrow_next_"+_fromWhichSN).css("left", ( 77+50+(125*_maxCols+10*(_maxCols-1))+50 )+"px");  
//     $("#selPhotoThumbs_"+_fromWhichSN).css("width", (125*_maxCols+10*(_maxCols-1))+"px"); 
//     $("#selPhotoThumbs_"+_fromWhichSN).css("height", (125*_maxRows+10*(_maxRows-1))+"px"); 
//     $("#allSelPhotoItems_"+_fromWhichSN).css("width", ( 77+50+(125*_maxCols+10*(_maxCols-1))+50+77 )+"px"); 
//     if(totalCols<=_maxCols){
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("display", "none"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("display", "none"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("left", ( 77+50+(125*totalCols+10*(totalCols-1))+50 )+"px");  
//         $("#selPhotoThumbs_"+_fromWhichSN).css("width", (125*totalCols+10*(totalCols-1))+"px"); 
//         $("#allSelPhotoItems_"+_fromWhichSN).css("width", ( 77+50+(125*totalCols+10*(totalCols-1))+50+77 )+"px");
//     }
    
//     this["curFirstCol_"+_fromWhichSN]=1;
//     $("#photoThumbs_"+_fromWhichSN).css("left", "0px"); 
//     for(var i=1; i<=photos.length;i++){
//         var curCol=(i%_maxRows==0)?( i/_maxRows ):( (i+(_maxRows-i%_maxRows))/_maxRows );
//         var curRow=(i%_maxRows==0)? (_maxRows):(i%_maxRows);
//         $("#photoThumbs_"+_fromWhichSN+" .photoThumb_"+i).css("left", ( (curCol-1)*135 )+"px"); 
//         $("#photoThumbs_"+_fromWhichSN+" .photoThumb_"+i).css("top", ( (curRow-1)*135 )+"px"); 
//     }
    
//     var _lastId=Math.min(photos.length, maxCols*maxRows);
//     loadAllPhotoThumbs( _fromWhichSN, _lastId, displayAllPhotoThumbs_done);
//     function displayAllPhotoThumbs_done(){
//         if(_callback !=null) _callback();
//     }
// }

// function loadAllPhotoThumbs(_fromWhichSN, _lastId, _callback){ //"fb", "gp"
//     var photos=(_fromWhichSN=="fb")?(fbPhotos):(gpPhotos);
//     var _firstId=photos.loadedThumbs+1;
//     if(_firstId > _lastId){
//         if(_callback !=null) _callback();
//     }else{
//         loadPhotoThumb(_firstId);
//         console.log("=====> "+_firstId+"  "+_lastId);
//     }
    
//     function loadPhotoThumb(_id){
//         var maskImg = new Image();
//         maskImg.src = photos[_id-1].thumbUrl;
//         maskImg.onload=function(){
//             var scale=Math.max(125/maskImg.width, 125/maskImg.height);
//             var newWidth=maskImg.width*scale;
//             var newHeight=maskImg.height*scale;
//             var newX=-(newWidth-125)/2;
//             var newY=-(newHeight-125)/2;
//             $("#photoThumbImg_"+_fromWhichSN+"_"+_id).css("background-image", "url("+photos[_id-1].thumbUrl+")"); 
//             $("#photoThumbImg_"+_fromWhichSN+"_"+_id).css("background-size", newWidth+"px "+newHeight+"px"); 
//             $("#photoThumbImg_"+_fromWhichSN+"_"+_id).css("background-position", newX+" "+newY); 
//             if(_id==_lastId) {
//                 photos.loadedThumbs=_lastId;
//                 if(_callback !=null) _callback();
//             }else{
//                 loadPhotoThumb(_id+1);
//             }
//         }
//     }
// }

// function movePhotoThumbs(_dir, _fromWhichSN){
//     var totalCols=(_fromWhichSN=="fb")?(totalCols_fb):(totalCols_gp);
//     this["curFirstCol_"+_fromWhichSN]+=_dir;
//     if(this["curFirstCol_"+_fromWhichSN] <=1) this["curFirstCol_"+_fromWhichSN]=1;
//     if(this["curFirstCol_"+_fromWhichSN] >=(totalCols-maxCols)+1) this["curFirstCol_"+_fromWhichSN]=(totalCols-maxCols)+1;
  
//     var curFirstCol=(_fromWhichSN=="fb")?(curFirstCol_fb):(curFirstCol_gp);
//     $("#photoThumbs_"+_fromWhichSN).css("left", -1*(curFirstCol-1)*135+"px"); 
//     if(curFirstCol==1){
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("opacity", "0.5"); 
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("pointer-events", "none"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("opacity", "1"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("pointer-events", "auto"); 
//     }else if(curFirstCol==(totalCols-maxCols)+1){
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("opacity", "1"); 
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("pointer-events", "auto"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("opacity", "0.5"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("pointer-events", "none"); 
//     }else{
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("opacity", "1"); 
//         $("#selPhotoArrow_back_"+_fromWhichSN).css("pointer-events", "auto"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("opacity", "1"); 
//         $("#selPhotoArrow_next_"+_fromWhichSN).css("pointer-events", "auto"); 
//     }
    
//     var photos=(_fromWhichSN=="fb")?(fbPhotos):(gpPhotos);
//     var _lastId=Math.min( photos.length, (curFirstCol+maxCols-1)*maxRows );
//     loadAllPhotoThumbs( _fromWhichSN, _lastId, null);
// }
// function choosePhotoThumb(_id, _fromWhichSN){
//     var curPhotoUrl=(_fromWhichSN=="fb")?(fbPhotos[_id-1].photoUrl):(gpPhotos[_id-1].photoUrl);
//     OC_ET.event((_fromWhichSN=="fb")?"ce7":"ce8");
//     closePopwin("popwin_selectPhoto");
//     upload_image_to_touchCanvas(curPhotoUrl, null, (curLang=="cn")?(true):(false));
// }