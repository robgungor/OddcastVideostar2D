  <!-- BEGIN info 
README - IMPORTANT - REMOVED THIS BLOCK! This is the default MySpace player template for all doors. To customize this template for other doors, save it as a template in the format embed_myspace_*doorid*.tpl Keep all the sws in the door's folder under swf ex: host-d.oddcast.com/door name/swf/player.swf Same with all the images ex: host-d.oddcast.com/door name/images/ Template Variables: {doorId} => The Door ID {clientId} => The Client ID {topicId} => The Topic ID {messageId} => The Message Id {movieURL} => The URL to the SWF {baseURL} => Accelrated URL {imageURL} => Path the image folder {title} => Application Title {descp} => Application Description {contentURL} => Content Domain URL {jsURL} => Accelerated URL /includes/ {fbcApplicationKey} => sets fbconnect key value {fbcURL} => script tags for fbconnect and related oddcast functions The below JAVASCRIPT was done this way so that each workshop can have there own parameters passed to them.
END info -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">

<head>
    <!-- TODO- load in via preloader <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script> -->


    <!--THIS NEEDS TO BE ABOVE BASE-->
    <base href="http://{dynamicURL}/template-2d-videostar-widget/mobile/" />

    <title>VideoStar2D Template</title>
    
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
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=2.0, width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
    <!-- {   youTubeJS
    }-->
    
    <link rel="Stylesheet" type="text/css" href="css/loading.css" id="loading_css" />
    <style>  
    
</style>
</head>
<body ontouchstart="">
    
    <img id="loading-spinner" class='spinner' src="img/common/spinner.gif"/>
    <div class='loading-spinner' id="main-loading-spinner"><img class="spinner" src="img/common/blue-spinner.gif"/></div>

   <div id="loading">        
       
        <div class="loading-bar">            
            <div id="loading-bar-fill" >                
                <img src="img/loading/loading-bar-fill.png">
            </div>
        </div>

        <div class="loading-oddcast-logo"><img src="img/loading/oddcast-loading-logo@2x.png"></div>        
    </div>

    <section id="upload-container"></section>
    <section id="positioning-container"></section>
    <!-- in templates/main.html -->
    <main id="landing"></main>
    

    <!-- in templates/sharing.html -->
    <section id="sharing"></section>       

    <div id='fb-root'></div>

<script type="text/javascript">
    function preloadOnload(){document.getElementById("loading").style.opacity = '1';document.getElementById("loading-spinner").style.opacity = '0';window.scrollTo(0, 1);var e=document.createElement("script");e.src="js/preload.js";document.body.appendChild(e)}if(window.addEventListener)window.addEventListener("load",preloadOnload,false);else if(window.attachEvent)window.attachEvent("onload",preloadOnload);else window.onload=preloadOnload
</script>


</body>

<script type="text/javascript">
      {fbcRequiredApplicationPermission} 
      {fbcApplication}
</script>
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


    var fbcApplicationKey = "173540005994564 ";
    var fbcRequiredApplicationPermissions = "user_about_me, publish_actions";

    var OC_CONFIG = {        
        //messageId      : "{messageId}",
        doorId       : "{doorId}",
        clientId     : "{clientId}",
        baseURL      : "{baseURL}",
        imageURL     : "{imageURL}",
        title        : "{title}",
        descp        : "{descp}",
        contentURL   : "{contentURL}",
        jsURL        : "{jsURL}",
        dynamicURL   : "//{dynamicURL}",
        accURL       : "{accURL}",
        trackingURL  : "{trackingURL}",
        topicId      : "{topicId}",        
        curURL       : (document.URL).substring(0, (document.URL).indexOf('.oddcast.com/') + 12),
        appDirectory : "template-2d-videostar-widget",
        fbcAppKey    : fbcApplicationKey
    }
    OC_CONFIG.messageId = QueryString['mId'];
    if({messageId} > 0){
        var d = document.getElementById("loading");
        d.className = d.className + " big-show";
    }
</script>


</html>
