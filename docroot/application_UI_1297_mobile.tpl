  <!-- BEGIN info 
README - IMPORTANT - REMOVED THIS BLOCK! This is the default MySpace player template for all doors. To customize this template for other doors, save it as a template in the format embed_myspace_*doorid*.tpl Keep all the sws in the door's folder under swf ex: host-d.oddcast.com/door name/swf/player.swf Same with all the images ex: host-d.oddcast.com/door name/images/ Template Variables: {doorId} => The Door ID {clientId} => The Client ID {topicId} => The Topic ID {messageId} => The Message Id {movieURL} => The URL to the SWF {baseURL} => Accelrated URL {imageURL} => Path the image folder {title} => Application Title {descp} => Application Description {contentURL} => Content Domain URL {jsURL} => Accelerated URL /includes/ {fbcApplicationKey} => sets fbconnect key value {fbcURL} => script tags for fbconnect and related oddcast functions The below JAVASCRIPT was done this way so that each workshop can have there own parameters passed to them.
END info -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">

<head>
    <!-- TODO- load in via preloader <script type="text/javascript" src="//connect.facebook.net/en_US/all.js"></script> -->


    <!--THIS NEEDS TO BE ABOVE BASE-->
    <base href="http://{dynamicURL}/snuggle-valentine/mobile/" />

    <title>Snuggle&#039;s Share a Snug</title>
    
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


    <style>  
    * {
        margin:0;
        padding:0;
    }   
    body {       
        background-size: cover;
        background-color: #24afe9;
        font-family: "VAG Rounded W01 Bold", sans-serif;
        min-height:100%;
        height: 100%;
        height:100vh;
        min-height:100vh;
    }
    .spinner {        
        border-radius: 50%; /* Rounds out the halo */
        opacity: .7; /* Some subtle opacity to help blend with variable background colors */
        width: 32px;
        height: 32px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -16px;
        margin-top: -16px;
    }  
    #main-loading-spinner {
        display: none;
    }   
    #loading {
        opacity: 0;
        background: url("img/loading/loading-bg.jpg") no-repeat left top #24afe9;
        background-size: cover;
        width: 100%;
        height: 100%;
        overflow: hidden; 
        width: 100vw;
        height: 100vh; 
        position: absolute;
        z-index: 1000;     
    }
    #loading, #loading-heart {
        -webkit-transition: opacity 500ms ease-out 0;
        -moz-transition: opacity 500ms ease-out 0;
        -o-transition: opacity 500ms ease-out 0;
        transition: opacity 500ms ease-out 0;
    }
    #loading .loading-text {
        text-align: center;
        color: #ffffff;
        font-size: 1.375em;
        margin-top: -6%;
        margin-top: -25px;
        float: left;
        width: 60%;
        margin-top: -6%;
        padding: 20%;
        padding-top: 0;
    }
    #loading .share-a-snug {
        text-align: center;
        padding-top: 3%;
        text-align: center;
        margin-top: -25%;
        float: left;
        margin-left: auto;
        width: 100%; 
    }    
    #loading .share-a-snug img {
        width: 100%;
        max-width: 400px; 
    }
    #loading .loading-oddcast-logo {
        position: absolute;
        left: 50%;
        bottom: 101px;
        width: 100px;
        margin-left: -50px;
    }
    #loading .loading-oddcast-logo img {
        width: 100%;
        max-width: 104px; 
    }
    #loading .snuggle-logo img {
        width: 100%;
    }
    #loading .snuggle-logo {
        position: absolute;
        bottom: 14px;
        left: 15px;
        width: 84px;
    }
    #loading .cloud {   position: absolute; }
    #loading .cloud img {   width: 100%; }
    #loading .cloud.top-right {
        top: 3%;
        right: -66px;
        width: 211px;
        float: right;
        position: relative;
        position: relative; 
    }
    #loading .cloud.top-left {
        width: 112px;
        top: 13%;
        left: -10%; 
    }
    #loading .cloud.bottom-middle {
        bottom: 0;
        left: 50%;
        float: left;
        width: 195px;
        z-index: 10;
        height: 67px;
        overflow: hidden;
        margin-left: -104px;
    }   
    #loading .loading-bar {
        background: url("img/loading/loading-bar-bg.png") no-repeat left top;
        float: left;
        position: absolute;
        left: 50%;
        width: 395px;
        height: 103px;
        bottom: 65px;
        margin-left: -197.5px; 
    }
    #loading-heart {
        position: absolute;
        top: 12px;
        right: 19px;
        opacity: 0;
    }
    #loading-bar-fill {
        position: absolute;          
        left: 73px;
        top: 26px;
        width: 1px;
        overflow: hidden; 
        -webkit-transition: width .5s ease-out 0;
        -moz-transition: width .5s ease-out 0;
        -o-transition: width .5s ease-out 0;
        transition: width .5s ease-out 0;
    }  

    @media screen and (max-width: 320px) {
         #loading .loading-logo, #loading .loading-bar, #loading .loading-oddcast-logo {
            -webkit-transform: scale(.8);
            transform: scale(.8);
            -ms-transform: scale(.8);           
        }
        #loading .loading-logo{
            margin-top: -39%;
        }
        #loading .loading-bar {
            bottom: 5%;
        }
        
    }
</style>
</head>
<body ontouchstart="">
    <div id='fb-root'></div>
    <div id="landscape-blocker"></div>
    <img id="loading-spinner" class='spinner' src="img/common/spinner.gif"/>
    <div class='loading-spinner' id="main-loading-spinner"><img class="spinner" src="img/common/blue-spinner.gif"/></div>
    
    <div id="loading">        
        <div class="top-right cloud"><img src="img/loading/cloud.png"></div>
        <div class="top-left cloud"><img src="img/loading/cloud.png"></div>
        <div class="share-a-snug">
            <img src="img/loading/share-a-snug@2x.png">
            <div class="loading-text">
                <img src="img/loading/loading-text@2x.png">
            <!-- Share a snug </br> with someone special </br>this Valentine's Day -->
            </div>        
        </div>
        
        <div class="bottom-middle cloud"><img src="img/loading/cloud.png"></div>        
        <div class="loading-bar">
            <div id="loading-heart">
                <img src="img/loading/loading-heart.png">
            </div>
            <div id="loading-bar-fill">                
                <img src="img/loading/loading-bar-fill.png">
            </div>
        </div>

        <div class="loading-oddcast-logo"><img src="img/loading/oddcast-loading-logo@2x.png"></div>
        <div class="snuggle-logo"><img src="img/common/snuggle-logo@2x.png" /></div>
    </div>
    
    <!-- in templates/main.html -->
    <main id="landing"></main>
    
    <!-- in templates/sharing.html -->
    <section id="sharing"></section>
       
   

<script type="text/javascript">
    function preloadOnload(){document.getElementById("loading").style.opacity = '1';document.getElementById("loading-spinner").style.opacity = '0';window.scrollTo(0, 1);var e=document.createElement("script");e.src="js/preload.js";document.body.appendChild(e)}if(window.addEventListener)window.addEventListener("load",preloadOnload,false);else if(window.attachEvent)window.attachEvent("onload",preloadOnload);else window.onload=preloadOnload
</script>

</body>

<script type="text/javascript">
      {fbcRequiredApplicationPermission} 
      {fbcApplication}
</script>
<script type="text/javascript">
    var fbcApplicationKey = "173540005994564 ";
    var fbcRequiredApplicationPermissions = "user_about_me, publish_actions";

    var OC_CONFIG = {        
        //messageId  : QueryString['mId']; //"{messageId}";
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
        appDirectory : "snuggle-valentine",
        fbcAppKey    : fbcApplicationKey
    }
  
</script>


</html>
