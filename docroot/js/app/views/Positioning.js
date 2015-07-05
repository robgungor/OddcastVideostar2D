// Positioning.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/positioning.html", "utils/OC_Utils", "utils/OC_Parser"],

  function($, Backbone, Model, template, OC_Utils, OC_Parser){
      
    var Positioning = Backbone.View.extend({

      el: "section#positioning-container",
      touchCanvas: null,
      // View constructor
      initialize: function() {
          
        var self = this;     
        
        self.render();

        //TODO - REFACTOR THIS SECTION
        self.upload_image_to_touchCanvas();
      },
        
      // View Event Handlers
      events: {
        'change input': 'onFileInputChange'      
      },            


      // Renders the view's template to the UI
      render: function() {
        var self = this;
        // Setting the view's template using the template method
        self.template = _.template(template, self.model.toJSON());

        // Dynamically updates the UI with the view's template
        self.$el.html(self.template);
      
        return this;
      },           
      
      //TODO - REFACTOR THIS SECTION
      upload_image_to_touchCanvas: function() {
        var self = this;
        
        var url = self.model.get('tempImageURL');
        var crossDomainErrors = self.model.get('isTempImageCrossdomain');        
       
        if(crossDomainErrors) {
          self.fixImageDomain(url);
        } else {
          self.preloadTempImage(url);
        }
        
        OC_ET.event("edbgu");
      },

      preloadTempImage: function(_url) {
        var self = this;

        var tempImg = document.createElement("img");
        tempImg.crossOrigin="anonymous";
        tempImg.src = _url;
        tempImg.onload = function(){
          self.tempImgLoaded(tempImg);
        }
      },

      tempImgLoaded: function(_newImg) {
        var self = this;

        var canvas = document.getElementById("preUploadFaceCanvas");
        canvas.width=_newImg.width;
        canvas.height=_newImg.height;
        var cContext = canvas.getContext("2d");
        cContext.drawImage(_newImg, 0, 0, canvas.width, canvas.height);
                
        var canvasPath=canvas.toDataURL();
        setTimeout(function(){ self.createTouchCanvas(canvasPath);}, 100);
      },

      fixImageDomain: function(_url) {
        var self = this;

        $.getImageData({
          url: _url,
          server: OC_CONFIG.curURL+'/'+OC_CONFIG.appDirectory+'/getImageData.php',
          success: function(newImg){
            self.tempImgLoaded(newImg);
          },
          error: function(xhr, text_status){
            alert('IMAGE DOMAIN FIX FAILED');
          }
        });
      },

      createTouchCanvas: function (_canvasPath) {
        var self = this;

        if(self.touchCanvas==null) {
          self.touchCanvas = new ImgTouchCanvas({
            canvas: document.getElementById('uploadFaceCanvas'),
            path: _canvasPath,
            guideCanvas: document.getElementById('uploadGuideCanvas'),
            guidePath: OC_CONFIG.curURL+'/'+OC_CONFIG.appDirectory+'/img/face_mask.png',
          });
        }else{
          self.touchCanvas.freezeCanvas();
          self.touchCanvas.resetCanvas(_canvasPath);
        }        
      },

      //++++++++++++++++++++++++++++++++++++++++++++++
    });

    // Returns the Positioning class
    return Positioning;

  }

);