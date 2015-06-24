<!-- BEGIN info -->
README - IMPORTANT - REMOVED THIS BLOCK! This is the default MySpace player template for all doors. To customize this template for other doors, save it as a template in the format embed_myspace_*doorid*.tpl Keep all the sws in the door's folder under swf ex: host-d.oddcast.com/door name/swf/player.swf Same with all the images ex: host-d.oddcast.com/door name/images/ Template Variables: {doorId} => The Door ID {clientId} => The Client ID {topicId} => The Topic ID {messageId} => The Message Id {movieURL} => The URL to the SWF {baseURL} => Accelrated URL {imageURL} => Path the image folder {title} => Application Title {descp} => Application Description {contentURL} => Content Domain URL {jsURL} => Accelerated URL /includes/ {fbcApplicationKey} => sets fbconnect key value {fbcURL} => script tags for fbconnect and related oddcast functions The below JAVASCRIPT was done this way so that each workshop can have there own parameters passed to them.
<!-- END info -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">

<head>
    <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script>
    <!--THIS NEEDS TO BE ABOVE BASE-->
    <base href="http://{dynamicURL}/nutcracker-2014/mobile/" />

    <title>Lindeman&#039;s Nutcracker Mobile E-card</title>
    <!-- zei test-->
    <!-- Open Graph data -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="{baseURL}" />
    <meta property="og:image" content="https://www.google.com/images/srpr/logo11w.png" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{descp}" />

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="description" content="{descp}" />
    <meta name="keywords" content="" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width, maximum-scale=1, user-scalable=yes" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
    {youTubeJS}


    <link rel="Stylesheet" type="text/css" href="//{baseURL}/nutcracker-2014/mobile/main.css" id="main_css" />
<!--  commented out by isaac 
    <link rel="stylesheet" type="text/css" href="//{baseURL}/nutcracker-2014/mobile/responsive_h.css" id="responsiveH_css" />
    <link rel="stylesheet" type="text/css" href="//{baseURL}/nutcracker-2014/mobile/responsive_v.css" id="responsiveV_css" />
-->

    <script type="text/javascript" src="//{baseURL}/includes/ws_common.js"></script>

    <script type="text/javascript">
        var QueryString = function () {
            // This function is anonymous, is executed immediately and 
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = pair[1];
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], pair[1]];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(pair[1]);
                }
            }
            return query_string;
        }();

        var fbcApplicationKey = "118257895016063";
        var fbcRequiredApplicationPermissions = "user_about_me, publish_actions";

        var _wsSettings = {};
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
        _wsSettings.curURL = (document.URL).substring(0, (document.URL).indexOf('.oddcast.com/') + 12);
         //+++++++++++++++++++++++++++
        _wsSettings.appDirectory = "nutcracker-2014";
        _wsSettings.fbcApplicationKey = fbcApplicationKey;
    </script>

    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/tracking.js"></script>


    <script type="text/javascript">
        var trackingAcc = '1253';
        OC_ET.init(_wsSettings.trackingURL, {
            'apt': 'W',
            'acc': trackingAcc,
            'emb': '0'
        });
    </script>


<!--  commented out by isaac
    <script type="text/javascript">
        var curVer = (QueryString['ver'] == null) ? (2) : (QueryString['ver']);
        if (curVer == 2) document.getElementById('main_css').href = _wsSettings.curURL + "/nutcracker-2014/mobile/main2.css";
        if (curVer == 2) document.getElementById('responsiveH_css').href = _wsSettings.curURL + "/nutcracker-2014/mobile/responsive_h2.css";
        if (curVer == 2) document.getElementById('responsiveV_css').href = _wsSettings.curURL + "/nutcracker-2014/mobile/responsive_v2.css";
    </script>
-->

<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/cpc_main.js"></script> commented out by isaac -->
    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/ocWorkshop.js"></script>
    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/custom_main.js"></script>
    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/video.js"></script>
<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/extImg_getimagedata.min.js"></script> commented out by isaac -->
<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/ext_exif2.js"></script> commented out by isaac -->
<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/ext_binaryajax.js"></script> commented out by isaac -->
<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/ext_html5uploader.js"></script> commented out by isaac -->
<!--    <script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/ext_img-touch-canvas.js"></script> commented out by isaac -->




    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- RENREN / WEIBO ++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!--<script type="text/javascript" src="//{baseURL}/nutcracker-2014/mobile/scripts/weiborenren.js"></script>-->

<!--    the following was commented out by isaac-->
<!--
    <div class='ugurDemo' style='z-index:9999999; display:none;background-color:blue; position:fixed; top:0; left:0; width: 120px; padding:10px;'>
        <a href="javascript:void(0)" onclick='rLogin()'>rLogin</a>
        <br>
        <a href="javascript:void(0)" onclick='rGetProfileInfo()'>rGetProfileInfo</a>
        <br>
        <a href="javascript:void(0)" onclick='rGetPictures()'>rGetPictures</a>
        <br>
        <a href="javascript:void(0)" onclick='rPostStatus("TEST STATUS")'>rPostStatus</a>
        <br>
        <a href="javascript:void(0)" onclick='rPostLink("TEST COMMENT", "http://google.com")'>rPostLink</a>
        <br>
        <a href="javascript:void(0)" onclick='rShareLink("http://renren.com/", "TEST DESCRIPTION")'>rShareLink</a>
        <br>
        <a href="javascript:void(0)" onclick='rPostPicture("http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png", "TEST COMMENT")'>rPostPicture</a>
        <br>
        <a href="javascript:void(0)" onclick='rLogout()'>rLogout</a>
        <br>
    </div>
    <div class='ugurDemo' style='z-index:9999999; display:none; background-color:green; position:fixed; top:0; left:140px; width: 120px; padding:10px;'>
        <a href="javascript:void(0)" onclick='wLogin()'>wLogin</a>
        <br>
        <a href="javascript:void(0)" onclick='wGetProfileInfo()'>wGetProfileInfo</a>
        <br>
        <a href="javascript:void(0)" onclick='wGetPictures()'>wGetPictures</a>
        <br>
        <a href="javascript:void(0)" onclick='wPostStatus("TEST STATUS")'>wPostStatus</a>
        <br>
        <a href="javascript:void(0)" onclick='wPostPictureStatus("TEST STATUS", "http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png")'>wPostPictureStatus</a>
        <br>
        <a href="javascript:void(0)" onclick='wSharePictureStatus("http://oddcast.com", "TEST DESCRIPTION", "http://s.xnimg.cn/imgpro/app/app-down/er/mdown_web_we.png")'>wSharePictureStatus</a>
        <br>
        <a href="javascript:void(0)" onclick='wLogout()'>wLogout</a>
        <br>
    </div>
-->


    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- fbConnect +++++++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <script type="text/javascript">
        {
            fbcRequiredApplicationPermissions
        } {
            fbcApplicationKey
        }
    </script>
    <div id="fb-root"></div>
    <script src="//connect.facebook.net/en_US/sdk.js" type="text/javascript"></script>
    <script type="text/javascript" src="//{baseURL}/includes/facebookconnectV2.js"></script>
    <script type="text/javascript">
        fbcSwitchAlertMode();
        fbcVersion = 'v2.0';
    </script>
    <script type="text/javascript">
        fbcSetFormat('json')
    </script>


    <!-- //TODO: later tonight+++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- GOOGLE ANALYTICS CODE +++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-38520630-9', 'oddcast.com');
        ga('send', 'pageview');
    </script>


    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- FACEBOOK TRACKING CODE ++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <script>
        (function () {
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
    <script type="text/javascript">
        gpSetFormat('json');
    </script>
    <script type="text/javascript" src="https://apis.google.com/js/client.js?onload=gpOnLoad"></script>


    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- FACEBOOK CODE +++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <script type="text/javascript">
        function uploadProfilePicture(url) {
            displayProgress(); //displayProgress_fake(1,98,null,100);
            console.log(_wsSettings.curURL + "/php/api/facebookAPI/?func=uploadPhoto&src=" + url + "&json=1&access_token=" + fbcAccessToken)
            OC_Utilities.getUrl(_wsSettings.curURL + "/php/api/facebookAPI/?func=uploadPhoto&src=" + url + "&json=1&access_token=" + fbcAccessToken, false, true, function (tmp) {
                if (tmp.indexOf("id") == -1) {
                    alert("Please remove this fb app and readd it again");
                    hideProgress();
                    return;
                }
                var tmpObj = JSON.parse(tmp);
                console.log(tmpObj);
                if ("id" in tmpObj) {
                    //NOW WE CAN REDIRECT THE USER TO FACEBOOK PAGE, this call must be trigger by a user action such as click
                    //https://m.facebook.com/photo.php?fbid=10204089810510446&prof&ls=your_photo_permalink
                    setProfilePicture(tmpObj.id)
                }
            });
        }

        function setProfilePicture(pId) {
            var tmpURL = "https://m.facebook.com/photo.php?fbid=" + pId + "&prof&ls=your_photo_permalink";
            //window.open(tmpURL,'_blank',"width=512, height=512, titlebar=no");
            blocked_url_link = tmpURL;
            updateBlockedUrlTitle("fb_share_title", null);
            openPopwin('popwin_blockedurl');
            hideProgress();
        }
    </script>


    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- TWITTER CODE ++++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <script type="text/javascript">
        function ajax(url, cb) {
            $.ajax({
                url: url,
                dataType: 'json',
                success: cb
            });
        }

        function twLogin(cb) {
            if (!cb) cb = "twLoginCB";
            //window.open("//{baseURL}/api_misc/{doorId}/twitterApi.php?cb="+cb, "Sign in with Twitter", "width=500,height=400");
            window.open(_wsSettings.curURL + "/api_misc/{doorId}/twitterApi.php?cb=" + cb, "Sign in with Twitter", "width=500,height=400");
        }

        function twLoginCB(response) {
            if (twStatusCallback != null) {
                twStatusCallback(response); //<== in custom_main.js
            } else {
                if (response['error']) { //not logged in
                    console.log("error: " + response['error']);
                } else { //Logged in
                    console.log(response);
                }
            }
        }

        function twUpdateProfileImage(imgsrc, cb) {
            ajax(_wsSettings.curURL + '/api_misc/{doorId}/twitterApi.php?f=UpdateProfileImage&image=' + encodeURIComponent(imgsrc), function (result) {
                if (cb) cb(result)
                console.log(result)
            })
        }

        function twUpdateStatus(status, imgsrc, cb) {
            if (!imgsrc) imgsrc = "";

            ajax(_wsSettings.curURL + '/api_misc/{doorId}/twitterApi.php?f=UpdateStatus&status=' + encodeURIComponent(status) + '&image=' + encodeURIComponent(imgsrc), function (result) {
                if (cb) cb(result)
                console.log(result)
            })
        }
    </script>
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    <!-- +++++++++++++++++++++++++++++++++++++++++++++++ -->
    
    <!-- isaac added video -->
    <link href="//vjs.zencdn.net/4.9/video-js.css" rel="stylesheet">
    <script src="//vjs.zencdn.net/4.9/video.js"></script>
    
</head>


<body ontouchstart="">
    <div id='fb-root'></div>
    <div class="main" id="mainpage">
        <!--MAINPAGE-->

        <!--==============================header=================================-->
        <div class="headerCanvas">
        </div>

        <!--======landing page======-->
        <div class="screenCanvas" id="landingPage" > 
<!--            style="display: none"-->
            <div class="landingCanvasContent">
                <div class="landingCanvasContent_nut">
                    <img id="nut_img" src="images/nutcracker.png" />
                </div>
                <div class="landingCanvasContent_balls">
                    <img id="balls_img" src="images/ornament.gif" />
                </div>
                <div class="landingCanvasContent_text">
                    <p>Share the festive spirit of the Lindeman's Nutcracker by sending your choice of <i>Notes from the Nutcracker</i> to your family and friends this holiday.</p>
                    <div class="landingCanvasContent_button">
                        <button id="button_get_started" type="button" onclick="jumpToPage('videoPage');isaac_load_video_select('instructions');OC_ET.event('ce1');"></button>
                    </div>
                </div>
                
                <div class="landingCanvasContent_mantel"></div>
            </div>
        </div>
        
        

        <!--======video page====== -->
        <div class="screenCanvas" id="videoPage" style="display: none">
            <div class="landingCanvasContent">

                <div class="landingCanvasContent_balls">
                    <img id="balls_img" src="images/ornament.gif" />
                </div>
                
                <div class="landingCanvasContent_glass" style="display: none">
                    <img id="glass_img" src="images/nutcracker.png" />
                </div>
<!--                onselect="isaac_load_video_select('instructions');"-->
				<select id="select_video" onchange="isaac_load_video_select();">
                    <option id="vid0" value="instructions" >Select Your E-card</option>
                    <option id="vid1" value="video/nutshell.mp4" >NUTSHELL</option>
                    <option id="vid2" value="video/nutty.mp4">NUTTY OR NICE</option>
                    <option id="vid3" value="video/kowabunga.mp4">DOWN UNDER</option>
                    <option id="vid4" value="video/winederful.mp4">WINE-DERFUL</option>
                </select>
                
                <div class="landingCanvasContent_video_buttons" style="">
					<button class="button_vid" id="vid_1" type="button" onclick="isaac_load_video('video/nutshell.mp4');"></button>
                    <button class="button_vid" id="vid_2" type="button" onclick="isaac_load_video('video/nutty.mp4');"></button>
                    <button class="button_vid" id="vid_3" type="button" onclick="isaac_load_video('video/kowabunga.mp4');"></button>
                    <button class="button_vid" id="vid_4" type="button" onclick="isaac_load_video('video/winederful.mp4');"></button>
				</div>
                				
<!--
				<div class="videoHolder">
					<video class="video" id="introVideo" controls src="video/nutshell.mp4" width="720" height="400"/>   
                </div>
-->
<!--    video/nutshell.jpg   data-setup='{ "example_option":true }'  autoplay-->
                <div class="videoHolder">
                    <video id="introVideo" class="video-js vjs-default-skin vjs-big-play-centered"
                          controls preload="auto"
                          poster=""
                          >
                         <source src="video/nutshell.mp4" type='video/mp4' />
                         <p class="vjs-no-js">To view this video please enable JavaScript</p>
                    </video>
                </div>
                

                
                <div class="videoPage_shareBtns">
                    <div id="video_share_text" ><p>SHARE:</p></div>
					<button class="shareBtn shareBtn_fb" type="button" onclick="isaac_share_facebook()"></button><!-- openFacebookWindow() -->
					<button class="shareBtn shareBtn_twitter" type="button" onclick="isaac_share_tweet()"></button><!-- openTwitterWindow()  -->
					<button class="shareBtn shareBtn_email" type="button" onclick="isaac_send_email()"></button><!-- postToEmail()  -->
					<button class="shareBtn shareBtn_geturl" type="button" onclick="openGetUrlWindow()"></button><!--   -->
				</div>
                
                <div class="landingCanvasContent_mantel"></div>
                
            </div>
        </div>

        <!--======bigshow page====== -->
        <div class="screenCanvas" id="bigshowPage" style="display: none">
            <div class="landingCanvasContent">

                <div class="landingCanvasContent_balls">
                    <img id="balls_img" src="images/ornament.gif" />
                </div>
                
 <!--
				<select id="select_video" onchange="isaac_load_video_select();">
                    <option id="vid0" value="default" >Select Your E-card</option>
                    <option id="vid1" value="video/nutshell.mp4" >NUTSHELL</option>
                    <option id="vid2" value="video/nutty.mp4">NUTTY OR NICE</option>
                    <option id="vid3" value="video/kowabunga.mp4">DOWN UNDER</option>
                    <option id="vid4" value="video/winederful.mp4">WINE-DERFUL</option>
                </select>
                
                <div class="landingCanvasContent_video_buttons" style="">
					<button class="button_vid" id="vid_1" type="button" onclick="isaac_load_video('video/nutshell.mp4');"></button>
                    <button class="button_vid" id="vid_2" type="button" onclick="isaac_load_video('video/nutty.mp4');"></button>
                    <button class="button_vid" id="vid_3" type="button" onclick="isaac_load_video('video/kowabunga.mp4');"></button>
                    <button class="button_vid" id="vid_4" type="button" onclick="isaac_load_video('video/winederful.mp4');"></button>
				</div>
-->
                				
				<div class="videoHolder">
					<video class="video" id="bigshowVideo" controls src="video/nutshell.mp4" width="720" height="400"/>   
                </div>

                <div id="bigshow_videoPage">
                    <button class="btn_videoPage_shareBtns" type="button" onclick="openGetUrlWindow();OC_ET.event('ce12');"></button>
				</div>
                
                <div class="landingCanvasContent_mantel"></div>
                
            </div>
        </div>
        
        <!--======share page====== -->
        <div class="screenCanvas" id="sharePage" style="display: none">
            <div class="landingCanvasContent">
                <div class="landingCanvasContent_balls">
                    <img id="balls_img" src="images/ornament.gif" />
                </div>
                <div id="urlHolder">
                    <div id="url_text_area">
                        <button id="button_X" type="button" onclick="jumpToPage('videoPage')"></button>
                        <p id="url_text">URLS goes here</p>
                        <input id="url_text_input" type="text" name="firstname" value="URLS goes here" readonly></input>
                        <div class="ok_button">
                            <button id="button_ok" type="button" onclick="jumpToPage('videoPage')"></button>
                        </div>
                    </div>
                    
                </div>
                <div class="landingCanvasContent_mantel"></div>
            </div>
        </div>
        
        
        
        <!--==============================footer=================================-->
        <div class="footerCanvas" id="bottomfooterCanvas">
            <div id="links"><a href="../privacy.php" target="_blank">Privacy Policy</a></div>
            <div id="copyright">&copy; 2014 TWE Imports, Napa, CA</div>
            <div id="enjoy"><img id="enjoy_img" src="images/footer.gif" /></div>
        </div>

    </div>
    <!--MAINPAGE-->

</body>


<script type="text/javascript">
    OC.init(_wsSettings);
    FB.init({
        appId: _wsSettings.fbcApplicationKey,
        status: true,
        cookie: true
    });
</script>


</html>