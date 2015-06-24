// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Message = Backbone.Model.extend({
            
            config: null,

            // Model Constructor
            initialize: function(options) {
                this.config = options.config;
                this.fetch({dataType:'xml'});  
            },

            url: function() {
                return '//'+this.config.baseURL +"/php/api/playScene/doorId="  +this.config.doorId +"/clientId=" +this.config.clientId +"/mId=" +this.config.messageId;
            },

            // Default values for all of the Model attributes
            defaults: {               
            },

            parse: function(data) {
                var parsed = {};    
                var $video = $(data).find('assets').find('video');
                parsed.videoURL = $video.text();        
                var extraData = decodeURIComponent($(data).find('extradata').text());  
                // too brute --  
                var selectedVideo = extraData.substr(extraData.indexOf('selectedVideo')+14,extraData.indexOf('selectedVideo')+15);
               // console.log('selectedVideo: '+extraData);
                selectedVideo = selectedVideo.split('=').join('').split('&').join('');
                parsed.selectedVideo = selectedVideo || '1';
                // convert each element to JSON element
                // $(data).find('data').children().each(function (index) {     
                //     var nodeName        = $(this)[0].localName;
                //     parsed[nodeName]    = $(this).text();                                                        
                // });
                
                return parsed;  
            },
    
            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {

            }

        });

        // Returns the Model class
        return Message;

    }

);
