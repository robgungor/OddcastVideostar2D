// Model.js
// --------
define(["jquery", "backbone", "collections/Names",  "models/Settings", "collections/BadWords"],

    function($, Backbone, Names, Settings, BadWords) {

        // Creates a new Backbone Model class object
        var App = Backbone.Model.extend({
            
            config: null,
            settings: null,
            names: null,
            friends: null,
            badWords: null,
            // Model Constructor
            initialize: function(options) {                
                this.settings   = new Settings(     {config:options.config});
                this.names      = new Names([],     {config:options.config});
                this.badWords   = new BadWords([],  {config:options.config})

                this.config     = options.config;
            },

            // Default values for all of the Model attributes
            defaults: {
                'selectedVideo':'',    
                'videoURL':''            
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
            getSelectedName: function(){
                return this.names.getNameBySpelling(this.get('toName'));                
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
                  url: '//host.oddcast.com/api_misc/1281/api.php',                 
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
            }

        });

        // Returns the Model class
        return App;

    }

);
