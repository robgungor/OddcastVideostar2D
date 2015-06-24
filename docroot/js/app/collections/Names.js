// Names.js
// --------


// Collection.js
// -------------
define(["jquery","backbone","models/Name",],

    function($, Backbone, Name) {

    var Names = Backbone.Collection.extend({
        
        model       : Name,
        config      : null,
        dropDownNames : [],

        initialize: function(models, options) {                    
            this.config = options.config;        
            this.dropDownNames = [];        
            this.fetch({dataType:'xml', reset:true});
        },

        url: function(){
            return '//'+ this.config.baseURL +"/" +this.config.appDirectory +"/xml/names.xml";
        },

        parse: function(data) {
            var parsed = [];
            var self = this;
            $(data).find("name").each(function (index) {
                // there is only one node per name
                var actualName = $(this).text();
                var dropDownName = $(this).attr('dropdown');
                self.dropDownNames.push({id:dropDownName,value:dropDownName});
                
                var spellings = $(this).attr("allNames").split('|');
                // there are multiple spellings per name, but make them individual objects for future iteration
                _.each(spellings, function(val){

                    parsed.push({
                        'name'    : actualName,
                        'spelling': val.toLowerCase()
                    });               
                })
                
            });
            
            this.trigger('add:names');

            return parsed;                  
        },

        getNameBySpelling: function(spelling){
            if(spelling == undefined) return 'default';
            spelling = spelling.toLowerCase();
            var n = this.findWhere({'spelling': spelling});
            return n != 'undefined' && n != null ? n.get('name').toLowerCase() : 'default';
        }   


    });

    // Returns the Collection class
    return Names;

  }

);