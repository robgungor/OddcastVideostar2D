// MobileInit.js
// -------------

// Include Mobile Specific JavaScript files here (or inside of your Mobile router)
require(["jquery", "backbone", "routers/MobileRouter", "jqueryui","jquerymobile","backbone.validateAll"],
  function($, Backbone, MobileRouter) {
  	
  // for main bg        
    //$('#main-bg-container').css({'opacity':'1'});
    var bg = $(window).width() > 767 ? 'img/common/main-bg-ipad.jpg' : 'img/common/main-bg.jpg';

    //$('body').css({background:'url('+bg+') no-repeat', 'background-size':'cover', 'background-attachment':'fixed'});   

    $.mobile.linkBindingEnabled = false;

    // Disabling this will prevent jQuery Mobile from handling hash changes
    $.mobile.hashListeningEnabled = false;
         
    OC_ET.init(OC_CONFIG.trackingURL, {
        'apt': 'W',
        'acc': OC_CONFIG.doorId,
        'emb': '0'
    });
    // Instantiates a new Mobile Router instance
    window.router = new MobileRouter();

    // set max height to window height;
    $('body').css({'max-height':$(window).height();});

    var loadJS =  function(file, callback) {
        
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = file;

      if (script.readyState) {  // IE
        script.onreadystatechange = function() {
          if (script.readyState == "loaded" || script.readyState == "complete") {
            script.onreadystatechange = null;
            callback();
          }
        };
      } else {  // Other Browsers
        script.onload = function() {
          callback();
        };
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    };  


    // fb and twitter laoding
    window.twttr = (function (d,s,id) {
      var t, js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
      js.src="//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
      return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
    }(document, "script", "twitter-wjs"));

    twttr.ready(function (twttr) {
      twttr.events.bind('tweet', function(event) {
        if(window.postedToTwitter)
          postedToTwitter(event);
      });
    });

   
// removed from binaryajax.js
// document.write(
//   "<script type='text/vbscript'>\r\n"
//   + "Function IEBinary_getByteAt(strBinary, iOffset)\r\n"
//   + " IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\n"
//   + "End Function\r\n"
//   + "Function IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n"
//   + "  Dim aBytes()\r\n"
//   + "  ReDim aBytes(iLength - 1)\r\n"
//   + "  For i = 0 To iLength - 1\r\n"
//   + "   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n"  
//   + "  Next\r\n"
//   + "  IEBinary_getBytesAt = aBytes\r\n" 
//   + "End Function\r\n"
//   + "Function IEBinary_getLength(strBinary)\r\n"
//   + " IEBinary_getLength = LenB(strBinary)\r\n"
//   + "End Function\r\n"
//   + "</script>\r\n"
// );
    
     /* ++++++++++++++++++++++++++++++++++++++++++++
      FACEBOOK TRACKING CODE +++++++++++++++++++++++ 
     +++++++++++++++++++++++++++++++++++++++++++++++ */
    // (function () {
    //         var _fbq = window._fbq || (window._fbq = []);
    //         if (!_fbq.loaded) {
    //             var fbds = document.createElement('script');
    //             fbds.async = true;
    //             fbds.src = '//connect.facebook.net/en_US/fbds.js';
    //             var s = document.getElementsByTagName('script')[0];
    //             s.parentNode.insertBefore(fbds, s);
    //             _fbq.loaded = true;
    //         }
    //     })();
  
  
    // window.fbAsyncInit = function()
    // {
    //     FB.init
    //     (
    //         {
    //              appId: '173540005994564',
    //              status: true,
    //              cookie: true
    //         }
    //     );
    // }
    // var fbcLogin_cb;
    // var ua = navigator.userAgent.toLowerCase();

    // //call fbcLogin if the connectState is 0
    // window.fbcReceiver = new function(){
    //   return {
    //     fbcSetConnectState: function(result){
    //       //console.log("fbcSetConnectState: " +result);
    //       if(result>0)
    //         fbcGetAccessToken();
    //     },
    //     fbcSetAccessToken: function(result){
    //       if(fbcLogin_cb !=null){
    //         fbcLogin_cb();
    //         fbcLogin_cb=null;
    //       }
    //       //console.log("fbcSetAccessToken: " +result);
    //     }
    //   }
    // }

     
 

  }

);