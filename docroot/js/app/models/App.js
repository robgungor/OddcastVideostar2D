// Model.js
// --------
define(["jquery", "backbone", "collections/Names",  "models/Settings", "collections/BadWords", "services/Facebook"],

    function($, Backbone, Names, Settings, BadWords, FacebookService) {

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
                                
                $.ajax({
                  //crossDomain: false,
                  //headers: {'X-Requested-With': 'XMLHttpRequest'},
                  type: 'GET',
                  data: {
                    video: 'video_'+self.get('selectedVideo')+'_'+self.getSelectedName(),
                    from: self.get('fromName'),
                    to: self.get('toName')
                  },
                  url: '//host.oddcast.com/api_misc/1297/api.php',                 
                  //'//host.oddcast.com/'+self.config.baseURL+'/api_misc/1281/api.php',                 
                  async: true,
                  dataType : 'xml',
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

                var mail_href_msg = "mailto:?subject=You%E2%80%99ve Received a Special Valentine%E2%80%99s Day Snug&";               
                mail_href_msg += 'body=Hi '+self.get('toName')+'!%0D%0A%0D%0A'+self.get('fromName')+' sent you a Snug!%0D%0A%0D%0A';
                mail_href_msg += 'Click here to see your customized video Valentine featuring Sunggle Bear.%0D%0A%0D%0A';
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
        });

        // Returns the Model class
        return App;

    }

);
