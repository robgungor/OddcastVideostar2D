define(['backbone', 'underscore'], function(Backbone, _) {
//********************************************************************************
//START OC_Parser ------ XML and PARSING UTILITIES
//********************************************************************************
  var OC_Parser = {

    getXmlDoc : function (strXml){
      try{

        if (window.DOMParser){
          parser=new DOMParser();
          xmlDoc=parser.parseFromString(strXml,"text/xml");
        }
        else{ // Internet Explorer
          xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async=false;
          xmlDoc.loadXML(strXml); 
        }

        return xmlDoc;

      }catch(e){
        return null;
      }

    },

    getXmlNode : function (xml, tag, i){
		var index = 0;
		if(i){
			index = i;
		}

		var tmp;
		try{
			tmp = xml.getElementsByTagName(tag);
			if(tmp.length>index)
			  return tmp[index];
			}catch(e){
			errorCaught(e, xml);
		}

		return null;
    },

    getXmlNodeValue : function (node){
		try{
			return node.childNodes[0].nodeValue;
		}catch(e){
			errorCaught(e, node);
		}

		return null;
    },

    getXmlNodeAttribute : function (xml, attribute){
      return xml.getAttribute(attribute); 
    },

    wrapXmlNode : function (txt){
      return "<parentnode>" +txt +"</parentnode>";
    },

    getStrNodeValue : function (txt, tag){    
      var re = new RegExp("<" +tag +">([\\s\\S]*)</" +tag +">", "im");
      var out = txt.match(re);
      if(out && out!=null && out.length>0)
        return out[1];
      
      return null;
    }
  }

  return OC_Parser;
});