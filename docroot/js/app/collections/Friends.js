// Collection.js
// -------------
define(["jquery","backbone","models/Friend"],

  function($, Backbone, Friend) {

    // Creates a new Backbone Collection class object
    var Collection = Backbone.Collection.extend({

      // Tells the Backbone Collection that all of it's models will be of type Model (listed up top as a dependency)
      model: Friend,
    
      parse: function(response) {      	
      	return response;
      },
      
      moveUserToTopOfList: function(user_id){
        var self = this;
        
        var user = this.findWhere({'uid':user_id }); 
        
        // reorder results by name first
        self.indexBy('name');

        if(user){
          var userRef = user;
          // remove user from list
          this.remove(user);
          //add user to the front
          this.add(user, {at: 0, merge:true});
        }

      }
    });

    // Returns the Model class
    return Collection;

  }

);
