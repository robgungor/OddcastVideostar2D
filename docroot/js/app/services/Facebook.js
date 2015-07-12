// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/share-facebook.html", "text!templates/friend.html", 'collections/Friends', 'collections/FBPhotos'],

    function($, Backbone, Model, template, friendTemplate, Friends, FBPhotos){
        
        var Facebook = Backbone.Model.extend({

            config: null,
            settings: null,
            app: null,
            callback: null,
            onConnectedCallback: null,
            // Model Constructor
            initialize: function(options) {
                this.config = options.config;     
                this.settings = options.settings;
                this.app = options.app;

                this.getConnectState();

                //this.loadSDK();
            },

            // Default values for all of the Model attributes
            defaults: {               
            },

            // function clickUploadBtn_fb(){
            //         if(curLang=="cn"){ 
            //             clickUploadBtn_renren();
            //         }else{
            //             if(fbPhotos==null){
            //                 if(fbcAccessToken==null || fbcAccessToken==""){
            //                     fbStatusCallback=clickUploadBtn_fb_step2;
            //                     fbcLogin();
            //                 }else{
            //                     clickUploadBtn_fb_step2();
            //                 }
            //             }else{
            //                 clickUploadBtn_fb_step3();
            //             }
            //         }
                    
            //         function clickUploadBtn_fb_step2(){
            //             displayProgress_fake(1,98,null,100);
            //             fbStatusCallback=clickUploadBtn_fb_step2b;
            //             fbcGetPicturesFromAlbums();
                        
            //             function clickUploadBtn_fb_step2b(){
            //                 createSelectPhotos("fb", clickUploadBtn_fb_step3);
            //             }
            //         }
            //         function clickUploadBtn_fb_step3(){
            //             if(fbPhotos.length==0){
            //                 openAlertWin(OC.getDynamicErrorMessage("mobile004", "There is no photo in your renren account!"));
            //                 hideProgress();
            //             }else{
            //                 showOtherPage("selectPhotoPage_fb");
            //                 hideProgress_fake(null);
            //             }
            //         }
            //     }

            parse: function(response) {               
                return response;
            },
    
            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            },

            postToFacebook : function (friendID) {
                var self = this;
                var obj = {
                    /*display: 'touch',*/
                    method: 'feed',
                    //link: this._fbPost.link,
                    link: "http://host-d.oddcast.com/fbrd.html?ocu=" +encodeURIComponent(self.app.getMessageLink()),
                    picture: self.settings.get('FACEBOOK_POST_IMAGE_URL'), 
                    name: self.settings.get('FACEBOOK_POST_NAME'), 
                    caption: self.settings.get('FACEBOOK_POST_CAPTION'), 
                    description: self.settings.get('FACEBOOK_POST_DESCRIPTION'),
                    to: friendID
                };

                FB.ui(obj, function(event){
                    OC_ET.event("edfbc");
                    if(window.postedToFacebook){
                        OC_ET.event("uiebfb");
                        OC_ET.event("ce9");
                        try {
                            if(self.config.messageId.length > 4) {
                                OC_ET.embed_session = 2;
                                OC_ET.event("uiebfb");
                            }
                        } catch(e) {}
                        self.onPostedToFacebook(event);
                    }
                });
            },

            onPostedToFacebook: function(event){
                // $('.share-in').fadeOut();
                // $('.share-result').fadeIn();
            },

            //facebook api loading in... 
            loadSDK: function() {
                var self = this;        

                // var fbcRequestStreamPermissions = false;
                // var fbcRequestEmailPermissions = false;
                // var fbcRequiredApplicationPermissions = "user_photos";
                // var fbcApplicationKey = "115894191772758";
                console.log('self.config.fbcAppKey: '+self.config.fbcAppKey);
                (function(d, debug){
                    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
                    if (d.getElementById(id)) {return;}
                    js = d.createElement('script'); js.id = id; js.async = true;
                    js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js#xfbml=1&appId="+self.config.fbcAppKey;
                    ref.parentNode.insertBefore(js, ref);

                }(document, /*debug*/ true));

                window.fbAsyncInit = function() { 
                   self.getConnectState();
                   // FB.init({appId: self.config.fbcAppKey, status: true, cookie: true});
                };
            },

            /*
            Function: fbcGetConnectState

            This is the initialization function and the first function to call before making any other calls. If FB object is not initialied, it is initialized first then login status is sent to the callback function fbcSetConnectState
            */
            getConnectState: function () {
                var self = this;                                
                
                $.getScript('//connect.facebook.net/en_US/sdk.js', function(){
                    FB.init({
                            appId: fbcApplicationKey , 
                            status: true, 
                            cookie: true, 
                            xfbml: true,
                            logging: false,
                            /*authResponse: true,*/
                            oauth  : true,
                            version: "v1.0"
                            });
                            
                    FB.Canvas.setAutoGrow();                                                        

                    FB.Event.subscribe('auth.login', function(response) {                    
                        //if (response.status == "connected") {   
                        if (response.authResponse && response.authResponse.userID != undefined) {
                            self.onConnected(response.authResponse.userID, response);
                        } else {
                            self.onNotConnected();
                        }
                    });
                          
                    FB.Event.subscribe('auth.logout', function(response) {
                        //fbcAlert("auth.logout:" +fbcArrayToXML(response));
                        self.onNotConnected();
                    });
                      
                      
                     FB.Event.subscribe('edge.create', function(response) {
                        if(response){
                            // fbcAlert(response);
                            // fbcCallFlash("fbcSetUserLiked", response);  
                        }
                      });
                      
                    FB.getLoginStatus(function(response) {                   
                      if (response.status == "connected") {   
                        self.onConnected(response.authResponse.userID, response);
                      } else {  
                        self.onNotConnected();
                      }
                    }); 

                })
                 
            },

            /*
            Function: onConnected

            This function is called when the user logs in to facebook. The callback function fbcSetConnectState is called with the userId of the logged in user
            */
            onConnected: function (user_id, response) {
                var self = this;

                self.set({'FBuserId':user_id});
                if (user_id == null || user_id == undefined) {
                }
                else {
                    self.set({'FBAccessToken':response.authResponse.accessToken});
                    if(self.onConnectedCallback) self.onConnectedCallback();
                    self.onConnectedCallback = null;
                    //self.getFriendsInfo(true);
                }
            },
     
            /*
            Function: fbcOnNotConnected

            This function is called when the user logs out or is not already logged in to facebook. The callback function fbcSetConnectState is called with the userId of 0.
            */
            onNotConnected: function() {
                //this.userId = 0;    
                // console.log('onNotConnected'); 
                // this.login();       
            },

            /*
            Function: login

            This function pops-up the login window for facebook. If the user is already loggeg in it pop-up first and then close automatically. 
            If the application is not installed it will prompt for "Request for Permission" dialog. The default permissions will be over written
            if fbcRequiredApplicationPermissions is defined. fbcRequiredApplicationPermissions can be set from application attributes.
            */
            login: function() {
                var self = this;

                // if we have already logged in and have a friends list don't login
                //if(self.get('FBuserId') && self.get('friends')) {
                if(self.get('FBuserId')) {
                    $('#main-loading-spinner').fadeOut(300);
                    return;
                }

                //http://developers.facebook.com/docs/authentication/permissions
                
                var strPermissions = "";
                //User related permissions  
                //user_about_me is appended at the end
                //strPermissions+= "user_activities, user_birthday, user_education_history, user_events, user_groups, user_hometown,";
                //strPermissions+= "user_interests, user_likes, user_location, user_notes, user_photo_video_tags, user_photos,";
                //strPermissions+= "user_relationships, user_relationship_details, user_religion_politics, user_status, user_videos, user_website, user_work_history, ";
                //strPermissions+= "read_stream, ";
                //strDefaultPermissions+= "user_checkins, user_online_presence, ";
                //strDefaultPermissions+= "email, read_friendlists, read_insights, read_mailbox, read_requests, xmpp_login, ads_management, ";
                        
                //Friends related permissions
                //strPermissions+= "friends_about_me, friends_activities, friends_birthday, friends_education_history, friends_events, friends_groups, friends_hometown, ";
                //strPermissions+= "friends_interests, friends_likes, friends_location, friends_notes, friends_photo_video_tags, friends_photos, ";
                //strPermissions+= "friends_relationships, friends_relationship_details, friends_religion_politics, friends_status, friends_videos, friends_website, friends_work_history, ";
                //strDefaultPermissions+= "friends_checkins, friends_online_presence, ";
                strPermissions+= "user_photos";                 
                            
                               
                FB.login(function(response) {
                    if (response.status == "connected") {     
                        self.onConnected(response.authResponse.userID, response);
                    } else {
                        self.onNotConnected();
                    }
                }, {scope:strPermissions});

            },
     
            /*
            Function: fbcLogout

            Logs out the user from facebook.

            */
            logout: function() {
                FB.logout(function(response){});
            },

            /*
            Function: fbcGetAccessToken

            The access_token to make external calls on behalf of the user is sent to fbcSetAccessToken. If the user is not logged in, null access token is passed.
            */
            getAccessToken: function() {
                //console.log(fbcAccessToken);
            },

            /*
            Function: fbcGetFriendsInfo

            The user information for the logged in user's friends are sent to fbcSetFriendsInfo.
            fields: uid, name, pic_square, pic_big, current_location, hometown_location, sex, meeting_sex, relationship_status

            Parameters:
                
                bIncludeYourSelf - Boolean flag to include the logged in user in the result list. A positive value should include logged in user.
                nNumberOfFriends - Max number of friends to include in the result.
                
            Returns:
                
            See Also:

                <fbcGetUserInfo>
                <fbcProcessFqlRequest>  
                <fbcCallFlash>
            */
            getFriendsInfo: function (bIncludeYourSelf, nNumberOfFriends) {

                var self = this;

                var strQueryLimit = '';
                if(nNumberOfFriends!=undefined)
                    strQueryLimit = ' LIMIT ' +nNumberOfFriends;
                    
                var strFQLfields = "";
                strFQLfields += "uid, name, pic_square, pic_big, current_location, hometown_location, sex, meeting_sex, relationship_status ";
                
                //var strFQL = 'SELECT uid, name, pic_square, pic_big, current_location, sex, meeting_sex FROM user WHERE ( uid IN ';
                var strFQL = 'SELECT ' +strFQLfields +' FROM user WHERE ( uid IN ';
                strFQL += ' ( SELECT uid2 FROM friend WHERE uid1=\'' +self.get('FBuserId') +'\' )';
             
                if (bIncludeYourSelf != undefined && bIncludeYourSelf == true) {
                    strFQL += ' OR uid=\'' + self.get('FBuserId') + '\'';
                }
                
                strFQL += ' ) '; //end of user id restrictions
             
                strFQL += ' AND strlen(pic_square)>7  ';
                strFQL += ' AND strpos(name, "\'")<0  ';
                
                strFQL += ' AND (strlen(current_location)<1 OR (';      
                strFQL += '     strpos(current_location.city, "\'")<0  ';   
                strFQL += ' AND strpos(current_location.state, "\'")<0  ';
                strFQL += ' AND strpos(current_location.country, "\'")<0  ';
                strFQL += ' AND strpos(current_location.zip, "\'")<0  )) '; 
                
                strFQL += ' ORDER BY name DESC ' +strQueryLimit;
                
                var cb = _.bind(self.onGotFriendsInfo, self);
                self.processFqlRequest(strFQL, cb);
            },

            loadPhotos: function(cb) {
                var self = this;
                
                if(cb) self.callback = cb;                

                if(self.get('FBuserId')) {
                   self.getPicturesFromAlbums();
                } else {

                    self.onConnectedCallback = _.bind(self.getPicturesFromAlbums, self);
                    self.login();
                }
            },



            /*
            Function: fbcGetPicturesFromAlbums

            Picture information from all albums of the requested user are sent to fbcSetProfileAlbum. The requested user might not be tagged in these pictures.
            fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

            Parameters:
                
                strFriendId - userId of the user
                nNumberOfPictures - Max number of pictures to include.
                    
            Returns:
                
            See Also:

                <fbcGetSubjectsFromPictureId>
                <fbcGetUserPictures>
                <fbcGetProfileAlbumCover>
                <fbcProcessFqlRequest>  
                <fbcCallFlash>
            */
            getPicturesFromAlbums: function(strFriendId, nNumberOfPictures) {
                
                var self = this;

                var requestedId = self.get('FBuserId');
                
                if(typeof strFriendId != 'undefined' && strFriendId.length > 0)
                    requestedId = strFriendId;
                
                var strQueryLimit = '';
                if(nNumberOfPictures!=undefined)
                    strQueryLimit = 'LIMIT ' +nNumberOfPictures;
                    
                var strFQLfields = "";
                strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
                strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
                    
                var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE aid IN ';
                strFQL += ' ( SELECT aid FROM album WHERE owner=\'' +requestedId +'\' )';
                //strFQL += ' AND strlen(src_big)>7 ';  
                strFQL += ' ORDER BY created DESC ' +strQueryLimit;

                var cb = _.bind(self.setPicturesFromAlbums, self);
                self.processFqlRequest(strFQL, cb);
             
            },

            setPicturesFromAlbums: function (result){
                
                var self = this;

                var photos = new FBPhotos();
                photos.set(result);

                self.set({'photos':photos});    
                if(self.callback) self.callback();
                self.callback = null; 
                     
            },

            getAllPictures: function(nNumberOfPictures) {
                var self = this;

                var strQueryLimit = '';
                if(nNumberOfPictures!=undefined)
                    strQueryLimit = 'LIMIT ' +nNumberOfPictures;
                    
                var strFQLfields = "";
                strFQLfields += "place_id, pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
                strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
                
                var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE pid IN ';
                strFQL += ' ( SELECT pid FROM photo_tag WHERE subject=\'' + self.get('FBuserId') +'\' ) ';
                strFQL += ' or pid IN ';
                strFQL += ' (SELECT pid FROM photo ';
                strFQL += ' WHERE aid IN (SELECT aid FROM album ';
                strFQL += ' WHERE owner=\'' + self.get('FBuserId') +'\' AND type!=\'profile\' ) ';
                strFQL += ')';
                strFQL += ' ORDER BY created DESC ' + strQueryLimit;
                
                var cb = _.bind(self.setUserPictures, self);
                self.processFqlRequest(strFQL, cb);

            },

            setUserPictures: function(result) {

               

            },            

            

            /*
            Function: fbcProcessFqlRequest

            A wrapper function to make an FQL request to the facebook server. The result of the query is converted to XML and then passed to the specified function.
            If the result is not valid then fbcERRORRESPONSE is passed.

            Parameters:

                strFQL - FQL query string
                strCallBackName - The function name of the flash object to pass the query result.
                
            Returns:
                
            See Also:

                <fbcArrayToXML> 
                <fbcCallFlash>
            */
            processFqlRequest: function (strFQL, callback) {
                
                FB.api(
                {
                  method: 'fql.query',
                  query: strFQL
                },
                    function(result) {

                        callback(result);
                    }
                );
            },


            

         });

        // Returns the View class
        return Facebook;

    }

);









