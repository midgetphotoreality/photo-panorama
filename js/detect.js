var _system = (function() {
		var _browser 	= false;//_browserDetect();
		var _os 		= false;//_osDetect();
		
		var _browserDetect = function(){
			navigator.browserInfo= (function(){
				var N= navigator.appName, ua= navigator.userAgent, tem;
				var M= ua.match(/(opera|chrome|crios|mercury|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
				if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
				M= M? [M[1], M[2]]: [N, navigator.appVersion, '-?']; // rewrite to object

				return M;
			})();
			var _browser = navigator.browserInfo[0];
			var _version = navigator.browserInfo[1];
			
			//_clientInfo.innerHTML += "<br/>You have "+_browser+" version: "+_version
			return {browser:_browser,version:_version}
		}
		
		var _osDetect = function(){
			navigator.osInfo= (function(){
				var ua 				= navigator.userAgent;
				var av 				= navigator.appVersion;
				var _os 			= "nada";
				var _device 		= "nada";
				var _version 		= "nada";
				var _versionMinor 	= "";
				var _checkString 	= "";
				var _cpuClass 		= "";
				var _build 			= "";//??
				var _startIndex,_endIndex,_cutLength = 0;

				if ( ua.match(/iPad/i)){//} || ua.match(/iPhone/i) )	{
					_checkString 	= 'OS ';
					_os 	= 'iOS';
					_device = 'iPad'
					_startIndex = ua.indexOf( _checkString );
					if (_startIndex > -1){
						_startIndex+= _checkString.length;
						_endIndex 	= ua.indexOf( ' ' ,_startIndex);
						_cutLength 	= _endIndex - _startIndex;
						_version 	= ua.substr( _startIndex, _cutLength );
						_version    = _version.replace( new RegExp("_", "g"), '.' );
					}
				}else if(ua.match(/iPhone/i)){
					_checkString 	= 'OS ';
					_os 			= 'iOS';
					_device 		= 'iPhone'
					_startIndex = ua.indexOf( _checkString );// + 3;
					if (_startIndex > -1){
						_startIndex+= _checkString.length;
						_endIndex 	= ua.indexOf( ' ' ,_startIndex);
						_cutLength 	= _endIndex - _startIndex;
						_version 	= ua.substr( _startIndex, _cutLength );
						_version    = _version.replace( new RegExp("_", "g"), '.' );
					}
				}else if ( ua.match(/Android/i) ) {
					_checkString 	= 'Android ';
					_os = 'Android';
					_startIndex = ua.indexOf( 'Android ' );
					if (_startIndex > -1){
						_startIndex+= _checkString.length;
						_endIndex 	= ua.indexOf( ';' ,_startIndex);
						_cutLength 	= _endIndex - _startIndex;
						_version 	= ua.substr( _startIndex, _cutLength );

						_startIndex = _endIndex+1;
						_endIndex 	= ua.indexOf( 'Build' ,_startIndex);
						_cutLength 	= _endIndex - _startIndex;
						_device 	= ua.substr( _startIndex, _cutLength );
						//_version    = _version.replace( new RegExp("_", "g"), '.' );
					}
				}else if(av.indexOf('Win')>-1){
					_os = 'Windows';
					_device = "Desktop";
					if (navigator.appMinorVersion){
						_versionMinor = " "+navigator.appMinorVersion
					}

					if (navigator.cpuClass){
						_versionMinor += " "+navigator.cpuClass;
					}
					
					//appMinorVersion 
					//cpuClass 
					
					if ((ua.indexOf("Windows NT 5.1") > -1) || (ua.indexOf("Windows XP") > -1)){
						_version = "XP"+_versionMinor;
					}else if((ua.indexOf("Windows NT 6.0") > -1)){
						_version = "Vista"
					}else if( (ua.indexOf("Windows NT 7.0") > -1) || (ua.indexOf("Windows NT 6.1") > -1) ){
						_version = "7"+_versionMinor;
					}

				}else{

				}
				return {device:_device,os:_os,version:_version}//_device+" / "+_os+" / "+_version;
				//return _device+" / "+_os+" / "+_version;
			})();

			//_clientInfo.innerHTML += "<br/>"+navigator.osInfo
			return navigator.osInfo;
		}
	
		_browser 	= _browserDetect();
		_os 		= _osDetect();
	
		var _public 		= {
			os:function(){return _os},
			browser:function(){return _browser}
		}
		return(_public);
	})();