/*
=================================
img-touch-canvas - v0.1
http://github.com/rombdn/img-touch-canvas

(c) 2013 Romain BEAUDON
This code may be freely distributed under the MIT License
=================================
*/


(function() {
    var root = this; //global object

    var ImgTouchCanvas = function(options) {
        if( !options || !options.canvas || !options.path) {
            throw 'ImgZoom constructor: missing arguments canvas or path';
        }

        this.canvas         = options.canvas;
        this.canvas.width   = this.canvas.clientWidth;
        this.canvas.height  = this.canvas.clientHeight;
        this.context        = this.canvas.getContext('2d');
		
        this.guideCanvas     = options.guideCanvas;
        this.guideCanvas.width   = this.guideCanvas.clientWidth;
        this.guideCanvas.height  = this.guideCanvas.clientHeight;
        this.guideContext    = this.guideCanvas.getContext('2d');
		
		this.dAllowX=50;
		this.dAllowY=50;
		this.dAllowS=0.8;
        
        this.position = {
            x: 0,
            y: 0
        };
        this.scale = {
            x: 0.5,
            y: 0.5
        };
		this.imgTexture = new Image();
		this.imgTexture.src = options.path;
        this.imgGuide = new Image();
        this.imgGuide.src = options.guidePath;
		
        this.lastZoomScale = null;
        this.lastX = null;
        this.lastY = null;
		
		this.lastDegree = null;
        this.totalDelDegree = null;

        this.checkRequestAnimationFrame();
		this.setEventListeners();
		
		this.init = false;
		this.doAnimation=true;
        requestAnimationFrame(this.animate.bind(this));
    };

    ImgTouchCanvas.prototype = {
		//****************************************************
		resetCanvas: function(imgSrc) {
			if(imgSrc !=null){
				this.imgTexture = new Image();
				this.imgTexture.src = imgSrc;
			}
			
			this.position = {
				x: 0,
				y: 0
			};
			this.scale = {
				x: 0.5,
				y: 0.5
			};
			this.context.translate(this.canvas.width/2, this.canvas.height/2);
			this.context.rotate(-this.totalDelDegree *Math.PI/180);
			this.context.translate(-this.canvas.width/2, -this.canvas.height/2);
			
			this.lastZoomScale = null;
			this.lastX = null;
			this.lastY = null;
			this.lastDegree = null;
			this.totalDelDegree = null;
			
			this.init = false;
			this.doAnimation=true;
			requestAnimationFrame(this.animate.bind(this));
		},
		resetGuide: function(guideImgSrc) {
			this.imgGuide = new Image();
			this.imgGuide.src = guideImgSrc;
		},
		freezeCanvas: function() {
			this.doAnimation=false;
		},
		//****************************************************
		
        animate: function() {
            //set scale such as image cover all the canvas
            if(!this.init) {
                if(this.imgTexture.width) {
					var scaleRatio_w = this.canvas.clientWidth / this.imgTexture.width;
					var scaleRatio_h = this.canvas.clientHeight / this.imgTexture.height;
					var scaleRatio = Math.max(scaleRatio_w, scaleRatio_h);
                    /*if(this.canvas.clientWidth > this.canvas.clientHeight) {
						//scaleRatio = this.canvas.clientWidth / this.imgTexture.width;
						scaleRatio = this.canvas.clientHeight / this.imgTexture.height;
                    }else {
						//scaleRatio = this.canvas.clientHeight / this.imgTexture.height;
						scaleRatio = this.canvas.clientWidth / this.imgTexture.width;
                    }*/
					
                    this.scale.x = scaleRatio;
                    this.scale.y = scaleRatio;
                    this.init = true;
                }
            }
			
            this.context.clearRect(-500, -500, this.canvas.width+1000, this.canvas.height+1000);
            this.context.drawImage(
                this.imgTexture, 
                this.position.x, this.position.y, 
                this.scale.x * this.imgTexture.width, 
                this.scale.y * this.imgTexture.height);

			this.guideContext.clearRect(0, 0, this.guideCanvas.width, this.guideCanvas.height);
			this.guideContext.drawImage(this.imgGuide, 0,0, this.guideCanvas.width,this.guideCanvas.height);
				
			if(this.doAnimation){
				requestAnimationFrame(this.animate.bind(this));
			}
        },


        gesturePinchZoomRot: function(event) {
			var zoom_rot = {
				zoom: false,
				rotation: false,
			};
			
			var zoom = false;
			var rotation = {
				delDegree: false,
				centerX: false,
				centerY: false
			};
			
            if( event.targetTouches.length >= 2 ) {
                var p1 = event.targetTouches[0];
                var p2 = event.targetTouches[1];
                var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance

                if( this.lastZoomScale ) {
                    zoom = zoomScale - this.lastZoomScale;
                }
                this.lastZoomScale = zoomScale;
				//+++++++++++++++++++++++
				var degree=0;
				if(p2.pageX >=p1.pageX){
					var degree=Math.atan(-(p2.pageY-p1.pageY)/(p2.pageX-p1.pageX))*180/Math.PI;
				}else{
					var degree=Math.atan(-(p1.pageY-p2.pageY)/(p1.pageX-p2.pageX))*180/Math.PI;
				}
				if(this.lastDegree && Math.abs(degree-this.lastDegree)>0.5){
					var delDegree=((degree-this.lastDegree)<0)?(2):(-2);
					var centerX=this.canvas.width/2; //(p1.pageX+p2.pageX)/2;
					var centerY=this.canvas.height/2; //(p1.pageY+p2.pageY)/2;
					
					rotation.delDegree=delDegree;
					rotation.centerX=centerX;
					rotation.centerY=centerY;
					
					this.totalDelDegree +=delDegree;
				}
				this.lastDegree = degree;
				//+++++++++++++++++++++++
            }    
			zoom_rot.zoom=zoom;
			zoom_rot.rotation=rotation;
			
			
            return zoom_rot;
        },


        doZoomRotate: function(zoom, rotation) {
			if(rotation !=false && rotation.delDegree !=false){
				var delDegree=rotation.delDegree;
				var centerX=rotation.centerX;
				var centerY=rotation.centerY;

				this.context.translate(centerX, centerY);
				this.context.rotate(delDegree *Math.PI/180);
				this.context.translate(-centerX, -centerY);
			}
			
			if(zoom !=false){
				var currentScale = this.scale.x;
				var newScale = this.scale.x + zoom/100;
				
				//some helpers
				var deltaScale = newScale - currentScale;
				var currentWidth    = (this.imgTexture.width * this.scale.x);
				var currentHeight   = (this.imgTexture.height * this.scale.y);
				var deltaWidth  = this.imgTexture.width*deltaScale;
				var deltaHeight = this.imgTexture.height*deltaScale;

				//by default scale doesnt change position and only add/remove pixel to right and bottom
				//so we must move the image to the left to keep the image centered
				//ex: coefX and coefY = 0.5 when image is centered <=> move image to the left 0.5x pixels added to the right
				var canvasmiddleX = this.canvas.clientWidth / 2;
				var canvasmiddleY = this.canvas.clientHeight / 2;
				var xonmap = (-this.position.x) + canvasmiddleX;
				var yonmap = (-this.position.y) + canvasmiddleY;
				var coefX = -xonmap / (currentWidth);
				var coefY = -yonmap / (currentHeight);
				var newPosX = this.position.x + deltaWidth*coefX;
				var newPosY = this.position.y + deltaHeight*coefY;

				//edges cases
				var newWidth = currentWidth + deltaWidth;
				var newHeight = currentHeight + deltaHeight;
				doTraceOnce(newPosX+"        "+newPosY);
				if( newWidth < this.canvas.clientWidth*this.dAllowS) return;
				//if( newPosX > 0 ) { newPosX = 0; }
				//if( newPosX < this.canvas.clientWidth-newWidth ) { newPosX = this.canvas.clientWidth-newWidth;}
				
				if( newHeight < this.canvas.clientHeight*this.dAllowS ) return;
				//if( newPosY > 0 ) { newPosY = 0; }
				//if( newPosY < this.canvas.clientHeight-newHeight ) { newPosY = this.canvas.clientHeight-newHeight; }
				
				doTrace(newPosX+"        "+newPosY);
				
				//finally affectations
				this.scale.x    = newScale;
				this.scale.y    = newScale;
				this.position.x = newPosX;
				this.position.y = newPosY;
			}
        },

        doMove: function(relativeX, relativeY) {
            if(this.lastX && this.lastY) {
              var deltaX = relativeX - this.lastX;
              var deltaY = relativeY - this.lastY;
              var currentWidth = (this.imgTexture.width * this.scale.x);
              var currentHeight = (this.imgTexture.height * this.scale.y);

              this.position.x += deltaX;
              this.position.y += deltaY;


              //edge cases
			  var thisAllowRight=0+this.dAllowX;
			  var thisAllowLeft=this.canvas.clientWidth-currentWidth-this.dAllowX;
			  var thisAllowTop=0+this.dAllowY;
			  var thisAllowBtm=this.canvas.clientHeight-currentHeight-this.dAllowY;
			  
              if( this.position.x > thisAllowRight ) {
                this.position.x = thisAllowRight;
              }
              else if( this.position.x  < thisAllowLeft ) {
                this.position.x = thisAllowLeft;
              }
              if( this.position.y > thisAllowTop ) {
                this.position.y = thisAllowTop;
              }
              else if( this.position.y < thisAllowBtm ) {
                this.position.y = thisAllowBtm;
              }
            }
			//doTraceOnce(this.position.x+"   "+this.position.y);
            this.lastX = relativeX;
            this.lastY = relativeY;
        },

        setEventListeners: function() {
			var detectCanvas=this.guideCanvas;
			
            detectCanvas.addEventListener('touchstart', function(e) {
				e.preventDefault();
                this.lastX          = null;
                this.lastY          = null;
                this.lastZoomScale  = null;
            }.bind(this));
			
            detectCanvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                
				if(e.targetTouches.length == 2) { //pinch
					var zoom_rot=this.gesturePinchZoomRot(e);
					this.doZoomRotate(zoom_rot.zoom, zoom_rot.rotation);
				}else if(e.targetTouches.length == 1) {
					var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
					var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;  
						
					if(this.totalDelDegree==null){
						this.doMove(relativeX, relativeY);
					}else{
						var totalDelDegree=this.totalDelDegree;
						var relativeX2_x = relativeX*Math.cos(totalDelDegree *Math.PI/180);
						var relativeY2_x = -relativeX*Math.sin(totalDelDegree *Math.PI/180);
						var relativeX2_y = relativeY*Math.cos((totalDelDegree-90) *Math.PI/180);
						var relativeY2_y = -relativeY*Math.sin((totalDelDegree-90) *Math.PI/180);
						var relativeX2 = relativeX2_x+relativeX2_y;
						var relativeY2 = relativeY2_x+relativeY2_y;
						this.doMove(relativeX2, relativeY2);
					}
				}
            }.bind(this));
        },


        checkRequestAnimationFrame: function() {
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame = 
                  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }

            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function(callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
                      timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }

            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function(id) {
                    clearTimeout(id);
                };
            }
        },
    };

    root.ImgTouchCanvas = ImgTouchCanvas;
}).call(this);