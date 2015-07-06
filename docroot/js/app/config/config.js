// Require.js Configurations
// -------------------------
require.config({

  // Sets the js folder as the base directory for all future relative paths
  baseUrl: "./js/app",

  // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
  // probably a good idea to keep version numbers in the file names for updates checking
  paths: {

      // Core Libraries
      // --------------
      "jquery": "../libs/jquery",

      "jqueryui": "../libs/jqueryui-large",
      
      "jquerymobile": "../libs/jquery.mobile.custom.min",

      "underscore": "../libs/lodash",

      "backbone": "../libs/backbone",

      // Plugins
      // -------
      "backbone.validateAll": "../libs/plugins/Backbone.validateAll",

      "text": "../libs/plugins/text",

      // "exif": "/libs/exif",

      // "binaryajax": "/libs/binaryajax",

      // "touchcanvas": "/libs/img-touch-canvas"

      "img-get-img-data":"img-get-img-data.min.js",

      "backbone.touch":"../libs/plugins/backbone.touch.min.js"
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
    
    // jQuery Mobile
    "jquerymobile": ["jquery"],

    "img-get-img-data":["jquery"],

     //"jqueryui":["jquery"],
     'jqueryui': {
        exports: '$',
        deps: ['jquery']
     },
      // Backbone.validateAll plugin that depends on Backbone
      "backbone.validateAll": ["backbone"],

      "backbone.touch":["backbone", "jquery", "underscore"]
      
  },
  // will not fail even with the slowest connection... dangerous??
  waitSeconds: 0

});