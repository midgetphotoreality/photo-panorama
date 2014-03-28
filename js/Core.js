Core = (function() {

	var _doc 	= document;
	var _head 	= _doc.getElementsByTagName("head")[0];
	var _preloadId = "Core31415926535897932384626433832preload";

	var _utils = (function() {
		var _getViewportSize = function(w) {
		
			// Use the specified window or the current window if no argument
			w = w || window;
		
			// This works for all browsers except IE8 and before
			if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight };
		
			// For IE (or any browser) in Standards mode
			var d = w.document;
			if (document.compatMode == "CSS1Compat")
				return { w: d.documentElement.clientWidth,
				   h: d.documentElement.clientHeight };
		
			// For browsers in Quirks mode
			return { w: d.body.clientWidth, h: d.body.clientHeight };

		}
		
		var _getImageUrls		= function(sourceTxt,type){
			/* do img tag check */
			if (!type){
				type = 3;
			}
			var i = 0;
			var l = 0;
			var imgUrls = new Array();
			var url;
			var matches = false;
			if (type == 1 || type > 2){
				matches = String(sourceTxt).match(/\<img .+?\/\>/ig);
				if (matches && matches.length >0){
					l = matches.length;
					for (i=0;i<l;i++){
						url = String(String(matches[i].match(/src=["'](.+?)["']/g)).substring(5,String(matches[i].match(/src=["'](.+?)["']/g)).length-1));
						if (url.indexOf("http://graph.facebook.com/") == -1){ // exclude graph.facebook.com image -> ajax preloading wont' work BUT it should work in the imageplacement method
						    imgUrls.push({url:url,type:"tag"});
		                }
					}
				}
			}

			if (type >=2){
				matches = String(sourceTxt).match(/url\((['"])(.+?)\1\)/g);
				if (matches && matches.length >0){
					l = matches.length;
					for (i=0;i<l;i++){
						//_imageUrls.push(String(matches[i]).substring(5,String(matches[i]).length-2));
						url = String(matches[i]).substring(5,String(matches[i]).length-2);
						imgUrls.push({url:url,type:"css"});
					}
				}
			}
			return imgUrls;
		}

		var _getFontUrls 	= function(sourceTxt){
			var _urls 		= new Array();
			var i,l 		= 0;
			var fontUrl;
			var matches 	= String(sourceTxt).match(/url(.[^)]+)/g);
			if (matches && matches.length >0){
				l = matches.length;
				for (i=0;i<l;i++){
					fontUrl = matches[i].substring(5,matches[i].length-1);
					if (fontUrl.indexOf("#")>-1){
						fontUrl = fontUrl.substr(0,fontUrl.indexOf("#"));
					}
					_urls.push(fontUrl);
				}
			}
			return _urls;
		}

		var _public =  {
			getViewportSize:function(w){return _getViewportSize(w);},
			getFontUrls: function(sourceTxt){
				return _getFontUrls(sourceTxt);
			},
			getImageUrls: function(sourceTxt,type){
				return _getImageUrls(sourceTxt,type);
			},
			objectCount: function(obj){	var count = 0; for(var prop in obj){count++;} return count;},
			setCookie: function(c_name,value,expiredays){
				var exdate=new Date();
				exdate.setDate(exdate.getDate()+expiredays);
				document.cookie=c_name+ "=" +escape(value)+((expiredays==null) ? "" : "; expires="+exdate.toGMTString())+ "; path=/";
			},
			getCookie: function(c_name){
				if (document.cookie.length>0){
					c_start=document.cookie.indexOf(c_name + "=");
					if (c_start!=-1){ 
						c_start=c_start + c_name.length+1; 
						c_end=document.cookie.indexOf(";",c_start);
						if (c_end==-1){
							c_end=document.cookie.length;

						}
						return unescape(document.cookie.substring(c_start,c_end));
					} 
				}
				return false;
			},
			get: function(privates,theVar){
				return privates[theVar];
			},
			set: function(privates,theVar,args){
				if (args.length>0){privates[theVar] =  args[0];}
			},
			getset: function(privates,theVar,args){
				if (args.length==0){
					return privates[theVar];
				}else{
					privates[theVar] = args[0];
				}
			},
			userAgent: function(){
				var parts = navigator.userAgent.split(/\s*[;)(]\s*/);
				return parts;
			},
			userOS: function(){
				return navigator.appVersion;
			},
			userPlatform: function(){
				return navigator.platform;
			},
			isString: function(object){
				return (typeof (object)) == "string";
			},
			isFunction: function(object){
				return (typeof (object)) == "function";
			},
			isObject: function(object){
				return (typeof (object)) == "object";
			},
			inArray: function(needle, haystack){
				var length = haystack.length;
			    for(var i = 0; i < length; i++) { if(haystack[i] == needle) return true; }
			    return false;
			},
			currentTime: function(){
				var date = new Date();
				var seconds 	= date.getSeconds();
				var minutes		= date.getMinutes();
				var hours 		= date.getHours();
				/*
				var year 		= date.getFullYear();
				var month 		= date.getMonth(); // beware: January = 0; February = 1, etc.
				var day 		= date.getDate();

				var dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
				var milliSeconds = date.getMilliseconds();
				*/
				return hours+":"+minutes+":"+seconds;
			}
		}

		return _public;
	})();

	var _joptions 				= (function(){
	

		var _scriptVars = {"config":{"debug":false},"CoreVars":{}};
		var _CoreVars = {};
		try {
			//_scriptVars = eval("("+document.getElementById("Core_framework_core").innerHTML+")");
			//_CoreVars = _scriptVars.CoreVars
		}catch(e){

		}



		var _public = {
			debug:function(){return _scriptVars.config.debug;}
		}
		return _public;
	})();

	var _debug = (function() {
		var _history 		= new Array();
		var _levels 		= {
			SETUP:"SETUP",
			CONSOLE:"CONSOLE",
			ASSET:"ASSET",
			CONTENT:"CONTENT",
			FRAMEWORK:"FRAMEWORK",
			NET:"NET",
			ERROR:"ERROR"
		}
		var _activeLevels	= {};
		for (var level in _levels){
			_activeLevels[level] = true;
		}
		var _debugTypes = new Array("info","group","groupEnd","groupCollapsed","warn","dir","dirxml","error","log","trace");
		var _debug  = function(type,msgObj,debugLevel){

			return

			if(!_utils.inArray(type,_debugTypes)){
				return false;
			}
			if (!debugLevel){
				debugLevel = _levels.CONSOLE;
			}
			if (console && console[type] ){
				_history.push({
					"msg":msgObj,
					"time":_utils.currentTime(),
					"type":type,
					"level":debugLevel,
					"active":_activeLevels[debugLevel]
				});
				console[type](msgObj);
			}
		}
		var _groupEnd = function(debugLevel){

			return

			if (!debugLevel){
				debugLevel = _levels.CONSOLE;
			}
			if (console && console.groupEnd){
				console.groupEnd();
			}
		}
		var _time 	= function(name,debugLevel){

			return

			if (!debugLevel){
				debugLevel = _levels.CONSOLE;
			}
			if (_joptions.debug() && console && console.time && _activeLevels[debugLevel]){
				console.time(name);
			}
		}
		var _timeEnd = function(name,debugLevel){

			return

			if (!debugLevel){
				debugLevel = _levels.CONSOLE;
			}
			if (_joptions.debug() && console && console.timeEnd && _activeLevels[debugLevel]){
				console.timeEnd(name);
			}
		}
		var _public = {
			LEVEL_SETUP : function(){return _levels.SETUP},
			LEVEL_CONSOLE : function(){return _levels.CONSOLE},
			LEVEL_ASSET : function(){return _levels.ASSET},
			LEVEL_CONTENT : function(){return _levels.CONTENT},
			LEVEL_FRAMEWORK : function(){return _levels.FRAMEWORK},
			LEVEL_NET : function(){return _levels.NET},
			LEVEL_ERROR : function(){return _levels.ERROR},
			info: function(msgObj,debugLevel){
				_debug("info",msgObj,debugLevel);
			},
			group: function(msgObj,debugLevel){
				_debug("group",msgObj,debugLevel);
			},
			groupCollapsed: function(msgObj,debugLevel){
				_debug("groupCollapsed",msgObj,debugLevel);
			},
			groupEnd: function(debugLevel){
				_groupEnd(debugLevel);
			},
			time: function(name,debugLevel){
				_time(name,debugLevel);
			},
			timeEnd: function(name,debugLevel){
				_timeEnd(name,debugLevel);
			},
			warn: function(msgObj,debugLevel){
				_debug("warn",msgObj,debugLevel);
			},
			dir: function(msgObj,debugLevel){
				_debug("dir",msgObj,debugLevel);
			},
			dirxml: function(msgObj,debugLevel){
				_debug("dirxml",msgObj,debugLevel);
			},
			trace: function(msgObj,debugLevel){
				_debug("trace",msgObj,debugLevel);
			},
			error: function(msgObj,debugLevel){
				_debug("error",msgObj,debugLevel);
			},
			log: function(msgObj,debugLevel){
				_debug("log",msgObj,debugLevel);
			},
			setLevels : function(levels){
				_activeLevels = levels;
				_debug("groupCollapsed","Core.debug -> setLevels");
				_debug("dir",_activeLevels);
				_groupEnd();
			}
		}
		return _public;
	})();

	var _version				= {nr:"0.0.1",desc:"2013"};
	_debug.info("PhotoReality - HTML Hospital CORE - Version: "+_version.nr+" / "+_version.desc);


	var _constants = {

		debug: { // !!! naming???
			CONTENT: "DEBUGGING_LEVEL_CONTENT",
			FRAMEWORK: "DEBUGGING_LEVEL_FRAMEWORK",
			NET: "DEBUGGING_LEVEL_NET",
			ERROR: "DEBUGGING_LEVEL_ERROR",
			UI: "DEBUGGING_LEVEL_UI",
			OBJECT: "DEBUGGING_LEVEL_OBJECT"
		}
	}

	var _dom = (function() {
		var _addClass 		= function(element,className){
			if (!_hasClass(element,className)){
				element.className += " "+className;
			}
			return true;
		}
		
		var _hasClass 		= function(element,className){
			return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
		}
		
		var _removeClass 	= function(element,className){
			if (_public.hasClass(element,className)) {
				element.className=element.className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),' ');
			}
			return true;
		}
		
		var _getByClass		= function(className){
			var results;
			if( _doc.querySelectorAll ) {
				results = _doc.querySelectorAll( '.' + className );
			} else if( _doc.getElementsByClassName ) {
				results = _doc.getElementsByClassName( className );
			} else {
				var elements = _doc.getElementsByTagName('*'),
				results = [];
				// and so on
			}
			return results;
		}
		
		var _getById			= function(id){
			return _doc.getElementById(id);
		}

		var _elementExists 		= function(id){
			if (_getById(id) == null){return false;}
			return true;
		}

		var _addCss 			= function(cssTxt,id){
			var style = _doc.createElement("style");
			style.type 	= "text/css";
			if (id){
				if (_elementExists(id)){
					_debug.warn("Core.dom -> _addCss(\""+id+"\"), ID: "+id+" already exists");
				}
				style.id 	= id;
			}
			if (style.styleSheet){
				style.styleSheet.cssText = cssTxt;
			} else {
				style.appendChild(_doc.createTextNode(cssTxt));
			}
			_head.appendChild(style);
			return style;
		}

		var _removeCss 			= function(id){
			if (!_elementExists(id)){
				_debug.warn("Core.dom -> _removeCss(\""+id+"\"), ID: "+id+" doesn't exist!");
				return false;
			}
			_head.removeChild(_getById(id));
			return true;
		}

		var _addJs				= function(jsContents,id){
			var script = _doc.createElement("script");
			script.type = "text/javascript";
			if (id){script.id = id;}
			try{ script.appendChild(_doc.createTextNode(jsContents));}
			catch(e){script.text = jsContents;}	
			_head.appendChild(script);
			return true;
		}
		
		var _removeJs			= function(id){
			if (!id){ return false;	}
			try{ _head.removeChild(_getById(id)); }
			catch(e){ return false; }
			return true;
		}
		
		var _getElementStyle			= function(element,styleProp){
			return (element.currentStyle) ? element.currentStyle[styleProp] : (window.getComputedStyle) ? _doc.defaultView.getComputedStyle(element,null).getPropertyValue(styleProp) : 'unknown';
		}
		
		var _addLoadEvent		= function(func){
			var oldonload = window.onload;
			if (typeof window.onload != 'function') {
				window.onload = func;
			} else {
				window.onload = function() {
					if (oldonload) {oldonload();}
					func();
				}
			}
		}
		
		var _getPreloadDiv 	= function(){
			if(!_elementExists(_preloadId)){
				//create Element
			}
		} 

		var _clearPreloadDiv = function(){
			_getById(_preloadId).innerHTML = "";
		}

		var _public 		= {
			addClass: function(element,className){ return _addClass(element,className); },
			hasClass: function(element,className){ return _hasClass(element,className); },
			removeClass: function(element,className){ return _removeClass(element,className); },
			getById: function(id){ return _getById(id); },
			elementExists: function(id){ return _elementExists(id); },
			getByClass: function(className){ return _getByClass(className); },
			addJs: function(jsContents,id){ return _addJs(jsContents,id); },
			removeJs: function(id){ return _removeJs(id); },
			addCss: function(cssContents,id){ return _addCss(cssContents,id); },
			removeCss: function(id){ return _removeCss(id); },
			getElementSytle: function(element,styleProp){ return _getElementSytle(element,styleProp); },
			addLoadEvent : function(func){ _addLoadEvent(func); }
		}
	
		return(_public);
	})();

	var _net = {
		Loader: function(url,postVars,type){
			var _xmlHttpObject,_result,_callback,_obj,_txt,_error;
			var _url 			= ""; 
			if(url){_url = url};
			var _postVars 			= postVars?postVars:false;
			var _type 			= type?type:"GET";
			var _async 			= true; 
			var _loader 		= this;
			var _status 		=0;
			var _public =  {
				getVars: function(){return _postVars;},
				setVars: function(postVars){
					_postVars = postVars;
				},
				getUrl: function(){return _url;},
				setUrl: function(url){
					_url = url;
				},
				getObj: function (){return _obj;},
				setObj: function (obj){
					_obj	= obj;
				},
				getType: function(){return _type;},
				setType: function(type){
					if (type == "POST"){_type = "POST";}
					else{_type = "GET";}
				},
				getAsync: function(){return _async;},
				setAsync: function(bool){
					if (!bool){_async = false;}
					else{_async = true;}
				},
				getText: function(){return _txt;},
				getError: function(){return _error;},
				getStatus: function(){return _status;},
				
				execute: function(callback){
					_debug.log("Core.net.Loader -> execute("+_url+"), type: "+_type)
					if (window.XMLHttpRequest) {
						_xmlHttpObject = new XMLHttpRequest();
						if (_xmlHttpObject.overrideMimeType) {
							_xmlHttpObject.overrideMimeType("text/xml");
						}
					} else if (window.ActiveXObject) {
						_xmlHttpObject = new ActiveXObject("Microsoft.XMLHTTP");
					}

					_xmlHttpObject.onprogress = function(evt) {
   						if (evt.lengthComputable) {  
	     					var percentComplete = (evt.loaded / evt.total)*100;  
  						} 
					}   

					_xmlHttpObject.open(_type, _url, _async);
					if (_type === "POST") {
						_xmlHttpObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					}
					
					_xmlHttpObject.onreadystatechange = function(){
					
						if (_xmlHttpObject.readyState === 4) {
							_status = _xmlHttpObject.status;
							 _txt    = "";
							try { _txt 	= _xmlHttpObject.responseText; }
							catch(err) {
								// debug
								_error = String(err)
							}
							if(callback){
								callback(_public);
							}
						}
					}
					//alert(_postVars)
					if (_postVars){
						_xmlHttpObject.send(_postVars);
					}else{
						_xmlHttpObject.send();
					}
				}
			}
			return(_public);
		}
	}

	var _managers = (function() {

		var _contentManager = (function() {


			var _displayFonts    = false; 
			var _displayAssets 	 = false;
			var _displayLevels 	 = false;
			var _fonts 			 = false;
			var _plDiv;
			var _preloadElements = new Array();
			var _preloadStyles  = new Array();
			var _preloadDiv 	 = function(){
				if (!_dom.elementExists(_preloadId)){
					_plDiv = document.createElement("div");
					_plDiv.id = _preloadId;
					_plDiv.className = _preloadId;
					_doc.body.appendChild(_plDiv);
				}
				return _dom.getById(_preloadId);
			}
			var _init = function(configObject){
				if (configObject.content){
					_debug.groupCollapsed(_utils.objectCount(configObject.content)+" Assets Found!");
					_debug.dir(configObject.content);
					_debug.groupEnd();
					_displayAssets = configObject.content;
				}else{
					_debug.warn("No Content given");
				}
				
				if (configObject.level){
					_debug.groupCollapsed(_utils.objectCount(configObject.level)+" Levels Found!");
					_debug.dir(configObject.level);
					_debug.groupEnd();
					_displayLevels = configObject.level;
				}else{
					_debug.warn("No Levels given");
				}
				
				if (configObject.font){
					_debug.groupCollapsed(_utils.objectCount(configObject.font)+" Fonts Found!");
					_debug.dir(configObject.font);
					_debug.groupEnd();
					_fonts = configObject.font;
				}else{
					_debug.warn("No Fonts given");
				}
			}
			var _clearPreloadDiv = function(){
				if (!_dom.elementExists(_preloadId)){
					return true;
				}
				_preloadDiv().innerHTML = "";
				_doc.body.removeChild(_dom.getById(_preloadId));
				// css !!! -> CSS REMOVER
			}
			var _preload = function(callback){
				
			}
			var _addElementForPreload 	= function(elem){
				_preloadElements.push(elem); /* keep array of preloaded elements?!?!?!?!?! */
				_preloadDiv().appendChild(elem);
			}
			var _addStyleForPreload 	= function(style){
				_preloadStyles.push(style);
			}
			var _public = {
				init : function(configObject){ /* config object */
					_debug.groupCollapsed("Core.managers.ContentManager.init()");
					_init(configObject);
					_debug.groupEnd();
				},
				/* TEMPS */
				preloadFont: function(displayFont,callback){
					//alert("preloadFont")
					displayFont.load(function(){
						//alert("preloadFont DONE");
						callback();
					});
				},
				preload: function(callback){
					_debug("Core.managers.ContentManager.preload()");
					_preload();
				},
				clearPreloadDiv: function(){
					_clearPreloadDiv();
				},
				preloadDiv : function(){
					return _preloadDiv();
				},
				addElementForPreload: function(elem){
					_addElementForPreload(elem);
				},
				addStyleForPreload: function(style){
					_addStyleForPreload(style);
				}
				
			}
			return _public;
		})();

		var _imageManager 			= (function() {
			var _siteImages 			= {};
			var _assetWithImages 	= {};

			var _objToArray			= function(obj){ // maybe utils?!?!?
				var arr = new Array();
				for(var prop in obj){
					arr.push(obj[prop]);
				}
				return arr;
			}

			var _addImages			= function(imgUrls,displayAsset){
				_debug.log("Core.managers.ImageManager -> addImages("+imgUrls.length+")");
				
				var i = 0;
				var l = 0;
				var url;
				var uniqueUrls		= new Array();
				if (imgUrls && imgUrls.length >0){
					var uUrls = {};
					l = imgUrls.length;
					for (i=0;i<l;i++){
						url = imgUrls[i].url;
						//uUrls[encodeURIComponent(url)]		= url;
						if (_siteImages[encodeURIComponent(url)]){
						}else{
							_debug.log("Core.managers.ImageManager -> addImages(), Found unique image: "+url);
							_siteImages[encodeURIComponent(url)] 	= {loaded:false,url:url};
						}
						uUrls[encodeURIComponent(url)] = _siteImages[encodeURIComponent(url)];
					}
					uniqueUrls = _objToArray(uUrls);
				}

				_debug.log("Core.managers.ImageManager -> addImages("+imgUrls.length+"), Unique images found: "+uniqueUrls.length);
				return uniqueUrls;
			}

			var _imageLoaded		= function(url){
				if (_siteImages[encodeURIComponent(url)] && _siteImages[encodeURIComponent(url)].isLoaded){
					return true;
				}
				return false;
			}

			var _setImageLoaded		= function(url){
				_debug.log("Core.managers.ImageManager -> _setImageLoaded('"+url+"')");
				var _curImage;
				if (_siteImages[encodeURIComponent(url)] ){
					_curImage = _siteImages[encodeURIComponent(url)];
					_curImage.loaded = true;
				}
			}

			var _public 			= {
				addImages : function(imgUrls,displayAsset){ // from _utils.getImageUrls()
					return _addImages(imgUrls,displayAsset);
				},
				imageLoaded: function(url){
					return _imageLoaded(url);
				},
				setImageLoaded: function(url){
					return _setImageLoaded(url);
				}
			}
			return _public;
		})();

		var _navigationManager = (function() {
			var _assetAddedCallbacks = {};
			var _showAsset 		= function(displayAsset,displayLevel){
				//_debug.log("Core.managers.NavigationManager -> _showAsset: "+displayAsset.name()+" , isLoaded:"+displayAsset.loaded()+":");
				
				if (!displayLevel){
					displayLevel = displayAsset.level();
				}

				if (!displayAsset.loaded()){
					displayAsset.load(function(){
						displayLevel.showAsset(displayAsset);
					});
				}else{
					displayLevel.showAsset(displayAsset);
				}
			}
			var _public = {
				showAsset : function(displayAsset,displayLevel){
					//_debug.groupCollapsed("Core.managers.NavigationManager._showAsset(\""+displayAsset.name()+"\")");
					_showAsset(displayAsset,displayLevel);
				},
				addAssetAddedCallback : function(displayAsset,itemAddedCallback){
					
				},
				removeAssetAddedCallback: function(displayAsset,itemAddedCallback){

				}
			}
			return _public;
		})();
		
		var _public = {
			NavigationManager : _navigationManager,
			ImageManager : _imageManager,
			ContentManager : _contentManager
		}
		
		return _public;
	})();	

	
	var _display = {

		
		Font: function(name,css,options){ // explore webfont methods to complete 
			var _options,_loader;
			var _name 	= name;
			var _css 	= {loaded:false,file:css,content:""}
			var _fonts 	= {loaded:false,files:new Array()}

			var _getLoader			= function(){
				if (!_loader){
					_loader = Core.net.Loader();
					_loader.setType("POST");
				}
				return _loader;
			}

			var _load = function(callback){
				if (!_css.loaded){
					_getLoader().setUrl(_css.file);
					_getLoader().execute(function(loader){
						_css.content 	= loader.getText();
						_debug.error("FONT FILES FOUND ....");
						_debug.dir(_utils.getFontUrls(_css.content));
						_css.loaded 	= true;
						_load(callback);
					});
					return 
				}
				callback();
			}

			var _public = {
				load: function(callback){
					//alert("_public.load");
					_load(callback);
				}
			}

			return (_public);
		},

		
		Asset: function(name,type,options){
			var _options,_level,_loader;
			var _type 			
			if (type){
				_type = type;
			}else{
				_type = "NORMAL"
			}
			var _name 			= name;
			var _loaded			= false;
			var _preload		= false;
			var _loader			= false;
			var _level			= false;
			var _nameSpace		= false; //deprecated
			var _isLoading		= false;
			var _dependencies 	= {};

			

			var _counter 		= 0; //temp, not used anymore?
			var _assetLoader,_imageLoader;
			var _toDomCallbacks = new Array();
			var _views 			= new Array(); // BETTER NAME??!?!?!?!?
			var _html			= {cl:0,name:"html",hasAssets:false,loaded:true,assets:new Array(),id:"_CoreAsset~Html~"+_name.toUpperCase()}; // cl = current index loading
			var _js 			= {cl:0,name:"js",hasAssets:false,loaded:true,assets:new Array(),id:"_CoreAsset~Js~"+_name.toUpperCase()};
			var _css 			= {cl:0,name:"css",hasAssets:false,loaded:true,assets:new Array(),id:"_CoreAsset~Css~"+_name.toUpperCase()}; // id deprectaed?
			var _images 		= {cl:0,name:"images",hasAssets:false,loaded:true,files:new Array()};
			var _subAssets 		= {cl:0,name:"subAssets",hasAssets:false,loaded:true,assets:false};
			
			var _privates		= {
				loaded:_loaded,
				js:_js,
				css:_css,

				level:_level,
				name:_name,
				html:_html
			}

			var _init = function(){
				if(options){
					_initOptions(options);
				}
				_assetLoader	= _loadNextAssetV2;
				_imageLoader	= _placeNextImage;
			}

			var _load				= function(callback){
				if (_isLoading || _loaded){
					callback(false);
					return false;
				}

				if (!_subAssets.loaded){
					_subAssets.assets[_subAssets.cl].load(function(){
						//alert("SUB ASSET LOADED!");
						_subAssets.cl++;
						if (_subAssets.cl == _subAssets.assets.length){
							_subAssets.loaded = true;
						}
						_load(callback);
					});
					return
				}

				_isLoading 		= true;
				
				_html.cl		= 0;
				_js.cl			= 0;
				_css.cl			= 0;
				_images.cl		= 0;
				
				_loadNext(callback);
			}
			
			var _loadNext 			= function(callback){
				_debug.log("Core.display.Asset -> _loadNext('"+_name+"'), loaded:"+_loaded+":"+_html.loaded+"/"+_js.loaded+"/"+_css.loaded);
				if (_loaded){
					callback(true);
					return true;
				}
				
				if (!_html.loaded){
					_assetLoader("html",callback);
					return false;
				}
				if (!_js.loaded){	
					_assetLoader("js",callback);
					return false;
				}
				if (!_css.loaded){
					_assetLoader("css",callback);
					return false;
				}
				
				if (!_images.loaded){
					_imageLoader(callback);
					return false;
				}

				_loaded = true;
				_debug.info("Core.display.Asset -> _loadNext('"+_name+"') COMPLETE");
				
				_preloadPlace(function(){
					callback();
				});

				//callback();
			}
						
			var _loadNextImage		= function(callback){ // dit moet toch beter kunnen .
				if (_images.cl == _images.files.length){
					/* do check if all files are loaded!!! */
					_images.loaded = true;
					_loadNext(callback);
					return;
				}

				if (_images.files[_images.cl]){
					var image = _images.files[_images.cl];
					_debug.info("Core.display.Asset -> _loadNextImage('"+_name+"'), url: "+_images.cl+" / "+_images.files.length);
					_debug.dir(image);
					if (image.loaded){
						_debug.info("Core.display.Asset -> _loadNextImage('"+_name+"'), image '"+image.url+"' loaded in Asset, skipping...");
						_images.cl++;
						_loadNext(callback);
					}else{
						// check loaded
						if (_managers.ImageManager.imageLoaded(image.url)){
							_debug.info("Core.display.Asset -> _loadNextImage('"+_name+"'), image '"+image.url+"' already loaded in Site, skipping...");
							_images.cl++;
								
							_loadNext(callback);
						}else{
							_debug.info("Core.display.Asset -> _loadNextImage('"+_name+"'), fresh image: "+image.url+", loading...");
							_getLoader().setUrl(image.url);
							_getLoader().execute(function(loader){
								_managers.ImageManager.setImageLoaded(loader.getUrl());
								_images.files[_images.cl].loaded = true;
								_images.cl++;

								_loadNext(callback);

							});
						}
					}
				}else{
					_debug.error("Core.display.Asset -> _loadNextImage('"+_name+"'), url: "+_images.cl+" / "+_images.files.length);
					_debug.dir(_images.files);
				}
			}

			var _checkImagesLoaded = function(){
				var loaded 	= true;
				var i 		= 0;
				var l 		= _images.files.length;
				for (i;i<l;i++){
					if(!_images.files[i].loaded){
						loaded = false;
						break;
					}
				}
				_images.loaded = loaded;
			}

			var _placeNextImage 		= function(callback){
				_debug.info("Core.display.Asset -> _placeNextImage START ('"+_name+"'),cl:"+_images.cl+" url: "+_images.cl+" / loaded:"+_images.loaded+":");
				if (_images.loaded){
					_debug.info("Core.display.Asset -> _placeNextImage START ('"+_name+"'), all images loaded -> loadNEXT");
					//_images.loaded = true;
					//_loadNext(callback);
					return;
				}
				if (_images.cl == _images.files.length){
					return ;
				}
				if (_images.files[_images.cl]){
					var image = _images.files[_images.cl];
				
					if (image.loaded){
						_debug.info("Core.display.Asset -> _placeNextImage('"+_name+"'), image '"+image.url+"' loaded in Asset, skipping...");
						_images.cl++;
						_loadNext(callback);
					}else{
						if (_managers.ImageManager.imageLoaded(image.url)){
							_debug.info("Core.display.Asset -> _placeNextImage('"+_name+"'), image '"+image.url+"' already loaded in Site, skipping...");
							_images.cl++;
							_loadNext(callback);
						}else{
							_debug.info("Core.display.Asset -> _placeNextImage('"+_name+"'), fresh image: "+image.url+", loading...");
							var img = _doc.createElement("img");
							img.onerror = function(){
								//alert("error")
								_managers.ImageManager.setImageLoaded(image.url); // of image.url
						    	
						    	_images.files[parseInt(this.id.substr(2))].loaded = true;
								_checkImagesLoaded();
								_loadNext(callback);
							
							}
						    img.onload = function(){
						    	_debug.info("Core.display.Asset -> _placeNextImage('"+_name+"'), images loaded:"+_images.loaded+":onload: "+this.src+" / "+this.attributes[0].value+", loading COMPLETE");
						    	_managers.ImageManager.setImageLoaded(image.url); // of image.url
						    	
						    	_images.files[parseInt(this.id.substr(2))].loaded = true;
						    	_checkImagesLoaded();

						    	_debug.info("Core.display.Asset -> _placeNextImage('"+_name+"'), STOP , cl:"+_images.cl+", LOADED?:"+_images.loaded+":");
						    	_loadNext(callback);

						    };
							
						    img.src = image.url;
						    img.id 	= "f_"+_images.cl;

					    	_counter++;
						   	_images.cl++;
						   	_loadNext(callback);
						}
					}
				}else{
					_debug.error("Core.display.Asset -> _placeNextImage('"+_name+"'), url: "+_images.cl+" / "+_images.files.length);
					_debug.dir(_images.files);
				}
			}
			
			var _loadNextAssetV2   	= function(assetCollectionConst,callback){

				var main			= _html;
				if (assetCollectionConst == "js"){
					main 			= _js;
				}else if (assetCollectionConst == "css"){
					main 			= _css;
				}
				var asset			= main.assets[main.cl];
				_debug.log("Core.display.Asset -> _loadNextAssetV2('"+_name+"'), "+assetCollectionConst);
				if (asset.loaded){
					main.cl++;
					_loadNext(callback);
				}else{
					//console.dir(asset);
					if (asset.asset.type == "url"){
						_getLoader().setUrl(asset.asset.url);
						_getLoader().execute(function(loader){
							asset.content = loader.getText();
							
							// image collection
							if (assetCollectionConst == "html"){
								_debug.group("Core.display.Asset -> _loadNextAssetV2('"+_name+"'), HTML images:");
								_assetImages = _managers.ImageManager.addImages( _utils.getImageUrls(asset.content,1) );
								_addImages(_assetImages)
								_debug.groupEnd();
							}
							/*
							if (assetCollectionConst == "css"){
								_debug.group("Core.display.Asset -> _loadNextAssetV2('"+_name+"'), CSS images:");
								_debug.dir(_utils.getImageUrls(asset.content,2));
								_debug.groupEnd();
							}
							*/
							asset.loaded = true;
							main.cl++;
							if (main.cl == main.assets.length){
								main.loaded = true;
							}
							_loadNext(callback);
						});
						return false;
					}else if(asset.asset.type == "function"){
						asset.loaded = true;
						main.cl++;
						if (main.cl == main.assets.length){
							main.loaded = true;
						}
						_loadNext(callback);
					}else{

					}
				}
			}

			var _loadNextAssetV1   	= function(assetCollectionConst,callback){

				var assetCollection = _html.assets;
				if (assetCollectionConst == "js"){
					assetCollection = _js.assets;
				}
				if (assetCollectionConst == "css"){
					assetCollection = _css.assets;
				}
				var _assetImages	= false;
				if (assetCollection.length > 0){
					for (var i=0;i<assetCollection.length;i++){ // keep current loaded somewhere -> no array looping needed! MAYBE?!?!?!
						if (!assetCollection[i].loaded){
							_debug.log("Core.display.Asset -> _loadNextAssetV1('"+_name+"'): ");
							_debug.log(assetCollection[i].asset);
							
							if (assetCollection[i].asset.type == "url"){
								_getLoader().setUrl(assetCollection[i].asset.url);
								_getLoader().execute(function(loader){
									assetCollection[i].content = loader.getText();
									
									// image collection
									if (assetCollectionConst == "html"){
										_debug.group("Core.display.Asset -> _loadNextAssetV1('"+_name+"'), HTML images:");
										_assetImages = _managers.ImageManager.addImages( _utils.getImageUrls(assetCollection[i].content,1) );
										_addImages(_assetImages)
										_debug.groupEnd();
									}
									if (assetCollectionConst == "css"){
										_debug.group("Core.display.Asset -> _loadNextAssetV1('"+_name+"'), CSS images:");
										_debug.dir(_utils.getImageUrls(assetCollection[i].content,2));
										_debug.groupEnd();
									}
									
									assetCollection[i].loaded = true;
									_setLoaded();
									_loadNext(callback);
								});
								return false;
								break;
							}else{
								// function
							}	
							
						}
					}
				}
			}

			var _setLoaded			= function(){
				_debug.log("Core.display.Asset -> _setLoaded('"+_name+"')");
				var _aLoaded 		= true;
				var _subAssets		= new Array(_html,_js,_css);
				var i 		   		= 0;
				var len 			= _subAssets.length;

				for (i=0;i<len;i++){ // Moet ik hier altijd doorheen? of kan ik het breaken?
					if (!_assetLoaded(_subAssets[i])){
						_aLoaded 	= false;
					}else{
						_subAssets[i].loaded 	= true;
					}
				}
				_loaded = _aLoaded;
				_debug.log("Core.display.Asset -> _setLoaded('"+_name+"'), is loaded:"+_loaded+":");
			}

			var _assetLoaded	= function(subAsset){
				var _loaded 		= true;
				var i,len 			= 0;
				if (!subAsset.loaded){
					len = subAsset.assets.length;
					if (len>0){
						for (i=0;i<len;i++){
							if (!subAsset.assets[i].loaded){
								_loaded = false;
								break;
							}
						}
					}
				}
				_debug.log("Core.display.Asset -> _assetLoaded('"+subAsset.name+"'), loaded (:before:/:after:):"+subAsset.loaded+":/:"+_loaded+":");
				return _loaded;
			}
			
			var _getLoader			= function(){
				if (!_loader){
					_loader = Core.net.Loader();
					_loader.setType("POST");
					
				}
				return _loader;
			}

			var _addImages			= function(collectionImages){
				_debug.log("Core.display.Asset -> _addImages('"+_name+"')");
				_debug.dir(collectionImages);
				var i,l =0;
				if (collectionImages && collectionImages.length >0){
					_images.hasAssets = true;
					l = collectionImages.length;
					for (i=0;i<l;i++){
						_images.files.push(collectionImages[i]);
						if (!collectionImages[i].loaded){
							_images.loaded 	= false;
							_loaded 		= false;
						}
					}
				}
				/*

				*/
			}

			var _optionType		= function(assets,assetType){
				var assetObj = false;
				_debug.log("Core.display.Asset -> _optionType(\""+_name+"\"), assetType: "+assetType);
				if(_utils.isString(assets)){
					_debug.log("Core.display.Asset -> _optionType(\""+_name+"\") has "+assetType+" (string): "+assets);
					assetObj = {};
					assetObj.type 	= "url";
					assetObj.url 	= assets;
				}else if(_utils.isFunction(assets)){
					_debug.groupCollapsed("Core.display.Asset -> _optionType(\""+_name+"\") has "+assetType+" (function): ");
					_debug.trace(assets);
					_debug.groupEnd();
                    /*
					assetObj = {};
					assetObj.type 	= "function";
					assetObj.function 	= assets;
                    */
				}else if(_utils.isObject(assets)){
					_debug.groupCollapsed("Core.display.Asset -> _optionType(\""+_name+"\") has "+assetType+" (object): ");
					_debug.dir(assets);
					_debug.groupEnd();
					/*
					!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! get correct asset from multibrowser object!!!
					*/
					/*
                    assetObj = {};
					assetObj.type 	= "url";
					assetObj.url 	= assets.default;
                    */
				}else{
					_debug.error("Core.display.Asset -> _optionType(\""+_name+"\") has no a valid "+assetType+" thingy");
					_debug.dirxml(assets);
				}
				
				return assetObj;
			}

			var _addAssetHtml = function(assets){
				_debug.info("Core.display.Asset -> _addAssetHtml: "+_name+" options: ");
				var assetOptions = _optionType(assets,"html")
				_debug.dir(assetOptions);
				_html.assets.push({asset:assetOptions,loaded:false,content:"",id:_html.id+"~"+_html.assets.length});
				_html.hasAssets = true;
				_html.loaded = false;
			}
			
			var _addAssetJs = function(assets){
				_debug.info("Core.display.Asset -> _addAssetJs: "+_name);
				var assetOptions = _optionType(assets,"js");
				_debug.dir(assetOptions);
				_js.assets.push({asset:assetOptions,loaded:false,content:"",id:_js.id+"~"+_js.assets.length});
				_js.hasAssets = true;
				_js.loaded = false;
			}
			
			var _addAssetCss = function(assets){
				_debug.info("Core.display.Asset -> _addAssetCss: "+_name);
				var assetOptions = _optionType(assets,"css")
				_debug.dir(assetOptions);
				_css.assets.push({asset:assetOptions,loaded:false,content:"",id:_css.id+"~"+_css.assets.length});
				_css.hasAssets = true;
				_css.loaded = false;
			}



			var _initOptions 	= function(options){
				_debug.groupCollapsed("Core.display.Asset -> _initOptions( \""+_name+"\")");
				if (options.preload){ // normal == false
					_preload = true;
				}
				
				if(options.level){
					_level = options.level;
				}else{
					_debug.warn("Core.display.Asset -> _initOptions(\""+_name+"\") doesn't have a level!");
				}
				
				if (options.html){
					_addAssetHtml(options.html);
				}else{
					_debug.log("Core.display.Asset -> _initOptions(\""+_name+"\") has no html");
				}
				
				if (options.js){
					_addAssetJs(options.js);
				}else{
					_debug.log("Core.display.Asset -> _initOptions(\""+_name+"\") has no js");
				}
				
				if (options.css){
					_addAssetCss(options.css);
				}else{
					_debug.log("Core.display.Asset -> _initOptions(\""+_name+"\") has no css");
				}
				
				_debug.groupEnd();
			}
			
			var _preloadPlace = function(callback){
				//alert("_preloadPlace");
				//_managers.ContentManager.preloadDiv()
				var i,l 			= 0;
				var subAsset 		= false;
				var div,img;
				if (_css.hasAssets){
					l = _css.assets.length;
					_debug.log("Core.display.Asset(\""+_name+"\") -> _preloadPlace(), has css assets: "+l);
					_debug.dir(_css.assets);
					for(i=0;i<l;i++){
						subAsset = _css.assets[i];
					//	_dom.addCss(subAsset.content,subAsset.id+"~"+_preloadId)
						_managers.ContentManager.addStyleForPreload(_dom.addCss(subAsset.content,subAsset.id+"~"+_preloadId));
					}
				}
				
				if (_images.hasAssets){
					l = _images.files.length;
					//alert("has images")
					for(i=0;i<l;i++){
						img = _doc.createElement("img");
						img.src = _images.files[i].url;

						_managers.ContentManager.addElementForPreload(img);
						// _managers.ContentManager.preloadDiv().appendChild(img);
					}
				}


				if (_html.hasAssets){
					l = _html.assets.length;
					_debug.log("Core.display.Asset(\""+_name+"\") -> _preloadPlace(), has html assets: "+l);
					_debug.dir(_html.assets);
					
					for(i=0;i<l;i++){
						div = div=_doc.createElement("div");
						div.innerHTML = _html.assets[i].content;
						_managers.ContentManager.addElementForPreload(div);
					}
				}
				_debug.log("Core.display.Asset(\""+_name+"\") -> _preloadPlace(), COMPLETE " );
				callback();
			}

			var _place = function(displayLevel){
				if(!displayLevel){
					displayLevel = _level;
				}
				_debug.log("Core.display.Asset(\""+_name+"\") -> _place(\""+displayLevel.name()+"\")");
				var i 			= 0;
				var subAsset 	= false;
				if (_css.hasAssets){
					var cssAssets = _css.assets.length;
					_debug.log("Core.display.Asset(\""+_name+"\") -> _place(\""+displayLevel.name()+"\"), has css assets: "+cssAssets);
					_debug.dir(_css.assets);
					for(i=0;i<cssAssets;i++){
						subAsset = _css.assets[i];
						_dom.removeCss(subAsset.id);
						_dom.addCss(subAsset.content,subAsset.id+"~"+displayLevel.name().toUpperCase());
					}
				}
				if (_js.hasAssets){
					var jsAssets = _js.assets.length;
					_debug.log("Core.display.Asset(\""+_name+"\") -> _place(\""+displayLevel.name()+"\"), has js assets: "+jsAssets);
					_debug.dir(_js.assets);
					for(i=0;i<jsAssets;i++){
						subAsset = _js.assets[i];
						_dom.removeJs(subAsset.id);
						_dom.addJs(subAsset.content,subAsset.id+"~"+displayLevel.name().toUpperCase());
					}
				}
				if (_html.hasAssets){
					var htmlAssets = _html.assets.length;
					_debug.log("Core.display.Asset(\""+_name+"\") -> _place(\""+displayLevel.name()+"\"), has html assets: "+htmlAssets);
					_debug.dir(_html.assets);
					var iHtml = "";
					for(i=0;i<htmlAssets;i++){
						subAsset = _html.assets[i];
						iHtml+=subAsset.content;
					}
					displayLevel.insertHTML(iHtml);
				}

				_debug.log("Core.display.Asset(\""+_name+"\") -> _place(\""+displayLevel.name()+"\"), ITEM PLACED!");
				//_executeCallbacks();
				_initViews();
				_showViews();
				return true;
			}

			var _addToDomCallback = function(callback){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _addToDomCallback");
				//_debug.trace(callback);
				_toDomCallbacks.push(callback);
			}

			var _removeToDomCallback = function(callback){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _removeToDomCallback()");
				var i =0;
				for(i=_toDomCallbacks.length-1;i>=0;i--){
					if (callback == _toDomCallbacks[i]){
						_toDomCallbacks.splice(i,1);
						return true;
					}
				}
				return false;
			}

			var _addView = function(view){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _addView");
				_views.push(view);
			}

			var _removeView = function(view){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _removeView("+view+")");
				var i =0;
				for(i=_views.length-1;i>=0;i--){
					if (view == _views[i]){
						_views.splice(i,1);
						return true;
					}
				}
				return false;
			}

			var _initViews = function(){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _initViews("+_views.length+")");
				var i;
				for(i=0;i<_views.length;i++){
					try{
						_views[i].init();
					}catch(e){
						_debug.warn("Core.display.Asset(\""+_name+"\") -> _initViews(), i:"+i);
					}
					//_toDomCallbacks[i]();
				}
				//_debug.groupEnd(); // triple lameness? or not?
			}

			var _showViews = function(){ /* view naming is lame , is there an isShowing boolean needed?*/
				_managers.ContentManager.clearPreloadDiv();
				_debug.log("Core.display.Asset(\""+_name+"\") -> _showViews("+_views.length+")");
				var i;
				for(i=0;i<_views.length;i++){
					try{
						_views[i].show();
					}catch(e){
						_debug.warn("Core.display.Asset(\""+_name+"\") -> _showViews(), i:"+i);
					}
					//_toDomCallbacks[i]();
				}
				_debug.groupEnd(); // triple lameness ?? or not? 
			}

			var _hideViews = function(callback){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _hideViews("+_views.length+")");
				var i;
				var trueViews	= 0;
				var hiddenViews = 0;

				for(i=0;i<_views.length;i++){
					try{
						_views[i].hide(function(){ // will the function be created at try fail???
							hiddenViews++;
							_debug.log("Core.display.Asset(\""+_name+"\") -> _hideViews("+_views.length+") CALLBACKED "+trueViews+" / "+hiddenViews);
							if(trueViews == hiddenViews){
								_hideComplete(callback);
							}
						});
						trueViews++;
					}catch(e){
						_debug.warn("Core.display.Asset(\""+_name+"\") -> _showViews(), i:"+i);
					}
					//_toDomCallbacks[i]();
				}
			}

			var _removeViews = function(){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _removeViews("+_views.length+")");
				var i;
				for(i=0;i<_views.length;i++){
					try{
						_views[i].remove();
					}catch(e){
						_debug.warn("Core.display.Asset(\""+_name+"\") -> _removeViews(), i:"+i);
					}
				}
			}

			var _remove = function(){
				_removeViews();
			}

			var _hide = function(callback){
				// isHiding???? boolean?
				_hideViews(callback);
			}

			var _hideComplete = function(callback){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _hideComplete()");
				callback();
			}

			var _executeCallbacks = function(){
				_debug.log("Core.display.Asset(\""+_name+"\") -> _executeCallbacks("+_toDomCallbacks.length+")");
				var i;
				for(i=0;i<_toDomCallbacks.length;i++){
					_toDomCallbacks[i]();
				}
				_debug.groupEnd();
			}

			var _addSubAsset 	= function(displayAsset){ //SUB LEVEL
				_debug.log("Core.display.Asset(\""+_name+"\") -> _addSubAsset("+displayAsset.name()+")");

				if (_name==displayAsset.name()){ // or: compare _public to displayAsset
					return false;
				}
				if (!_subAssets.assets){
					_subAssets.assets 	= new Array();
				}
				_subAssets.assets.push(displayAsset);
				_subAssets.loaded = false;
				return true;
			}

			var _public = {
				/*
				loaded: function(){
					return _utils.get(_privates,"loaded");
				},*/
				addSubAsset: function(displayAsset){
					return _addSubAsset(displayAsset);
				},
				addToDomCallback: function(func){
					_addToDomCallback(func);
				},
				removeToDomCallback: function(func){
					_removeToDomCallback(func);
				},
				addView: function(view){
					_addView(view);
				},
				removeView: function(view){
					_removeView(view);
				},
				//loaded: function(){if(arguments.length==0){return _loaded}else{_loaded=arguments[0]}},
				loaded: function(){if(arguments.length==0){return _loaded}else{}},
				load: function(callback){
					_debug.time("TIMER_LOAD_"+_name.toUpperCase());
					_debug.groupCollapsed("Core.display.Asset -> load(\""+_name+"\") Load");
					_load(function(){
						_debug.groupEnd();
						_debug.timeEnd("TIMER_LOAD_"+_name.toUpperCase());
						callback();
						
					});
				},
				hide: function(callback){
					_hide(callback);
				},
				place: function(displayLevel){
					_place(displayLevel);
				},
				placeInDiv: function(){ // id or element?

				},
				remove: function(){
					_remove();
				},
				/*
				html: function(){ return _utils.getset(_privates,"html",arguments); },
				level: function(){ return _utils.getset(_privates,"level",arguments); },
				name: function(){ return _utils.get(_privates,"name",arguments); },
				*/
				//html: function(){if(arguments.length==0){return _html.assets[0].content}else{_level=arguments[0]}},
				level: function(){if(arguments.length==0){return _level}else{_level=arguments[0]}},
				name: function(){if(arguments.length==0){return _name}else{}},
				levelTest: function(){return _privates.level;},
				levelTest2: function(){return _level;},
				htmlTest:function(){return _privates.html}
				
			}

			/*********************
			*** init functions ***
			*********************/
			_init();


			return(_public);
		},

		Level: function(name,element){
			var _name			= name;
			var _element		= element;
			var _div = function(){
				return _dom.getById(_element);
			}
			
			var _asset;
			var _content;
			var _contentSet 	= false;
			var _contentDiv     = _dom.getById(element);
			var _currentAsset	= false;

			var _idConst_label  		= 0;
			var _idConst_type  			= 1;
			var _idConst_displayAsset  	= 2;
			var _idConst_subAssetNr  	= 3;
			var _idConst_displayLevel  	= 4;

			var _cleanHeader 	= function(){
				_debug.log("Core.display.Level(\""+_name+"\") -> _cleanHeader()",_debug.LEVEL_ASSET());
				var _injectedScripts = _head.getElementsByTagName("script");
				var _injectedScriptsTotal = _injectedScripts.length;
				var _idProps;
				var i =0;
				for(i=_injectedScriptsTotal-1;i>=0;i--){

				//for (var i=0;i<_injectedScriptsTotal;i++){

					_idProps = String(_injectedScripts[i].id).split("~");
					if (_idProps.length == 5 && _idProps[_idConst_label] =="_CoreAsset"){
						if (_idProps[_idConst_displayLevel] == _name.toUpperCase()){
							_debug.groupCollapsed("Core.display.Level(\""+_name+"\") -> _cleanHeader(), JS ASSET FOUND TO REMOVE - i:"+i);
							_debug.dir(_idProps);
							_debug.groupEnd();
							_dom.removeJs(_injectedScripts[i].id);
						}
					}
				}

				var _injectedStyles = _head.getElementsByTagName("style");
				var _injectedStylesTotal = _injectedStyles.length;
				//_debug.log(_injectedStyles)
				//alert(_injectedStylesTotal)


				//for (var i=0;i<_injectedStylesTotal;i++){ // back loop!!!!!
				for(i=_injectedStylesTotal-1;i>=0;i--){
					if (_injectedStyles[i]){
						_idProps = String(_injectedStyles[i].id).split("~");
						if (_idProps.length == 5 && _idProps[_idConst_label] =="_CoreAsset"){
							if (_idProps[_idConst_displayLevel] == _name.toUpperCase()){
								_debug.groupCollapsed("Core.display.Level(\""+_name+"\") -> _cleanHeader(), CSS ASSET FOUND TO REMOVE - i:"+i+" / "+_injectedStyles.length);
								_debug.dir(_idProps);
								
								_dom.removeJs(_injectedStyles[i].id);
								_debug.log("Core.display.Level(\""+_name+"\") -> _cleanHeader():"+i+" / "+_injectedStyles.length);
								_debug.groupEnd();
							}
						}
					}else{// _injectedStyles[i
						_debug.error("Core.display.Level(\""+_name+"\") -> _cleanHeader(), ERROR: "+i+" / "+_injectedStyles[i])
					}
				}
			}

			var _placeAsset = function(displayAsset){
				_debug.log("Core.display.Level(\""+_name+"\") -> _placeAsset(\""+displayAsset.name()+"\")",_debug.LEVEL_ASSET());
				displayAsset.place(_public);
				_currentAsset = displayAsset;
			}

			var _hideAsset =  function(callback){
				//alert("hide");
				_debug.log("Core.display.Level(\""+_name+"\") -> _hideAsset()",_debug.LEVEL_ASSET());
				if (!_currentAsset){
					_debug.info("Core.display.Level(\""+_name+"\") -> _hideAsset(), NO _currentAsset to hide!",_debug.LEVEL_ASSET());
					_cleanHeader();
					if(callback){
						callback();
					}
					return true;
				}else{
					_debug.info("Core.display.Level(\""+_name+"\") -> _hideAsset(), -> "+_currentAsset.name(),_debug.LEVEL_ASSET());
					_currentAsset.hide(function(){ // effin it here 
						_debug.info("Core.display.Level(\""+_name+"\") -> _hideAsset() COMPLETE, -> "+_currentAsset.name(),_debug.LEVEL_ASSET());
						_currentAsset.remove(); // 
						_insertHTML("");
						_cleanHeader();
						 _currentAsset	= false;
						if(callback){
							callback();
						}
					});
				}
			}

			var _showAsset  =  function(displayAsset){
				_debug.log("Core.display.Level(\""+_name+"\") -> _showAsset(\""+displayAsset.name()+"\")",_debug.LEVEL_ASSET());
				
				//if (!_currentAsset || displayAsset!= _currentAsset)

				_hideAsset(function(){
					_placeAsset(displayAsset);
				});
			}

			var _insertHTML = function(htmlTxt){
				_div().innerHTML = htmlTxt;
			}

			var _public = {
				showAsset : function(displayAsset){
					//alert("show")
					_showAsset(displayAsset);
					
				},
				hideAsset : function(callback){
					_hideAsset(callback);

				},
				close: function(callback){
					_hideAsset(callback);
				},
				insertHTML : function(htmlTxt){
					_insertHTML(htmlTxt);
				},
				element: function(){if(arguments.length==0){return _element}else{_element=arguments[0]}},
				name: function(){if(arguments.length==0){return _name}else{}}
			}
			
			return (_public);
		}
		
	}

	/* Core Public */
	var _public =  {
		dom : _dom,
		utils : _utils,
		net: _net,
		display: _display,
		managers: _managers,
		constants:_constants,
		//joptions: function(){return _optionsObject},
		debug : _debug,
		trace : function (msgObject){
			_trace(msgObject);
		},
		version : _version
	}


	/* return the public object ;*/
	return (_public);
})();