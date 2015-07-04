// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/upload.html", "utils/OC_Utils", "utils/OC_Parser"],

  function($, Backbone, Model, template, OC_Utils, OC_Parser){
      
    var Positioning = Backbone.View.extend({

      el: "section#positioning-container",

      // View constructor
      initialize: function() {
          
        var self = this;     
        
        self.render();

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
      
      onFileInputChange: function (event) {
        
        // var imgUploadedFile = document.getElementById('fileUpload'+uploadImgBtnId); 
        // imgUploadedFile.addEventListener('change', function(event){
        
        var self = this;

        var files = event.target.files;

        for (var i = 0; i < files.length; i++) {
          if (files[i].type.match(/image.*/)) {
            console.log(files[i]);
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
              var resizedPhotoUrl = self.upload_V3(_base64Im, newImgW, newImgH);
              self.rotate_flip_image(resizedPhotoUrl, null, backendUploadMaxWH, orientation, function(_canvas){self.img_is_FlippedRotated(_canvas);});
            }
          }
        }
      },

      img_is_FlippedRotated : function (_canvas) {
        var self = this;
        var canvasPath=_canvas.toDataURL();
        setTimeout(function(){self.upload_image_to_touchCanvas(null, canvasPath, false);}, 100);
      },



      upload_image_to_touchCanvas: function (_url, _dataUrl, _img_with_crossdomain_issue) {
        //displayProgress_fake(1,98,null,100);
        // savedMidObj.videoMid=null;
        // savedMidObj.photoMid=null;
        // savedMidObj.body=-1;
        // savedMidObj.mask=-1;
        // savedMidObj.teamName="";
        // savedMidObj.teamNum="00";

        // showPage(2);

        setTimeout(function(){
          if(_url ==null && _dataUrl==null){
            step3_done();
          }else if(_url !=null){  //<======== from fb/gp
              step1_preUpload(_url, null, _img_with_crossdomain_issue);
          }else{          //<======== from upload
              step1_preUpload(null, _dataUrl, _img_with_crossdomain_issue);
              createUploadImgBtn();
          }
        }, 500);

        function step1_preUpload(_url, _dataUrl, _img_with_crossdomain_issue){
          
          if(_url !=null){
            if(_img_with_crossdomain_issue){
              $.getImageData({
                url: _url,
                server: OC_CONFIG.curURL+OC_CONFIG.appDirectory+'/getImageData.php',
                success: function(newImg){
                  newImgLoaded(newImg);
                },
                error: function(xhr, text_status){
                  // Handle your error here
                }
              });
            }else{
              var newImg = document.createElement("img");
              newImg.crossOrigin="anonymous";
              newImg.src = _url;
              newImg.onload=function(){
                newImgLoaded(newImg);
              }
            }
          }else if(_dataUrl !=null){
            var newImg = document.createElement("img");
            newImg.src = _dataUrl;
            newImg.onload=function(){
              newImgLoaded(newImg);
            }
          }
          //fbTrackGMApp('upload-photo');
          OC_ET.event("edbgu");
        
          function newImgLoaded(_newImg){
            var canvas = document.getElementById("preUploadFaceCanvas");
            canvas.width=_newImg.width;
            canvas.height=_newImg.height;
            var cContext = canvas.getContext("2d");
            cContext.drawImage(_newImg, 0, 0, canvas.width, canvas.height);
                    
            var canvasPath=canvas.toDataURL();
            setTimeout(function(){step2_createMyTouchCanvas(canvasPath);}, 100);
          }
        }
        function step2_createMyTouchCanvas(_canvasPath){
          if(myTouchCanvas==null){
            myTouchCanvas = new ImgTouchCanvas({
              canvas: document.getElementById('uploadFaceCanvas'),
              path: _canvasPath,
              guideCanvas: document.getElementById('uploadGuideCanvas'),
              guidePath: _wsSettings.curURL+'/manu-profile-photo/images/ipad/myImgBody_'+curBody+'_'+curMask+'.png',
            });
          }else{
            myTouchCanvas.freezeCanvas();
            myTouchCanvas.resetCanvas(_canvasPath);
          }
          setTimeout(step3_done, 1000);
        }
        function step3_done(){
          hideProgress_fake(null);
        }
      },

      /*
      Uploads base64Encoded file and gets a temp location url
      */
      upload_V3 : function (base64File) {
        var tmp = OC_Utils.getUrl( "//" + OC_CONFIG.baseURL + "/api/upload_v3.php?extension=png&convertImage=true&sessId=" +this.__getSessionId(), {FileDataBase64:base64File});
        if(tmp!="OK"){
          //errorCaught(null, "upload_v3.php: " +tmp);
          alert("ERROR");
          return null;
        }
        tmp = OC_Utils.getUrl("//" + OC_CONFIG.baseURL + "/api/getUploaded_v3.php?sessId=" +this.__getSessionId());
        tmp = OC_Parser.getXmlDoc(tmp);
        tmp = OC_Parser.getXmlNode(tmp, "FILE")
        tmp = OC_Parser.getXmlNodeAttribute(tmp, 'URL');
        return tmp;
      },
    
      _sessionId: false,

      __getSessionId : function () {
        if(this._sessionId == false){
          this._sessionId = new Date().getTime();
          this._sessionId += this.__S4() +this.__S4() +this.__S4() +this.__S4() +this.__S4() +this.__S4();
          this._sessionId = this._sessionId.substring(0,32);
        }
        return this._sessionId;
      },

      __S4 : function () {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
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

    // Returns the Positioning class
    return Positioning;

  }

);