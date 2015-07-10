// Collection.js
// -------------
define(["jquery","backbone","models/FBPhoto"],

  function($, Backbone, FBPhoto) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: FBPhoto,
    
      parse: function(response) {      	
      	return response;
      },
           
    });

    // Returns the Model class
    return Collection;

  }

);
