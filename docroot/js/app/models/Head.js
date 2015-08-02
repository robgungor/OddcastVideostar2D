// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Head = Backbone.Model.extend({

            
            // Model Constructor
            initialize: function() {
                
            },

            // Default values for all of the Model attributes
            defaults: {               
            },

            parse: function(response) {               
                console.log(response);
                return response;
            },
    
            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            },

            /*
            Uploads base64Encoded file and gets a temp location url
            */
            uploadImage : function (base64File, callback) {
              var self = this;

              var sessionID = self.__getSessionId(true);
        
              $.ajax({
                  //crossDomain: false,
                  //headers: {'X-Requested-With': 'XMLHttpRequest'},
                  type: 'POST',
                  data: {FileDataBase64:base64File},
                  url: "//" + OC_CONFIG.baseURL + "/api/upload_v3.php?extension=png&convertImage=true&sessId=" +sessionID, 
                  url: "//"+OC_CONFIG.baseURL +"/api_misc/"+OC_CONFIG.doorId+"/generate-video.php", 
                  //http://host-vd.oddcast.com/api_misc/1300/generate-video.php?doorId=1300&clientId=299&videoId=1                
                  //'//host.oddcast.com/'+self.config.baseURL+'/api_misc/1281/api.php',                 
                  async: true,
                  //dataType : 'xml',
                  dataType : 'text',
                  beforeSend: function(xhr, opts){
                    
                  
                  },
                  complete: function(data, textStatus, errorThrown) { 
                    
                    var url = $(data.responseText).attr('URL');
                    //self.set({'videoURL':url});
                    self.getUploadedURL(sessionID);
                    if(callback!=undefined) callback(url);  
                  }
              });

              // if(tmp!="OK"){
              //   //errorCaught(null, "upload_v3.php: " +tmp);
              //   alert("ERROR UPLOADING");
              //   $('#main-loading-spinner').hide();
              //   return null;
              // }
             
            },

            getUploadedURL: function(sessionID, callback) {
              // tmp = OC_Utilities.getUrl("//" + OC_CONFIG.baseURL + "/api/getUploaded_v3.php?sessId=" +sessionID, {}, true, callback);
              // tmp = OC_Parser.getXmlDoc(tmp);
              // tmp = OC_Parser.getXmlNode(tmp, "FILE")
              // tmp = OC_Parser.getXmlNodeAttribute(tmp, 'URL');

              var self = this;

              $.ajax({
                  //crossDomain: false,
                  //headers: {'X-Requested-With': 'XMLHttpRequest'},
                  type: 'GET',
                  data: {sessId:sessionID},
                  url: OC_CONFIG.baseURL + "/api/getUploaded_v3.php",             
                  //http://host-vd.oddcast.com/api_misc/1300/generate-video.php?doorId=1300&clientId=299&videoId=1                
                  //'//host.oddcast.com/'+self.config.baseURL+'/api_misc/1281/api.php',                 
                  async: true,
                  dataType : 'xml',
                  
                  beforeSend: function(xhr, opts){
                    
                  
                  },
                  complete: function(data, textStatus, errorThrown) { 
                    
                    console.log("DATA: "+data);
                    self.set({'src':src});
                    if(callback!=undefined)callback(url);  
                  }
              });
              
            },

            _sessionId: false,

            __getSessionId : function (createNew) {
              if(this._sessionId == false || createNew){
                this._sessionId = new Date().getTime();
                this._sessionId += this.__S4() +this.__S4() +this.__S4() +this.__S4() +this.__S4() +this.__S4();
                this._sessionId = this._sessionId.substring(0,32);
              }
              return this._sessionId;
            },

            __S4 : function () {
              return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }

        });

        // Returns the Model class
        return Head;

    }

);
