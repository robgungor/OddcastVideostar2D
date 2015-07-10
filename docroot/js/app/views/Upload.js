// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/upload.html", "utils/OC_Utils", "utils/OC_Parser", "utils/OC_Uploader"],

  function($, Backbone, Model, template, OC_Utils, OC_Parser, OC_Uploader){
      
    var Upload = Backbone.View.extend({

      el: "#upload-container",

      // View constructor
      initialize: function() {
          
        var self = this;     
        
        self.render();        
      },
        
      // View Event Handlers
      events: {
        'change input': 'onFileInputChange',      
        'click .close-x': 'onCloseXClicked',
        'click #facebook': 'onFacebookClicked',
      },            

      close: function() {
        this.$el.fadeOut().empty();
      },

      // Renders the view's template to the UI
      render: function() {
        var self = this;
        // Setting the view's template using the template method
        self.template = _.template(template, self.model.toJSON());

        // Dynamically updates the UI with the view's template
        self.$el.html(self.template).fadeIn();
        
        return this;
      },    

      onFacebookClicked: function(e) {        
        e.preventDefault();
        window.router.navigate('upload-facebook', true);
      },     

      onCloseXClicked: function(e) {        
        e.preventDefault();
        window.router.navigate('landing', true);
      },     
      
      onFileInputChange: function (event) {
        
        // var imgUploadedFile = document.getElementById('fileUpload'+uploadImgBtnId); 
        // imgUploadedFile.addEventListener('change', function(event){
        
        var self = this;

        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
          if (files[i].type.match(/image.*/)) {            
            self.upload(files[i]);
          }
        }
        
      },
      
      upload: function (_file) { //get dataUrl
        var self = this;
        var backendUploadMaxWH = 600;

        var reader = new FileReader();
        reader.readAsDataURL(_file);
                
        reader.onload = function (readerEvent) {
          var image = new Image();
          image.src = readerEvent.target.result;
                  
          image.onload = function (imageEvent) {
            var _dataUrl=image.src;
            var _scale=Math.max( (image.width/backendUploadMaxWH), (image.height/backendUploadMaxWH));
            var byteString = atob(_dataUrl.split(',')[1]);
            var binaryFile = new EXIF.BinaryFile(byteString, 0, byteString.length);
            var exif = EXIF.findEXIFinJPEG(binaryFile);
            var orientation = exif.Orientation || 0;
                  
            if(_scale<=1) {  //no need
              self.rotate_flip_image(null, _dataUrl, backendUploadMaxWH, orientation, function(_canvas){self.img_is_FlippedRotated(_canvas);});
            }else{      //upload
              var newImgW=image.width/_scale;
              var newImgH=image.height/_scale;
              var _base64Im=_dataUrl.substring(_dataUrl.indexOf(",")+1);
              var resizedPhotoUrl = OC_Uploader.upload_V3(_base64Im, newImgW, newImgH);
              self.rotate_flip_image(resizedPhotoUrl, null, backendUploadMaxWH, orientation, function(_canvas){self.img_is_FlippedRotated(_canvas);});
            }
          }
        }
      },

      img_is_FlippedRotated : function (_canvas) {
        var self = this;
        var canvasPath=_canvas.toDataURL();
        self.model.set({'tempImageURL':canvasPath, 'isTempImageCrossdomain':false});

        window.router.navigate('positioning', true);
        //setTimeout(function(){self.upload_image_to_touchCanvas(null, canvasPath, false);}, 100);
      },    
      
      //**********************************************************************
      //html5 uploader
      //**********************************************************************
      rotate_flip_image: function (_url, _dataUrl, _maxSize, _orientation, _callback) {
        var self = this;

        var newImg = document.createElement("img");
        if(_url !=null){
          newImg.crossOrigin="anonymous";
          newImg.src = _url;
        }else{
          newImg.src = _dataUrl;
        }
        
        newImg.onload = function (imageEvent) {
          var canvas = document.createElement("canvas");
          var imgWidth=newImg.width;
          var imgHeight=newImg.height;
          var _scale=(_maxSize==null)?(1):( Math.max( 1, Math.max((newImg.width/_maxSize),(newImg.height/_maxSize)) ) ); //do nothing if <1
          var scaleWidth=imgWidth/_scale;
          var scaleHeight=imgHeight/_scale;
                // Measure the width and height, based on orientation.
               switch (_orientation) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        canvas.width = scaleHeight;
                        canvas.height = scaleWidth;
                        break;
                    default:
                        canvas.width = scaleWidth;
                        canvas.height = scaleHeight;
                }
          var ctx = canvas.getContext("2d");
          self.transformCoordinate(ctx, _orientation, scaleWidth, scaleHeight);
          ctx.drawImage(newImg, 0, 0, scaleWidth, scaleHeight);
          
          if(_callback) _callback(canvas);
          
        }         
      },

      //++++++++++++++++++++++++++++++++++++++++++++++
      transformCoordinate: function(ctx, _orientation, width, height) {
        switch (_orientation) {
          case 1:
            // nothing
            break;
          case 2:
            // horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
          case 3:
            // 180 rotate left
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
          case 4:
            // vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
          case 5:
            // vertical flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
          case 6:
            // 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;
          case 7:
            // horizontal flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;
          case 8:
            // 90 rotate left
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;
          default:
            break;
        }
      },

      detectTransparency: function(ctx) {
          var canvas = ctx.canvas;
          var height = canvas.height;

          // Returns pixel data for the specified rectangle.
          var data = ctx.getImageData(0, 0, 1, height).data;

          // Search image edge pixel position in case it is squashed vertically.
          for (var i = 0; i < height; i++) {
              var alphaPixel = data[(i * 4) + 3];
              if (alphaPixel == 0) {
                  return true;
              }
          }
          return false;
      }
      //++++++++++++++++++++++++++++++++++++++++++++++
    });

    // Returns the Upload class
    return Upload;

  }

);