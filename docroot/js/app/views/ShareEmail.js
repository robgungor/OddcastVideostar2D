// LandingView.js
// -------
define(["jquery", "backbone", "models/App", "text!templates/sharing.html", "text!templates/email-message.html",],

    function($, Backbone, Model, template, EmailMessage){
        
        var ShareEmail = Backbone.View.extend({

            // The DOM Element associated with this view
            //el: "sharing",

            // View constructor
            initialize: function() {                
            },
            
            // View Event Handlers
            events: {
                
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
                

                $('#ok').on("click", function(e){
                    self.onOKClick(e);
                });

                $('#ok-after').on("click", function(e){
                    self.onOKAfterClick(e);
                });
                
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
                this.sendEmail();

                $('.share-in').fadeOut();
                $('.share-result').fadeIn();
            },

            onOKAfterClick: function(e){
                e.preventDefault();
               
                this.$el.fadeOut(200);
                $('main').fadeIn();
                OC_ET.event("ce12");
            },

            sendEmail: function(){
                //var here_link = "<a href='http://"+_wsSettings.baseURL +"/"+_wsSettings.appDirectory+"?mId="+isaac_mId+"'>here</a>";
                var here_link = "here (http://"+this.model.config.baseURL +"/"+this.model.config.appDirectory+"?mId="+this.model.get('mId')+")";
                var link = this.model.getMessageLink();
                this.model.set({'pickUpLink':link});

                var mail_href_msg = "mailto:?subject=You%E2%80%99ve Received a Special Valentine%E2%80%99s Day Snug&";
                // mail_href_msg += "body=Hi "+Someone wants to make your holidays merry and bright!%0D%0A%0D%0A";
                // mail_href_msg += "Click "+here_link+" to see your Note from the Nutcracker!%0D%0A%0D%0A";
                // mail_href_msg += "Privacy Policy (http://content.oddcast.com/host/nutcracker/privacy.php)";
                mail_href_msg += 'body=Hi '+this.model.get('toName')+'!%0D%0A%0D%0A'+this.model.get('fromName')+' sent you a Snug!%0D%0A%0D%0A';

                mail_href_msg += 'Click here to see your customized video Valentine featuring Sunggle Bear.%0D%0A%0D%0A';
                mail_href_msg += this.model.get('pickUpLink');

//                mail_href_msg += _.template(EmailMessage, this.model.toJSON());
                //  var mail_href_msg = "mailto:?subject=You%E2%80%99ve Received a Note from the Nutcracker and Lindeman%E2%80%99s!&";
                // mail_href_msg += "body=Hi%2C%0D%0A%0D%0ASomeone wants to make your holidays merry and bright!%0D%0A%0D%0A";
                // mail_href_msg += "Click "+here_link+" to see your Note from the Nutcracker!%0D%0A%0D%0A";
                // mail_href_msg += "Privacy Policy (http://content.oddcast.com/host/nutcracker/privacy.php)";
                //window.location.href = mail_href_msg;          
                window.top.location = mail_href_msg;          
                //Sharing via email
                OC_ET.event("edems");
                //email message sent to 1 or more recipients 
                OC_ET.event("evrcpt"); 
                OC_ET.event("ce11");
                try {
                if(this.model.config.messageId.length > 4) {
                    OC_ET.embed_session = 2;
                    OC_ET.event("edems");
                }
            } catch(e) {}    
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