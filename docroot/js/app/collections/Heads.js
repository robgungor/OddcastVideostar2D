// Collection.js
// -------------
define(["jquery","backbone","models/Head"],

  function($, Backbone, Head) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Head,

      currentHead: null,
    
      parse: function(response) {      	
        console.log(response);
      	return response;
      },

      addNew: function() {
        var head = new Head();
        this.add(head);
        return head;
      },
          
    });

    // Returns the Model class
    return Collection;

  }

);
