define(['backbone', 'underscore', 'utils/OC_Utils', 'utils/OC_Parser'], 
	function(Backbone, _, OC_Utilities, OC_Parser) {
//********************************************************************************
//START OC
//********************************************************************************
	var OC_MessageSaver = {
		_api_base_url: '',	
		_wsSettings: {
			doorId	: 1297,
			clientId: 360,
			topicId: 0
		},
	    //NOTE saveMessage
		saveMessage : function (model, extraData, callback){
			
	        extraData = extraData || {};
	        extraData.selectedVideo =  model.get('selectedVideo');
	        
			var strExtraData = "";
			for (var prop in extraData) {				
				strExtraData += prop +"=" +encodeURIComponent(extraData[prop]) +"&amp;";
			}
			// 		  	<player>
			//   <params>
			//     <door>1217</door>
			//     <client>217</client>
			//     <topic>0</topic>
			//     <mode>embed</mode>
			//     <appType>workshop</appType>
			//   </params>
			//   <assets>
			//     <video tempid="101" name="" length="25" vidid="0">http://host-vd.oddcast.com/ccs7/tmp/APS/video/78/a8/78a82268761cbdca394578e91d409b84/78a82268761cbdca394578e91d409b84.webm</video>    
			//     <bg tempid="24" name="">http://host-vd.oddcast.com/ccs7/tmp/APS/video/4f/35/4f35bab759cbef8a638269bf358b7b48/thumbnailSquare.jpg</bg>
			//   </assets>
			//   <scenes>
			//     <scene>
			//       <video>
			//         <tempid>101</tempid>
			//       </video>
			//       <bg>
			//         <tempid>24</tempid>
			//       </bg>
			//       <id>1</id>
			//     </scene>
			//   </scenes>
			//   <extradata>bgPos=0%2C0%2C1%2C0&amp;</extradata>
			// </player>
			var xml = "";
			xml += '<player>\n';
			xml += '  <params>\n';
			xml += '    <door>'	 + model.config.doorId   +'</door>\n';
			xml += '    <client>'+ model.config.clientId +'</client>\n';
			xml += '    <topic>' + model.config.topicId  +'</topic>\n';
			xml += '    <mode>embed</mode>\n';
			xml += '    <appType>workshop</appType>\n';
			xml += '  </params>\n';
			xml += '  <assets>\n';
			xml += '    <video tempid="101" name="" length="25" vidid="0">'+model.get('videoURL')+'</video>';	       	        
			xml += '  </assets>\n';

			xml += '<scenes>\n';
			xml += '    <scene>\n';
			xml += '      <video>\n';
			xml += '        <tempid>101</tempid>\n';
			xml += '      </video>\n';
			// xml += '      <bg>\n';
			// xml += '        <tempid>24</tempid>\n';
			// xml += '      </bg>\n';
			xml += '      <id>1</id>\n';
			xml += '    </scene>\n';
			xml += '  </scenes>\n';
			xml += '  <extradata>'+strExtraData+'</extradata>\n'; //' +strExtraData +'
			xml += '</player>\n';

			var tmp;			
			OC_Utilities.getUrl('//'+model.config.baseURL +"/api/saveWorkshopData.php?rand=" +Math.random(), {xmlData: xml}, true, function(tmp){
				//for testting purpose ===> http://host-vd.oddcast.com/php/api/playScene/doorId=1217/clientId=217/mId=<mId>
				tmp = OC_Parser.getXmlDoc(tmp);
				tmp = OC_Parser.getXmlNode(tmp, 'MESSAGE');
				if(tmp){
				     tmp = OC_Parser.getXmlNodeAttribute(tmp, 'MID');
				}
				callback(tmp);
			});
		},
	    
	    
		emailMessage : function (mid, fromInfo, toInfos, extradata, cb){
			var strExtraData = "";
			for (var prop in extradata) {
				strExtraData += prop +"=" +encodeURIComponent(extradata[prop]) +"&amp;";
			}
		  
			xml = "";
			xml += '<player>\n';
			xml += '  <params>\n';
			xml += '    <door>' +this._wsSettings.doorId +'</door>\n';
			xml += '    <client>' +this._wsSettings.clientId +'</client>\n';
			xml += '    <topic>' +this._wsSettings.topicId +'</topic>\n';
			xml += '    <mode>email</mode>\n';
			xml += '    <appType>workshop</appType>\n';
			xml += '    <mid>'+mid+'</mid>\n';
			xml += '  </params>\n';

		  
			xml += '  <message>\n';
			xml += '    	<from>\n';
			xml += '    		<name>' +fromInfo[0] +'</name>\n';
			xml += '    		<email>' +fromInfo[1] +'</email>\n';
			xml += '    	</from>\n';
			xml += '    	<body></body>\n';
			for(var i=0; i<toInfos.length; i++){
				xml += '    <to>\n';
				xml += '    	<name>' +toInfos[i][0] +'</name>\n';
				xml += '    	<email>'+toInfos[i][1] +'</email>\n';
				xml += '    </to>\n';
			}
			xml += '  </message>\n';

			xml += '  <extradata>' +strExtraData +'</extradata>\n';
			xml += '</player>\n';
			var tmp;
			OC_Utilities.getUrl(this._api_base_url +"/api/sendMessage.php?rand=" +Math.random(), {xmlData: xml}, true, function(tmp){
				tmp = OC_Parser.getXmlDoc(tmp);
				tmp = OC_Parser.getXmlNode(tmp, 'MESSAGE');
				if(tmp){
					tmp = OC_Parser.getXmlNodeAttribute(tmp, 'MID');
				}
				cb(tmp);
			});
		},

		getExtraDataFromPlayScene : function (mid){
			try{
				var tmp = OC_Utilities.getUrl(this._api_base_url +"/php/api/playScene/doorId="  +this._wsSettings.doorId +"/clientId=" +this._wsSettings.clientId +"/mId=" +mid+"?rand=" +Math.random());
				tmp = OC_Parser.getXmlDoc(tmp);
				tmp = OC_Parser.getXmlNode(tmp, 'extradata');
				tmp = OC_Parser.getXmlNodeValue(tmp);
				if(tmp==null){
					//matt temp use for deugging purpose
					tmp="msg%3DI%20march%20to%20support%20awareness%26chptr%3D5%26hr%3D1%26hrc%3D15128939%26otft%3D1%26clr%3D13937030%26bgPos%3D0%2C0%2C1%2C0%26fn%3DDebug%20N%26bgid%3D51336%26%3D";
					//return null;
				}
				tmp = decodeURIComponent(tmp);
				var extradata = {};
				var vars = tmp.split('&');
				for (var i = 0; i < vars.length; i++) {
					 var pair = vars[i].split('=');
					 extradata[pair[0]] = decodeURIComponent(pair[1]);
				}
				return extradata;
			}catch(e){
				errorCaught(e, mid);
				return null;
			} 
		}
	}
  return OC_MessageSaver;
});