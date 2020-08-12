<!DOCTYPE html>
<head>
      <title>Web Terminal - Under Construction</title>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1">	  
      <link rel="stylesheet" href="css/style.css">
	  <link href="images/favicon.ico" rel="shortcut icon">
	  <link href="https://fonts.googleapis.com/css?family=Inconsolata" rel="stylesheet" type="text/css" />  
	  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type='text/css'>
</head>

<html lang="en">
  <body>
		<div class="text-terminal">
			<div class="title-bar">
			    <span class="title">BrownTurbo Gaming &mdash; Command Terminal</span> 
			    <div id="clock"><?= date("h:i:s A") ?></div>
				<span class="options" aria-label="Close"><i class="fa fa-times"></i></span>
		    </div>
			<div class="text-body">
				<output></output>
				<div id="input-line" class="input-line">
                   <div class="prompt"></div><div><input class="cmdline" type="text" autofocus /></div>
			    </div>
            </div>	
            <div id="l-bottom">
                <div id="l-bottom-dent">
                    <div id="l-bottom-dent-inner"></div>
                </div>
                <ul id="l-left" class="l-grill">
                    <li> </li>
                    <li> </li>
                    <li> </li>
                </ul>
                <ul id="l-right" class="l-grill">
                    <li> </li>
                    <li> </li>
                    <li> </li>
                </ul>
            </div>
        </div>			
    
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script type="text/javascript" src="js/terminal.js"></script>
	<script type="text/javascript">
	   $(document).ready(function () {   
          var term = new Terminal({
	         enclock: false
          });
          term.init(); // this.init();
       });
    </script>
  </body>
</html>