var ok; //this is the return value from event.php, defining it to prevent js warnings/errors

function SessionEventMap(){

  this.session_events_ar = [];
  this.interval_mask = 0;
  this.session_mask = 0;
  this.start_time = new Date();

  this.session_events_ar = [ 
                      {event:"acmic", bit:0},
                      {event:"actts", bit:1},
                      {event:"acph",  bit:2},
                      {event:"acup", bit:3},
                      {event:"edems", bit:4},
                      {event:"edsv", bit:5},
                      {event:"uirt", bit:6},
                      {event:"edvscr", bit:7},
                      {event:"edapu", bit:8},
                      {event:"edbgu", bit:9},
                      {event:"ce1", bit:10},
                      {event:"ce2", bit:11},
                      {event:"ce3", bit:12},
                      {event:"ce4", bit:13},
                      {event:"ce5", bit:14},
                      {event:"ce6", bit:15},
                      {event:"ce7", bit:16},
                      {event:"ce8", bit:17},
                      {event:"uieb", bit:18},
                      {event:"uiebms", bit:19},
                      {event:"uiebfb", bit:20},
                      {event:"edphs", bit:21},
                      //{event:"edmbls", bit:22},
                      {event:"accc", bit:22},
                      {event:"edvdx", bit:23},
                      {event:"edaux", bit:24},
                      {event:"edfbc", bit:25},
                      {event:"uiebws", bit:26},
                      {event:"edecs", bit:27},
                      {event:"uiebyt", bit:28},
                      {event:"eddlph", bit:29},
                      {event:"edsrhd", bit:30},
                      {event:"edsrse", bit:31},
                      {event:"edsrsm", bit:32},
                      {event:"edsrpb", bit:33},
                      {event:"edsrpp", bit:34},
                      {event:"edsrpl", bit:35},
                      {event:"edsrwc", bit:36},
                      {event:"edmbls", bit:37},
                      {event:"ce9", bit:38},
                      {event:"ce10", bit:39},
                      {event:"ce11", bit:40},
                      {event:"ce12", bit:41},
                      {event:"ce13", bit:42},
                      {event:"ce14", bit:43},
                      {event:"ce15", bit:44},
                      {event:"ce16", bit:45}
      ];


      



    this.getSessionEventData = function()
    {
      var t_obj = {};
      t_obj["session_mask"] = this.session_mask;
      t_obj["interval_mask"] = this.interval_mask;
      t_obj["session_time"] = Math.round((new Date().getTime() - this.start_time.getTime())/1000);
      
      this.session_mask += this.interval_mask;
      this.interval_mask = 0;

      return t_obj;
    }
      
    this.sessionEvent = function (in_event)
    {
      for (var i = 0; i < this.session_events_ar.length; ++i)
      {

        if (this.session_events_ar[i].event == in_event)
        {
          var t_o = this.session_events_ar[i];
          this.session_events_ar.splice(i, 1);
          this.interval_mask += Math.pow(2, t_o.bit);
          break;
        }
      }
    }
    
    this.destroy = function()
    {
      this.session_events_ar = null;
      this.start_time = null;
    }


}

function OddcastSharedObject(id, expiration, priority){
  priority = defaultValue(priority, "");

  this.so_data = null;
  this.enabled = true;
  this.shared_obj = null;

  this.max_so_size = 2048;
  this.so_id = "";
  this.auto_delete_tries = 4;
  this.PERMANENT = "permanent";
  this.flush_status = "";


  this.flush_cookie = function(value) {
    name = "oddcast_so" 
    var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
  }

  this.read_cookie = function() {
   name = "oddcast_so"    
   var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
   result && (result = JSON.parse(result[1]));

   return result;
  }

  this.delete_cookie  = function(name) {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
  }



  



  this.getDataObject = function(){

      if (!this.enabled)
        return null;
      
      if (this.so_data == null)
      {
        return new Object();
      }
      else
      {
        return this.so_data;
      }

  }

  

  this.deleteSO = function(remove_all)
    {

      remove_all = defaultValue(remove_all, false);
      if (!this.enabled)
        return;
      
      if (!isNull(this.shared_obj))
      {
        if (remove_all)
        {
          this.shared_obj = new Object();
          //this.shared_obj.data = new Array();
          this.shared_obj.data = new Object();
        }
        else
        {
          var t_obj = new Object();
          for (var s1 in this.shared_obj.data)
          {
            if (this.shared_obj.data[s1].priority == "PERMANENT")
            {
              t_obj[s1] = this.shared_obj.data[s1];
            }
          }
          this.shared_obj = new Object();
          //this.shared_obj.data = new Array();
          this.shared_obj.data = new Object();
          for (var s2 in t_obj)
          {
            this.shared_obj.data[s2] = t_obj[s2];
          }
          this.flushSO();
        }
      }
    }



  this.internalDeleteSO = function()
  {
      if (!this.enabled)
        return;
      
      if (this.auto_delete_tries == 0) 
      {
        this.deleteSO(true);
      }
      else
      {
        this.deleteSO();
      }
      --this.auto_delete_tries;
  }

  this.flushSO = function()
  {
      if (!this.enabled)
        return;

     try
      {
        this.flush_cookie(this.shared_obj); 
      }
      catch(e)
      {
        trace("SHARED OBJECT - FLUSH ERROR - "+e.message);
      }
  }


  this.write = function(obj){

    if (!this.enabled)
        return false;   

    if (this.shared_obj != null && this.so_id.length > 0 && this.shared_obj.data[this.so_id] != null && this.shared_obj.data[this.so_id].data != null)
    {
      this.so_data = obj;
      this.shared_obj.data[this.so_id].data = this.so_data;
      this.flushSO();
      if (this.shared_obj.size > this.max_so_size) this.internalDeleteSO();
      return true;
    }
    else
    {
      return false;
    }
  }


  this.cleanUp = function()
  {
      if (!this.enabled)
        return;
      
      var t_obj = new Object();
      for (var s1 in this.shared_obj.data)
      {
        if (s1.length > 0 && this.shared_obj.data[s1] != null)
        {
          var t_so_date;
         //if (shared_obj.data[s1].toString() == "[object Object]" && shared_obj.data[s1].expiration != null && shared_obj.data[s1].expiration is Date) 
         if (typeof this.shared_obj.data[s1] == "object" && !isNull(this.shared_obj.data[s1].expiration)) {
            //convert string to date here
            t_so_date = new Date(this.shared_obj.data[s1].expiration)
          }

          var t_now_date = new Date();
          if (t_so_date == null || t_so_date.getTime() > t_now_date.getTime())
          {
            t_obj[s1] = this.shared_obj.data[s1]
          }
        }
      }

      this.shared_obj = new Object();
      //this.shared_obj.data = new Array();
      this.shared_obj.data = new Object();
      for (var s2 in t_obj)
      {
        this.shared_obj.data[s2] = t_obj[s2];
      }
      this.flushSO();
    }

  
    //init
    this.init = function(){

        if (!this.enabled)
          return;

        try
        {

          this.shared_obj = this.read_cookie("oddcast_so");   
          if(this.shared_obj==null){
            this.shared_obj =  new Object();
            //this.shared_obj.data = new Array();
            this.shared_obj.data = new Object();
          }
        }
        catch(e)
        {
          //console.log("SHARED OBJECT ERROR !!! "+e.message);
        }

        if (this.shared_obj != null && id.length > 0)
        {
          if (getSize(this.shared_obj) > this.max_so_size) this.internalDeleteSO();
          //shared_obj.addEventListener(NetStatusEvent.NET_STATUS, e_netStatus);
          this.cleanUp();
          this.so_id = id;
          if (this.shared_obj.data[this.so_id] == null)
          {
            this.shared_obj.data[this.so_id] = new Object();
          }
          if (this.shared_obj.data[this.so_id].data == null)
          {
            this.shared_obj.data[this.so_id].data = new Object();
          }
          this.so_data = this.shared_obj.data[this.so_id].data;
          this.shared_obj.data[this.so_id].expiration = expiration.toUTCString();

          this.shared_obj.data[this.so_id].priority = priority;
          this.shared_obj.data[this.so_id].name = this.so_id;
          this.flushSO();
        }
    }



    this.init();


}

function EventTracker(){
 
    this.req_domain = "http://track.oddcast.com/event.php";
    this.send_frequency = 2000;
    this.sendTimer;

    this.max_so_size = 10000;
    this.session_end = 1200000; // max session time is 20 minutes 
    
    this.app_type = null;      // W - Workshop editor, w - Workshop player, v - VHSS player, k - Voki player, K - Voki editor, S - SitePal editor, P - Pro Editor
    this.account_id = null;    // for workshop this is the door id
    this.show_id = null;     // for workshop this is the message id
    this.skin_id = null;     // for workshop this is the topic id
    this.scene_id = null;
    this.partner_id = null;
    this.app_id = null;
    this.email_session = null;
    this.embed_session = null;
    this.swf_name = null;
    
    this.page_domain = null;
    
    this.so = null;
    //this.so_data = null;
    this.so_data_id = null;
    this.unique = null;
    this.eventtime = null;
    
    this.events = null;
    this.init_obj = null;
    this.session_event_map = null;

    etself = this;

    this.onetimeevents = {};



    this.init = function(in_req_url, in_init_obj, in_loader){

      in_loader = defaultValue(in_loader, null);

      if (in_req_url != null)       this.req_domain = in_req_url;
      if (in_init_obj == null) in_init_obj = new Object();
      this.init_obj = in_init_obj;
      if (!isNull(in_init_obj["apt"]))   this.app_type = in_init_obj["apt"];
      if (!isNull(in_init_obj["acc"]))   this.account_id = in_init_obj["acc"];
      if (!isNull(in_init_obj["shw"]))   this.show_id = in_init_obj["shw"];
      if (!isNull(in_init_obj["skn"]))   this.skin_id = in_init_obj["skn"];
      if (!isNull(in_init_obj["prt"]))   this.partner_id = in_init_obj["prt"];
      if (!isNull(in_init_obj["api"]))   this.app_id = in_init_obj["api"];
      if (!isNull(in_init_obj["eml"]))   this.email_session = in_init_obj["eml"]; 
      if (!isNull(in_init_obj["dom"]))   this.page_domain = in_init_obj["dom"];
      if (!isNull(in_init_obj["scn"]))   this.scene_id = in_init_obj["scn"];
      if (!isNull(in_init_obj["emb"]))   this.embed_session = in_init_obj["emb"];
      
      /*
      try
      {
        var t_regex = /(?<=\/|\\)(\w*)\.swf/gi;
        var t_swf_url = in_loader.loaderURL;
        this.swf_name = t_regex.exec(t_swf_url)[0];
      }catch(e){}
      */
      //events = new Object();
      this.events = {};



      try
      {
        var t_so_date = new Date();
        t_so_date.setMonth(t_so_date.getMonth()+1);
        this.so = new OddcastSharedObject(this.account_id, t_so_date);

      }
      catch(e)
      {
        //console.log("EVENTTRACKER SHARED OBJECT ERROR !!! "+e.message);
      }
      

      if (this.so != null)
      {
        var t_so_data = this.so.getDataObject();
        t_so_data = this.cleanUpOldData(t_so_data);
        this.so.write(t_so_data);


        //this.so_data = this.getSOData();
        //access so_data through so object
        {
          if (this.so.so_data == null)
          {
            this.so.so_data = new Object();
          }
          
          if (this.account_id != null)
            this.so_data_id = this.account_id
            
          if (this.show_id != null)
             this.so_data_id = this.show_id
           
          if (this.scene_id != null)
            this.so_data_id = this.scene_id          

          if (this.so.so_data[this.so_data_id] == null) 
            this.so.so_data[this.account_id] = new Object();
        }

      }
      
      
      var t_date = new Date();
      var t_m = t_date.getMonth();
      var t_d = t_date.getDate();
      
        this.session_event_map = new SessionEventMap();//so_data);
        // it is a new month for this year, ergo a new day as well
        if (this.so != null)
        {
          //if (this.so_data.date_mn == undefined || this.so_data.date_mn.getMonth() != t_date.getMonth())
          if (isNull(this.getSODataCopy().date_mn) || new Date(this.getSODataCopy().date_mn).getMonth() != t_date.getMonth())
          {
            this.unique  = 1; //= this.so_data.visits
            this.setSODataProperty('visits', 1);
            this.setSODataProperty('date_mn', new Date().toUTCString());
            //this.so_data.date_mn = new Date().toUTCString();
            this.setSODataProperty('date_day', new Date().toUTCString());
            //this.so_data.date_day = new Date().toUTCString();
          } 
          // it is a new day for this user
          else if (isNull(this.getSODataCopy().date_day) || new Date(this.getSODataCopy().date_day).getDate() != t_date.getDate())
          {

            this.setSODataProperty('visits', this.getSODataCopy().visits + 1);
            this.unique = this.getSODataCopy().visits
            //this.unique = ++this.so_data.visits;
            this.setSODataProperty('date_day', new Date().toUTCString());
            //this.so_data.date_day = new Date().toUTCString();;
          }
          // this user has been here before during this day
            else
          {
            this.unique = 0;
          }
          this.so.write(this.so.getDataObject());
        }
        else
        {
          this.unique = 0;
        }
      
        
        this.event("tss", "0"); // tss - tracking session started. sent only the first time
        this.sendEvents();

        this.sendTimer = setInterval(this.sendEvents, this.send_frequency);
    }
    //END OF INIT



    this.setAccountId = function(in_acc)
    {
      this.account_id = in_acc;
    }
    
    this.setShowId = function(in_show)
    {
      this.show_id = in_show;
    }
    
    this.setSceneId = function(in_scene)
    {
      this.scene_id = in_scene;
    }
    
    this.setAppType = function(in_app)
    {
      this.app_type = in_app;
    }
    
    this.setPageDomain = function(in_pd)
    {
      this.page_domain = in_pd;
    }
    
    this.setSkinId = function(in_skin)
    {
      this.skin_id = in_skin;
    }
    
    this.setPartnerId = function(in_partner)
    {
      this.partner_id = in_partner;
    }
    
    this.setAppId = function(in_app_id)
    {
      this.app_id = in_app_id;
    }
    
    this.setEmailSession = function(in_eml_session)
    {
      this.email_session = in_eml_session;
    }
    
    this.setRequestDomain = function(in_str)
    {
      this.req_domain = in_str;
    }




    this.event = function(in_event, in_scene, in_count, in_value)
    {
      in_scene = defaultValue(in_scene, null);
      in_count = defaultValue(in_count, 0);
      in_value = defaultValue(in_value, null);
      
      if (this.account_id != null && this.app_type != null && in_event != null)
      {
        var t_et = (this.eventtime != null) ? Math.round((new Date().getTime() - this.eventtime.getTime())) : 0;
        if (t_et > this.session_end)  // 20 minutes has elapsed - RESTART SESSION 
        {
          this.eventtime = new Date();
          
          window.clearTimeout(this.sendTimer)
          this.init(this.req_domain, this.init_obj);

        }
        if (in_scene == null && this.scene_id == null)
        {
          in_scene = "0";
        }
        else if (in_scene == null)
        {
          in_scene = this.scene_id;
        }
        if (this.events[in_scene] == null) this.events[in_scene] = new Array();
        this.events[in_scene].push({event:in_event, count:in_count, value:in_value});
        this.session_event_map.sessionEvent(in_event);

      }
    }



   this.sendEvents = function (evt)
    {

      evt = defaultValue(evt, null);
      var t_ev_str = new String();
      
      for (var i in etself.events)
      {
        for (var n = 0; n < etself.events[i].length; ++n)
        {
          t_ev_str += "&ev[" + i + "][]=" + etself.events[i][n].event;
          if (etself.events[i][n].count > 1)
          {
            t_ev_str += "&cnt[" + etself.events[i][n].event + "]=" + etself.events[i][n].count;
          }
          if (etself.events[i][n].value != null)
          {
            t_ev_str += "&val[" + i + "][" + etself.events[i][n].event + "][]="+String(etself.events[i][n].value).substr(0, 20);
          }
        }
      }
      etself.events = new Object();
      if (t_ev_str.length > 6)
      {   
        var t_str = "?";
        
        // top level parameters
        t_str += "apt="+etself.app_type;
        t_str += "&acc="+etself.account_id;
        if (etself.swf_name != null) t_str+= "&swf="+etself.swf_name;
        if (etself.show_id != null) t_str += "&shw="+etself.show_id;
        if (etself.skin_id != null) t_str += "&skn="+etself.skin_id;
        if (etself.partner_id != null) t_str += "&prt="+etself.partner_id;
        if (etself.app_id != null) t_str += "&api="+etself.app_id;
        if (etself.email_session == "1") t_str += "&eml="+etself.email_session;
        if (etself.embed_session != null) t_str += "&emb="+etself.embed_session;
        if (etself.page_domain != null) t_str += "&dom="+etself.page_domain;
        t_str += "&uni="+etself.unique;
        var t_obj = etself.session_event_map.getSessionEventData();
        t_str += "&sm="+t_obj["session_mask"] ;
        if (t_obj["interval_mask"] != 0) t_str += "&st["+t_obj["interval_mask"]+"]="+t_obj["session_time"];
        //end top level parameters
        
        var et = (etself.eventtime == null) ? 0 : Math.round((new Date().getTime() - etself.eventtime.getTime())/1000);
        t_str += "&et="+et+t_ev_str;
        
        etself.sendRequest(t_str);
        etself.eventtime = new Date();
        
      }
    }
     


    this.sendRequest = function(in_str)
    {
      
      console.log("TRACKING: " +etself.req_domain+in_str)
      //return;

      $.ajax({
          type: "GET",
          url: etself.req_domain+in_str,
          async: true,
          dataType : 'script',      
          complete: function(data, textStatus, errorThrown) { 
          	this.embed_session = null;
          }
      });
    }


    this.destroy = function()
    {
      this.req_domain = null;
      this.app_type = null;
      this.account_id = null;
      this.show_id = null;
      this.skin_id = null;
      this.scene_id = null;
      this.partner_id = null;
      this.app_id = null;
      this.email_session = null;
      this.embed_session = null;
      this.page_domain = null;
      this.eventtime = null;
      this.events = null;
      this.init_obj = null;
      if (this.sendTimer != null)
      {
        window.clearTimeout(this.sendTimer)
        this.sendTimer = null;
      }
      if (this.so != null)
      {
        this.so = null;
      }
      //this.so_data = null;
      if (this.session_event_map != null)
      {
        this.session_event_map.destroy();
        this.session_event_map = null;
      }
      
    }


    this.cleanUpOldData = function(o, ref, st)
    {
      ref = defaultValue(ref, null);
      st = defaultValue(st, null);
      var i;
      for (i in o)
      {
        var t_str = (ref == null) ? i : ref;
        var t_str1 = (st == null) ? "" : "    "+st;
        
        if (typeof o[i] == "object")
        {
          this.cleanUpOldData(o[i], t_str, t_str1);
        }
      }
      if (o.hasOwnProperty("eventtime") && o.getMonth)
      {
        for (i in o)
        {
          if (i != "date_day" && i != "date_mn" && i != "visits") delete o[i];
        }
      }
      return o;
    }


    this.getSODataCopy = function()
    {
      var o = this.so.getDataObject();
      if (this.account_id != null){
        if (o[this.account_id] == null) o[this.account_id] = new Object();
        o = o[this.account_id];
      }
      if (this.show_id != null){
        if (o[this.show_id] == null) o[this.show_id] = new Object();
        o = o[this.show_id];
      }
      if (this.scene_id != null){
        if (o[this.scene_id] == null) o[this.scene_id] = new Object();
        o = o[this.scene_id];
      }
      return o;
    }


    this.setSODataProperty = function(prop, val){
      this.so.so_data[this.so_data_id][prop] = val;
    }

   

}

function getSize(obj){
  return JSON.stringify(obj).length;
}

function isNull(arg){
  return (typeof arg === 'undefined' || arg === null)
}

function defaultValue(arg, val){
  if (typeof arg === 'undefined')
    return val;
  else
    return arg;
}


var OC_ET = new EventTracker();
