// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/sharing.html", "text!templates/email-message.html",],

    function($, Backbone, Model, template, EmailMessage){
        
        var ShareEmail = Backbone.View.extend({

            // The DOM Element associated with this view
            el: "#share-email-container",

            // View constructor
            initialize: function() {                
            },
            
            // View Event Handlers
            events: {
                "click #ok": 'onOKClick', 
            },            

            // Renders the view's template to the UI
            render: function() {
                
                var self = this;

                self.$el = $('#sharing');
                // Setting the view's template using the template method
                self.template = _.template(template, {shareMethod:'Email'});

                // Dynamically updates the UI with the view's template
                self.$el.html(self.template);

                $('.share-result').hide();
                                
                return this;
            },
                       
            share: function(mId){

                this.render();                
                
                $('#main-loading-spinner').fadeOut(300);
                $('#sharing').fadeIn();
                $('.share-in').fadeIn();
                
            },

            onOKClick: function(e){
                e.preventDefault();
                this.model.sendEmail();

                $('.share-confirm').fadeOut();
                $('.share-result').fadeIn();
            },

            onOKAfterClick: function(e){
                e.preventDefault();
               
                this.$el.fadeOut(200);
                window.router.navigate('landing', true);
                OC_ET.event("ce12");
            },
            
            close: function() {
                this.$el.fadeOut().empty();
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
                xml += '      <from>\n';
                xml += '        <name>' +fromInfo[0] +'</name>\n';
                xml += '        <email>' +fromInfo[1] +'</email>\n';
                xml += '      </from>\n';
                xml += '      <body></body>\n';
                for(var i=0; i<toInfos.length; i++){
                  xml += '    <to>\n';
                  xml += '      <name>' +toInfos[i][0] +'</name>\n';
                  xml += '      <email>'+toInfos[i][1] +'</email>\n';
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
            }

        });

        // Returns the View class
        return ShareEmail;

    }

);