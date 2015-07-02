<!-- BEGIN info -->
README - IMPORTANT - REMOVED THIS BLOCK!
This is the default MySpace player template for all doors.
To customize this template for other doors, save it as a template in the format embed_myspace_*doorid*.tpl
Keep all the sws in the door's folder under swf ex: host-d.oddcast.com/door name/swf/player.swf
Same with all the images ex: host-d.oddcast.com/door name/images/

Template Variables: 
{doorId}		=> The Door ID
{clientId}		=> The Client ID
{topicId}		=> The Topic ID
{messageId}		=> The Message Id
{movieURL}		=> The URL to the SWF
{baseURL}		=> Accelrated URL
{imageURL}		=> Path the image folder 
{title}			=> Application Title
{descp}			=> Application Description
{contentURL}		=> Content Domain URL
{jsURL}			=> Accelerated URL /includes/
{fbcApplicationKey}	=> sets fbconnect key value
{fbcURL}		=> script tags for fbconnect and related oddcast functions

The below JAVASCRIPT was done this way so that each workshop can have there own parameters passed to them.  
<!-- END info --><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
<head>
  
<script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script><!--THIS NEEDS TO BE ABOVE BASE-->
<base href="http://{dynamicURL}/manu-profile-photo/" />

<title>WHAT DO YOU #PLAYFOR</title>
<!-- zei test--> 
<!-- Open Graph data --> 
<meta property="og:type" content="article" /> 
<meta property="og:url" content="{baseURL}" />
<meta property="og:image" content="https://www.google.com/images/srpr/logo11w.png" />
<meta property="og:title" content="{title}" /> 
<meta property="og:description" content="{descp}" />

<meta name="description" content="Learn tips to help raise more than more than $90,000 in sponsorship funds for the NHF, its participating chapters, and Save One Life.  Joining the Virtual Walk is fun, free, and easy!" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  
<!--<meta name="description" content="{descp}" />-->
<meta name="keywords" content="Chevy"/>
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=yes" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />


{youTubeJS}
<link rel="Stylesheet" type="text/css" href="//{baseURL}/manu-profile-photo/main.css"  id="main_css"/>
<link rel="stylesheet" type="text/css" href="//{baseURL}/manu-profile-photo/responsive_h.css"  id="responsiveH_css" />
<link rel="stylesheet" type="text/css" href="//{baseURL}/manu-profile-photo/responsive_v.css" id="responsiveV_css" />
<script type="text/javascript" src="//{baseURL}/includes/ws_common.js"></script>
<script type="text/javascript">
	var QueryString = function () {
	  // This function is anonymous, is executed immediately and 
	  // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	    	// If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = pair[1];
	    	// If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]], pair[1] ];
	      query_string[pair[0]] = arr;
	    	// If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(pair[1]);
	    }
	  } 
	    return query_string;
	} ();

	{fbcApplicationKey}

	var _wsSettings = { };
	_wsSettings.messageId = QueryString['mId']; //"{messageId}";
	_wsSettings.doorId = "{doorId}";
	_wsSettings.clientId = "{clientId}";
	_wsSettings.baseURL = "{baseURL}";
	_wsSettings.imageURL = "{imageURL}";
	_wsSettings.title = "{title}";
	_wsSettings.descp = "{descp}";
	_wsSettings.contentURL = "{contentURL}";
	_wsSettings.jsURL = "{jsURL}";
	_wsSettings.dynamicURL = "//{dynamicURL}";
	_wsSettings.accURL = "{accURL}";
	_wsSettings.trackingURL = "{trackingURL}";
	_wsSettings.topicId = "{topicId}";
	//+++++++++++++++++++++++++++
	_wsSettings.curURL=(document.URL).substring(0, (document.URL).indexOf('.oddcast.com/')+12);
	//+++++++++++++++++++++++++++
	_wsSettings.appDirectory = "manu-profile-photo";
	_wsSettings.fbcApplicationKey = fbcApplicationKey ;
</script>

<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/jquery-2.1.1.min.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/tracking.js"></script>
<script type="text/javascript">
  var trackingAcc='1221';
  var curLang=(QueryString['l']==null)?('us'):(QueryString['l']);
  switch(curLang) {
	case 'us':			trackingAcc='1221'; break;
	case 'cn':			trackingAcc='1227'; break;
	case 'mx':			trackingAcc='1228'; break;
	case 'queens':		trackingAcc='1229'; break;
	case 'kr':			trackingAcc='1230'; break;
	case 'jp':			trackingAcc='1231'; break;
	case 'th':			trackingAcc='1232'; break;
	case 'pt':			trackingAcc='1233'; break;
	case 'ru':			trackingAcc='1234'; break;
	case 'id':			trackingAcc='1235'; break;
	case 'arabic':		trackingAcc='1236'; break;
	case 'queens_row':	trackingAcc='1237'; break;
	case 'arabic_row':	trackingAcc='1238'; break;
	case 'sp_row':		trackingAcc='1239'; break;
	case 'queens_mutd':	trackingAcc='1242'; break;
	case 'queens_uae':	trackingAcc='1243'; break;
	case 'queens_sa':	trackingAcc='1244'; break;
	case 'queens_in':	trackingAcc='1245'; break;
	case 'queens_eg':	trackingAcc='1246'; break;
	case 'arabic_sa':	trackingAcc='1247'; break;
	case 'arabic_uae':	trackingAcc='1248'; break;
	case 'arabic_eg':	trackingAcc='1249'; break;
    default:			trackingAcc='1221';
  }
  OC_ET.init(_wsSettings.trackingURL, {'apt': 'W', 'acc':  trackingAcc, 'emb': '0'});
</script>
<script type="text/javascript">
	var curVer=(QueryString['ver']==null)?(2):(QueryString['ver']);
	if(curVer==2)document.getElementById('main_css').href=_wsSettings.curURL+"/manu-profile-photo/main2.css";
	if(curVer==2)document.getElementById('responsiveH_css').href=_wsSettings.curURL+"/manu-profile-photo/responsive_h2.css";
	if(curVer==2)document.getElementById('responsiveV_css').href=_wsSettings.curURL+"/manu-profile-photo/responsive_v2.css";
</script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/cpc_main.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/ocWorkshop.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/custom_main.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/extImg_getimagedata.min.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/ext_exif2.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/ext_binaryajax.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/ext_html5uploader.js"></script>
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/ext_img-touch-canvas.js"></script>
	



<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- RENREN / WEIBO ++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script type="text/javascript" src="//{baseURL}/manu-profile-photo/scripts/weiborenren.js"></script>

<div class='ugurDemo' style='z-index:9999999; display:none;background-color:blue; position:fixed; top:0; left:0; width: 120px; padding:10px;'>
	<a href="javascript:void(0)" onclick='rLogin()'>rLogin</a><br>
	<a href="javascript:void(0)" onclick='rGetProfileInfo()'>rGetProfileInfo</a><br>
	<a href="javascript:void(0)" onclick='rGetPictures()'>rGetPictures</a><br>
	<a href="javascript:void(0)" onclick='rPostStatus("TEST STATUS")'>rPostStatus</a><br>
	<a href="javascript:void(0)" onclick='rPostLink("TEST COMMENT", "http://google.com")'>rPostLink</a><br>
	<a href="javascript:void(0)" onclick='rShareLink("http://renren.com/", "TEST DESCRIPTION")'>rShareLink</a><br>
	<a href="javascript:void(0)" onclick='rPostPicture("http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png", "TEST COMMENT")'>rPostPicture</a><br>
	<a href="javascript:void(0)" onclick='rLogout()'>rLogout</a><br>
</div>
<div class='ugurDemo' style='z-index:9999999; display:none; background-color:green; position:fixed; top:0; left:140px; width: 120px; padding:10px;'>
	<a href="javascript:void(0)" onclick='wLogin()'>wLogin</a><br>
	<a href="javascript:void(0)" onclick='wGetProfileInfo()'>wGetProfileInfo</a><br>
	<a href="javascript:void(0)" onclick='wGetPictures()'>wGetPictures</a><br>
	<a href="javascript:void(0)" onclick='wPostStatus("TEST STATUS")'>wPostStatus</a><br>
	<a href="javascript:void(0)" onclick='wPostPictureStatus("TEST STATUS", "http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png")'>wPostPictureStatus</a><br>
	<a href="javascript:void(0)" onclick='wSharePictureStatus("http://oddcast.com", "TEST DESCRIPTION", "http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png")'>wSharePictureStatus</a><br>
	<a href="javascript:void(0)" onclick='wLogout()'>wLogout</a><br>
</div>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- fbConnect +++++++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script type="text/javascript">
	{fbcRequiredApplicationPermissions}
	{fbcApplicationKey}
</script>
<div id="fb-root"></div>
<script src="//connect.facebook.net/en_US/sdk.js"  type="text/javascript"></script>
<script type="text/javascript" src="//{baseURL}/includes/facebookconnectV2.js"></script>
<script type="text/javascript">
	fbcSwitchAlertMode();
	fbcVersion = 'v2.0';
</script>
<script type="text/javascript">fbcSetFormat('json')</script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- GOOGLE ANALYTICS CODE +++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-38520630-9', 'oddcast.com');
  ga('send', 'pageview');
</script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- FACEBOOK TRACKING CODE ++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script>(function() {
	var _fbq = window._fbq || (window._fbq = []);
	if (!_fbq.loaded) {
	    var fbds = document.createElement('script');
	    fbds.async = true;
	    fbds.src = '//connect.facebook.net/en_US/fbds.js';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(fbds, s);
	    _fbq.loaded = true;
  	}
})();
</script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- GOOGLE+ CODE ++++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script type="text/javascript">
	var gpClientId = '130352800933-v4p7mgm6eiprr0gksu5c5gasrq2c08u8.apps.googleusercontent.com';
	var gpApiKey = 'AIzaSyBz2-7DCIQ_LDIfN4UUpsq74YJWq9afPZM';
	var gpScopes = 'http://picasaweb.google.com/data/ https://www.googleapis.com/auth/plus.me';
	var gpAccessToken = "";
	var gpLoaded = false;
	var gpInitializeRequested = false;
	var gpInitialized = false;
</script>
<script type="text/javascript" src="//{baseURL}/includes/googleconnect.js"></script>
<script type="text/javascript">gpSetFormat('json');</script>
<script type="text/javascript" src="https://apis.google.com/js/client.js?onload=gpOnLoad"></script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- FACEBOOK CODE +++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script type="text/javascript">
function uploadProfilePicture(url){
	displayProgress(); //displayProgress_fake(1,98,null,100);
	console.log(_wsSettings.curURL+"/php/api/facebookAPI/?func=uploadPhoto&src=" +url +"&json=1&access_token=" +fbcAccessToken)
	OC_Utilities.getUrl(_wsSettings.curURL+"/php/api/facebookAPI/?func=uploadPhoto&src=" +url +"&json=1&access_token=" +fbcAccessToken, false, true, function(tmp){
			if(tmp.indexOf("id")==-1){
				alert("Please remove this fb app and readd it again");
				hideProgress();
				return;
			}
			var tmpObj = JSON.parse(tmp);
			console.log(tmpObj);
			if("id" in tmpObj){
				//NOW WE CAN REDIRECT THE USER TO FACEBOOK PAGE, this call must be trigger by a user action such as click
				//https://m.facebook.com/photo.php?fbid=10204089810510446&prof&ls=your_photo_permalink
				setProfilePicture(tmpObj.id)
			}
	});
}
function setProfilePicture(pId){
	var tmpURL = "https://m.facebook.com/photo.php?fbid=" +pId +"&prof&ls=your_photo_permalink";
	//window.open(tmpURL,'_blank',"width=512, height=512, titlebar=no");
	blocked_url_link=tmpURL;
	updateBlockedUrlTitle("fb_share_title", null);
	openPopwin('popwin_blockedurl');
	hideProgress();
}
</script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- TWITTER CODE ++++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<script type="text/javascript">
function ajax(url, cb){
   $.ajax({
      url: url,
      dataType: 'json',
      success: cb
  });
} 
function twLogin(cb){
	if(!cb) cb = "twLoginCB";
	//window.open("//{baseURL}/api_misc/{doorId}/twitterApi.php?cb="+cb, "Sign in with Twitter", "width=500,height=400");
	window.open(_wsSettings.curURL+"/api_misc/{doorId}/twitterApi.php?cb="+cb, "Sign in with Twitter", "width=500,height=400");
}
function twLoginCB(response){
  if(twStatusCallback !=null) {
	  twStatusCallback(response); //<== in custom_main.js
  }else{
	  if(response['error']){	//not logged in
		console.log("error: " +response['error']);
	  }else{					//Logged in
		console.log(response);
	  }  
  }
}
function twUpdateProfileImage(imgsrc, cb){
  ajax(_wsSettings.curURL+'/api_misc/{doorId}/twitterApi.php?f=UpdateProfileImage&image=' +encodeURIComponent(imgsrc), function(result){
    if(cb) cb(result)
    console.log(result)
  })
}
function twUpdateStatus(status, imgsrc, cb){
  if(!imgsrc)imgsrc = "";

  ajax(_wsSettings.curURL+'/api_misc/{doorId}/twitterApi.php?f=UpdateStatus&status=' +encodeURIComponent(status) +'&image=' +encodeURIComponent(imgsrc), function(result){
  	if(cb) cb(result)
    console.log(result)
  })
}
</script>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
<!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->


</head>




<body ontouchstart=""> 
<div id='_log' style='display:none; z-index:99999999; position:fixed; top:0; left:0; width:100%; height: 100px; background-color:#111;'></div>
<div id='fb-root'></div>
<div class="" id="mainpage"><!--MAINPAGE-->
<!--======================== bsPage (bigshow) ==========================-->
<div class="screenCanvas" id="bsPage">
	<div class="bsPage_title">
		<div class="pageTitle" id="bsPage_titleH">SHARE YOUR PRIDE</div>
		<div class="pageTitle" id="bsPage_titleV">SHARE YOUR PRIDE</div>
		<div class="pageSubtitle" id="bsPage_subtitleH">#PlayFor the team.</div>
		<div class="pageSubtitle" id="bsPage_subtitleV">#PlayFor the team.</div>
	</div>
	<div class="bsPage_bsPhoto">
		<canvas id="bsPhotoCanvas" width="400" height="400" style="display:block; position: absolute; top:0px; left:0px"></canvas>
	</div>
	<div class="bsPage_bsVideo">
		<div class="videoBG"></div>
		<div class="videoHolder">
			<video class="video" id="bsVideo" width="600" height="338" controls src=""></video>
		</div>
	</div>
	<div class="bsPage_createYourOwnBtn" onclick="clickCreateUrOwn()">
		<div class="btnTitle bBtnTitle" id="bsBtnTitle_createYourOwnBtn">CREATE YOUR OWN</div>
	</div>
</div>
<!--==============================page1=================================-->
<div class="screenCanvas" id="page1">
	<div class="page1_title">
		<div class="pageTitle" id="page1_titleH">CHARLTON, GIGGS, ROONEY AND YOU!</div>
		<div class="pageTitle" id="page1_titleV">CHARLTON, GIGGS, ROONEY AND YOU!</div>
		<div class="pageSubtitle" id="page1_subtitleH">Upload your picture to see yourself in the new Chevrolet Man Utd Shirt.</div>
		<div class="pageSubtitle" id="page1_subtitleV">Upload your picture to see yourself in the new Chevrolet Man Utd Shirt.</div>
	</div>

	<div class="page1_uploadBtns">
		<div class="uploadBtnsTitle" id="uploadBtnsTitle">CHOOSE OR TAKE A PHOTO</div>
		<div class="allBtns">
			<div class="uploadBtn uploadBtn_fb OCET" data-ocetcode="ce1" onclick="clickUploadBtn_fb();"><div class="btnTitle bBtnTitle" id="page1BtnTitle_fb">FACEBOOK</div></div>
			<div class="uploadBtn uploadBtn_gp OCET" data-ocetcode="ce2" onclick="clickUploadBtn_gp();"><div class="btnTitle bBtnTitle" id="page1BtnTitle_gp">GOOGLE</div></div>
			<!-- ++++++++++++++++++++++++ -->
			<div class="uploadBtn uploadBtn_camera OCET" data-ocetcode="ce3" id="uploadBtn_camera">
				<div class="btnTitle bBtnTitle" id="page1BtnTitle_camera">CAMERA</div>
				<!--div class="media-drop" id="media-drop-0">
					<div id="dropbox">
						<input accept="image/*" type="file" class="inputBtn" id="fileUpload">
					</div>
				</div-->
				<!--input accept="image/*" type="file" class="inputBtn" id="fileUpload0"-->
			</div>
			<!-- ++++++++++++++++++++++++ -->
		</div>
		<div class="uploadBtnsTerms" id="uploadBtnsTerms"><a href="http://www.chevrolet.com/fc-disclaimers.html" target="_blank">TERMS OF USE</a></div>
		<div class="uploadBtnsPrivacy" id="uploadBtnsPrivacy"><a href="http://www.gm.com/toolbar/privacyStatement.html" target="_blank">PRIVACY POLICY</a></div>
	</div>
	
</div>
<!--==============================page2=================================-->
<div class="screenCanvas" id="page2">
	<div class="page2_title">
		<div class="pageTitle" id="page2_titleH">TAKE YOUR BEST SHOT</div>
		<div class="pageTitle" id="page2_titleV">TAKE YOUR BEST SHOT</div>
		<div class="pageSubtitle" id="page2_subtitleH">Touch, scale, and drag your head to position it within the frame.</div>
		<div class="pageSubtitle" id="page2_subtitleV">Touch, scale, and drag your head to position it within the frame.</div>
	</div>
	
	<div class="page2_refPhotos">
		<div class="page2_refPhoto1"><div class="refPhotoTitle" id="refPhotoTitle1">EXAMPLE</div></div>
		<div class="page2_refPhoto2"><div class="refPhotoTitle" id="refPhotoTitle2">EXAMPLE</div></div>
	</div>

	<div class="page2_uploadPhoto">
		<canvas id="preUploadFaceCanvas" style="display:none; position: absolute; top:0px; left:0px"></canvas>
		<canvas id="finalMaskCanvas" width="400" height="400" style="display:block; position: absolute; top:0px; left:0px"></canvas>
		<canvas id="finalFaceCanvas" width="400" height="400" style="display:block; position: absolute; top:0px; left:0px"></canvas>
		
		<div class="uploadPhoto_bg"></div>
		<!--div class="uploadPhoto_body"></div-->
		<div style="-webkit-transform: scale3d(1.0, 1.0, 1); position: absolute; top:0px; left: 0px;">
			<div id="mycontainer" style="position: absolute;width: 400px; height: 400px; top:0px; left:0px">
				<canvas id="uploadFaceCanvas" style="width: 100%; height: 100%"></canvas>
			</div>
			<div id="mycontainer2" style="position: absolute;width: 400px; height: 400px; top:0px; left:0px">
				<canvas id="uploadGuideCanvas" style="width: 100%; height: 100%"></canvas>
			</div>
		</div>
	</div>

	<div class="page2_NameNumber" id="page2_NameNumber">
		<input placeholder="SURNAME" id="yourName2" SIZE=16 MAXLENGTH=16 type="text">
		<input placeholder="SURNAME" id="yourName" SIZE=16 MAXLENGTH=16 type="text">
		<input placeholder="00" id="yourNumber" SIZE=2 MAXLENGTH=2 onKeyPress="return numbersOnly(this, event)" type="text">
	</div>
	<div class="page2_hairBtns">
		<div class="hairbodyBtn hairBtn_back OCET" data-ocetcode="ce9" onclick="changeHair(-1)"></div>
		<div class="hairbodyBtn_title" id="hairBtnTitle">HAIR STYLE</div>
		<div class="hairbodyBtn hairBtn_next OCET" data-ocetcode="ce9" onclick="changeHair(1)"></div>
	</div>
	<div class="page2_bodyBtns">
		<div class="hairbodyBtn bodyBtn_minus" onclick="changeBody(-1)"></div>
		<div class="hairbodyBtn_title" id="bodyBtnTitle">CONTRAST</div>
		<div class="hairbodyBtn bodyBtn_plus" onclick="changeBody(1)"></div>
	</div>

	<div class="allBtn_back" onclick="back();">
		<div class="btnTitle wBtnTitle" id="page2BtnTitle_back">BACK</div>
	</div>
	<div class="allBtn_next OCET" data-ocetcode="ce10" onclick="createFinalPhotosVideo();">
		<div class="btnTitle bBtnTitle" id="page2BtnTitle_next">NEXT</div>
	</div>
</div>
<!--==============================page3=================================-->
<div class="screenCanvas" id="page3">
	<div class="page3_title">
		<div class="pageTitle" id="page3_titleH">SHARE YOUR PRIDE</div>
		<div class="pageTitle" id="page3_titleV">SHARE YOUR PRIDE</div>
		<div class="pageSubtitle" id="page3_subtitleH">Brilliant. Now share your photo and get your friends to #PlayFor the team.</div>
		<div class="pageSubtitle" id="page3_subtitleV">Brilliant. Now share your photo and get your friends to #PlayFor the team.</div>
	</div>
	<div class="page3_title2">
		<div class="pageTitle" id="page3_titleH2">SHARE YOUR PRIDE</div>
		<div class="pageTitle" id="page3_titleV2">SHARE YOUR PRIDE</div>
		<div class="pageSubtitle" id="page3_subtitleH2">Brilliant. Now share your photo and get your friends to #PlayFor the team.</div>
		<div class="pageSubtitle" id="page3_subtitleV2">Brilliant. Now share your photo and get your friends to #PlayFor the team.</div>
	</div>
	<div class="page3_sharePhoto">
		<canvas id="sharePhotoCanvas" width="400" height="400" style="display:block; position: absolute; top:0px; left:0px"></canvas>
	</div>
	<div class="page3_shareVideo">
		<div class="videoBG"></div>
		<div class="videoHolder">
			<video class="video" id="shareVideo"  width="600" height="338" controls autoplay src=""></video>
		</div>
	</div>
	<div class="page3_shareBtns">
		<div class="shareBtn shareBtn_fb" onclick="openFacebookWindow()"></div>
		<div class="shareBtn shareBtn_twitter" onclick="openTwitterWindow()"></div>
		<div class="shareBtn shareBtn_gplus" onclick="postToGoolePlus()"></div>
		<div class="shareBtn shareBtn_email" onclick="postToEmail()"></div>
		<div class="shareBtn shareBtn_youtube" onclick="postToYoutube()"></div>
		<div class="shareBtn shareBtn_geturl" onclick="openGetUrlWindow()"></div>
	</div>
	<div class="page3_switchBtns">
		<div class="page3_switchToPhoto" onclick="switchToShare('sharePhoto')">
			<div class="btnTitle bBtnTitle" id="page3BtnTitle_sharePhoto">SHARE PHOTO</div>
		</div>
		<!--div class="page3_switchToVideo" onclick="switchToShare('shareVideo')">
			<div class="btnTitle bBtnTitle" id="page3BtnTitle_shareVideo">SHARE VIDEO</div>
		</div-->
	</div>
	<div class="page3_allBackNextBtns">
		<div class="allBtn_back" onclick="clickPage3BackBtn();">
			<div class="btnTitle wBtnTitle" id="page3BtnTitle_back">BACK</div>
		</div>
		<div class="page3_uploadNewBtn OCET" data-ocetcode="ce16" onclick="pauseVideo('shareVideo'); showPage(1);">
			<div class="btnTitle wBtnTitle" id="page3BtnTitle_uploadNew">START OVER</div>
		</div>
	</div>
</div>
<!--============================ selectPhoto ============================-->
<!-- selectPhoto_fb +++++++++++ -->
<div class="photoCanvas" id="selectPhotoPage_fb">
		<div class="selectPhoto_title">
			<div class="pageTitle" id="selectFbPhoto_title">CHOOSE YOUR PHOTO</div>
		</div>
		
		<div class="allSelPhotoItems" id="allSelPhotoItems_fb">
			<div class="selPhotoArrow selPhotoArrow_back" id="selPhotoArrow_back_fb" onClick="movePhotoThumbs(-1,'fb');"></div>
			<div class="selPhotoThumbs"  id="selPhotoThumbs_fb">
				<div class="photoThumbs" id="photoThumbs_fb">
					<!--div class="photoThumb photoThumb_1" onclick="choosePhotoThumb(1,'fb')">
						<div class="photoThumbImg" id="photoThumbImg_fb_1"></div>
						<div class="photoThumbCover"></div>
					</div>
					<div class="photoThumb photoThumb_2" onclick="choosePhotoThumb(2,'fb')">
						<div class="photoThumbImg" id="photoThumbImg_fb_2"></div>
						<div class="photoThumbCover"></div>
					</div>
					<div class="photoThumb photoThumb_3" onclick="choosePhotoThumb(3,'fb')">
						<div class="photoThumbImg" id="photoThumbImg_fb_3"></div>
						<div class="photoThumbCover"></div>
					</div>
					<div class="photoThumb photoThumb_4" onclick="choosePhotoThumb(4,'fb')">
						<div class="photoThumbImg" id="photoThumbImg_fb_4"></div>
						<div class="photoThumbCover"></div>
					</div-->
				</div>
			</div>
			<div class="selPhotoArrow selPhotoArrow_next" id="selPhotoArrow_next_fb" onClick="movePhotoThumbs(1,'fb');"></div>
		</div>

		<div class="allBtn_back" onclick="closeOtherPage();">
			<div class="btnTitle wBtnTitle" id="selectFbPhotoBtnTitle_back">BACK</div>
		</div>
</div>
<!-- selectPhoto_gp +++++++++++ -->
<div class="photoCanvas" id="selectPhotoPage_gp">
		<div class="selectPhoto_title">
			<div class="pageTitle" id="selectGpPhoto_title">CHOOSE YOUR PHOTO</div>
		</div>
		
		<div class="allSelPhotoItems" id="allSelPhotoItems_gp">
			<div class="selPhotoArrow selPhotoArrow_back" id="selPhotoArrow_back_gp" onClick="movePhotoThumbs(-1,'gp');"></div>
			<div class="selPhotoThumbs" id="selPhotoThumbs_gp">
				<div class="photoThumbs" id="photoThumbs_gp">
				</div>
			</div>
			<div class="selPhotoArrow selPhotoArrow_next" id="selPhotoArrow_next_gp" onClick="movePhotoThumbs(1,'gp');"></div>
		</div>

		<div class="allBtn_back" onclick="closeOtherPage();">
			<div class="btnTitle wBtnTitle" id="selectGpPhotoBtnTitle_back">BACK</div>
		</div>
</div>
<!--==============================popwin=================================-->
<!-- fb ++++++++++++++++++++++ -->
<div class="popupCanvas" id="popwin_fb">
	<div class="popwinBox">
		<div class="closeBtn" onclick="closePopwin('popwin_fb');"></div>
		<div class="popwinUL_title">
			<div class="popwinTitle" id="fbShare_title">SHARE WITH FACEBOOK</div>
		</div>
		
		<div class="fbShareBtns">
			<div class="createProfilePicBtn OCET" data-ocetcode="ce12" onClick="postToFacebook_createProfilePic();">
				<div class="btnTitle bBtnTitle" id="fbShareBtnTitle_profile">CREATE PROFILE PHOTO</div>
			</div>
			<div class="content_or">
				<div id="fbShareContent_or">or</div>
			</div>
			<div class="postToFbBtn" onClick="postToFacebook_postToTimeline();">
				<div class="btnTitle bBtnTitle" id="fbShareBtnTitle_post">POST TO TIMELINE</div>
			</div>
		</div>
	</div>
</div>
<!-- twitter ++++++++++++++ -->
<div class="popupCanvas" id="popwin_twitter">
	<div class="popwinBox">
		<div class="closeBtn" onclick="closePopwin('popwin_twitter');"></div>
		<div class="popwinUL_title">
			<div class="popwinTitle" id="twitterShare_title">SHARE WITH TWITTER</div>
		</div>
		<div class="twitterShareBtns">
			<div class="createProfilePicBtn OCET" data-ocetcode="ce14" onClick="postToTwitter_createProfilePic();">
				<div class="btnTitle bBtnTitle" id="twitterShareBtnTitle_profile">CREATE PROFILE PHOTO</div>
			</div>
			<div class="content_or">
				<div id="twitterShareContent_or">or</div>
			</div>
			<div class="postToTwitterBtn" onClick="postToTwitter_tweetMyPic();">
				<div class="btnTitle bBtnTitle" id="twitterShareBtnTitle_post">TWEET MY PIC</div>
			</div>
		</div>
	</div>
</div>
<!-- geturl +++++++++++++++ -->
<div class="popupCanvas" id="popwin_geturl">
	<div class="popwinBox">
		<div class="geturlShareItems">
			<div class="popwinCT_title">
				<div class="popwinTitle" id="geturlShare_title">COPY URL</div>
				<div class="popwinSubtitle" id="geturlShare_subtitle">Select and copy the URL</div>
			</div>
			<div class="geturlInput">
				<input class="geturl_link OCET" data-ocetcode="ce14" id="geturl_link" type="text">
			</div>
		</div>
		<div class="closeBtn" onclick="closePopwin('popwin_geturl');"></div>
	</div>
</div>
<!-- blockedurl ++++++++++++ -->
<div class="popupCanvas" id="popwin_blockedurl">
	<div class="popwinBox">
		<div class="popwinUL_title">
			<div class="popwinTitle" id="blockedurlShare_title">SHARE WITH FACEBOOK</div>
		</div>
		<div class="blockedurlShareItems">
			<div class="popwinCT_title">
				<div class="popwinTitle" id="blockedurlShare_titleCT">SHARE WITH FACEBOOK</div>
				<div class="popwinSubtitle" id="blockedurlShare_subtitle">Select and copy the URL</div>
			</div>
			<div class="okBtn" onclick="openBlockedUrlPopwin();">
				<div class="btnTitle bBtnTitle" id="alertBtnTitle_ok">OK</div>
			</div>
		</div>
		<div class="closeBtn" onclick="closePopwin('popwin_blockedurl');"></div>
	</div>
</div>
<!-- alert ++++++++++++++++++++ -->
<div class="popupCanvas" id="popwin_alert">
	<div class="popwinBox">
		<div class="alertItems">
			<div class="popwinCT_title">
				<div class="popwinTitle popwinTitle2" id="alert_title">ALERT</div>
				<div class="popwinSubtitle" id="alertMessage"></div>
			</div>
			<div class="okBtn" onclick="closePopwin('popwin_alert');">
				<div class="btnTitle bBtnTitle" id="alertBtnTitle_ok">OK</div>
			</div>
		</div>
		<div class="closeBtn" onclick="closePopwin('popwin_alert');"></div>
	</div>
</div>
<!--============================== loader =====================================-->
<!--div class="loaderCanvas" id="firsttimeLoader">
	<div class="title"></div>
	<div class="percent">
		<div class="bar"></div>
	</div>
</div-->


<!-- PROGRESS SCREEN -->
<div class="loaderCanvas" id="progressLoader">
	<div class="title"></div>
	<div class="percent">
		<div class="bar"></div>
	</div>
</div>
<!--====================================================================-->
<div class="chevyLogo1"></div>
<div class="chevyLogo2"></div>
<div class="oddcastLogo" onclick="window.open('http://www.oddcast.com/', '_blank');"></div>
<!--===========================================================================-->
<div id="debugItems" style="position:absolute;top:80px;display:none">
	<div style="position: absolute; left:0px; top:0px;">
		<button type="button" style="position: absolute; left:0px; top:0px; width:100px;" onclick="clickTestBtn1()">test1</button>
		<button type="button" style="position: absolute; left:0px; top:30px; width:100px;" onclick="clickTestBtn2()">test2</button>
		<button type="button" style="position: absolute; left:0px; top:60px; width:100px;" onclick="clickTestBtn3()">test3</button>
		<button type="button" style="position: absolute; left:0px; top:90px; width:100px;" onclick="clickTestBtn4()">test4</button>
	</div>
	<div style="position: absolute; left:120px; top:0px;">
		My Debug Area
		<button type="button" style="position: absolute; left:0px; top:0px; width:80px;" onclick="myDebugArea.value=''">Clear Me!</button>
		<textarea style="position: absolute; left:0px; top:25px;" id = "myDebugArea" rows = "5" cols = "30"></textarea>
	</div>
	<div style="position: absolute; left:0px; top:150px;">
		<button type="button" style="position: absolute; left:0px; top:0px; width:100px;" onclick="clickTestBtn1b()">test1b</button>
		<button type="button" style="position: absolute; left:0px; top:30px; width:100px;" onclick="clickTestBtn2b()">test2b</button>
		<button type="button" style="position: absolute; left:0px; top:60px; width:100px;" onclick="clickTestBtn3b()">test3b</button>
		<button type="button" style="position: absolute; left:0px; top:90px; width:100px;" onclick="clickTestBtn4b()">test4b</button>
	</div>
	<div style="position: absolute; left:120px; top:150px;">
		<button type="button" style="position: absolute; left:0px; top:0px; width:100px;" onclick="clickTestBtn1c()">test1c</button>
		<button type="button" style="position: absolute; left:0px; top:30px; width:100px;" onclick="clickTestBtn2c()">test2c</button>
		<button type="button" style="position: absolute; left:0px; top:60px; width:100px;" onclick="clickTestBtn3c()">test3c</button>
		<button type="button" style="position: absolute; left:0px; top:90px; width:100px;" onclick="clickTestBtn4c()">test4c</button>
	</div>
</div>

<!--div style="position: absolute; width:300px; left:300px; top:0px;">
	<a href="javascript:void(0)" onclick="gpLogin()">gpLogin()</a>
	<br>
	<a href="javascript:void(0)" onclick="gpGetUserPictures()">gpGetUserPictures()</a>
	
	<br><br>
	>>> shareGooglePlus(url, languageCode)
	<br>
	<a href="https://developers.google.com/+/web/share/#available-languages" target='_blank'>Language Codes</a><br>
	<a href="javascript:void(0)" onclick="shareGooglePlus('http://www.oddcast.com')">shareGooglePlus('http://www.oddcast.com', 'en-US')</a>
	
	<br><br>
	>>> sharePinterest(url, media, description)
	<br>
	<a href="javascript:void(0)" onclick="sharePinterest('http://www.oddcast.com', 'http://myappmag.com/pic/100/003/oddcast.jpg', 'Description Field')">sharePinterest('http://www.oddcast.com', 'http://myappmag.com/pic/100/003/oddcast.jpg', 'Description Field')</a>
</div-->
<!--===========================================================================-->
</div><!--MAINPAGE-->


</body>
<script type="text/javascript">
	OC.init(_wsSettings);
	FB.init({appId: _wsSettings.fbcApplicationKey, status: true, cookie: true});
</script>


</html>