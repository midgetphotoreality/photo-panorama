SHeemstede = {};
SHeemstede.view = {};
SHeemstede.Setup = (function () {

	var _level = {
		content: Core.display.Level("content", "levelContent"),
		menu: Core.display.Level("menu", "levelMenu"),
		overlay: Core.display.Level("overlay", "levelOverlay")
	}

	var _content = {
		Home: Core.display.Asset("Home", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets_mobile/html/Home.html",
			js: "assets_mobile/js/Home.js",
			css: "assets_mobile/css/Home.css"
		})
	}

	return {
		level: _level,
		content: _content
	}
})();

SHeemstede.Menu = (function () {
	var _menu = false
	var _selectedRoute = false;
	var _currentMenu = false;

	var _selectedRouteName = "";
	var _selectedRouteIndex = false;
	
	var _choice = 'north';

	var _initMenu = function (routes) {

		_menu = routes; //new Array();

		//_buildMenu();
	}

	var getCleanName = function (str) {
		var prevVal = "";
		while (prevVal != str) {
			prevVal = str;
			str = String(str).replace(" ", "_");
		}
		while (prevVal != str) {
			prevVal = str;
			str = String(str).replace("%20", "_");
		}
		/*while(prevVal!=str){
				prevVal = str;
				str = String(str).replace("&","|");
			}*/
		return str;
	}

	var _curHash;
	var _buildMenu = function (selectedRoute) {
		Core.debug.log("SHeemstede.Menu._buildMenu(): ");

		_currentMenu = _menu;



		var special = false

		if (("onhashchange" in window)) { // && !($.browser.msie)) { only for oldy ies
			window.onhashchange = function () {
				_routeSelected(window.location.hash.replace("#", ""));
			}
		} else {
			var prevHash = window.location.hash;
			window.setInterval(function () {
				if (window.location.hash != _curHash) {
					_curHash = window.location.hash;
					_routeSelected(window.location.hash.replace("#", ""));
				}
			}, 100);
		}

		var startRoute = false;
		var selectedRoute = window.location.hash.replace("#", "");
		var routeLetter;


		var html, htmlInner = "";
		var sel = "";
		var routeIndex = 0;
		html = '<select name="departments" id="select_routes" class="menuRouteList" onchange="SHeemstede.Menu.selectRoute(this)" value=""><option value="">Kies uw afdeling</option>';

		function getLabelName(name){
			return name.substr(0,name.length-4);
		}
		
		function getLabelType(name){
			return name.substr(name.length-4);
		}

		for (i = 0; i < _currentMenu.length; i++) {
			_currentMenu[i].cleanName = getCleanName(_currentMenu[i].name);
			_currentMenu[i].routeIndex = i;
			sel = "";
			if (selectedRoute && selectedRoute == getCleanName(_currentMenu[i].name)) { 
				sel = " selected ";
				startRoute = true;
				routeIndex = i;
			}
			//if(i%2==0){
				routeLetter = _currentMenu[i].name.substr(0, 1).toUpperCase();
				html = html + '<option value="' + i + '" ' + sel + '>' + getLabelName(_currentMenu[i].name) + '</option>';
			//}
		}

		html = html + "</select>";
		
		document.getElementById("menuRouteContainerInner").innerHTML = html;
		if (startRoute) {
			llog("startroute" + routeIndex);
			_doSelect(routeIndex);
		}
		Core.debug.log("SHeemstede.Menu._buildMenu(), END");
	}

	var _formatName = function (str) {
		if (String(str).lastIndexOf("_") > -1) {
			str = String(str).substr(0, String(str).lastIndexOf("_"));
		}
		return str;
	}

	var _routeSelected = function (name) {
		//console.log("_routeSelected: " + name);
		for (i = 0; i < _currentMenu.length; i++) {
			if (name && name == getCleanName(_currentMenu[i].name)) {

				_doSelect(i);
				break;
			}
		}
	}

	var _selectRoute = function (dropdown) {
		if (_currentMenu[dropdown.value]) {
			window.location.hash = getCleanName(_currentMenu[dropdown.value].name);
		}
	}

	var _cleanFloorName = function(name){
		//f1.name
		if(name.indexOf("- Noord")>=0){
			name = name.replace("- Noord","");
		}
		
		if(name.indexOf("- Zuid")>=0){
			name = name.replace("- Zuid","");
		}
		
		return name;
	}
	
	
	var _doSelect = function (i) {
		
		_selectedRouteIndex = i;
		_selectedRoute = _currentMenu[i];
		_selectedRouteName = _formatName(_currentMenu[i].name);
		function getLabelName(name){
			return name.substr(0,name.length-4);
		}
		
		function getRouteNumber(name){
			var li = name.lastIndexOf(' - ');
			return name.substring(li+3);
		}

		
		var f1 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[0].id);
		var f2 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[1].id);
		
		//document.getElementById('floor1Text').innerHTML = "<b>"+_cleanFloorName(f1.name)+"</b>: "+_selectedRoute.floors[0].label;
		//document.getElementById('floor2Text').innerHTML = "<b>"+_cleanFloorName(f2.name)+"</b>: "+_selectedRoute.floors[1].label;
		
		console.log("_selectedRouteName: "+_selectedRouteName);

		document.getElementById('floor1TextInner').innerHTML = "Volg route "+getRouteNumber(_selectedRouteName)+" op de "+_cleanFloorName(f1.name);
		//"<b>"+_cleanFloorName(f1.name)+"</b>: "+_selectedRoute.floors[0].label;
		document.getElementById('floor2TextInner').innerHTML = "Volg route "+getRouteNumber(_selectedRouteName)+" op de "+_cleanFloorName(f2.name);
		

		HOSPITALS.MapsContainer.selectRoute(_selectedRoute);
		
		var f1Height,f2Height;
		f1Height = document.getElementById('map1').getBoundingClientRect().height;
		
		
		var _itemSpace = 10;
        if(_selectedRoute.floors[0].id == _selectedRoute.floors[1].id){
			Core.dom.addClass(document.getElementById('floor2Text'),"hidden");
			Core.dom.addClass(document.getElementById('map2'),"hidden");
		}else{
            Core.dom.removeClass(document.getElementById('floor2Text'),"hidden");
            Core.dom.removeClass(document.getElementById('map2'),"hidden");
        }
		
		/*
		document.getElementById('map1').style.top = parseInt(document.getElementById('floor1Text').offsetHeight)+_itemSpace+"px" ;
		
		document.getElementById('versionText').style.top = parseInt(document.getElementById('map1').style.top)+parseInt(f1Height)+_itemSpace+"px";
		
		if(_selectedRoute.floors[0].id == _selectedRoute.floors[1].id){
			Core.dom.addClass(document.getElementById('floor2Text'),"hidden");
		}else{
			Core.dom.removeClass(document.getElementById('floor2Text'),"hidden");
			
			f2Height = document.getElementById('map2').getBoundingClientRect().height;
			document.getElementById('floor2Text').style.top = parseInt(document.getElementById('map1').style.top)+(Math.ceil( f1Height ))+_itemSpace+"px";
			
			document.getElementById('map2').style.top = parseInt(document.getElementById('floor2Text').style.top)+document.getElementById('floor2Text').offsetHeight+_itemSpace+"px";
			
			document.getElementById('versionText').style.top = parseInt(document.getElementById('map2').style.top)+parseInt(f2Height)+_itemSpace+"px";	
		}
		
		
		f1TextHeight = parseInt(document.getElementById('floor1Text').offsetHeight);
		 f2TextHeight = parseInt(document.getElementById('floor2Text').offsetHeight);
		
		
		console.log("f1Text, height: "+f1TextHeight)
		console.log("f2Text, height: "+f2TextHeight)
        */
		/*
		
		_selectedRoute.floors[0].label
		
		document.getElementById('floor1Text').innerHTML = "<b>"+_cleanFloorName(f1.name)+"</b>: "+_selectedRoute.floors[0].label;
		document.getElementById('floor2Text').innerHTML = "<b>"+_cleanFloorName(f2.name)+"</b>: "+_selectedRoute.floors[1].label;
		
		document.getElementById('map1').style.top = parseInt(document.getElementById('floor1Text').offsetHeight)+20+"px" ;
		
		if(_selectedRoute.floors[0].id == _selectedRoute.floors[1].id){
			Core.dom.addClass(document.getElementById('floor2Text'),"hidden");
			document.getElementById('floor2Text').style.top = (10+Math.ceil( f1.floorHeight ))+"px";
			document.getElementById('versionText').style.top = (90+Math.ceil( f1.floorHeight ))+"px";
		}else{
			Core.dom.removeClass(document.getElementById('floor2Text'),"hidden");
			document.getElementById('floor2Text').style.top = 10+(Math.ceil( f1.floorHeight ))+"px";
			
			
			
			document.getElementById('map2').style.top = (80+Math.ceil( f1.floorHeight )+document.getElementById('floor2Text').offsetHeight)+"px";
			
			document.getElementById('versionText').style.top =(80+parseInt(document.getElementById('map1').style.top)+Math.ceil( f1.floorHeight )+Math.ceil( f2.floorHeight ))+"px";;// (90+Math.ceil( f1.floorHeight ))+"px";
			
		}
		
		*/
		HOSPITALS.MapsContainer.selectRoute(_selectedRoute);
	}

var _setRouteChoice = function(choice){
		_choice = choice;
	//	llog("_setRouteChoice: "+choice+" / "+_selectedRouteIndex)
		if(_selectedRouteIndex){
			if(_choice == 'south'){
	//			llog("south: "+_currentMenu[_selectedRouteIndex+1].cleanName);
				window.location.hash = _currentMenu[_selectedRouteIndex+1].cleanName;
			}else{
	//			llog("north: "+_currentMenu[_selectedRouteIndex].cleanName);
				window.location.hash = _currentMenu[_selectedRouteIndex].cleanName;
			}
		}
		// select current!!
	}
	var _public = {
		initMenu: function (routes) {
			_initMenu(routes)
		},
		buildMenu: function () {
			_buildMenu();
		},
		selectRoute: function(dropdown){
			_selectRoute(dropdown);
		},
		setRouteChoice: function(choice){
			_setRouteChoice(choice);
		},
		selectNorth: function () {
			//console.log("n");
			document.getElementById('imgSouth').src = "images/draaiknopzuidzwart.png"
			document.getElementById('imgNorth').src = "images/draaiknopnoordwit.png"
			SHeemstede.Menu.setRouteChoice('north');
		},
		selectSouth: function () {
			document.getElementById('imgSouth').src = "images/draaiknopzuidwit.png"
			document.getElementById('imgNorth').src = "images/draaiknopnoordzwart.png"
			SHeemstede.Menu.setRouteChoice('south');
		}
	}
	return _public;
})();
function llog(msg){
	console.log(msg);
}


SHeemstede.SiteManager = (function () {

	var _init = function () {
		// Preloader
		// CanvasLoader
	//	console.log("_init")

		var cl = new CanvasLoader('preloaderSpinner');
		cl.setColor('#008fd0'); // default is '#000000'
		cl.setShape('spiral'); // default is 'oval'
		cl.setDiameter(35); // default is 40
		cl.setDensity(16); // default is 40
		cl.setRange(1.1); // default is 1.3
		cl.setSpeed(1); // default is 2
		cl.setFPS(25); // default is 24
		cl.show(); // Hidden by default
		var loaderObj = document.getElementById("canvasLoader");
		loaderObj.style.position = "absolute";
		loaderObj.style["top"] = cl.getDiameter() * -0.5 + "px";
		loaderObj.style["left"] = cl.getDiameter() * -0.5 + "px";
		HOSPITALS.Model.floorMargin = 5;
		//TweenLite.from(document.getElementById("logo"), 0.5, {css:{autoAlpha:0, right:"0px"}});
		
		//HOSPITALS.Controller.setFloorMargin(10);
		
		HOSPITALS.MapsContainer.setStartFloor("fld29fe6ed5b1714fc9bba0ee2e0ee5fab718eef395af5d72a9d66290294632180");
		HOSPITALS.MapsContainer.init();
		

		HOSPITALS.Controller.loadJSON(function () {
			SHeemstede.Menu.initMenu(HOSPITALS.Model.routes())

			
			HOSPITALS.Controller.loadFloors(function () {
				//SHeemstede.Menu.initMenu(HOSPITALS.Model.routes())
				Core.debug.info("Floors Loaded");
				_initComplete();
			})
		});
	}


	var _initComplete = function () {
		//	
		var preloader = document.getElementById("preloaderSpinner");
		document.getElementById('application').removeChild(preloader);
		//document.getElementById('Core31415926535897932384626433832preload').innerHTML="";
		Core.managers.NavigationManager.showAsset(SHeemstede.Setup.content.Home);
	//	Core.managers.NavigationManager.showAsset(SHeemstede.Setup.content.Menu);

		
	}

	var _public = {
		init: function () {
			_init()
		}
	}
	return _public;
})();

//SHeemstede.SiteManager.init();




SHeemstede.AnimationManager = (function () {

	var _genContentInit = function (div) {
		TweenLite.set(div, {
			css: {
				autoAlpha: 0
			}
		});
	}

	var _genContentShow = function (div) {
		TweenLite.to(div, 0.5, {
			css: {
				autoAlpha: 1
			}
		});
	}

	var _genContentHide = function (div, callback) {
		TweenLite.to(div, 0.5, {
			css: {
				autoAlpha: 0
			},
			onComplete: callback
		});
	}

	var _public = {
		genContentHide: _genContentHide,
		genContentInit: _genContentInit,
		genContentShow: _genContentShow
	}
	return _public;
})();


Core.dom.addLoadEvent(function () {
	SHeemstede.SiteManager.init();
});
