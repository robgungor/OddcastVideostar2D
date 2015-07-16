define(['backbone', 'underscore'], function(Backbone, _) {

  var OC_Utilities = {

	  isValidEmail : function (email) {
	    var re = /^.+@.+?\.[a-zA-Z]{2,3}$/;
	    return re.test(email);
	  },

	  isArray : function (obj){
	    return (toString.call(obj) === "[object Array]")   
	  },

	  isDefined : function (x){
	    return (typeof x !== 'undefined');
	  },

	  isUndefined : function (x){
	    return (typeof x === 'undefined');
	  },


	  getFirstKey : function (obj){
	      if(isArray(obj) && obj.length>0)
	        return 0;
	     
	      for(i in obj){
	        return i;
	      }
	      
	      return null;
	  },

	  getFirstElement : function (obj){
	    var tmp = getFirstKey(obj);
	     if(tmp!=null)
	      return obj[tmp];

	    return null;
	  },


	  getRandomKey : function (obj){
	    var rnd = Math.floor(Math.random()*99999999);
	    
	    if(this.isArray(obj)){
	      rnd = rnd%(obj.length-1)
	      return rnd;
	    }

	    rnd = rnd%(Object.keys(obj).length-1)

	    var ctr = 0;
	    for(i in obj){
	      if(ctr==rnd)
	        return i;
	      ctr++;
	    }
	      
	    return null;
	  },

	  getRandomElement : function (obj){
	    var tmp = this.getRandomKey(obj);
	    if(tmp!=null)
	      return obj[tmp];

	    return null;
	  },

	  
	  getOrdinal : function (n){

	    if(n>13)
	      n = n%10;

	    if(n==1)
	      return "st"
	    else if(n==2)
	      return "nd"
	    else if(n==3)
	      return "rd"
	    else
	      return "th"
	  },


	  getUrl : function (purl, pdata, pasync, cb) {

	      var type = "GET";
	      if(pdata)
	        type = "POST";

	      if(!pdata){
	        pdata = {}
	      }

	      if(pasync)
	        pasync = true;
	      else
	        pasync = false;

	      var response =  $.ajax({
	          //crossDomain: false,
	          //headers: {'X-Requested-With': 'XMLHttpRequest'},
	          type: type,
	          data: pdata,
	          url: purl,
	          async: pasync,
	          dataType : 'text',
	          beforeSend: function(xhr, opts){
	            
	          
	          },
	          complete: function(data, textStatus, errorThrown) { 
	           
	            //console.log(data.responseText); 
	            if(cb!=undefined && _.isFunction(cb) )cb(data.responseText);  
	          }
	      }).responseText;

	      
	      return response;
	    },


	  convertObjectToQueryString : function (obj){
	      var ret = "";
	      for(var i in obj){
	        ret += i +"=" +obj[i] +"&"
	      }

	      return ret;
	    },


	  isIos : function() {
	      if(navigator.userAgent.match(/(iphone|ipad|ipod)/gi));//isaac modified for uppper or lower case
	        return true;

	      return false;
	   },

	  isAndroid : function() {
	      if(navigator.userAgent.match(/(android)/gi));//isaac modified for uppper or lower case
	        return true;

	      return false;
	   },
	  

	  getIphoneVersion : function() {

	    var ver = 0;
	    if(navigator.userAgent.match(/(iPhone)/i)){
	        ver = 3;

	        if(window.devicePixelRatio==2 && window.screen.height==480)
	          ver = 4;

	        if(window.devicePixelRatio==2 && window.screen.height==568)
	          ver = 5;
	    }

	    return ver;
	  }

	}


  return OC_Utilities;
});