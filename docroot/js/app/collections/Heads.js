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
        var index = this.models.length;
        var head = new Head({'id':index});
        var maxHeads = 5;
        if(this.models.length >= maxHeads) {
          //remove first head, replace with this one
        }
        this.add(head);
        return head;
      },
          
    });

    // Returns the Model class
    return Collection;

  }

);
