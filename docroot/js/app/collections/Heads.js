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
        var maxHeads = 5;
        if(this.currentHead) index = this.currentHead.get('index') + 1;
        if(index >= maxHeads) index = 0;
        var head;

        // we know this is an old head
        if(this.at(index))  {
          head = this.at(index);
          head.clear();
          head.set({'index':index});
        } else {
          head = new Head({'index':index});
        }

        this.add(head);
        this.currentHead = head;
        return head;
      },
          
    });

    // Returns the Model class
    return Collection;

  }

);
