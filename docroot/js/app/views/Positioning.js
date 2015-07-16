// Positioning.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/positioning.html", "utils/OC_Utils", "utils/OC_Parser", "utils/OC_Uploader"],

  function($, Backbone, Model, template, OC_Utils, OC_Parser, OC_Uploader){
      
    var Positioning = Backbone.View.extend({

      el: "section#positioning-container",
      touchCanvas: null,
      // View constructor
      initialize: function() {
          
        var self = this;     
        
        self.render();

        //TODO - REFACTOR THIS SECTION
        self.prepareImageForPositioning();
      },
        
      // View Event Handlers
      events: {
        // 'change input': 'onFileInputChange'  
        'click .next'       :'onNextClicked', 
        'click .back'       : 'onBackClicked',
        'route:positioning' : 'render'
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

      onNextClicked: function(e) {
        var self = this;
        
        self.drawFinalFace_mask();
      },

      //TODO - REFACTOR THIS SECTION
      prepareImageForPositioning: function() {
        var self = this;
        
        var head = self.model.heads.currentHead;
        var url = head.get('tempImageURL');
        var crossDomainErrors = head.get('isTempImageCrossdomain');        
        var useAnonymous = head.get('uploadSource') == 'facebook';
        if(crossDomainErrors) {
          self.fixImageDomain(url);
        } else {
          self.preloadTempImage(url, useAnonymous);
        }
        
        OC_ET.event("edbgu");
      },

      preloadTempImage: function(_url, useCrossOrigin) {
        var self = this;

        var tempImg = document.createElement("img");
        if(useCrossOrigin) tempImg.crossOrigin="anonymous";
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
            guidePath: OC_CONFIG.curURL+'/'+OC_CONFIG.appDirectory+'/mobile/img/positioning/face_overlay.png',
          });
        }else{
          self.touchCanvas.freezeCanvas();
          self.touchCanvas.resetCanvas(_canvasPath);
        }        
      },
           
      drawFinalFace_mask: function() {
        var self = this;
        $('#main-loading-spinner').fadeIn(300);
        self.$el.fadeOut();

        var maskImg = new Image();
        maskImg.crossOrigin="anonymous";
        maskImg.src = OC_CONFIG.curURL+'/'+OC_CONFIG.appDirectory+'/mobile/img/positioning/face_mask.png';
        maskImg.onload = function() {
          var cMask = document.getElementById("finalMaskCanvas");
          var cMaskTX = cMask.getContext("2d");
          cMaskTX.clearRect(0, 0, cMask.width, cMask.height);
          cMaskTX.drawImage(maskImg, 0, 0, cMask.width, cMask.height);
          setTimeout(function(){ self.drawFinalFace_now(); }, 100);
        };  
      },

      drawFinalFace_now: function() {
        var self = this;
        var c = document.getElementById("finalFaceCanvas");
        var cMask = document.getElementById("finalMaskCanvas");
        var uploadImg=document.getElementById('uploadFaceCanvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, cMask.width, cMask.height);
        ctx.save();
        ctx.drawImage(cMask, 0, 0, cMask.width, cMask.height);
        ctx.globalCompositeOperation = 'source-in';
        //ctx.drawImage(uploadImg, 57, 78, cMask.width, cMask.height, 0, 0, cMask.width, cMask.height);
        ctx.drawImage(uploadImg, 0, 0, cMask.width, cMask.height, 0, 0, cMask.width, cMask.height);
        ctx.restore();
        setTimeout(function(){ self.drawFinalFace2_now();}, 100);
      },

      drawFinalFace2_now: function() {
        var self = this;

        //TODO - put in settings
        var curCropInfo=[82, 39, 235, 316]; //x,y,w,h
        var canvas = document.getElementById("finalFaceCanvas");
        var canvas2 = document.createElement('canvas');
        canvas2.width=curCropInfo[2];
        canvas2.height=curCropInfo[3];
        var ctx2 = canvas2.getContext('2d');
        ctx2.drawImage(canvas, curCropInfo[0], curCropInfo[1], canvas2.width, canvas2.height, 0, 0, canvas2.width, canvas2.height);
        self.drawFinalFace_snapshot(canvas2);
      },

      drawFinalFace_snapshot: function(_canvas){
        var self = this;

        var _base64Im = _canvas.toDataURL();
        _base64Im = _base64Im.substring(_base64Im.indexOf(",")+1);
        var head = self.model.heads.currentHead;
        var src = OC_Uploader.upload_V3(_base64Im, function(result){
        
        });
        
        head.set({'src':src});
       
        $('#main-loading-spinner').fadeOut(300);
        window.router.navigate('upload-manager', true);
        
        //setTimeout(function(){ self.createFinalSharedVideo(); }, 100);
      },
      
      close: function() {
        var self = this;
        if(self.touchCanvas) self.touchCanvas.freezeCanvas();
        //self.touchCanvas = null;
        this.$el.fadeOut().empty();
        this.undelegateEvents();
        this.stopListening();
      },

      open: function() {
        this.delegateEvents();
        this.startListening();
        this.render();
      },
      // function precheck_saved_mid(_callback, _callback_afterMidCreated){
      //   if(_callback_afterMidCreated==null) _callback_afterMidCreated=_callback;
      //   var checkedMid=(shareType=="share-video")?(savedMidObj.videoMid):(savedMidObj.photoMid);
      //   if( checkedMid !=null && savedMidObj.body==curBody && savedMidObj.mask==curMask && savedMidObj.teamName==curTeamName  && savedMidObj.teamNum==curTeamNum){
      //     OC_Social.setFacebookPost(checkedMid+'.3', null);
      //     OC_Social.setTwitterPost(checkedMid+'.3', null);
      //     OC_Social.setRenrenPost(checkedMid+'.3', null);
      //     OC_Social.setWeiboPost(checkedMid+'.3', null);
      //     OC_Social.setGoolePlusPost(checkedMid+'.3', null);
      //     OC_Social.setEmailPost(checkedMid+'.2', null);
      //     OC_Social.setGetUrlPost(checkedMid+'.3', null);
      //     if(_callback) _callback();
      //   }else{
      //     createMessageId();
      //   }
        
      //   function createMessageId(){
          
      //     var extradata = {};
      //       extradata.isVideo = (shareType=="share-video");
      //       extradata.jerseyNumber = curTeamNum;
      //       extradata.surname = curTeamName;
      //       extradata.contrast = curBody-1;
      //       extradata.hairStyle = curMask-1;
      //       extradata.lang=curLang;
      //     OC.saveMessage(extradata, function(mid){
      //       OC_ET.event("edsv"); //Messages created
      //       loadFinalPhotos_from_mid(mid);
      //     });
      //   }
      //   function loadFinalPhotos_from_mid(mid){
      //     var allPhotos=new Object();
      //     var tmp = OC_Utils.getUrl(OC_CONFIG.baseURL +"/php/api/playScene/doorId="  +OC_CONFIG.doorId +"/clientId=" +OC_CONFIG.clientId +"/mId=" +mid);
      //     tmp = OC_Parser.getXmlDoc(tmp);
      //     var errorTmp=OC_Parser.getXmlNode(tmp, 'APIERROR');
      //     var okTmp=OC_Parser.getXmlNode(tmp, 'assets');

      //     if(errorTmp != null){
      //       //alert("create message error");
      //       openAlertWin("create message error");
      //       hideProgress();
      //     }else{
      //       var tmp1 = OC_Parser.getXmlNode(okTmp, 'bg', 0);
      //       var tmp2 = OC_Parser.getXmlNode(okTmp, 'bg', 1);
      //       if(tmp2 ==null) {
      //         var photoUrl1 = OC_Parser.getXmlNodeValue(tmp1);
      //         updateShareLinks(mid, photoUrl1);
      //       }else{
      //         var photoName1 = OC_Parser.getXmlNodeAttribute(tmp1, 'name');
      //         var photoUrl1 = OC_Parser.getXmlNodeValue(tmp1);
      //         photoUrl1=decodeURIComponent(photoUrl1);
      //         allPhotos[photoName1]=photoUrl1;
              
      //         var photoName2 = OC_Parser.getXmlNodeAttribute(tmp2, 'name');
      //         var photoUrl2 = OC_Parser.getXmlNodeValue(tmp1);
      //         photoUrl2=decodeURIComponent(photoUrl2);
      //         allPhotos[photoName2]=photoUrl2;
              
      //         updateShareLinks(mid, allPhotos["profilePhoto"]);
      //       }
      //     }
      //   }
      //   function updateShareLinks(mid, snapshot){
      //     OC_Social.setFacebookPost(mid+'.3', snapshot);
      //     OC_Social.setTwitterPost(mid+'.3', snapshot);
      //     OC_Social.setRenrenPost(mid+'.3', snapshot);
      //     OC_Social.setWeiboPost(mid+'.3', snapshot);
      //     OC_Social.setGoolePlusPost(mid+'.3', snapshot);
      //     OC_Social.setEmailPost(mid+'.2', snapshot);
      //     OC_Social.setGetUrlPost(mid+'.3', snapshot);
          
      //     if(shareType=="share-video"){
      //       savedMidObj.videoMid=mid;
      //     }else if(shareType=="sharePhoto"){
      //       savedMidObj.photoMid=mid;
      //     }
      //     setTimeout( function() { 
      //         hideProgress_fake(function(){
      //           if(_callback_afterMidCreated) _callback_afterMidCreated();
      //         });
      //     }, 200);
      //   }
      //++++++++++++++++++++++++++++++++++++++++++++++
    });

    // Returns the Positioning class
    return Positioning;

  }

);