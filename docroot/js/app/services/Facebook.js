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

                this.loadSDK();
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
                            if(self.model.config.messageId.length > 4) {
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
                };
            },

            /*
            Function: fbcGetConnectState

            This is the initialization function and the first function to call before making any other calls. If FB object is not initialied, it is initialized first then login status is sent to the callback function fbcSetConnectState
            */
            getConnectState: function () {
                var self = this;                                
                
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
                strPermissions+= "public_profile, user_friends, user_photos";                 
                            
                               
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
                strFQL += ' ( SELECT uid2 FROM friend WHERE uid1=\'' +self.model.get('FBuserId') +'\' )';
             
                if (bIncludeYourSelf != undefined && bIncludeYourSelf == true) {
                    strFQL += ' OR uid=\'' + self.model.get('FBuserId') + '\'';
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
                                
                self.processFqlRequest(strFQL, function(result){ self.onGotFriendsInfo(result); });
            },

            loadPhotos: function() {
                var self = this;

                if(self.get('FBuserId')) {
                   self.getPicturesFromAlbums();
                } else {
                    self.onConnectedCallback = function() {
                        self.getPicturesFromAlbums();
                    }
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
                
                if(strFriendId!=undefined)
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
                
                self.processFqlRequest(strFQL, function(result){ self.setPicturesFromAlbums(result); });
            },

            setPicturesFromAlbums: function (result){
            //console.log("fbcSetUserPictures: ");
            //console.log(result)

                // fbPhotos=new Array();
                // fbPhotos.loadedThumbs=0;
                // for(i=0; i<result.length; i++){

                //     var strBig = result[i]['src_big']
                //     var strSmall = result[i]['src_small']   

                //     console.log("strBig:" +strBig +" small:" +strSmall)
                    
                //     var fbPhotoObj=new Object();
                //     fbPhotoObj.thumbUrl=strSmall;
                //     fbPhotoObj.photoUrl=strBig;
                //     fbPhotos.push(fbPhotoObj);
                // }
                var self = this;

                var photos = new FBPhotos();
                photos.set(result);

                self.set({'photos':photos});            
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











// /**
// * @author ugur bozkaya 20100823
// * Graph API version
// * Updated 20101116
// */
 
// /*
// document: Oddcast Facebook Connect API

// facebookconnectV2.js needs to be included to provide an API between a flash object and facebook connect API. The name of the default browser object to communicate with is *"flashObj"*
// and can be changed using <fbcSetFlashObjectId> function. 

// The first function to initialize the facebook connect API and get the status of the current user is <fbcInitialize> which is an alias for <fbcGetConnectState>. 
// Depending on the response of this function <fbcLogin> and <fbcGetUserInfo> can be called to access the basic user information.

// Function calls are asynchronous. For example when <fbcGetConnectState> is called, corresponding callback function will be called when the result is ready.
// Callback function names are always derived from the called function name. <fbcGetConnectState> will send its result to fbcSetConnectState asynchronously.


// Updated: 12/13/2010 Ugur Bozkaya

// 20101213 -> fbcPublishFeedStory is added. fbcPublishImageStream and fbcPublishFlashStream are deprecated.
// 20111207 -> http video(swf) urls are replaced with https links
// */


// var fbcUserId = -1;
// var fbcFlashReady = -1;
// var fbcERRORRESPONSE = "<xml><response result=\"ERROR\"/></xml>";
// var fbcErrorAlert = -1;
// var fbcFlashObjectId = "flashObj";
// var fbcAccessToken = "";


// var fbcFormat = "xml";
// var fbcVersion = "v1.0";


// function fbcSetFormat(strIn){
//     if(strIn == 'json')
//         fbcFormat = 'json';

//     /* console.log('fbcFormat: ' +fbcFormat) */
// }


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public HTML Related Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////

// /*
// Function: fbcSetFlashObjectId

// Sets the name of the flash object that is accessed through  window[movieName] or window.document[movieName]

// Parameters:     

//     strId - window or document name of the flash object.  
    
// Returns:

// See Also:

//     <fbcCallFlash>
//     <fbcGetFlashMovie>

// */
// function fbcSetFlashObjectId(strId)
// {
//     fbcFlashObjectId = strId;
// }

 
// /*
// Function: fbcSwitchAlertMode

// Toggles the debugging mode. When alert mode is turned on debug messages will pop up during function calls

// Parameters:

// Returns:

// See Also:

//     <fbcAlert>

// */
// function fbcSwitchAlertMode()
// {
//     if (fbcErrorAlert > 0) {
//         fbcErrorAlert = 0;
//         fbcAlert("Alert mode is OFF!");
//     }
//     else {
//         fbcErrorAlert = 1;
//         fbcAlert("Alert mode is ON!");
//     }
// }
 


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public Initialization Related Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////



// /*
// Function: fbcInitialize

// Alias for fbcGetConnectState. 

// See Also:

//     <fbcGetConnectState>

// */
// function fbcInitialize(){fbcGetConnectState()}


// /*
// Function: fbcGetConnectState

// This is the initialization function and the first function to call before making any other calls. If FB object is not initialied, it is initialized first then login status is sent to the callback function fbcSetConnectState

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize>
//     <fbcOnConnected>
//     <fbcOnNotConnected>
// */
// function fbcGetConnectState() {
                        
//     if(fbcFlashReady<1) {
//         fbcFlashReady = 1;
        
//         FB.init({
//                 appId: fbcApplicationKey , 
//                 status: true, 
//                 cookie: true, 
//                 xfbml: true,
//                 logging: false,
//                 /*authResponse: true,*/
//                 oauth  : true,
//                 version: fbcVersion
//                 });
        
        
//         FB.Event.subscribe('auth.login', function(response) {
//             fbcAlert("auth.login:" +fbcArrayToXML(response));
//             //if (response.status == "connected") {   
//             if (response.authResponse && response.authResponse.userID != undefined) {
//                 fbcOnConnected(response.authResponse.userID, response);
//             } else {
//                 fbcOnNotConnected();
//             }
//           });
              
//         FB.Event.subscribe('auth.logout', function(response) {
//             fbcAlert("auth.logout:" +fbcArrayToXML(response));
//             fbcOnNotConnected();
//         });
          
          
//          FB.Event.subscribe('edge.create', function(response) {
//             if(response){
//                 fbcAlert(response);
//                 fbcCallFlash("fbcSetUserLiked", response);  
//             }
//           });
          


        
//         FB.getLoginStatus(function(response) {
//             fbcAlert("getLoginStatus");
//           if (response.status == "connected") {   
//             fbcOnConnected(response.authResponse.userID, response);
//           } else {  
//             fbcOnNotConnected();
//           }
//         }); 
        
    
//     }     
// }


// /*
// Function: fbcOnConnected

// This function is called when the user logs in to facebook. The callback function fbcSetConnectState is called with the userId of the logged in user

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize>
//     <fbcGetConnectState>
//     <fbcOnNotConnected>
// */
// function fbcOnConnected(user_id, response) {
        
//     fbcAlert("fbcOnConnected=====> connected");
//     fbcAlert("fbcOnConnected: " +user_id);
        
//     fbcFlashReady = 1;  
//     fbcUserId = user_id;
//     if (user_id == null || user_id == undefined) {
//     }
//     else {
//         fbcAccessToken = response.authResponse.accessToken;
//         fbcCallFlash("fbcSetConnectState", fbcUserId);
//     }
// }
 

// /*
// Function: fbcOnNotConnected

// This function is called when the user logs out or is not already logged in to facebook. The callback function fbcSetConnectState is called with the userId of 0.

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize>
//     <fbcGetConnectState>
//     <fbcOnConnected>
// */
// function fbcOnNotConnected() {
//     fbcAlert("fbcOnNotConnected=====> notconnected");  
//     fbcAlert("fbcOnNotConnected: ");
    
//     fbcFlashReady = 1;
//     fbcUserId = 0;
//     fbcCallFlash("fbcSetConnectState", fbcUserId);
// }


// /*
// Function: fbcLogin

// This function pops-up the login window for facebook. If the user is already loggeg in it pop-up first and then close automatically. 
// If the application is not installed it will prompt for "Request for Permission" dialog. The default permissions will be over written
// if fbcRequiredApplicationPermissions is defined. fbcRequiredApplicationPermissions can be set from application attributes.

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize> 
//     <fbcGetConnectState>
//     <fbcLogout>
//     <fbcOnConnected>
//     <fbcOnNotConnected>
// */
// function fbcLogin() {
//     //http://developers.facebook.com/docs/authentication/permissions
//     /*
//     strDefaultPermissions = "publish_stream, ";
//     strDefaultPermissions += "user_about_me, friends_about_me, user_photo_video_tags, friends_photo_video_tags, user_photos, friends_photos";
//     strDefaultPermissions += ", friends_location, user_location, read_stream";
//     */
    
//     var strDefaultPermissions = "";
//     //User related permissions  
//     //user_about_me is appended at the end
//     strDefaultPermissions+= "user_activities, user_birthday, user_education_history, user_events, user_groups, user_hometown,";
//     strDefaultPermissions+= "user_interests, user_likes, user_location, user_notes, user_photo_video_tags, user_photos,";
//     strDefaultPermissions+= "user_relationships, user_relationship_details, user_religion_politics, user_status, user_videos, user_website, user_work_history, ";
//     strDefaultPermissions+= "read_stream, ";
//     //strDefaultPermissions+= "user_checkins, user_online_presence, ";
//     //strDefaultPermissions+= "email, read_friendlists, read_insights, read_mailbox, read_requests, xmpp_login, ads_management, ";
            
//     //Friends related permissions
//     strDefaultPermissions+= "friends_about_me, friends_activities, friends_birthday, friends_education_history, friends_events, friends_groups, friends_hometown, ";
//     strDefaultPermissions+= "friends_interests, friends_likes, friends_location, friends_notes, friends_photo_video_tags, friends_photos, ";
//     strDefaultPermissions+= "friends_relationships, friends_relationship_details, friends_religion_politics, friends_status, friends_videos, friends_website, friends_work_history, ";
//     //strDefaultPermissions+= "friends_checkins, friends_online_presence, ";
    
//     //Optional Ones
//     try{
//         if(fbcRequestEmailPermissions)
//             strDefaultPermissions+= "email, ";
//     }catch(err){}
    
//     try{
//         if(fbcRequestStreamPermissions) 
//             strDefaultPermissions+= "publish_stream, "; 
//     }catch(err){}
    
//     try{
//         if(fbcRequestCheckinPermissions)
//             strDefaultPermissions+= "user_checkins, friends_checkins, ";
//     }catch(err){}

    
//     strDefaultPermissions+= "user_about_me";
    
//     //If the permissions are not set just use the default permissions
//     strPermissions = strDefaultPermissions;
        
//     try{    
//         if(typeof(fbcRequiredApplicationPermissions)==undefined){
//             //strPermissions = strDefaultPermissions;
//         }else{
//             strTemp = '';
//             strTemp += fbcRequiredApplicationPermissions;
            
//             if(strTemp.length>4){           
//                 strPermissions = fbcRequiredApplicationPermissions;
//             }
//         }
//     }catch(err){
//         strPermissions = strDefaultPermissions;
//     }   
        
    
//     fbcAlert(strPermissions);
//     FB.login(function(response) {
//     if (response.status == "connected") {     
//         fbcOnConnected(response.authResponse.userID, response);
//       } else {
//         fbcOnNotConnected();
//       }
//     }, {scope:strPermissions});

// }
 

// /*
// Function: fbcLogout

// Logs out the user from facebook.

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize> 
//     <fbcGetConnectState>
//     <fbcLogin>
//     <fbcOnConnected>
//     <fbcOnNotConnected>
// */
// function fbcLogout() {
//     FB.logout(function(response){});
// }


    


// /*
// Function: fbcGetAccessToken

// The access_token to make external calls on behalf of the user is sent to fbcSetAccessToken. If the user is not logged in, null access token is passed.

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize> 
//     <fbcGetConnectState>
//     <fbcLogin>
// */
// function fbcGetAccessToken() {
//     fbcCallFlash("fbcSetAccessToken", fbcAccessToken);
//     //console.log(fbcAccessToken);
// }






// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public User Related Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////


// /*
// Function: fbcGetLoggedInUser

// The userId of the logged in user is sent to fbcSetLoggedInUser. If the user is not logged in, a userId of 0 is passed.

// Parameters:
    
// Returns:

// See Also:

//     <fbcInitialize> 
//     <fbcGetConnectState>
//     <fbcLogin>
// */
// function fbcGetLoggedInUser() {
//     fbcCallFlash("fbcSetLoggedInUser", fbcUserId);
// }


// /*
// Function: fbcGetUserInfo

// The user information of the logged in user is sent to fbcSetUserInfo.
// fields: uid, first_name, middle_name, last_name, name, pic_small, pic_big, pic_square, pic, affiliations, profile_update_time, 
// timezone, religion, birthday, birthday_date, sex, hometown_location, meeting_sex, meeting_for, relationship_status, significant_other_id, 
// political, current_location, activities, interests, is_app_user, music, tv, movies, books, quotes, about_me, hs_info, education_history, 
// work_history, notes_count, !!wall_count, status, has_added_app, online_presence, locale, proxied_email, profile_url, email_hashes, 
// pic_small_with_logo, pic_big_with_logo, pic_square_with_logo, pic_with_logo, allowed_restrictions, verified, profile_blurb, family, username, 
// website, is_blocked, contact_email, email

// Parameters:
    
// Returns:
    
// See Also:

//     <fbcGetDetailedUserInfo>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetUserInfo() {
    
//     //FB.Data._waitToProcess = function (){if(FB.Data.timer<0)FB.Data.timer=setTimeout('FB.Data._process(0)',10);}
//     //wall_count, education_history,family,has_added_app,status,hs_info, username,work_history,
//     var strFQLfields = "";
//     strFQLfields += "uid, first_name, middle_name, last_name, name, pic_small, pic_big, pic_square, pic, affiliations, profile_update_time, ";
//     strFQLfields += "timezone, religion, birthday, birthday_date, sex, hometown_location, meeting_sex, meeting_for, relationship_status, ";
//     strFQLfields += "significant_other_id, political, current_location, activities, interests, is_app_user, music, tv, movies, books, quotes, ";
//     strFQLfields += "about_me,    notes_count,   online_presence, ";
//     strFQLfields += "locale, proxied_email, profile_url, email_hashes, pic_small_with_logo, pic_big_with_logo, pic_square_with_logo, ";
//     strFQLfields += "pic_with_logo, allowed_restrictions, verified, profile_blurb,  website, is_blocked, contact_email, email";
    
//     //var strFQL = 'SELECT uid, name, pic_square, pic_big, current_location, sex FROM user WHERE uid=' +fbcUserId
//     var strFQL = 'SELECT ' +strFQLfields +' FROM user WHERE uid=' +fbcUserId
//     var strCB = 'fbcSetUserInfo';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetDetailedUserInfo

// The detailed user information for the requested user is sent to fbcSetDetailedUserInfo.
// fields: uid, first_name, middle_name, last_name, name, pic_small, pic_big, pic_square, pic, affiliations, profile_update_time, 
// timezone, religion, birthday, birthday_date, sex, hometown_location, meeting_sex, meeting_for, relationship_status, significant_other_id, 
// political, current_location, activities, interests, is_app_user, music, tv, movies, books, quotes, about_me, hs_info, education_history, 
// work_history, notes_count, wall_count, status, has_added_app, online_presence, locale, proxied_email, profile_url, email_hashes, 
// pic_small_with_logo, pic_big_with_logo, pic_square_with_logo, pic_with_logo, allowed_restrictions, verified, profile_blurb, family, username, 
// website, is_blocked, contact_email, email

// Parameters:
    
//     strFriendId - The userId of the user to get the detailed information.
    
// Returns:
    
// See Also:

//     <fbcGetUserInfo>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetDetailedUserInfo(strFriendId) {
     
    
//     var strFQLfields = "";
//     strFQLfields += "uid, first_name, middle_name, last_name, name, pic_small, pic_big, pic_square, pic, affiliations, profile_update_time, ";
//     strFQLfields += "timezone, religion, birthday, birthday_date, sex, hometown_location, meeting_sex, meeting_for, relationship_status, ";
//     strFQLfields += "significant_other_id, political, current_location, activities, interests, is_app_user, music, tv, movies, books, quotes, ";
//     strFQLfields += "about_me, hs_info, education_history, work_history, notes_count, wall_count, status, has_added_app, online_presence, ";
//     strFQLfields += "locale, proxied_email, profile_url, email_hashes, pic_small_with_logo, pic_big_with_logo, pic_square_with_logo, ";
//     strFQLfields += "pic_with_logo, allowed_restrictions, verified, profile_blurb, family, username, website, is_blocked, contact_email, email";
    
//     /*
//     strFQLfields += "uid, name, current_location, sex, meeting_sex, birthday, hometown_location, education_history, "
//     strFQLfields += "books, activities, interests, movies, music, political, relationship_status, "
//     strFQLfields += "significant_other_id, work_history, tv, family"
//     */
    
//     var strFQL = 'SELECT ' +strFQLfields +' FROM user WHERE uid=\'' +strFriendId +'\''
//     var strCB = 'fbcSetDetailedUserInfo';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetFriendsInfo

// The user information for the logged in user's friends are sent to fbcSetFriendsInfo.
// fields: uid, name, pic_square, pic_big, current_location, hometown_location, sex, meeting_sex, relationship_status

// Parameters:
    
//     bIncludeYourSelf - Boolean flag to include the logged in user in the result list. A positive value should include logged in user.
//     nNumberOfFriends - Max number of friends to include in the result.
    
// Returns:
    
// See Also:

//     <fbcGetUserInfo>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetFriendsInfo(bIncludeYourSelf, nNumberOfFriends) {
        
//     var strQueryLimit = '';
//     if(nNumberOfFriends!=undefined)
//         strQueryLimit = ' LIMIT ' +nNumberOfFriends;
        
//     var strFQLfields = "";
//     strFQLfields += "uid, name, pic_square, pic_big, current_location, hometown_location, sex, meeting_sex, relationship_status ";
    
//     //var strFQL = 'SELECT uid, name, pic_square, pic_big, current_location, sex, meeting_sex FROM user WHERE ( uid IN ';
//     var strFQL = 'SELECT ' +strFQLfields +' FROM user WHERE ( uid IN ';
//     strFQL += ' ( SELECT uid2 FROM friend WHERE uid1=\'' +fbcUserId +'\' )';
 
//     if (bIncludeYourSelf != undefined && bIncludeYourSelf == true) {
//         strFQL += ' OR uid=\'' + fbcUserId + '\'';
//     }
    
//     strFQL += ' ) '; //end of user id restrictions
 
//     strFQL += ' AND strlen(pic_square)>7  ';
//     strFQL += ' AND strpos(name, "\'")<0  ';
    
//     strFQL += ' AND (strlen(current_location)<1 OR (';      
//     strFQL += '     strpos(current_location.city, "\'")<0  ';   
//     strFQL += ' AND strpos(current_location.state, "\'")<0  ';
//     strFQL += ' AND strpos(current_location.country, "\'")<0  ';
//     strFQL += ' AND strpos(current_location.zip, "\'")<0  )) '; 
    
//     strFQL += ' ORDER BY name DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetFriendsInfo';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetUserFanInfo

// The relationship between the user and the page is sent to fbcSetUserFanInfo. If the user is not a fan then an error message is returned.
// fields: uid, page_id, type

// Parameters:
    
//     strUserId   - Id of the user
//     strPageId   - Id of the page.
        
// Returns:
    
// See Also:

//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetUserFanInfo(strUserId, strPageId) {

//     var strFQL = 'SELECT uid, page_id, type FROM page_fan WHERE uid=' +strUserId +' AND page_id=' +strPageId;   
//     var strCB = 'fbcSetUserFanInfo';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetUsersEmail

// The email of the logged in user is passed to fbcSetUsersEmail. This would require extended permissions. 
// The email address might be a real or a proxied email address. 
// fields: email
// Note: With the new api (facebookconnectV2.js) you don't need to make a seperate call to this function if you have already called one of
// these functions <fbcGetFriendsInfo>, <fbcGetDetailedUserInfo>, <fbcGetUserInfo>. They contain the same field.

// Parameters:
        
// Returns:
    
// See Also:

//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetUsersEmail() {
        
//     var strFQL = 'SELECT email FROM user WHERE uid=\'' +fbcUserId +'\'';    
//     var strCB = 'fbcSetUsersEmail';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public Photo Related Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////


// /*
// Function: fbcGetUserPictures

// Ids of the pictures that the logged in user is tagged is sent to fbcSetUserPictures.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetFriendsPictures>
//     <fbcGetProfileAlbum>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetPlaceInfo(pid) {
    
//     var strFQLfields = "";
//     fbcErrorAlert = 1;
//     strFQLfields += "name,description,display_subtext,latitude,longitude,checkin_count,is_city,is_unclaimed,page_id,pic_large,type";
        
//     var strFQL = 'SELECT ' +strFQLfields +' FROM place WHERE page_id=' +pid;
//     var strCB = 'fbcSetPlaceInfo';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// function fbcGetUserPictures(nNumberOfPictures) {
    
//     var strQueryLimit = '';
//     if(nNumberOfPictures!=undefined)
//         strQueryLimit = 'LIMIT ' +nNumberOfPictures;
        
//     var strFQLfields = "";
//     strFQLfields += "place_id, pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
    
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE pid IN ';
//     strFQL += ' ( SELECT pid FROM photo_tag WHERE subject=\'' +fbcUserId +'\' ) ';
//     strFQL += ' AND strlen(src_big)>7 ';    
//     strFQL += ' ORDER BY created DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetUserPictures';
//     fbcProcessFqlRequest(strFQL, strCB);

// }
 
 
// /*
// Function: fbcGetFriendsPictures

// Ids of the pictures that the requested user is tagged is sent to fbcSetFriendsPictures.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     fbcFriendId - userId of the user
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbum>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetFriendsPictures(fbcFriendId, nNumberOfPictures) {
    
//     var strQueryLimit = '';
//     if(nNumberOfPictures!=undefined)
//         strQueryLimit = 'LIMIT ' +nNumberOfPictures;
        
//     var strFQLfields = "";
//     strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
        
//     //var strFQL = 'SELECT pid, src, src_big, src_small, created FROM photo WHERE pid IN ';
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE pid IN ';
//     strFQL += ' ( SELECT pid FROM photo_tag WHERE subject=\'' +fbcFriendId +'\' ) ';
//     strFQL += ' AND strlen(src_big)>7 ';    
//     strFQL += ' ORDER BY created DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetFriendsPictures';
//     fbcProcessFqlRequest(strFQL, strCB);
// }
 

// /*
// Function: fbcGetProfileAlbum

// Ids of the pictures that are in the profile album is sent to fbcSetProfileAlbum. The requested user might not be tagged in these pictures.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     strFriendId - userId of the user
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbumCover>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetProfileAlbum(strFriendId, nNumberOfPictures) {
    
//     var requestedId = fbcUserId;
    
//     if(strFriendId!=undefined)
//         requestedId = strFriendId;
    
//     var strQueryLimit = '';
//     if(nNumberOfPictures!=undefined)
//         strQueryLimit = 'LIMIT ' +nNumberOfPictures;
        
//     var strFQLfields = "";
//     strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
        
//     //var strFQL = 'SELECT pid, src, src_big, src_small, created FROM photo WHERE aid IN ';
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE aid IN ';
//     strFQL += ' ( SELECT aid FROM album WHERE type=\'profile\' AND owner=\'' +requestedId +'\' )';
//     //strFQL += ' AND strlen(src_big)>7 ';  
//     strFQL += ' ORDER BY created DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetProfileAlbum';
//     fbcProcessFqlRequest(strFQL, strCB);
 
// }


// /*
// Function: fbcGetProfileAlbumCover

// Id of the picture that is the cover of the profile album is sent to fbcSetProfileAlbumCover.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     strFriendId - userId of the user
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbum>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetProfileAlbumCover(strFriendId) {
    
//     var requestedId = fbcUserId;
    
//     if(strFriendId!=undefined)
//         requestedId = strFriendId;
    
//     var strFQLfields = "";
//     strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
    
//     //var strFQL = 'SELECT pid, src, src_big, src_small, created FROM photo WHERE pid IN ';
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE pid IN ';
//     strFQL += ' ( SELECT cover_pid FROM album WHERE type=\'profile\' AND owner=\'' +requestedId +'\' )';
//     strFQL += ' AND strlen(src_big)>7 ';    
    
//     var strCB = 'fbcSetProfileAlbumCover';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetSubjectsFromPictureId

// All the tag information for a specified pictureId is sent to fbcSetSubjectsFromPictureId.
// fields: pid, subject, text, xcoord, ycoord, created

// Parameters:
    
//     nPictureId - The Id of the picture.
        
// Returns:
    
// See Also:

//     <fbcGetFriendsPictures>
//     <fbcGetUserPictures>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetSubjectsFromPictureId(nPictureId){
            
//     var strFQLfields = "";
//     strFQLfields += "pid, subject, text, xcoord, ycoord, created ";
    
//     //var strFQL = 'SELECT subject, text, xcoord, ycoord FROM photo_tag WHERE pid=' +nPictureId;
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo_tag WHERE pid=' +nPictureId;
//     var strCB = 'fbcSetSubjectsFromPictureId';
//     fbcProcessFqlRequest(strFQL, strCB);
// }


// /*
// Function: fbcGetAlbumsInformation

// Information about the requested user's albums is sent to fbcSetProfileAlbum. The requested user might not be tagged in these pictures.
// fields: aid, owner, cover_pid, name, created, modified, description, location, size, link, visible, modified_major, edit_link, type, object_id, can_upload  

// Parameters:
    
//     strFriendId - userId of the user
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbumCover>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetAlbumsInformation(strFriendId) {
            
//     var requestedId = fbcUserId;
    
//     if(strFriendId!=undefined)
//         requestedId = strFriendId;
        
//     var strFQLfields = "";
//     strFQLfields += "aid, owner, cover_pid, name, created, modified, description, location, size, link, visible, modified_major, edit_link, type, object_id, can_upload";
    
//     var strFQL = 'SELECT ' +strFQLfields +' FROM album WHERE owner=\'' +requestedId +'\'';
        
//     var strCB = 'fbcSetAlbumsInformation';
//     fbcProcessFqlRequest(strFQL, strCB);
 
// }


// /*
// Function: fbcGetPicturesFromTheAlbum

// Picture information from the specified album are sent to fbcSetPicturesFromTheAlbum. The requested user might not be tagged in these pictures.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     strAlbumId  - albumId of the album <fbcGetAlbumsInformation>
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbumCover>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetPicturesFromTheAlbum(strAlbumId, nNumberOfPictures) {
    
//     var strQueryLimit = '';
//     if(nNumberOfPictures!=undefined)
//         strQueryLimit = 'LIMIT ' +nNumberOfPictures;
        
//     var strFQLfields = "";
//     strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
        
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE aid=\'' +strAlbumId +'\'';
//     strFQL += ' AND strlen(src_big)>7 ';    
//     strFQL += ' ORDER BY created DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetPicturesFromTheAlbum';
//     fbcProcessFqlRequest(strFQL, strCB);
 
// }


// /*
// Function: fbcGetPicturesFromAlbums

// Picture information from all albums of the requested user are sent to fbcSetProfileAlbum. The requested user might not be tagged in these pictures.
// fields: pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, src_big_width, src, src_height, src_width, link, caption, created, modified, object_id  

// Parameters:
    
//     strFriendId - userId of the user
//     nNumberOfPictures - Max number of pictures to include.
        
// Returns:
    
// See Also:

//     <fbcGetSubjectsFromPictureId>
//     <fbcGetUserPictures>
//     <fbcGetProfileAlbumCover>
//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetPicturesFromAlbums(strFriendId, nNumberOfPictures) {
    
//     var requestedId = fbcUserId;
    
//     if(strFriendId!=undefined)
//         requestedId = strFriendId;
    
//     var strQueryLimit = '';
//     if(nNumberOfPictures!=undefined)
//         strQueryLimit = 'LIMIT ' +nNumberOfPictures;
        
//     var strFQLfields = "";
//     strFQLfields += "pid, aid, owner, src_small, src_small_height, src_small_width, src_big, src_big_height, ";
//     strFQLfields += "src_big_width, src, src_height, src_width, link, caption, created, modified, object_id ";
        
//     var strFQL = 'SELECT ' +strFQLfields +' FROM photo WHERE aid IN ';
//     strFQL += ' ( SELECT aid FROM album WHERE owner=\'' +requestedId +'\' )';
//     //strFQL += ' AND strlen(src_big)>7 ';  
//     strFQL += ' ORDER BY created DESC ' +strQueryLimit;
    
//     var strCB = 'fbcSetPicturesFromAlbums';
//     fbcProcessFqlRequest(strFQL, strCB);
 
// }


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public Stream Related Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////


// /*
// Function: fbcGetStreams

// The streams for the logged in user is passed to fbcSetStreams.
// fields: post_id, viewer_id, app_id, source_id, updated_time, created_time, filter_key, attribution, actor_id, target_id, message, app_data, action_links, attachment, comments, likes, privacy, type, permalink

// Parameters:
        
//     nNumberOfStreams - Max number of streams
    
// Returns:
    
// See Also:

//     <fbcProcessFqlRequest>  
//     <fbcCallFlash>
// */
// function fbcGetStreams(nNumberOfStreams) {
    
//     var nNumberOfStreams = parseInt(nNumberOfStreams);
//     if(isNaN(nNumberOfStreams))
//         nNumberOfStreams = 10;
    
        
//     var strQueryLimit = '';
//     if(nNumberOfStreams>0)
//         strQueryLimit = ' LIMIT ' +nNumberOfStreams;
    
//     var strFQLfields = "";
//     strFQLfields += "post_id, viewer_id, app_id, source_id, updated_time, created_time, filter_key, attribution, actor_id, target_id, ";
//     strFQLfields += "message, app_data, action_links, attachment, comments, likes, privacy, type, permalink ";
 
//     //var strFQL = 'SELECT post_id, viewer_id, app_id, source_id, updated_time, created_time, filter_key, attribution, actor_id, target_id, message ';
//     //strFQL += ' FROM stream WHERE ';
//     var strFQL = 'SELECT ' +strFQLfields +' FROM stream WHERE ';    
//     //strFQL += ' filter_key in (SELECT filter_key FROM stream_filter WHERE uid = ' +fbcUserId +')';
//     strFQL += ' source_id=\'' +fbcUserId +'\' ';    
//     //strFQL += '  ORDER BY created_time DESC ';
//     strFQL += '  ' +strQueryLimit;
        
//     var strCB = 'fbcSetStreams';
//     fbcProcessFqlRequest(strFQL, strCB);
// }






// /*
// Function: fbcPublishFeedStory

// Pops-up the feed dialog box. Prompt the user to publish an individual story to a profile's feed. This does not require any extended permissions. You can use the fbcPublishFeedStory link on the 3d_template page to see a preview of this function.

// Parameters:
        
//     strToId     - The ID or username of the profile that this story will be published to. If this is unspecified, it defaults to the the value of from.
//     strMessage  - The message to prefill the text field that the user will type in. 
//     strLink     - The link attached to this post. It must direct to the application's connect or canvas URL. (same domain)
//     strPicture  - The URL of a picture attached to this post.
//     strSwfSource - The URL of a media file (e.g., a SWF or video file) attached to this post. If both source and picture are specified, only source is used.
//     strName     - The name of the link attachment.
//     strCaption  - The caption of the link (appears beneath the link name).
//     strDescription - The description of the link (appears beneath the link caption).
//     strDisplay  - The display mode in which to render the dialog. page/popup/iframe
    
// Returns:
    
// See Also:
    
    
// */
// function fbcPublishFeedStory (strToId, strMessage, strLink, strPicture, strSwfSource, strName, strCaption, strDescription, strDisplay, strAddLink, strAddTxt)
// {   
    
//     strToId         = unescape(strToId);
//     strMessage      = unescape(strMessage);
//     strLink         = unescape(strLink);
//     strLink = "http://host-d.oddcast.com/fbrd.html?ocu=" +strLink;
    
//     strPicture      = unescape(strPicture);
//     strSwfSource    = unescape(strSwfSource);
//     if(fbcApplicationKey == "244806422205509")
//         strSwfSource    = strSwfSource.replace(/http:/i, "https:")
//     strName         = unescape(strName);
//     strCaption      = unescape(strCaption);
//     strDescription  = unescape(strDescription);

//     fbcAlert(strToId +'\n' +strMessage +'\n' +strLink +'\n' +strPicture +'\n' +strSwfSource +'\n' 
//         +strName +'\n' +strCaption +'\n' +strDescription +'\n' +strDisplay +'\n' +strAddLink +'\n' +strAddTxt);
    
//     //If we want to add additional links we can add them here in properties array.
//     //if(strAddLink != undefined && strAddTxt != undefined) {   
//     if(fbcIsNonEmptyString(strAddLink) && fbcIsNonEmptyString(strAddTxt)) {
//         var FeedStoryArray = {  'method': 'feed',
//                                 "properties": [{
//                                                   "name": "link", 
//                                                   "text": strAddTxt,
//                                                   "href": strAddLink 
//                                                }]
//                             };
//     } else {
//         var FeedStoryArray = {'method': 'feed'};
//     }       
    
//     strDisplay = "popup";
    
//     if(strDisplay!=undefined)
//         FeedStoryArray['display'] = strDisplay; 

    

        
//     if(strToId!=undefined)
//         FeedStoryArray['to'] = strToId; 
//     if(strMessage!=undefined)
//         FeedStoryArray['message'] = strMessage;     
//     if(strLink!=undefined)
//         FeedStoryArray['link'] = strLink;   
//     if(strPicture!=undefined)
//         FeedStoryArray['picture'] = strPicture;     
//     if(strSwfSource!=undefined)
//         FeedStoryArray['source'] = strSwfSource;
//     if(strName!=undefined)
//         FeedStoryArray['name'] = strName;
//     if(strCaption!=undefined)
//         FeedStoryArray['caption'] = strCaption;
//     if(strDescription!=undefined)
//         FeedStoryArray['description'] = strDescription;
    
//     FB.ui(FeedStoryArray, function(response) {
//         if (response && response.post_id) {
//             fbcAlert('Post was published.' +response.post_id);
//             fbcCallFlash("fbcPublishFeedStoryCB", response.post_id);
//         } else {
//             fbcAlert('Post was not published.');
//             fbcCallFlash("fbcPublishFeedStoryCB","");
//         }
//     });
// }







// /*
// Function: fbcPublishImageStream  THIS IS DEPRECATED - USE <fbcPublishFeedStory>

// Pops-up the stream publishing dialog that includes only image THIS IS DEPRECATED - USE <fbcPublishFeedStory>

// Parameters:
        
//     nFriendId   - UserId to post the stream to.
//     strTitle    - Title for the dialog
//     strMessageContent - Default message to show in the dialog.
//     strName - Name of the stream
//     strCaption - Caption of the stream
//     strDescription - Description of the stream
//     strImageSource - URL of the image
//     strHref - Target URL to visit when the image is clicked.
    
// Returns:
    
// See Also:

//     <fbcPublishFeedStory>   
//     <fbcPublishImageStreamSilently>
//     <fbcRandomPublishImageStreamSilently>
    
// */

// function fbcPublishImageStream (nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strImageSource, strHref)
// {   
    
//     strTitle            = unescape(strTitle);
//     strMessageContent   = unescape(strMessageContent);
//     strName             = unescape(strName);
//     strCaption          = unescape(strCaption);
//     strDescription      = unescape(strDescription);
//     strImageSource      = unescape(strImageSource);
                
//     var myAttachment = { 
//     'name':strName,
//     'caption':strCaption,
//     'description':strDescription,
//     'href':strHref, 
//     'media':[{      
//     'type': 'image', 
//     'src': strImageSource,
//     'href': strHref
//     }]};        
         
//     FB.ui(
//     {
//      method: 'stream.publish',
//      message: strMessageContent,
//      target_id: nFriendId,     
//      attachment: myAttachment,
//      user_message_prompt: strTitle
//     },
//     function(response) {
//         if (response && response.post_id) {
//             fbcAlert("debug fbcPublishImageStream published: " +strHref);
//         } else {
//             fbcAlert("debug fbcPublishImageStream was not published: " +strHref);
//         }
//     }
//     );
// }
// function fbcPublishImageStream2(nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strImageSource, strHref){
//         fbcAlert("Please use fbcPublishFeedStory, this function is deprecated!");
//         fbcPublishImageStream(nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strImageSource, strHref)
// }


// /*
// Function: fbcPublishFlashStream THIS IS DEPRECATED - USE <fbcPublishFeedStory>

// Pops-up the stream publishing dialog that includes only image and swf file THIS IS DEPRECATED - USE <fbcPublishFeedStory>

// Parameters:
        
//     nFriendId   - UserId to post the stream to.
//     strTitle    - Title for the dialog
//     strMessageContent - Default message to show in the dialog.
//     strName - Name of the stream
//     strCaption - Caption of the stream
//     strDescription - Description of the stream
//     strVideSource - URL of the swf file
//     strImageSource - URL of the image
//     strHref - Target URL to visit when the image is clicked.
//     strImgW - Width of the image
//     strImgH - Height of the image
//     strVidW - Width of the swf file
//     strVidH - Height of the swf file
//     bForcePopupWindow - Forces the dialog window to popup
    
// Returns:
    
// See Also:

//     <fbcPublishFeedStory>   
//     <fbcPublishImageStreamSilently>
//     <fbcRandomPublishImageStreamSilently>
    
// */


// function fbcPublishFlashStream(nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strVideSource, strImageSource, strHref, strImgW, strImgH, strVidW, strVidH, bForcePopupWindow, bRepeatCall)
// {   
//     //alert(nFriendId);
//     strTitle            = unescape(strTitle);
//     strMessageContent   = unescape(strMessageContent);
//     strName             = unescape(strName);
//     strCaption          = unescape(strCaption);
//     strDescription      = unescape(strDescription);
//     strVideSource       = unescape(strVideSource);
//     if(fbcApplicationKey == "244806422205509")
//         strVideSource       = strVideSource.replace(/http:/i, "https:")
//     strImageSource      = unescape(strImageSource);
    
//     //console.dir(FB)   
//     var strCallText = "fbcPublishFlashStream('"+nFriendId+"','"+ strTitle+"','"+ strMessageContent+"','"+ strName+"','"+ strCaption+"','"+ strDescription+"','"+ strVideSource+"','"+ strImageSource+"','"+ strHref+"',"+ strImgW+","+ strImgH+","+ strVidW+","+ strVidH+","+strForcePopupVal +", false)";
//     fbcAlert(strCallText);
        
//     strHref = "http://host-d.oddcast.com/fbrd.html?ocu=" +strHref;

//     var myAttachment = { 
//     'name':strName,
//     'href':strHref,
//     'caption':strCaption,
//     'description':strDescription,
//     'media':[{      
//     'type': 'flash',
//     'swfsrc':   strVideSource, 
//     'imgsrc':   strImageSource,
//     'width':           strImgW, 
//     'height':          strImgH,
//     'expanded_width':  strVidW,
//     'expanded_height': strVidH
//     }]
//     };  
    
//     //bForcePopupWindow = true;

//     var strForcePopupVal = 'false';
//     var strDisplayType = 'iframe';  
//     if(bForcePopupWindow!=undefined && (bForcePopupWindow || bForcePopupWindow>0)){
//         strDisplayType = 'popup';
//         strForcePopupVal = 'true';
//     }
    
    
    
//     FB.ui(
//     {
//      method: 'stream.publish',
//      display: strDisplayType,
//      message: strMessageContent,
//      target_id: nFriendId,     
//      attachment: myAttachment,
//      user_message_prompt: strTitle
//     },function(response){       
//         if (response && response.post_id) {
//             fbcAlert("debug fbcPublishFlashStream published: " +strHref);
//             fbcCallFlash("fbcPublishFlashStreamCB", response.post_id);
//         } else {
//             fbcAlert("debug fbcPublishFlashStream was not published: " +strHref);
//             fbcCallFlash("fbcPublishFlashStreamCB","");
//         }
//     }
//     );
    
    
//     /*
//     var strCallText = "fbcPublishFlashStream('"+nFriendId+"','"+ strTitle+"','"+ strMessageContent+"','"+ strName+"','"+ strCaption+"','"+ strDescription+"','"+ strVideSource+"','"+ strImageSource+"','"+ strHref+"',"+ strImgW+","+ strImgH+","+ strVidW+","+ strVidH+","+strForcePopupVal +", false)";
    
//     if((bRepeatCall==undefined || bRepeatCall==null) && strDisplayType == 'iframe')
//         setTimeout(strCallText, 2000);
//     */
    
// }
// function fbcPublishStream2(nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strVideSource, strImageSource, strHref, strImgW, strImgH, strVidW, strVidH){
                    
//         fbcAlert("Please use fbcPublishFeedStory, this function is deprecated!");
//         fbcPublishFlashStream(nFriendId, strTitle, strMessageContent, strName, strCaption, strDescription, strVideSource, strImageSource, strHref, strImgW, strImgH, strVidW, strVidH)
// }

// /*
// Function: fbcPublishImageStreamSilently

// Publishes stream silently in the background. It requires extended permission.

// Parameters:
        
//     nFriendId   - UserId to post the stream to.
//     strMessage -    Message to post.
//     strName - Name of the stream
//     strCaption - Caption of the stream
//     strDescription - Description of the stream
//     strImageSource - URL of the image
//     strHref - Target URL to visit when the image is clicked.
//     strSource (optional) - URL of the swf file 
    
// Returns:
    
// See Also:

//     <fbcPublishFeedStory>   
//     <fbcRandomPublishImageStreamSilently>
    
// */

// function fbcPublishImageStreamSilently(nFriendId, strMessage, strName, strCaption, strDescription, strImageSource, strHref, strSource)
// {   
//     strMessage          = unescape(strMessage);
//     strName             = unescape(strName);
//     strCaption          = unescape(strCaption);
//     strDescription      = unescape(strDescription);
//     strImageSource      = unescape(strImageSource);
//     strSource           = unescape(strSource);
                        
//     var myAttachment = {    
//     message:    strMessage,
//     picture:    strImageSource,
//     link:       strHref,
//     name:       strName,
//     caption:    strCaption,
//     description: strDescription
//     };          
    
//     if(strSource!=undefined && strSource!=null)
//         myAttachment.strSource = strSource;
    
//     FB.api('/' +nFriendId +'/feed', 'post', myAttachment, function(response) {
//         if (!response || response.error) {
//         fbcAlert('fbcPublishImageStreamSilently error: ' + fbcArrayToXML(response));
//         } else {
//         fbcAlert('fbcPublishImageStreamSilently success: ' + fbcArrayToXML(response));
//         }   
//     }); 
// }
// function fbcPublishStreamDirectly(nFriendId, strName, strCaption, strDescription, strImageSource, strHref){
//     fbcAlert("Please use fbcPublishImageStreamSilently!");
//     strMessage = "";
//     fbcPublishImageStreamSilently(nFriendId, strMessage, strName, strCaption, strDescription, strImageSource, strHref, strSource)
// }

// /*
// Function: fbcRandomPublishImageStreamSilently

// Randomly publishes stream silently in the background. It requires extended permission.

// Parameters:
        
//     nNumberOfStreams - Max number of streams to publish randomly.
//     strMessage -    Message to post.
//     strName - Name of the stream
//     strCaption - Caption of the stream
//     strDescription - Description of the stream
//     strImageSource - URL of the image
//     strHref - Target URL to visit when the image is clicked.
//     strSource (optional) - URL of the swf file 
    
// Returns:
    
// See Also:

//     <fbcPublishFeedStory>
//     <fbcPublishImageStreamSilently>
    
// */

// function fbcRandomPublishImageStreamSilently(nNumberOfStreams, strMessage, strName, strCaption, strDescription, strImageSource, strHref, strSource)
// {
//     if(nNumberOfStreams==undefined)
//         nNumberOfStreams = 25;
    
//     if(nNumberOfStreams>50)
//         nNumberOfStreams = 50;
        
//     strFQL = 'SELECT uid2 FROM friend WHERE uid1=\'' +fbcUserId +'\'';
//     FB.api(
//     {
//       method: 'fql.query',
//       query: strFQL
//     },
//     function(result) {
//         //randomize friend list
//         result.sort( fbcUtilityRandomOrder );
        
//         var nCtr = 1;           
//         for (key in result) {   
//             //fbcAlert("fbcRandomPublishImageStreamSilently: " + result[key]['uid2']);              
//             fbcPublishImageStreamSilently(result[key]['uid2'], strMessage, strName, strCaption, strDescription, strImageSource, strHref, strSource)
//             nCtr++;
//             if(nCtr>nNumberOfStreams)
//                 break;
//         }
//     }
//     );
// }

// function fbcPublishRandomStreamDirectly(nNumberOfStreams, strName, strCaption, strDescription, strImageSource, strHref){
//         fbcAlert("Please use fbcRandomPublishImageStreamSilently!");
//         strMessage = "";
//         fbcRandomPublishImageStreamSilently(nNumberOfStreams, strMessage, strName, strCaption, strDescription, strImageSource, strHref, strSource)
// }


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Public Other Facebook Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////



// /*
// Function: fbcGetFacebookAccessibility

// 1 is passed to fbcSetFacebookAccessibility if facebook domain is accessible from client, 0 otherwise.

// Parameters:
    
// Returns:
    
// See Also:
// */
// function fbcGetFacebookAccessibility() {

//     try{            
//         if(FB == undefined || FB==null){
//             fbcAlert("facebook is not accessible" +"0");
//             fbcCallFlash("fbcSetFacebookAccessibility", 0);
//         }
//         else{
//             fbcAlert("facebook is accessible");
//             fbcCallFlash("fbcSetFacebookAccessibility", 1);
//         }
//     }catch(err){
//         fbcAlert("facebook is not accessible" +"-1");
//         fbcCallFlash("fbcSetFacebookAccessibility", 0);
//     }
    
// }


// /*
// Function: fbcInviteFriends

// Shows Facebook Requests Dialog

// Parameters:
//     strTitle -  Optional, the title for the friend selector dialog. Maximum length is 50 characters.
//     strMessage - The request the receiving user will see. It appears as a question posed by the sending user. The maximum length is 255 characters.
//     strFriendIds - A user ID or username. Must be a friend of the sender. If this is specified, the user will not have a choice of recipients. If this is omitted, the user will see a friend selector and will be able to select a maximum of 50 recipients.
//     strFilters - Optional, default is '', which shows a selector that includes the ability for a user to browse all friends, but also filter to friends using the application and friends not using the application. Can also be all, app_users and app_non_users. This controls what set of friends the user sees if a friend selector is shown. If all, app_users ,or app_non_users is specified, the user will only be able to see users in that list and will not be able to filter to another list. Additionally, an application can suggest custom filters as dictionaries with a name key and a user_ids key, which respectively have values that are a string and a list of user ids. name is the name of the custom filter that will show in the selector. user_ids is the list of friends to include, in the order they are to appear.
//     strData - Optional, additional data you may pass for tracking. This will be stored as part of the request objects created.
// Returns:
    
// See Also:
// */

// function fbcInviteFriends(strTitle, strMessage, strFriendIds, strFilters, strData) {

//     var FeedStoryArray = {'method': 'apprequests'}; 
    
//     if(strTitle!=undefined && strTitle.length>0)
//         FeedStoryArray['title'] = strTitle;
        
//     if(strMessage!=undefined && strMessage.length>0)
//         FeedStoryArray['message'] = strMessage; 
    

//     if(strFriendIds!=undefined && strFriendIds.length>0)
//         FeedStoryArray['to'] = strFriendIds;
    

//     if(strFilters!=undefined && strFilters.length>0)
//         FeedStoryArray['filters'] = strFilters;
        
        
//     if(strData!=undefined && strData.length>0)
//         FeedStoryArray['data'] = strData;

//     fbcAlert(strTitle + ", " + strMessage + ", " + strFriendIds + ", " + strFilters + ", " + strData);
    
//     FB.ui(FeedStoryArray, function(response) {
//         if (response && response.post_id) {
//             fbcAlert('Post was published.' +response.post_id);
//         } else {
//             fbcAlert('Post was not published.');
//         }
//     });
    

    
// }




// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Private Utility Functions

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////


// /*
// Function: fbcUtilityRandomOrder

// Randomly generates 0 or 1 values. Used in the sort function for arrays to randomize.

// Parameters:
    
// Returns:
    
//     Integer - 0 or 1 randomly.

// See Also:

//     <fbcRandomPublishImageStreamSilently>
    
// */
// function randOrd(){ return fbcUtilityRandomOrder();} //Just an alias for fbcUtilityRandomOrder. This function is used by FLASH so don't delete it.
// function fbcUtilityRandomOrder(){   return (Math.round(Math.random())-0.5); }


// /*
// Function: fbcIsNonEmptyString

// Checks if the input is a valid string with more than one characters

// Parameters:
    
// Returns:
    
//     Boolean value.  true if the input string is not an empty string
    
// */
// function fbcIsNonEmptyString(strIn){
//     return (typeof strIn!=="undefined" && strIn!==null && strIn.length>0)
// }

// /*
// Function: fbcAlert

// A wrapper function for javascript's alert(). It will pop up input text only if the alert mode is on

// Parameters:

//     strIn - Text to display in the pop-up window
    
// Returns:

// See Also:

//     <fbcSwitchAlertMode>

// */
// function fbcAlert(strIn)
// {   
//     if(fbcErrorAlert>0){
//         if(window.console){
//             console.log(strIn)
//         }else{
//             //alert(strIn);
//         }
//         //console.log(strIn);
//     }
// }
 

// /*
// Function: fbcGetFlashMovie

// Used to get the flash object that is in the browser window to communicate with. 

// Parameters:

//     movieName - Name of the flash object
    
// Returns:
    
//     Embeded flash object in the browser window.

// See Also:

//     <fbcCallFlash>

// */
// function fbcGetFlashMovie(movieName){
        
//     var ret = document.getElementById(movieName);
//     if(ret == null)
//         ret = window.document[movieName];
//     if(ret == null)
//         ret = window[movieName];
//     if(ret == null)
//         ret = document[movieName];
    
//     return ret;
// }
 

// /*
// Function: fbcIsArray

// Identifes if the passed parameter is an array or not

// Parameters:

//     obj - variable to analyze
    
// Returns:
    
//     Boolean value.  true if the input is an array

// See Also:

//     <fbcArrayToXML>

// */
// function fbcIsArray(obj) {
//     if(obj==null || obj == undefined)
//         return false;
        
//    if (obj.constructor.toString().indexOf("bject") == -1 && obj.constructor.toString().indexOf("rray") == -1)
//       return false;
//    else
//       return true;
// }


// /*
// Function: fbcArrayToXML

// Converts the input variable into an XML string

// Parameters:

//     inputArray - variable to convert
    
// Returns:
    
//     String that contains the XML.

// See Also:

//     <fbcIsArray>

// */
// function fbcArrayToXML(inputArray)  {
 
//     var retVal = "";
//     var key ="";
    
//     try {
//         for (key in inputArray) {       
//             if(fbcIsArray(inputArray[key])) {
//                 retVal = retVal + "<" +key +">";
//                 retVal = retVal + fbcArrayToXML(inputArray[key]);
//                 retVal = retVal + "</" +key +">\n"
//             }
//             else {  
                
//                //This should strip the map node that is injected in IE7
//                if(key!="map"){  
//                    retVal = retVal + "<" +key +">";
//                    var strTempVal = inputArray[key];
//                    if (inputArray[key] != null && inputArray[key] != undefined) {
//                         //retVal = retVal + inputArray[key];
                        
//                         strTempVal = strTempVal + '';
//                         strTempVal = strTempVal.replace(/</g, " ");
//                         strTempVal = strTempVal.replace(/>/g, " ");
//                         retVal = retVal + strTempVal;                   
//                    }
//                    retVal = retVal + "</" +key +">\n";
//                }        
//             }
//         }
//     }
//     catch(err) {
//         fbcAlert("fbcArrayToXML failed!\n" +key +"\n" +inputArray[key] +"\n" +err.name +"\n" +err.message +"\n" +err.description);      
//     }
    
//     return retVal;
// }



// /*
// Function: fbcCallFlash

// Calls the specified function of the flash movie and passes the arguments. 

// Parameters:

//     strFunctionName - name of the function to call
//     strFunctionArg  - string to pass 
    
// Returns:

// See Also:

//     <fbcGetFlashMovie>

// */
// function fbcCallFlash(strFunctionName, strFunctionArg){
//     if(fbcFlashReady<1)
//         return;
        
//     fbcAlert(strFunctionName +'\n' +strFunctionArg);
    
//     try {
//         fbcGetFlashMovie(fbcFlashObjectId)[strFunctionName](strFunctionArg);
//     }
//     catch(err) {
//         fbcAlert("fbcCallFlash failed:" +strFunctionName +'\n' +strFunctionArg +'\n');
//     }
// }   


// ////////////////////////////////////////////////////////////////////////////////////////////////
// /*
// section: Private Facebook Functions

// These function should not be called directly from flash. They should be used internally.

// */
// ////////////////////////////////////////////////////////////////////////////////////////////////

// /* function to encode url in XML <src_small> and <src_big> fields */
// function encodeFacebookUri(p){
//     /* console.log('rl#3=>encodeFacebookUri'); */
    
//     /* iterate thru array */
//     for (var obj in p) {
//         if (p.hasOwnProperty(obj)) {
//             /* view each */
//             for (var key in p[obj]){
//                 if (key == 'src_big'){
//                     p[obj][key] = encodeURIComponent(p[obj][key]);
//                 }
//             }
//         }
//     }
    
//     return;
// }

// /*
// Function: fbcProcessFqlRequest

// A wrapper function to make an FQL request to the facebook server. The result of the query is converted to XML and then passed to the specified function.
// If the result is not valid then fbcERRORRESPONSE is passed.

// Parameters:

//     strFQL - FQL query string
//     strCallBackName - The function name of the flash object to pass the query result.
    
// Returns:
    
// See Also:

//     <fbcArrayToXML> 
//     <fbcCallFlash>
// */
// function fbcProcessFqlRequest(strFQL, strCallBackName) {
    
//     FB.api(
//     {
//       method: 'fql.query',
//       query: strFQL
//     },
//         function(result) {
//             if(fbcFormat == 'json'){
//                 fbcCallFlash(strCallBackName, result);
//                 return;
//             }

//             var retVal = fbcERRORRESPONSE;
//             if(result!=null && result[0]!= undefined)
//             {               
                
//                 /* is a photo request */
//                 if (strFQL.toLowerCase().indexOf('from photo ') >= 0){
//                     encodeFacebookUri(result);
//                 }
                
//                 /* make response */
//                 retVal = "<xml><response result=\"OK\">";           
//                 retVal = retVal + fbcArrayToXML(result);
//                 retVal = retVal + "</response></xml>";          
//             }
//             /* console.log('rl#1=>'+strFQL+' got=>'+JSON.stringify(result)); */
            
//             //if(strCallBackName!=undefined)
//             fbcCallFlash(strCallBackName, retVal);  
//         }
//     );
// }


