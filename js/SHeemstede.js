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
			html: "assets/html/Home.html",
			js: "assets/js/Home.js",
			css: "assets/css/Home.css"
		}),
		Area: Core.display.Asset("About", "NORMAL", {
			preload: true,
			level: _level.content,
			html: "assets/html/About.html",
			js: "assets/js/About.js",
			css: "assets/css/About.css"
		}),
		/*Print: Core.display.Asset("Contact","NORMAL",{
			preload:	true,
			level:		_level.overlay,
			html:		"assets/html/Contact.html",
			js:			"assets/js/Contact.js",
			css:		"assets/css/Contact.css"
		}),
		Overzichtsplattegrond: Core.display.Asset("Overzichtsplattegrond", "NORMAL", {
			preload: true,
			level: _level.overlay,
			html: "assets/html/Overzichtsplattegrond.html",
			js: "assets/js/Overzichtsplattegrond.js",
			css: "assets/css/Overzichtsplattegrond.css"
		})
		*/
	}

	return {
		level: _level,
		content: _content
	}
})();

SHeemstede.Menu = (function () {
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

		Core.debug.log("SHeemstede.Menu._selectRoute(" + index + ")");
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

SHeemstede.MenuOld = (function () {
	var _menuCar = false;
	var _menuTrain = false;
	var _menuBus = false;

	var _transVarTrain = "transport_train";
	var _transVarCar = "transport_car";
	var _transVarBus = "transport_bus";

	var _selectedTransportation = false;
	var _selectedRoute = false;
	var _currentMenu = false;

	var _selectedRouteName = "";

	var _selectedMenuElement = false;
	var _clickedMenuElement = false;

	var _initMenu = function (routes) {

		_currentMenu = routes;
	}

	var getUrlVars = function () {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
		return vars;
	}

	var _buildDesktopMenu1 = function () {
		//alert("building menu")
	}

	var _initialButtonOnMouseOver = function () {
		if (_selectedMenuElement) {
			if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
				Core.dom.removeClass(_selectedMenuElement, "initialTopButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
			} else {
				Core.dom.removeClass(_selectedMenuElement, "initialButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
			}
		}
	}


	var _getPos = function (el) {
		for (var lx = 0, ly = 0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
		return {
			x: lx,
			y: ly
		};
	}

	var _curHash = "";

	var _startRoute = function (starts) {
		for (var i = 0; i < _currentMenu.length; i++) {
			if (starts && starts == _currentMenu[i].cleanName) { //(decodeURIComponent(starts) == decodeURIComponent(_currentMenu[i].name))) {
				//alert("got one "+starts);
				_menuClick(_clickedMenuElement, i);
				_startRoute();
				_selectRoute(i);
			}
		}
	}

	var _menuClick = function (that, id) {
		SHeemstede.Menu.selectRoute(id);
		if (_selectedMenuElement) {
			if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
				Core.dom.removeClass(_selectedMenuElement, "initialTopButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
			} else {
				Core.dom.removeClass(_selectedMenuElement, "initialButtonSelected");
				Core.dom.removeClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
			}
		}
		_selectedMenuElement = that;
		////console.log(this.innerHTML);
		if (Core.dom.hasClass(_selectedMenuElement, "initialSpecialButtonInnerMenuItem")) {
			Core.dom.addClass(_selectedMenuElement, "initialTopButtonSelected");
			Core.dom.addClass(_selectedMenuElement.parentNode.parentNode, "initialTopButtonSelected2");
		} else {
			Core.dom.addClass(_selectedMenuElement, "initialButtonSelected");
			Core.dom.addClass(_selectedMenuElement.parentNode.parentNode, "initialButtonSelected2");
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
		/*while(prevVal!=str){
				prevVal = str;
				str = String(str).replace("&","|");
			}*/
		return str;
	}

	var _buildDesktopMenu = function () {
		try {
			document.getElementById("Core31415926535897932384626433832preload").innerHTML = "";
		} catch (e) {

		}
		var initialButtons = document.getElementsByClassName('initialButtonInnerMenu');

		var i = 0;
		for (i = 0; i < initialButtons.length; i++) {
			initialButtons[i].innerHTML = "";
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

		var html;
		var sel = "";

		var routeIndex = 0;
		var currLetter = "a";
		var routeLetter = "a";
		var div = false;

		var specials = {
			"1": true,
			"2": true,
			"3": true,
			"4": true,
			"5": true,
			"6": true,
			"7": true,
			"BG": true
		}

		var special = false



		for (i = 0; i < _currentMenu.length; i++) {
			special = false

			routeLetter = _currentMenu[i].name.substr(0, 1).toUpperCase();
			if (specials[routeLetter] || specials[_currentMenu[i].name.substr(0, 2).toUpperCase()]) {
				special = true;
			}
			_currentMenu[i].cleanName = getCleanName(_currentMenu[i].name);
			_currentMenu[i].routeIndex = i;
			if (starts && starts == _currentMenu[i].cleanName) { //(decodeURIComponent(starts) == decodeURIComponent(_currentMenu[i].name))) {
				//alert(starts)
				startRoute = true;
				routeIndex = i
				//_selectRoute(i);
			}


			div = document.createElement('div');
			if (special) {
				div.className = "initialSpecialButtonInnerMenuItem";
			} else {
				div.className = "initialButtonInnerMenuItem";
			}

			_currentMenu[i].menuDiv = div;

			div.innerHTML = _formatName(_currentMenu[i].name);
			div.id = "r_" + i;
			div.onclick = function () {
				_clickedMenuElement = this;

				window.location.hash = _currentMenu[(this.id.replace("r_", ""))].cleanName;
			}

			if (_currentMenu[i].name.substr(0, 2).toUpperCase() == "BG") {
				document.getElementById("inner_BG").appendChild(div);
			} else {
				document.getElementById("inner_" + routeLetter).appendChild(div);
			}

			if (routeIndex == i && startRoute) {
				////console.log(div.innerHTML);
				div.click();
				//alert(i)
				_menuClick(div, i);
			}


		}

		var i = initialButtons;
		var theMove = 720;
		for (i = 0; i < initialButtons.length; i++) {

			if (initialButtons[i].getBoundingClientRect().top + initialButtons[i].scrollHeight > theMove) {
				var move = theMove - (initialButtons[i].getBoundingClientRect().top + initialButtons[i].scrollHeight)
				initialButtons[i].style.top = move + "px";
			}

		}
		if (startRoute) {
			_selectRoute(routeIndex);
		}
	}

	var _formatName = function (str) {
		if (String(str).lastIndexOf("_") > -1) {
			str = String(str).substr(0, String(str).lastIndexOf("_"));
		}
		return str;
	}

	var _selectRoute = function (index) {
		Core.debug.log("SHeemstede.Menu._selectRoute(" + index + ")");
		_selectedRoute = _currentMenu[index];
		_selectedRouteName = _formatName(_currentMenu[index].name);
		
		
		
		alert(document.getElementById('currentRoutePrint').innerHTML)
		//

		var f1 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[0].id);
		var f2 = HOSPITALS.Controller.getFLoorById(_selectedRoute.floors[1].id);

		document.getElementById('labelMap1').innerHTML = _cleanFloorName(f1.name);
		document.getElementById('labelMap2').innerHTML = "";
		if (_selectedRoute.floors[0].id != _selectedRoute.floors[1].id) {
			document.getElementById('labelMap2').innerHTML = _cleanFloorName(f2.name);
		}

		document.getElementById('topLabel').innerHTML = "route naar " + _selectedRouteName
		HOSPITALS.MapsContainer.selectRoute(_selectedRoute);
	}

	var _initDesktopMenu = function () {

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
		selectTransportMode: function (transVar) {
			_selectTransportMode(transVar)
		},
		selectedTransportation: function () {
			return _selectedTransportation
		},
		selectRoute: function (index) {
			_selectRoute(index)
		},
		TRANSPORT_TRAIN: function () {
			return _transVarTrain
		},
		TRANSPORT_CAR: function () {
			return _transVarCar
		},
		TRANSPORT_BUS: function () {
			return _transVarBus
		}
	}
	return _public;
})();

SHeemstede.SiteManager = (function () {

	var _init = function () {
		////console.log("SHeemstede.SiteManager INIT")
		// Preloader
		// CanvasLoader
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

		
		
		//TweenLite.from(document.getElementById("logo"), 0.5, {css:{autoAlpha:0, right:"0px"}});
		HOSPITALS.MapsContainer.setStartFloor("fld29fe6ed5b1714fc9bba0ee2e0ee5fab718eef395af5d72a9d66290294632180");
		HOSPITALS.MapsContainer.init();

		
		
		HOSPITALS.Controller.setFloorWidth(488);
		HOSPITALS.Controller.loadJSON(function () {
			document.getElementById('versionText').innerHTML = HOSPITALS.Model.settings().version;
			SHeemstede.Menu.initMenu(HOSPITALS.Model.routes())
			////console.log("SHeemstede.SiteManager -> Loading Floors")
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
		//Core.managers.NavigationManager.showAsset(SHeemstede.Setup.content.Menu);
		/*
		document.getElementById('print').onclick = function(){
			window.print();
		}
		*/
		//alert("SHeemstede.SiteManager -> _initComplete ")
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

function llog(msg){
	console.log(msg);
}
	