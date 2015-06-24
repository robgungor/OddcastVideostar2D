// Mobile/Desktop Detection script
(function(ua, w, d, undefined) {

        // App Environment
        // ---------------
        //  Tip: Set to true to turn on "production" mode
        var production = false,
          filesToLoad;

          //App Helper Methods
          window.Preloader = {
            // estimated amounts: helps with percentage of loading bar
            imagesEstimatedK: 513,
            cssEstimatedK: 22,
            jsEstimatedK: 280,
            jsPercentLoaded: 0,
            cssPercentLoaded: 0,
            imagesPercentLoaded: 0,
            totalEstimatedK: 0,

            initView: function() {
                var self = this;                                
                self.totalEstimatedK = self.imagesEstimatedK+self.cssEstimatedK+self.jsEstimatedK;
                self.percentShown = 0;
                self.percentLoaded = 0;
                window.preloadTimer = setInterval(function(){self.updatePercentageView();}, 300);
            },
            loadCSS: function(url, callback) {
              var self = this;
              
              var link = d.createElement("link");
              link.type = "text/css";
              link.rel = "stylesheet";
              link.href = url;
              d.getElementsByTagName("head")[0].appendChild(link);
              if(callback) {
                setTimeout(function(){callback();}, 200);
              }
            },
            loadJS: function(file, callback) {
              //TODO - handle an array instead of a file
              var script = d.createElement("script");
              script.type = "text/javascript";
              var self = this;
              
              if (script.readyState) {  // IE
                script.onreadystatechange = function() {
                  if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                    self.jsPercentLoaded = .3; // this initial load is very small...  bulk happens at require                   
                  }
                };
              } else {  // Other Browsers
                script.onload = function() {
                  callback();
                  self.jsPercentLoaded = .3; // this initial load is very small...  bulk happens at require
                };
              }
              if(((typeof file).toLowerCase()) === "object" && file["data-main"] !== undefined) {
                script.setAttribute("data-main", file["data-main"]);
                script.async = true;
                script.src = file.src;
              } else {
                script.src = file;
              }
              d.getElementsByTagName("head")[0].appendChild(script);
            },
            loadJavascripts: function(firstFile, callback){
                var self = this,
                    filesToLoad = [firstFile, 'js/tracking.js',
                                    //'//'+OC_CONFIG.baseURL+'/includes/facebookconnectV2.js',
                                    //'//platform.twitter.com/widgets.js',
                                    
                                    ],
                    filesTotal;
                                            
                var onJSLoaded = function (){
                    // remove the previous loaded image
                    filesToLoad = filesToLoad.slice(1, filesToLoad.length);
                    
                    var filesLeft = filesTotal-filesToLoad.length;                    
                    self.jsPercentLoaded = (filesLeft/filesTotal)-.25; // assume it's only half of what we gotta do
                   
                    if(filesToLoad.length > 0) loadNext();
                    else callback();
                }

                var loadNext = function(){
                    self.loadJS(filesToLoad[0], onJSLoaded);
                };

                filesTotal = filesToLoad.length+1;
                self.loadJS(filesToLoad[0], onJSLoaded);
                

            },  
            loadFonts: function(callback){
              var self = this;
              self.loadCSS('http://fast.fonts.net/lt/1.css?apiType=css&c=02e28d94-07f8-4d37-85c4-456e261c1c10&fontids=710839,710836,710833,710830', callback);
            },
            loadFiles: function(production, obj, callback) {
              var self = this;
              
              self.cssPercentLoaded = 0;

              if(production) {
                // Loads the production CSS file(s)
                self.loadCSS(obj["prod-css"], function() {
                    // load fonts
                    self.loadFonts(function(){
                      // If there are production JavaScript files to load
                      if(obj["prod-js"]) {
                        // Loads the correct initialization file (which includes Almond.js)
                        self.loadJS(obj["prod-js"], callback);
                      }
                    });
                });
              } else {
                // Loads the development CSS file(s)
                self.loadCSS(obj["dev-css"], function() {                 
                  self.cssPercentLoaded = .5;
                  // load fonts
                  self.loadFonts(function(){
                    self.cssPercentLoaded = 1;
                    // If there are development Javascript files to load
                    if(obj["dev-js"]) {                    
                      // Loads Require.js and tells Require.js to find the correct intialization file
                      
                      self.loadJavascripts(obj["dev-js"], callback);
                      //self.loadJS(obj["dev-js"], callback);
                      //TODO
                      //self.loadJavascripts(callback);
                    }
                  });
                });
              }
            },
            loadImages: function(callback){
                var self = this,
                    imagesToLoad = ['img/common/main-bg.jpg',
                                    'img/video_preview/1.jpg',                                    
                                    'img/video_preview/2.jpg',
                                    'img/video_preview/3.jpg',
                                    'img/video_preview/4.jpg',
                                    'img/video_preview/5.jpg',
                                    'img/landing/input-bg.jpg',
                                    'img/landing/video-spinner-bg.jpg'
                                    ],
                    imagesTotal;
                                            
                    //if (window.devicePixelRatio == 2) {
                      //retina images
                      imagesToLoad.push.apply(imagesToLoad, 
                        [ 'img/landing/share-a-snug-logo@2x.png',
                          'img/landing/bubble-button-bg@2x.png',
                          'img/landing/bubble-button-bg-active@2x.png',
                          'img/landing/button-email@2x.png',
                          'img/landing/button-email-active@2x.png',
                          'img/landing/button-fb@2x.png',
                          'img/landing/button-fb-active@2x.png',                          
                          'img/landing/button-twitter@2x.png',
                          'img/landing/button-twitter-active@2x.png',                          
                          'img/common/snuggle-logo@2x.png',
                          'img/common/oddcast-logo@2x.png',
                          'img/common/snuggledotcom-logo@2x.png',
                          'img/big_show/create-your-own@2x.png',
                          'img/big_show/create-your-own-active@2x.png'
                        ]);
                     
                    // } else{
                    //   imagesToLoad.push.apply(imagesToLoad, 
                    //     [ 'img/landing/share-a-snug-logo.png',
                    //       'img/landing/customize-and-share.png',
                    //       'img/landing/bubble-button-bg.png',
                    //       'img/landing/bubble-button-long-bg.png',
                    //       'img/landing/button-fb.png',
                    //       'img/landing/button-twitter.png'                          
                    //     ]);
                    // }       

                var onImageLoaded = function (){
                    // remove the previous loaded image
                    imagesToLoad = imagesToLoad.slice(1, imagesToLoad.length);
                    
                    var imagesLeft = imagesTotal-imagesToLoad.length;                    
                    self.imagesPercentLoaded = (imagesLeft/imagesTotal);
                    
                    if(imagesToLoad.length > 0) loadNextImage();
                    else callback();
                }

                var loadNextImage = function(){
                    var img = new Image();
                    
                    // call the notify_complete function when the image has loaded
                    img.onload = onImageLoaded;
                    // let's ignore errors and move on
                    img.onerror = onImageLoaded;

                    // load the image
                    img.src = imagesToLoad[0];                    
                };

                imagesTotal = imagesToLoad.length;
                loadNextImage();
            },  
            updatePercentageView: function(){
                var self = this;
                                
                var total = self.totalEstimatedK;
                self.percentLoaded = (self.jsPercentLoaded*(self.jsEstimatedK/total)) + (self.cssPercentLoaded*(self.cssEstimatedK/total)) + (self.imagesPercentLoaded*(self.imagesEstimatedK/total));
                // increment the percent shown, but do not exceed actual percent loaded
                self.percentShown = Math.max(self.percentShown+.01, self.percentLoaded);
                
                if(self.percentShown > 1 && self.percentLoaded < 1) self.percentShown = .1; // restart for very very slow connections 

                document.getElementById("loading-bar-fill").style.width = (self.percentShown*253)+'px';

                // all loaded
                if(self.percentLoaded >= 1 && self.percentShown >=.99) self.loaded();
            },
            loaded: function(){
                
                var self = this;
                clearInterval(window.preloadTimer);

                document.getElementById("loading-bar-fill").style.width = '253px';
                setTimeout(function(){
                  document.getElementById("loading-heart").style.opacity = '1';
                }, 300);
                
                // do this on timeout to add a pause for animation
                setTimeout(function(){      
                  //fadeOut is overloading CPU I think
                  $('#loading').css({'opacity':'0'});
                  setTimeout(function(){ $('#loading').hide(); }, 400);

                }, 800);
                //clearInterval(self.timer);
                                    
                // document.getElementById("loading-bar-fill").style.width = '253px';
                // setTimeout(function(){
                //   document.getElementById("loading-heart").style.opacity = '1';
                // }, 300);
            }
                     
          };

          // Mobile/Tablet Logic
          //if((/iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/).test(ua)) {

            // Mobile/Tablet CSS and JavaScript files to load
            filesToLoad = {
              // CSS file that is loaded when in development mode
              "dev-css": "css/app.css",
              // CSS file that is loaded when in production mode
              "prod-css": "css/app.min.css",
              // Require.js configuration file that is loaded when in development mode
              "dev-js": { "data-main": "js/app/config/config.js", "src": "js/libs/require.js" },
              // JavaScript initialization file that is also loaded when in development mode
              "dev-init": "js/app/init/MobileInit.js",
              // JavaScript file that is loaded when in production mode
              "prod-js": "js/app/init/MobileInit.min.js",
            };

          //}

          // Desktop Logic
          // else {

          //   // Desktop CSS and JavaScript files to load
          //   filesToLoad = {
          //     // CSS file that is loaded when in development mode
          //     "dev-css": "../css/desktop.css",
          //     // CSS file that is loaded when in production mode
          //     "prod-css": "../css/desktop.min.css",
          //     // Require.js configuration file that is also loaded when in development mode
          //     "dev-js": { "data-main": "/js/app/config/config.js", "src": "/js/libs/require.js" },
          //     // JavaScript initialization file that is loaded when in development mode
          //     "dev-init": "/js/app/init/DesktopInit.js",
          //     // JavaScript file that is loaded when in production mode
          //     "prod-js": "/js/app/init/DesktopInit.min.js"
          //   };

          // }
          
          Preloader.initView();

          Preloader.loadFiles(production, filesToLoad, function() {
            
            
            if(!production && window.require) {
              Preloader.loadImages(function(){ 

                require([filesToLoad["dev-init"]], function(init){                
                //  Preloader.loaded();
                });  
              });
                          
            }
          });

      })(navigator.userAgent || navigator.vendor || window.opera, window, document);