Site = {};
Site.view = {};
Site.Setup = (function () {

	var _level = {
		content: Core.display.Level("content", "levelContent"),
		menu: Core.display.Level("menu", "levelMenu"),
		overlay: Core.display.Level("overlay", "levelOverlay")
	}

	var _content = {
		Home: Core.display.Asset("Home", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets/view/home/Home.html",
			js: "assets/view/home/Home.js",
			css: "assets/view/home/Home.css"
		}),
		Panorama: Core.display.Asset("About", "NORMAL", {
			preload: true,
			level: _level.overlay,
			html: "assets/view/panorama/panorama.html",
			js: "assets/view/panorama/panorama.js",
			css: "assets/view/panorama/panorama.css"
		}),
        Menu: Core.display.Asset("Menu", "NORMAL", {
			preload: true,
			level: _level.menu,
			html: "assets/view/menu/menu.html",
			js: "assets/view/menu/menu.js",
			css: "assets/view/menu/menu.css"
		})
	}

	return {
		level: _level,
		content: _content
	}
})();

Site.Menu = (function () {
	var _selectedRoute = false;
	var _currentMenu = false;

	var _alphabetLetters = String("ABCDEFGHIJKLMNOPQRSTUVWXYZ").split("");
	var _menus = {};

	var _menuDiv = false;
	var openLetter = false;
	var _selectedRouteName = "";
	var _menuHeight = 0;
	var _choice = 'north';

	var _selectedMenuElement = false;
	var _clickedMenuElement = false;

	var _selectedRouteIndex = false;

	var _initMenu = function (routes) {

		_currentMenu = routes;
	}

	var _formatName = function (str) {
		if (String(str).lastIndexOf("_") > -1) {
			str = String(str).substr(0, String(str).lastIndexOf("_"));
		}
		return str;
	}

	var _curHash = "",
		prevHash = false;

	var openLetterMenu = function (letter) {
		//console.log(letter);
		if (openLetter) {
			openLetter.container.style.display = "none";
			openLetter.container.style.width = "1px";
			openLetter.container.style.height = "1px";
			Core.dom.removeClass(openLetter.letter, "menuItemSelected");
			Core.dom.addClass(openLetter.letter, "menuItemDeSelected");
			//openLetter = _menus[letter].menu.container;
		}
		openLetter = _menus[letter];
		openLetter.container.style.display = "block";
		openLetter.container.style.width = null;
		openLetter.container.style.height = null;
		
		Core.dom.removeClass(openLetter.letter, "menuItemDeSelected");
		Core.dom.addClass(openLetter.letter, "menuItemSelected");

		if (openLetter.container.getBoundingClientRect().bottom  > _menuHeight) {
			openLetter.container.style.top = String(parseInt(openLetter.container.style.top.replace("px",""))+(_menuHeight - (openLetter.container.getBoundingClientRect().bottom))+"px");
		}

		if (openLetter.container.getBoundingClientRect().top  < 0 ) {
			openLetter.container.style.top =  "0px";
		}

		
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
		return str;
	}
	
	

	var _startRoute = function (starts) {
		llog("_startRoute: "+starts)
		for (var i = 0; i < _currentMenu.length; i++) {
			if (starts && starts == _currentMenu[i].cleanName) { //(decodeURIComponent(starts) == decodeURIComponent(_currentMenu[i].name))) {
				openLetterMenu(_currentMenu[i].name.substr(0, 1).toUpperCase());
				selectRoute(i);
			}
		}
	}
	
	

	var selectRoute = function (index) {
		////console.log(index)

		Core.debug.log("Site.Menu._selectRoute(" + index + ")");
		//console.log(_currentMenu[index].name);
		/*
		if(_choice == "north"){
		}
		*/
		_selectedRouteIndex = index;
		//if(index%2!=0){
		//	_selectedRouteIndex = index-1;
		//}
		
		
		_selectedRoute = _currentMenu[index];
		_selectedRouteName = _formatName(_currentMenu[index].name);
		
		llog(_selectedRoute);

		var f1 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[0].id);
		var f2 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[1].id);
		
        /*
		document.getElementById('currentRoutePrint').innerHTML = "Händellaan 2a<br/>2102 CW Heemstede<br/>Telefoon (023) 890 89 00<br/>"+_selectedRouteName;*/
/*
		document.getElementById('infoSouth').style.display = "none";
		document.getElementById('infoNorth').style.display = "none";
		
		if(_choice == "north"){
			document.getElementById('infoNorth').style.display = "block";
		}else{
			document.getElementById('infoSouth').style.display = "block";
		}
*/		
		////////////////////////// HEEMSTEDE //////////////////////////
		document.getElementById('printText').innerHTML = _selectedRouteName;
		
		////////////////////////// HEEMSTEDE //////////////////////////
		
		
		
		
		
		document.getElementById('labelMap1Layer').innerHTML = ""+_cleanFloorName(f1.name)+":";
		document.getElementById('labelMap1Desc').innerHTML =_selectedRoute.floors[0].label;
		
		document.getElementById('labelMap2Layer').innerHTML = "";
		document.getElementById('labelMap2Desc').innerHTML = "";
		
		if (_selectedRoute.floors[0].id != _selectedRoute.floors[1].id) {
			document.getElementById('labelMap2Layer').innerHTML = ""+_cleanFloorName(f2.name)+":";
		document.getElementById('labelMap2Desc').innerHTML =_selectedRoute.floors[1].label;
		}

		document.getElementById('topLabel').innerHTML = "route naar " + _selectedRouteName
		HOSPITALS.MapsContainer.selectRoute(_selectedRoute);

	}

	var _buildDesktopMenu = function () {
		try {
			document.getElementById("Core31415926535897932384626433832preload").innerHTML = "";
		} catch (e) {

		}

		if (("onhashchange" in window)) { // && !($.browser.msie)) { only for oldy ies
			window.onhashchange = function () {
				_startRoute(window.location.hash.replace("#", ""));
			}
		} else {
			var prevHash = window.location.hash;
			window.setInterval(function () {
				if (window.location.hash != _curHash) {
					_curHash = window.location.hash;
					_startRoute(window.location.hash.replace("#", ""));
				}
			}, 100);
		}

		var startRoute = false;

		var starts = window.location.hash.replace("#", "");
		if (starts == "") {
			starts = false;
		}

		var snippet = function (str) {
			return '<div class="menuItem">' +
				'<div class="menuItemLetter menuItemDeSelected" id="menuItemLetter' + str + '">' + str + '</div>' +
				'<div class="menuItemContainer" id="menuItemContainer' + str + '"></div>' +
				'</div>';
		}

		_menuDiv = document.getElementById('menuContainer');

		

		var routeLetter, i, div, container;

		

		for (i = 0; i < _alphabetLetters.length; i++) {
			routeLetter = _alphabetLetters[i];
			
			
			div = document.createElement('div');
			div.innerHTML = snippet(routeLetter);
			div.id = 'menuItem' + routeLetter;
			_menuDiv.appendChild(div);
			
			
			
			div.style.top = String((i * 30) + "px");
			container = document.getElementById("menuItemContainer" + routeLetter);
			_menus[_alphabetLetters[i]] = {
				"div": div,
				"id": routeLetter,
				"container": container,
				"items": [],
				"letter":document.getElementById("menuItemLetter" + routeLetter)
			}

			// TODO: fix container

			div.style.top = String((i * 30) + "px");
			container.style.top = String((i * 30) + "px");
			_menuHeight = (i * 30) + 30;
			Core.dom.addClass(container, "menutItemContainer");


			div.onclick = function () {
				openLetterMenu(String(this.id).substr(8, 1));
			}
			div.onmouseover = function () {
				openLetterMenu(String(this.id).substr(8, 1));
			}
			div.onmouseout = function () {
				////console.log(this);
			}
		}

		var _filters = [" - Z"," - N"];
		var _menuNoord = document.createElement('div');
		var _menuZuid = document.createElement('div');
		
		function getLabelName(name){
			return name.substr(0,name.length-4);
		}
		
		function getLabelType(name){
			return name.substr(name.length-4);
		}
		
		for (i = 0; i < _currentMenu.length; i++) {
			routeLetter = _currentMenu[i].name.substr(0, 1).toUpperCase();
			if (_menus[routeLetter]) {
				
				//if(i%2==0){
				
					div = document.createElement('div');
					div.innerHTML = getLabelName(_currentMenu[i].name);
					
					//console.log(i+": "+getLabelType(_currentMenu[i].name));
					
					Core.dom.addClass(div, "menuRouteItem");
					_menus[routeLetter].container.appendChild(div);
					_menus[routeLetter].items.push({
						"id": i,
						"div": div
					});
					div.id = "menuRouteItem" + i;
					div.onclick = function () {
						
						if(_choice == 'south'){
							//console.log("south: "+(parseInt(String(this.id).substr(13))+1));
							window.location.hash = _currentMenu[parseInt(String(this.id).substr(13))+1].cleanName;
						}else{
							//console.log("north: "+(parseInt(String(this.id).substr(13))));
							window.location.hash = _currentMenu[parseInt(String(this.id).substr(13))].cleanName;
						}
					}
					
				//}
				
					_currentMenu[i].cleanName = getCleanName(_currentMenu[i].name);
					_currentMenu[i].routeIndex = i;
					
					if(_currentMenu[i].cleanName == starts){
						
						openLetterMenu(routeLetter);
						_startRoute(starts);
					}
			} else {
				//console.log("Unknow letter: " + routeLetter);
			}
		}
	}
	
	var _setRouteChoice = function(choice){
		_choice = choice;
		if(_selectedRouteIndex){
			if(_choice == 'south'){
				//console.log("south: "+(parseInt(String(this.id).substr(13))+1));
				window.location.hash = _currentMenu[_selectedRouteIndex+1].cleanName;
			}else{
				//console.log("north: "+(parseInt(String(this.id).substr(13))));
				window.location.hash = _currentMenu[_selectedRouteIndex].cleanName;
			}
		}
		// select current!!
	}
	
	var _cleanFloorName = function(name){
		llog(name);
		if(name.indexOf("- Noord")>=0){
			name = name.replace("- Noord","");
		}
		
		if(name.indexOf("- Zuid")>=0){
			name = name.replace("- Zuid","");
		}
		
		return name;
	}

	var _public = {
		initMenu: function (routes) {
			_initMenu(routes)
		},
		initDesktopMenu: function () {
			_initDesktopMenu();
		},
		buildDesktopMenu: function () {
			_buildDesktopMenu()
		},
		initialButtonOnMouseOver: function () {
			_initialButtonOnMouseOver();
		},

		selectedTransportation: function () {
			return _selectedTransportation
		},
		selectRoute: function (index) {
			_selectRoute(index)
		},
		setRouteChoice: function(choice){
			_setRouteChoice(choice);
		},
		selectNorth: function () {
			//console.log("n");
			document.getElementById('imgSouth').src = "images/draaiknopzuidzwart.png"
			document.getElementById('imgNorth').src = "images/draaiknopnoordwit.png"
			Site.Menu.setRouteChoice('north');
		},
		selectSouth: function () {
			document.getElementById('imgSouth').src = "images/draaiknopzuidwit.png"
			document.getElementById('imgNorth').src = "images/draaiknopnoordzwart.png"
			Site.Menu.setRouteChoice('south');
		}
		
		
	}
	return _public;

})();


Site.SiteManager = (function () {
    var _startFloorId = "fld29fe6ed5b1714fc9bba0ee2e0ee5fab718eef395af5d72a9d66290294632180";
    
    var _initPreloader = function(){
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

    }
    
    var _loadProjectsJsonDone = function(){
        document.getElementById('versionText').innerHTML = HOSPITALS.Model.settings().version;
        Site.Menu.initMenu(HOSPITALS.Model.routes())
        
        Core.managers.NavigationManager.showAsset(Site.Setup.content.Menu);
        
        _loadProjectAssets();
    }
    
    var _loadProjectJson = function(){
        HOSPITALS.Controller.loadJSON(function () {
			_loadProjectsJsonDone();
		});
    }
    
    var _loadProjectAssetsDone = function(){
        _initComplete();
    }
    var _loadProjectAssets = function(){
        HOSPITALS.Controller.loadFloors(function () {
			_loadProjectAssetsDone();
        })
    }

	var _init = function () {
		_initPreloader();
		HOSPITALS.MapsContainer.setStartFloor(_startFloorId);
        HOSPITALS.MapsContainer.init();
        _loadProjectJson();
	}




	var _initComplete = function () {
		//	
		var preloader = document.getElementById("preloaderSpinner");
		document.getElementById('application').removeChild(preloader);
		Core.managers.NavigationManager.showAsset(Site.Setup.content.Home);
		//Core.managers.NavigationManager.showAsset(Site.Setup.content.Menu);
		
	}

	var _public = {
		init: function () {
			_init()
		}
	}
	return _public;
})();

//Site.SiteManager.init();




Site.AnimationManager = (function () {

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
	Site.SiteManager.init();
});

function llog(msg){
	console.log(msg);
}
	