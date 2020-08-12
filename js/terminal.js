window.onload = function()
{
    if (!window.jQuery)
    {
      console.error("Uncaught ReferenceError: JQuery lib is required to be Included/Loaded..."); 
      //window.history.back();
	}
}

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(configuration) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var config = {
	      width: "auto",
          height: "auto",
          welcome: "auto",
          cmdprefix: "auto",
          enclock: true,
          hostname: "auto",
	      internetcondown: function () { 
	         console.warn('BrownTurbo Gaming\'s Command Terminal requires Internet Connection to work correctly...!');
	      },
	      cmdLineContainer: '#input-line .cmdline', 
	      outputContainer: '.text-body output',
	      termContainer: '.text-terminal',
	      termbodyContainer: '.text-body',
	      clockContainer: '#clock',
	      promptContainer: '.prompt',
		  stylesheetspath: '/css/terminal.css'	  
  };
  var options = $.extend(config, configuration);		
  var cmdLine_ = document.querySelector(options.cmdLineContainer);
  var output_ = document.querySelector(options.outputContainer);

  const CMDS_ = [
    GetCommandPrefix() + 'clear', GetCommandPrefix() + 'clock', GetCommandPrefix() + 'dati', GetCommandPrefix() + 'ping', 
	GetCommandPrefix() + 'help', GetCommandPrefix() + 'uname', GetCommandPrefix() + 'whoami', GetCommandPrefix() + 'cmd'
  ];
  const COLORS_ = {
     white: "#FFFFFF",
     silver: "#C0C0C0",
     gray: "#808080",
     black: "#000000",
     red: "#FF0000",
     maroon: "#800000",
     yellow: "#FFFF00",
     olive: "#808000",
     lime: "#00FF00",
     green: "#008000",
     cyan: "#00FFFF",
	 //aqua: this.cyan,
     teal: "#008080",
     blue: "#0000FF",
     navy: "#000080",
     fuchsia: "#FF00FF",
     purple: "#800080",
     brown: "#A20000",
	 pink: "#EC13C0",
	 orange: "#FF9900"
  };
  var enoffline = true;
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;
  
  document.querySelector(options.termbodyContainer).addEventListener('click', function(e) { // window.
  //document.querySelector(options.termbodyContainer').on('click', function() {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case GetCommandPrefix() + 'clear':
          Clear();
		  //return;
          break;
        case GetCommandPrefix() + 'clock':
          if (document.querySelector(options.clockContainer).style.display == 'block') 
		  {
             document.querySelector(options.clockContainer).style.display = "none";
			 document.querySelector('.options').style.marginTop = "0px";
			 SendMessage(COLORS_.white, "15px", "none", 'Classic Clock\'s Elements is: <b style="color: ' + COLORS_.red + ';">Invisible</b>');
          } 
		  else 
		  {
             document.querySelector(options.clockContainer).style.display = "block";
			 document.querySelector('.options').style.marginTop = "-20px";
			 SendMessage(COLORS_.white, "15px", "none", 'Classic Clock\'s Elements is: <b style="color: ' + COLORS_.green + ';">Visible</b>');
          }
          break;
        case GetCommandPrefix() + 'dati':
       	  var today = new Date(),
              d = today.getDate(),
		      dw = today.getDay(),
              m = today.getMonth(),
	          y = today.getFullYear(),
		      h = today.getHours(),
              min = today.getMinutes(),
              s = today.getSeconds();
		  today.setHours(h + 2); 
	      var hd = (h % 12) || 12,
	          time = (hd < 10 ? '0' : '') + h +
		             (min < 10 ? ':0' : ':') + min +
	   	             (s < 10 ? ':0' : ':') + s + 
   		             (h < 12 ? ' AM' : ' PM');  
		  
		  SendMessage(COLORS_.white, "15px", "none", 'Date: ' + d + ' ' + GetDayName(dw) + ' ' + GetMonthName(m) + ' ' + y + 
		                                                   ' || Time: ' + time);
          break;
        case GetCommandPrefix() + 'help':
		  var CMDS_List = '';
		  for(i = -1; i <= CMDS_.length; i++)
		  {
			 if(CMDS_[i+1] !== "help")
		     {
			    if(i <= 6)
			    {
                   CMDS_List = CMDS_List + CMDS_[i+1] + ',';
			    }
  			    else 
		        {
			       if(i < CMDS_.length)	
				   {
				      if(i === 7)
				      {
				         CMDS_List = CMDS_List + CMDS_[i+1] + ',';
                      }
                      else if(i === CMDS_.length)
                      {
					    CMDS_List = CMDS_List + CMDS_[i+1];   
				      }	
                      else 
				      { 
					     if(typeof CMDS_[i+1] == 'undefined' || CMDS_[i+1] == null)
				         {
					        //CMDS_List = CMDS_List + CMDS_[i+1] + ',';
						    console.error('Undefined Command Variable on the Database: ' + CMDS_[i+1] + ' - ID: ' + i+1);
				 	     }
					     else 
					     {
					        CMDS_List = CMDS_List + CMDS_[i+1];  
					     }
                      }					   
				   }
				   else if(i > CMDS_.length)
				   {
				      break;	
				   }
				}
			 }
		  }
		  SendMessage(COLORS_.white, "15px", "none", '<span class="ls-files">' + CMDS_List + '</span>'); // CMDS_.join(',')
          break;
        case GetCommandPrefix() + 'uname':
          SendMessage(COLORS_.white, "15px", "none", navigator.appVersion);
          break;
        case GetCommandPrefix() + 'whoami': //:Based on Maxmind GeoIP Command
		  try {
		     SendMessage(COLORS_.white, "15px", "none", 'Detecting Your Location Details...</p>');
             var onSuccess = function(location){
			 var stats = JSON.parse(JSON.stringify(location, undefined, 4));
			 SendMessage(COLORS_.white, "15px", "none", 'Continent: '+ stats['continent']['names']['en']);
			 SendMessage(COLORS_.white, "15px", "none", 'Country: '+ stats['country']['names']['en']);
             SendMessage(COLORS_.white, "15px", "none", 'City: '+ stats['city']['names']['en']);
			 SendMessage(COLORS_.white, "15px", "none", 'Latitude: '+ stats['location']['latitude']);
			 SendMessage(COLORS_.white, "15px", "none", 'Longitude: '+ stats['location']['longitude']);
			 SendMessage(COLORS_.white, "15px", "none", 'Timezone: '+ stats['location']['time_zone']);
			 SendMessage(COLORS_.white, "15px", "none", 'ISP: '+ stats['traits']['isp'] +'</p>');
			 SendMessage(COLORS_.white, "15px", "none", 'Organization: '+ stats['traits']['organization']);
			 //SendMessage(COLORS_.white, "15px", "none", 'IP Address: '+ stats['traits']['ip_address']);
			 if(stats['postal'].length > 1)
		     {
			    SendMessage(COLORS_.white, "15px", "none", 'Postal Code: '+ stats['postal']);
			 }
			 else 
		     {
			    SendMessage(COLORS_.white, "15px", "none", 'Postal Code: Unknown');
			 }
           };
           var onError = function(error){
             //SendMessage(COLORS_.white, "15px", "none", JSON.stringify(error, undefined, 4));
			 SendMessage(COLORS_[white], "15px", "none", 'Uncaught GeoIP Syncing ERROR...!');
			 console.error('Maxmind GeoIP Syncing ERROR: ' + JSON.stringify(error, undefined, 4));
           }; 
		  
           geoip2.city(onSuccess, onError);
		  }
		  catch(err)
		  {
			 switch(err.name.toString())
			 {
			    case 'TypeError':
				  console.error(e);
				  break;
				case 'SyntaxError':
				  console.error(e);
				  break;
				default:
				  console.warn('Missing Runtime ERROR\'s Type Name Definitions...: ' + err);
			 }			 
		  }
		  finally
		  {
		     SendMessage(COLORS_[white], "15px", "none", 'Uncaught GeoIP Syncing ERROR...!'); 
		  }
          break;
		case GetCommandPrefix() + 'cmd':
          Clear();
		  SendMessage(COLORS_.white, "20px", "center", 'BrownTurbo Gaming(c) - Command Terminal');
          break;
		case GetCommandPrefix() + 'ping':
		  var params = args.toString().replace(/[()\s]+/g, '').split(',');
		  LookupAddress(params, 'C:\\WINDOWS\\system32', 1);
          break;		  
        default:
          if (cmd) {
			SendMessage(COLORS_.white, "15px", "none", cmd + ': is not recognized as an internal or external command, operable program.<br /><p>Enter `' + GetCommandPrefix() + 'help` for more information.');
	      }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var cheight = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', cheight, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  function SendMessage(color, font, align = 'none', message)
  {
	 if(align !== "none")
     {
	    output_.insertAdjacentHTML('beforeend', '<p style="color: ' + color + '; font-size: ' + font + '; text-align: ' + align + ';">' + message + '</p>'); 
	 }
	 else if(align === "none")
	 {
	    output_.insertAdjacentHTML('beforeend', '<p style="color: ' + color + '; font-size: ' + font + ';">' + message + '</p>'); 
	 }
  }
  function GetLocationFileName(path)
  {
	 var fName = '';
     for(i = 1; i < path.length; i++)
	 {
		if(i === path.length)
	    {
	       fName = path.split('/')[i]; 
		}
	 }
	 return fName;
  }
  
  function GetRealPathName(path)
  {
	 var rPath = '';
     for(i = 1; i < path.length; i++)
	 {
		if(i !== path.length)
	    {
	       rPath = rPath + '/' + path.split('/')[i]; 
		}
	 }
	 return rPath;
  }
  function IsInternetConnectionValid(demo = 'https://upload.wikimedia.org/wikipedia/comons/5/51/Google.png')
  {
     var xhr = new XMLHttpRequest();
     //var randnum = Math.round(Math.random() * 10000); /* Random Numeric Character generator */
	 var netcon_exists = false;
     xhr.open('GET', demo, true);
     xhr.send();
     xhr.addEventListener("readystatechange", OnNetStateChange, false);
     var OnNetStateChange = function()
     {
	    if(xhr.readyState === 4)
        {
		   if(xhr.status >= 200 & xhr.status < 304)
           {
			  netcon_exists = true;   
		   }
           else
           {
			  netcon_exists = false;
              console.log('NCSC: Missing HTTP response code: ' + xhr.status + '... - Site: ' + demo);			  
		   }			   
		}			
	 }	 
	 return (netcon_exists === true);
  }
  function InitRequirements()
  {
	 var uri = {
		 protocol: location.protocol,
		 host: location.host,
		 pathname: location.pathname.replace(GetLocationFileName(location.pathname), ''),
		 realpathname: GetRealPathName(this.pathname),
		 filename: GetLocationFileName(location.pathname)
	 }; 	 

	 /*var uri_debug = 'URI Debug Logs:-<br />URI Protocol: ' + uri.protocol + '<br />URI Host: ' + uri.host + '<br />URI Pathname: ' + uri.pathname + 
	                 '<br />URI RealPathName: ' + uri.realpathname + '<br />URI FileName: ' + uri.filename;
	 var uri_fields = uri_debug.replace('<br />', '\n');
	 console.log(uri_debug); alert(uri_fields);*/
				 
	 if(IsInternetConnectionValid('https://js.maxmind.com/js/apis/geoip2/v2.1/geoip2.js'))
	 {
	    $.getScript('https://js.maxmind.com/js/apis/geoip2/v2.1/geoip2.js', function(){/* OnJavaScriptExceute(...) */});	 
	 }	 
     if(IsInternetConnectionValid(uri.protocol + "//" + uri.host + "/" + uri.realpathname + options.stylesheetspath))
	 {
	    $('head').append('<link href="' + uri.protocol + "//" + uri.host + "/" + uri.realpathname + options.stylesheetspath + '" rel="stylesheet" type="text/stylesheet" />');	 
	 }
     if(enoffline === true)
	 {
		var netoff_notif = false;
	    var netoff = function(){
           if(IsInternetConnectionValid() === true)
		   {
			  if(cmdLine_.autofocus === false)
			  {
				cmdLine_.autofocus = true;
			  }
			  if(cmdLine_.readOnly === true)
			  {
			    cmdLine_.readOnly = false;
			  }				
		   } 
		   else if(IsInternetConnectionValid() === false)
		   {
			  if(cmdLine_.autofocus === true)
			  {
			     cmdLine_.autofocus = false;
			  }
			  if(cmdLine_.readOnly === false)
              {
			     cmdLine_.readOnly = true;
			  }
			  if(netoff_notif === false)
			  {
			     /*var netcondown = new Function(options.internetcondown);
			     netcondown;*/
			     eval(options.internetcondown);
				 netoff_notif = true;
			  }
		   }
        }
        setInterval(netoff, 500);
	 }
  }

   // Initialising Terminal's Shortcuts Configuration...
   //document.onkeydown = function(e) 
   document.querySelector(options.termContainer).onkeydown = function(e)
   {
      if (e.ctrlKey && e.keyCode !== 123)
	  {
		 if(e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 85 || e.keyCode === 16 || e.keyCode === 67 || 
		    e.keyCode === 86 || e.keyCode === 65 || e.keyCode === 90 || e.keyCode === 88)
		 { 
            e.preventDefault(); // return false; 
		 } 
		 else if(e.keyCode === 76)
		 {
			e.preventDefault(); // return false;
            Clear();			 
		 }
	  }
	  else if(e.keyCode === 123 || e.keyCode === 91 || e.keyCode === 112)
	  {
         e.preventDefault(); // return false;  		  
	  }
	  else if(e.keyCode == 27)
	  {
		 window.close();
	  }
	  else 
	  {
		 return true;
	  }
   };
   $(document).ready(function () {  
       $(document).bind("cut copy paste", function(e) {
           e.preventDefault();
       });
       $(document).bind("contextmenu",function(e){
           return false; // e.preventDefault(); 	   
       });
   }); 
   //for (i = 0; i < 3; i++) console.clear(); 
   console.warn("%cStop!!\r\n\n", "color: red; font-size: 20px; text-align: center; text-style: italic;", "This is a browser feature intended for developers. If someone told you to copy and paste something here this Website belongs to BrownTurbo Gaming and its not open source Community, and that counts you as Scamer\r\nNote: your full Location Details is Recorded (keep out)!\r\n");
   
   $('.options').on('click', function() {
	 window.close(); 
   });
   function LookupAddress(params, address = 'C:\\WINDOWS\\system32', mode)
   {
      ShellAppExecute("cmd.exe", "ping " + params, address, 1); /* /k or /c modes */
   }
   function ShellAppExecute(app, params, address, mode)
   {
       var objShell = new ActiveXObject("shell.application"); 
       objShell.ShellExecute(app, params, address, "open", mode);
   }
   function Clear()
   {
      output_.innerHTML = '';
	  this.value = '';
   }

   function GetCommandPrefix()
   {
	  const default_prefix = ""; // Empty
	  if(options.cmdprefix !== "auto")
      {
	     cmd_prefix = options.cmdprefix;
	  }
      else if(options.cmdprefix === "auto")
      {
		 cmd_prefix = default_prefix;
	  }	
	  return cmd_prefix;
   }
   
   function GetMonthName(month)
   {
	   var month_name = 'Unknown', months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		   
	   if(month < 1 || month > 12)
	   {
	      month_name = 'Unknown';   
	   }
	   else
	   {
	      month_name = months[month];
	   }
	   return month_name;
   }
   function GetDayName(dayofweek)
   {
	  var day_name = 'Unknown', days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

	  if(dayofweek < 0 || dayofweek > 6)
	  {
	     day_name = 'Unknown';   
      }
	  else
	  {
	     day_name = days[dayofweek];
	  }
	  return day_name;
   }   
   function GetClockAPM(hours, minutes, seconds) 
   { 
      new Date().setHours( hours + 2 ); 
	  var h = (hours % 12) || 12; 
	  return (
	     (h < 10 ? '0' : '') + h +
		 (minutes < 10 ? ':0' : ':') + minutes +
	   	 (seconds < 10 ? ':0' : ':') + seconds + 
   		 (hours < 12 ? ' AM' : ' PM')  
	  );
    }	
    function SyncClock() 
    {
       var today = new Date();
       var h = today.getHours();
       var m = today.getMinutes();
       var s = today.getSeconds();
       $(options.clockContainer).text(GetClockAPM(h, m, s));
       setTimeout(SyncClock, 500);
    }   
   function Init()
   {
      if(options.width !== "auto")
	  {
	     document.querySelector(options.termContainer).style.maxWidth = options.width;
	  }
	  else if(options.width === "auto")
	  {
	     document.querySelector(options.termContainer).style.maxWidth = "700px";
	  }
      if(options.height !== "auto")
	  {
	     document.querySelector(options.termContainer).style.height = options.height;
	  }
	  else if(options.height === "auto")
	  {
	     document.querySelector(options.termContainer).style.height = "350px";
	  }
	  if(options.hostname !== "auto")
      {
		 if(options.hostname.indexOf('.') === -1)
	     {
	        $('.prompt').html('[root@' + options.hostname + ']# ');
	     }
		 else if(options.hostname.indexOf('.') !== -1)
		 {
			var subdom = options.hostname.toString().replace(/[()\s]+/g, '').split('.');
			if(subdom.length === 3)
		    {
			   $(options.promptContainer).html('[root@' + params[1] + ']# ');
			}
			else
		    {
			   $(options.promptContainer).html('[root@' + params[1] + ']# ');	
			}
		 }
	  }
      else if(options.hostname === "auto")
      {
		 $(options.promptContainer).html('[root@brownturbo]# ');
	  }	 
	  if(options.welcome !== "auto")
      {
		 if(typeof options.welcome != 'undefined' && options.welcome != null && options.welcome.length > 0)
		 {
		    SendMessage(COLORS_.white, "14px", "center", options.welcome);	 
		 } 
	  }
      else if(options.welcome === "auto")
      {
		 SendMessage(COLORS_.white, "14px", "center", 'Copyright BrownTurbo Gaming - Command Terminal™ © 2015-2017 All Rights Reserved.</p>');
	  }	  
      if(options.enclock === true)
	  {
		 document.querySelector(options.clockContainer).style.display = "block";
		 document.querySelector('.options').style.marginTop = "-20px";
	  }	
      else if(options.enclock === false)
      {
		 document.querySelector(options.clockContainer).style.display = "none";
		 document.querySelector('.options').style.marginTop = "0px";
	  } 
   }
   
  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //window.onload = SyncClock;
  return {
    init: function() {
	  Init();
	  InitRequirements();
	  SyncClock();
    },
    output: output
  }
};