// Names.js
// --------


// Collection.js
// -------------
define(["jquery","backbone","models/BadWord", 'utils/OC_Utils'],

    function($, Backbone, BadWord, OC_Utilities) {

    var Names = Backbone.Collection.extend({
        
        model       : BadWord,
        config      : null,        

        initialize: function(models, options) {                    
            this.config = options.config;         
            this.fetch({dataType:'xml', reset:true});
        },

        isBadWord: function (word){
            if(OC_Utilities.isUndefined(word))
              return false;

            var n = this.findWhere({'word': word});           
            return !OC_Utilities.isUndefined(n);
        },

        url: function(){
            return '//'+ this.config.baseURL +'/php/ttsAPI/getBadWords/doorId='+this.config.doorId;
        },

        parse: function(data) {
            var parsed = [];

            $(data).find("WORD").each(function (index) {                
               parsed.push({'word':$(this).text()});
            });

            return parsed;                  
        },


    });

    // Returns the Collection class
    return Names;

  }

);