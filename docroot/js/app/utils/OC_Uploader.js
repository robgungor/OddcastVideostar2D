define(['backbone', 'underscore', 'utils/OC_Utils', 'utils/OC_Parser'], 
	function(Backbone, _, OC_Utilities, OC_Parser) {
//********************************************************************************
//START OC
//********************************************************************************
	var OC_Uploader = {
		_api_base_url: '',	
		_wsSettings: {
			doorId	: 1297,
			clientId: 360,
			topicId: 0
		},
	   	/*
		Uploads base64Encoded file and gets a temp location url
		*/
		upload_V3 : function (base64File, callback) {
			var tmp = OC_Utilities.getUrl( "//" + OC_CONFIG.baseURL + "/api/upload_v3.php?extension=png&convertImage=true&sessId=" +this.__getSessionId(), {FileDataBase64:base64File}, callback);
			if(tmp!="OK"){
			  //errorCaught(null, "upload_v3.php: " +tmp);
			  alert("ERROR");
			  return null;
			}
			tmp = OC_Utilities.getUrl("//" + OC_CONFIG.baseURL + "/api/getUploaded_v3.php?sessId=" +this.__getSessionId());
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
		}

	}
  	
  	return OC_Uploader;
});