// Model.js
// --------
define(["jquery", "backbone", "collections/Names",  "models/Settings", "collections/BadWords", "collections/Heads", "services/Facebook", "utils/OC_Utils", "utils/OC_MessageSaver"],

    function($, Backbone, Names, Settings, BadWords, Heads, FacebookService, OC_Utils, OC_MessageSaver) {

        // Creates a new Backbone Model class object
        var App = Backbone.Model.extend({
            
            config: null,
            settings: null,            
            friends: null,
            badWords: null,
            facebook: null,
            // Model Constructor
            initialize: function(options) {                
                this.settings   = new Settings(     {config:options.config});            
                this.badWords   = new BadWords([],  {config:options.config})
                this.facebook   = new FacebookService( {config:options.config, settings:this.settings, app:this});
                this.heads      = new Heads([],{config:options.config});

                this.config     = options.config;
            },

            // Default values for all of the Model attributes
            defaults: {
                'tempImageURL':'',
                'isTempImageCrossdomain':false,
                'croppedImage':null,
                // maybe this could be one - but I'm making it seperate for now, rendering and sharing...
                'videoURL':'videos/1.mp4',
                'shareVideoURL':null,
                'selectedVideo':'1',
                // different model structure for this probably
                'UPLOAD_PHOTO':'UPLOAD PHOTO',
                'terms_of_use':'terms of use',
                'termsLink':'http://www.oddcast.com/terms_of_use/',
                
            },

            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            },

            getMessageLink: function (){                                
                return this.settings.get('PICKUP_URL') +"?mId="+this.get('mId')+".3";
            },

            getTwitterLink: function(){
                var self = this;

                var url = "https://twitter.com/intent/tweet?";
                url += "url=";
                url += encodeURIComponent( self.getMessageLink( self.get('mId') ) );
                url += "&text=";
                url += encodeURIComponent( self.settings.get('TWITTER_DEFAULT_TEXT') );
                
                return url;              
            },            
            fetchVideoLink: function(cb){
                var self = this;
                var _img= ''
                var imgString = "";
                var head = self.heads.currentHead;
                var _extradata=escape("isVideo=true");
                
                
                var index = 1;
                var dataObject = {
                  video: self.get('selectedVideo'),
                  doorId: 1300,//self.config.doorId,
                  clientId: self.config.clientId,
                }
                self.heads.each(function(head){
                  _img = head.get('src');
                  dataObject["img"+index] = _img;                  
                  index++;
                });

                ///http://host-d-vd.oddcast.com/api_misc/1300/generate-video.php
                $.ajax({
                  //crossDomain: false,
                  //headers: {'X-Requested-With': 'XMLHttpRequest'},
                  type: 'GET',
                  data: dataObject,
                  url: "//"+OC_CONFIG.baseURL +"/api_misc/1300/generate-video.php", 
                  //http://host-vd.oddcast.com/api_misc/1300/generate-video.php?doorId=1300&clientId=299&videoId=1                
                  //'//host.oddcast.com/'+self.config.baseURL+'/api_misc/1281/api.php',                 
                  async: false,
                  //dataType : 'xml',
                  dataType : 'text',
                  beforeSend: function(xhr, opts){
                    
                  
                  },
                  complete: function(data, textStatus, errorThrown) { 
                    
                    var url = $(data.responseText).attr('URL');
                    self.set({'videoURL':url});
                    if(cb!=undefined)cb(url);  
                  }
              })
            },
            // this should maybe be in a utility but this thang ain't MVC at this point
            sendEmail: function(){
                var self = this;
                //var here_link = "<a href='http://"+_wsSettings.baseURL +"/"+_wsSettings.appDirectory+"?mId="+isaac_mId+"'>here</a>";
                var here_link = "here (http://"+self.config.baseURL +"/"+self.config.appDirectory+"?mId="+self.get('mId')+")";
                var link = self.getMessageLink();
                self.set({'pickUpLink':link});

                var mail_href_msg = "mailto:?subject=you are a video star&";               
                mail_href_msg += 'body=Hi '+self.get('toName')+'!%0D%0A%0D%0A'+self.get('fromName')+' made you a star!%0D%0A%0D%0A';
                mail_href_msg += 'Click here to see your customized video YOU!%0D%0A%0D%0A';
                mail_href_msg += self.get('pickUpLink');

                window.top.location = mail_href_msg;          

                //Sharing via email
                OC_ET.event("edems");
                //email message sent to 1 or more recipients 
                OC_ET.event("evrcpt"); 
                OC_ET.event("ce11");
                try {
                    if(self.config.messageId.length > 4) {
                        OC_ET.embed_session = 2;
                        OC_ET.event("edems");
                    }
                } catch(e) {}    
            },

            postToTwitter : function () {
              window.open(this.getTwitterLink(), '_blank');
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

            getMID: function(callback){
              var self = this;
              var mId = self.get('mId');              
              
              if( !OC_Utils.isUndefined(mId) && !self.hasChanged('videoURL') && !self.hasChanged('croppedImage') ) {
                // if we have an mId, reuse it
                if(callback) callback();//shareView.share.apply(shareView, [mId]);
              } else {
                  var onMessageSaveComplete = function(mId){
                    console.log('onMessageSaveComplete: '+mId);
                    if(mId == null) mId = "123456";
                    // set the mId to our model so it is not forgetten about                    
                    self.set({'mId': mId});                       
                    
                    $('#main-loading-spinner').fadeOut(300);
                    
                    OC_ET.event("edsv");//Messages created

                    // pass along to next step, use apply for scope and inheritance
                    if(callback) callback();
                  }
                 
                  $('#main-loading-spinner').fadeIn(300);
                  // save our message
                  OC_MessageSaver.saveMessage(self, {}, onMessageSaveComplete);
              }

            },
           
            createFinalSharedVideo: function(){  
              var self = this;
                        
                var _img= ''
                var imgString = "";

                var _extradata=escape("isVideo=true");
                
                
                var index = 1;

                _.each(self.heads, function(head){
                  _img = head.get('croppedImage');
                  imgString += "&img"+index+"="+_img;  
                  index++;
                })
                //http://host-vd.oddcast.com/api_misc/1300/generate-video.php?doorId=1300&clientId=299&videoId=1
                var tmp = OC_Utils.getUrl("//"+OC_CONFIG.baseURL +"/api_misc/generate-video.php?doorId="+OC_CONFIG.doorId +"&clientId=" +OC_CONFIG.clientId +imgString+"&videoId="+self.get('selectedVideo'));
                //var tmp = OC_Utils.getUrl("//"+OC_CONFIG.baseURL +"/api/downloadTempVideo.php?doorId="+OC_CONFIG.doorId +"&clientId=" +OC_CONFIG.clientId +imgString+"&extraData="+_extradata);
                tmp = OC_Parser.getXmlDoc(tmp);
                var errorTmp=OC_Parser.getXmlNode(tmp, 'APIERROR');
                var okTmp=OC_Parser.getXmlNode(tmp, 'DATA');
                
                if(errorTmp != null){
                  var error_msg=unescape(OC_Parser.getXmlNodeAttribute(errorTmp, 'ERRORSTR'));
                  alert(error_msg);
                  
                }else{
                  var sessionId=OC_Parser.getXmlNodeAttribute(okTmp, 'SESSIONID');
                             
                  setTimeout(function(){  self.createFinalSharedVideo_pulling(sessionId);}, 30*1000);
                }
              
            },

            createFinalSharedVideo_pulling: function(_sessionId) {
              var self = this;
              

              var tmp = OC_Utils.getUrl("//"+OC_CONFIG.baseURL +"/api/downloadTempVideoStatus.php?sessionId="  +_sessionId);
              tmp = OC_Parser.getXmlDoc(tmp);
              var errorTmp=OC_Parser.getXmlNode(tmp, 'APIERROR');
              var okTmp=OC_Parser.getXmlNode(tmp, 'DATA');
              if(errorTmp != null){
                var error_msg=unescape(OC_Parser.getXmlNodeAttribute(errorTmp, 'ERRORSTR'));
                alert(error_msg);
                hideProgress();
              }else{
                var _status=OC_Parser.getXmlNodeAttribute(okTmp, 'STATUS');
                var _url=OC_Parser.getXmlNodeAttribute(okTmp, 'URL');
                //alert(_status);
                if(_status=="0"){
                  //console.log(_status+"  "+_url);
                  setTimeout(function(){self.createFinalSharedVideo_pulling(_sessionId);}, 2*1000);
                }else if(_status=="1"){
                  //console.log(_status+"  "+_url);
                  this.model.set({'shareVideoURL':_url, 'videoURL':_url});
                  //document.getElementById("share-video").src=_url;
                  self.createFinalSharedVideo_done();
                  OC_ET.event("edvscr");
                }
              }
            },

            createFinalSharedVideo_done: function(){
              alert('DONE!: '+this.model.get('videoURL'));
              window.router.navigate('landing');
            },
            

        });

        // Returns the Model class
        return App;

    }

);
