// Model.js
// --------
define(["jquery", "backbone"],

    function($, Backbone) {

        // Creates a new Backbone Model class object
        var Settings = Backbone.Model.extend({

            config: null,
            
            // Model Constructor
            initialize: function(options) {
                this.config = options.config;                
                this.fetch({dataType:'xml'});
            },

            url: function(){
                return '//'+ this.config.baseURL +"/" +this.config.appDirectory +"/xml/settings.xml"              
            },
        
            parse: function(data) {
                var parsed = [];    
                
                // convert each element to JSON element
                $(data).find('data').children().each(function (index) {     
                    var nodeName        = $(this)[0].localName;
                    parsed[nodeName]    = $(this).text();                                                        
                });
                
                return parsed;                  
            },

            // Default values for all of the Model attributes
            defaults: {               
            },
    
            // Gets called automatically by Backbone when the set and/or save methods are called (Add your own logic)
            validate: function(attrs) {
                console.log('validating: '+attrs);
            }

        });

        // Returns the Model class
        return Settings;

    }

);
