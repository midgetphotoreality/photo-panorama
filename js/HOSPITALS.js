/* Old browsers and scale -> fallback??
 * margins in scaling
 * event or callback for floorchange inroute -> label changes etc
 * set startfloor?? search for basefloor and overwrite?
 */
HOSPITALS = {};
HOSPITALS.Model = (function () {
	var _settings = false;
	var _floors = false;
	var _icons = false;
	var _routes = false;
	var _floorMargin = 0;

	var _setData = function (data) {
		_floors = data.floors;
		_settings = data.settings;
		_icons = data.icons;
		_routes = data.routes;
		_setFloors();
	};

	var _getData = function () {
		return _settings;
	};

	var _setFloors = function () {
		if (_floors.length > 0) {
			for (var i = 0; i < _floors.length; i++) {
				_floors[i].loaded = false;
			}
		}
	};

	var _getFloorById = function (id) {
		for (var i = 0; i < _floors.length; i++) {
			if (id == _floors[i].id) {
				return _floors[i];
			}
		}
		return false;
	};

	var _public = {
		setData: function (data) {
			_setData(data);
		},
		getData: function (data) {
			return _getData();
		},
		settings: function () {
			return _settings;
		},
		floors: function () {
			return _floors;
		},
		icons: function () {
			return _icons;
		},
		routes: function () {
			return _routes;
		},
		floorMargin: _floorMargin,
		getFloorById: function (id) {
			return _getFloorById(id);
		}
	};
	return _public;
})();

HOSPITALS.Controller = (function () {
	var _currentLoadedFloor = 0;
	var _currentLoadedIcon = 0;
	var _iconOffsetX = 0; //-9;
	var _iconOffsetY = 0; //-6;
	var _setFloorWidth = false;
	var _setFloorMargin = false;
	var _scaleRatio = 1;
	var _loadJSON = function (callback) {
		_loader = Core.net.Loader();
		_loader.setType("GET");
		_loader.setUrl("json/application.json");
		_loader.execute(function (loader) {
			var _data = eval("(" + loader.getText() + ")");
			Array.prototype.naturalSort = function () {
				var a, b, a1, b1, rx = /(\d+)|(\D+)/g,
					rd = /\d+/;
				return this.sort(function (as, bs) {
					a = String(as).toLowerCase().match(rx);
					b = String(bs).toLowerCase().match(rx);
					while (a.length && b.length) {
						a1 = a.shift();
						b1 = b.shift();
						if (rd.test(a1) || rd.test(b1)) {
							if (!rd.test(a1)) return 1;
							if (!rd.test(b1)) return -1;
							if (a1 != b1) return a1 - b1;
						} else if (a1 != b1) return a1 > b1 ? 1 : -1;
					}
					return a.length - b.length;
				});
			};

			var dict = {};
			var nameList = [];
			var u;
			var newRoutes = [];
			for (u = 0; u < _data.routes.length; u++) {
				dict[_data.routes[u].name] = _data.routes[u];
				nameList.push(_data.routes[u].name);
			}

			nameList.naturalSort();

			for (u = 0; u < nameList.length; u++) {
				newRoutes.push(dict[nameList[u]]);
			}

			_data.routes = newRoutes;

			HOSPITALS.Model.setData(_data);
			callback();
		});
	};

	var _getFLoorById = function (id) {
		for (var i = 0; i < HOSPITALS.Model.floors().length; i++) {
			if (id == HOSPITALS.Model.floors()[i].id) {
				return HOSPITALS.Model.floors()[i];
			}
		}
		return false;
	};

	var _loadFloors = function (callback) {
		if (HOSPITALS.Model.floors()[_currentLoadedFloor] && !HOSPITALS.Model.floors()[_currentLoadedFloor].loaded && _currentLoadedFloor < HOSPITALS.Model.floors().length) {
			_loadFloor(HOSPITALS.Model.floors()[_currentLoadedFloor], function () {
				_currentLoadedFloor++;
				_loadFloors(callback);
			});
		} else {
			if (callback) {
				callback();
			}
		}
	};

	var _loadFloor = function (floor, callback) {
		_currentLoadedIcon = 0;
		floor.canvas = document.createElement('canvas');
		floor.floorImg = document.createElement('img');

		floor.floorImg.onload = function () {

			var floorWidth = floor.floorImg.width;
			var floorHeight = floor.floorImg.height;

            
			HOSPITALS.MapsContainer.setScaleRatio(1);

			floor.floorHeight = floorHeight;
			floor.floorWidth = floorWidth;

			floor.canvas.width = floorWidth;
			floor.canvas.height = floorHeight;
            
            //TEMP
            /*
            document.getElementById('map1Image').width = floorWidth;
            document.getElementById('map1Image').height = floorHeight;
            */
            /*
            document.getElementById('map1').width = floorWidth;
            document.getElementById('map1').height = floorHeight
            */
			floor.canvas.getContext("2d").drawImage(floor.floorImg, 0, 0, floorWidth, floorHeight);

			_addIcon(floor, callback);
		};
		floor.floorImg.src = "images/floors/" + floor.linkage + ".png";
	};

	var _addIcon = function (floor, callback) { // adds next item
		var _done = false;
		if (floor.icons[_currentLoadedIcon] && !floor.icons[_currentLoadedIcon].loaded && _currentLoadedIcon < floor.icons.length) {
			floor.icons[_currentLoadedIcon].img = document.createElement('img');

			floor.icons[_currentLoadedIcon].img.onload = function () {
				_done = _drawIcon(
					floor.canvas,
					floor.icons[_currentLoadedIcon].img,
					Math.round(floor.icons[_currentLoadedIcon].x - floor.icons[_currentLoadedIcon].img.width / 2),
					Math.round(floor.icons[_currentLoadedIcon].y - floor.icons[_currentLoadedIcon].img.height / 2),
					floor.icons[_currentLoadedIcon].rotation
				);
				_currentLoadedIcon++;
				_addIcon(floor, callback);
			};
			floor.icons[_currentLoadedIcon].img.src = "images/icons/icon_" + floor.icons[_currentLoadedIcon].name + ".png";
		} else {
			floor.loaded = true;
			callback();
		}

	};

	var _drawIcon = function (canvas, img, x, y, angle) {
		var context = canvas.getContext('2d');
		var old = false;
		if (old) {
			context.drawImage(img, x, y);
		} else {

			var newX = x * HOSPITALS.MapsContainer.getScaleRatio();
			var newY = y * HOSPITALS.MapsContainer.getScaleRatio();
			var newWidth = img.width * HOSPITALS.MapsContainer.getScaleRatio();
			var newHeight = img.height * HOSPITALS.MapsContainer.getScaleRatio();

			context.save();
			context.translate(newX, newY);
			context.translate(newWidth / 2, newHeight / 2);
			angle = angle * Math.PI / 180;
			context.rotate(angle);
			context.drawImage(img, 0 - (newWidth / 2), 0 - (newHeight / 2), newWidth, newHeight);
			context.rotate(0 - angle);
			context.restore();

		}
		return true;
	};

	var _public = {
		setFloorWidth: function (w) {
			_setFloorWidth = w;
		},
		setFloorMargin: function (w) {
			_setFloorMargin = w;
		},
		getScaleRatio: function () {
			return _scaleRatio;
		},
		loadJSON: function (callback) {
			_loadJSON(callback);
		},
		loadFloors: function (callback) {
			_loadFloors(callback);
		},
		getFLoorById: _getFLoorById
	};
	return _public;
})();

HOSPITALS.MapsContainer = (function () {
	var _map1;
	var _map2;
	var _selectedFloor1 = false;
	var _selectedFloor2 = false;
	var _floor1 = false;
	var _floor2 = false;
	var _imgFloor1 = false;
	var _imgFloor2 = false;

	var _floor1Route = false;
	var _floor2Route = false;

	var _labelStart = false;
	var _labelEnd = false;

	var _canvasFloor1 = false;
	var _canvasFloor2 = false;

	//var _toolTip = false;

	var _arrow = false;
	var _arrowImg = false;

	var _selectedRoute = false;

	var _timeline = false;

	var _floorSwitchCallback = false;
	
	var _startFloor = false;
	
	var _scaleRatio = 1;

	var _selectedWidth = false;

	var _init = function () {
		Core.debug.info("HOSPITALS.MapsContainer._init");

		_map1 = document.getElementById("map1");
		_map2 = document.getElementById("map2");
		_floor1 = document.getElementById("map1Image");
		_floor2 = document.getElementById("map2Image");
		_floor1Route = document.createElement('canvas');
		_floor2Route = document.createElement('canvas');
		_labelStart = document.getElementById('mapLabelStart');
		_labelEnd = document.getElementById('mapLabelEnd');
		//_toolTip = document.getElementById('tooltip');
		_arrow = document.getElementById('mapArrow');

		// noord: flc76c26b1b34676bf350478ada601284a17fcbfd3804fb71e4c431b6f1198ee94
		// zuid: fl5a09086faa86ba6d507c8721aca6f1b265b3e41262d2a6bb4c668e2067e8b51c
		if(_startFloor){
			_setFloor1(_startFloor);//"fl5a09086faa86ba6d507c8721aca6f1b265b3e41262d2a6bb4c668e2067e8b51c");
		}
		
	};

	var _setWidth = function (w) {
		_selectedWidth = w;
		//console.log("_setWidth: " + w);
        //alert("sw")
		var ratio;
		//console.log(_selectedFloor1);
		//console.log(_map1);
		//console.log(_selectedFloor2);
		//console.log(_map2);
        
        var newW,newH;
        
		if (_selectedFloor1) {
			ratio = Math.floor((w / _selectedFloor1.floorWidth) * 100) / 100;
            _selectedFloor1.ratio = ratio;
			//console.log("ratio:" + ratio);
			_scaleMap(_map1, ratio);
            
            newW = _selectedFloor1.floorWidth * ratio;
            newH = _selectedFloor1.floorHeight * ratio;
            _map1.style.width = newW+"px";
            _map1.style.height = newH+"px";
		}

		if (_selectedFloor2) {
			ratio = Math.floor((w / _selectedFloor2.floorWidth) * 100) / 100;
			//console.log(ratio);
            _selectedFloor2.ratio = ratio;
			_scaleMap(_map2, ratio);
            
            newW = _selectedFloor2.floorWidth * ratio;
            newH = _selectedFloor2.floorHeight * ratio;
            _map2.style.width = newW+"px";
            _map2.style.height = newH+"px";
		} else {
			_scaleMap(_map2, 0.01);
		}
	};

	var _scaleMap = function (elem, ratio) {
        //elem.style.zoom = ratio;
        
		elem.style.webkitTransformOrigin = "0px 0px";
		elem.style.MozTransformOrigin = "0px 0px";
		elem.style.msTransformOrigin = "0px 0px";
		elem.style.OTransformOrigin = "0px 0px";
		elem.style.transformOrigin = "0px 0px";
        console.log("_scaleMap : "+ratio);
        console.log(elem)
       // ratio = 1;
		elem.style.webkitTransform = "scale(" + ratio + ")";
		elem.style.MozTransform = "scale(" + ratio + ")";
		elem.style.msTransform = "scale(" + ratio + ")";
		elem.style.OTransform = "scale(" + ratio + ")";
		elem.style.transform = "scale(" + ratio + ")";
        
        // set width
        
        //elem.style.width = 
	};

	var _selectRoute = function (route) {
		Core.debug.info("HOSPITALS.MapsContainer._selectRoute(" + route.name + ")");
		_selectedRoute = route;
		_setFloors();
		_drawRoute(route);
		_setLabels(route);
		_setToolTip(route);
		_loadArrow(route);
		if (_selectedWidth) {
            //alert("sr sw")
			_setWidth(_selectedWidth);
		}
	};

	var _startEmpty = function (route) {
		_selectedRoute = route;
		_setFloors();
	};

	var _loadArrow = function (route) {

		var ctx = _arrow.getContext('2d');
		_arrow.width = 10;
		_arrow.height = 10;

		ctx.moveTo(0, 0);
		ctx.lineTo(10, 5);
		ctx.lineTo(0, 10);
		ctx.fill();

		_floor1.appendChild(_arrow);

		_startAnimation(route);
	};

	var _startAnimationOnComplete = function () {
		if (_timeline) {
			_timeline.restart();

			if (_floor1) {
				if (_arrow) {
					_floor1.appendChild(_arrow);
				}
                /*
				if (_toolTip) {
					_floor1.appendChild(_toolTip);
				}
                */
			}
		}
	};

	var _startAnimation = function (route) {
		if (_timeline) {
			_timeline.kill();
		}
		_timeline = new TimelineLite({
			onComplete: _startAnimationOnComplete
		});
		_timeline.append(TweenLite.delayedCall(0,
			function () {
				_floor1.appendChild(_arrow);
                
                try{
                    _floor1.appendChild(_toolTip);
                }catch(e){
                }
				
				
				
				if(_floorSwitchCallback){
					_floorSwitchCallback(0);
				}
				/*
				try {
					document.getElementById("tooltiptext").innerHTML = route.floors[0].label;
					document.getElementById('labelMap1Container').className = "labelMap1Container labelMapCurrent";
					document.getElementById('labelMap2Container').className = "labelMap2Container";
				} catch (err) {}
				*/
			}));
		var arrowHeight = 10;
		var arrowWidth = 10;
		var arrowSpeed = 5;
		var offsetY = 0;
		var offsetX = 0;
		_arrow.style.top = ((parseInt(route.points[0].y) + offsetY) - (arrowHeight / 2)) * _scaleRatio + "px";
		_arrow.style.left = ((parseInt(route.points[0].x) + offsetX) - (arrowWidth / 2)) * _scaleRatio + "px";
		_arrow.style.width = arrowWidth * _scaleRatio + "px";
		_arrow.style.height = arrowHeight * _scaleRatio + "px";
		_arrow.style.rotationPoint = "50% 50%";

		var isOnSecondFloor = false;

		var totalPoints = route.points.length;

		for (i = 1; i < totalPoints; i++) {
			var duration = 1;
			if (i > 0) {
				var x1 = route.points[i].x;
				var x2 = route.points[i - 1].x;
				var y1 = route.points[i].y;
				var y2 = route.points[i - 1].y;
				var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
				duration = distance / 10 / arrowSpeed;

			}

			var rotation = 0;
			if (route.points[i - 1] && route.points[i - 1].angleOut) {
				rotation = route.points[i - 1].angleOut;
			}

			_timeline.append(TweenLite.to(_arrow, 0.00001, {
				css: {
					rotation: (rotation + "deg")
				},
				ease: Linear.easeNone
			}));

			_timeline.appendMultiple([
				TweenLite.to(_arrow, duration, {
					css: {
						top: ((parseInt(route.points[i].y) + offsetY) - (arrowHeight / 2)) * _scaleRatio,
						left: ((parseInt(route.points[i].x) + offsetX) - (arrowWidth / 2)) * _scaleRatio
					},
					ease: Linear.easeNone
				})/*,
				TweenLite.to(_toolTip, duration, {
					css: {
						top: ((parseInt(route.points[i].y) + offsetY) - (arrowHeight / 2)) * _scaleRatio,
						left: ((parseInt(route.points[i].x) + offsetX) - (arrowWidth / 2)) * _scaleRatio
					},
					ease: Linear.easeNone
				})*/
				]);

			if (i < totalPoints - 2) {
				if (route.points[i].floorId != route.points[i + 1].floorId) {
					_timeline.append(TweenLite.delayedCall(0,
						function () {
							_floor2.appendChild(_arrow);
							//_floor2.appendChild(_toolTip);
							if(_floorSwitchCallback){
								_floorSwitchCallback(1);
							}
							/*
							try {
								document.getElementById("tooltiptext").innerHTML = route.floors[1].label;
								document.getElementById('labelMap1Container').className = "labelMap1Container";
								document.getElementById('labelMap2Container').className = "labelMap2Container labelMapCurrent";
							} catch (err) {}
							*/
						}));
				}
			}

		}
		_timeline.play();
	};

	var _drawRoute = function (route) {
		Core.debug.info("HOSPITALS.MapsContainer._drawRoute(" + route.name + ")");

		var baseFloor = true;

		_floor1Route.width = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.width;
		_floor1Route.height = HOSPITALS.Model.getFloorById(route.floors[0].id).canvas.height;
		_floor2Route.width = HOSPITALS.Model.getFloorById(route.floors[1].id).canvas.width;
		_floor2Route.height = HOSPITALS.Model.getFloorById(route.floors[1].id).canvas.height;

		_floor2Route.width = _floor2Route.width;
		_floor1Route.width = _floor1Route.width;
		var context = _floor1Route.getContext('2d');
		context.beginPath();
		context.clearRect(0, 0, 600, 600);
		context.lineWidth = parseInt(HOSPITALS.Model.getData().lineThickness);
		var col = String("#" + parseInt(HOSPITALS.Model.getData().lineColor).toString(16));
		context.strokeStyle = "#6FB640";
		context.moveTo(route.points[0].x * _scaleRatio, route.points[0].y * _scaleRatio);
		for (var i = 0; i < route.points.length; i++) {
			context.lineTo(route.points[i].x * _scaleRatio, route.points[i].y * _scaleRatio);
			if (i < (route.points.length - 2) && route.points[i].floorId != route.points[i + 1].floorId) {
				context.stroke();
				context = _floor2Route.getContext('2d');
				context.beginPath();
				context.clearRect(0, 0, 1000, 1000);
				context.lineWidth = parseInt(HOSPITALS.Model.getData().lineThickness);
				//context.strokeStyle = '#'+parseInt(HOSPITALS.Model.getData().lineColor).toString(16);
				context.strokeStyle = "#6FB640";
				context.moveTo(route.points[i].x * _scaleRatio, route.points[i].y * _scaleRatio);
			}
		}

		context.stroke();
		_floor1.appendChild(_floor1Route);
		_floor1Route.className = "mapContent";
		_floor2.appendChild(_floor2Route);
		_floor2Route.className = "mapContent";

		// Destination icon
		var destImage = document.createElement('img');
		destImage.onload = function () {

			var newX = route.points[route.points.length - 1].x * _scaleRatio;
			var newY = route.points[route.points.length - 1].y * _scaleRatio;
			var newWidth = destImage.width * _scaleRatio;
			var newHeight = destImage.height * _scaleRatio;

			context.save();
			context.translate(newX, newY);
			context.translate(newWidth / 2, newHeight / 2);
			context.drawImage(destImage, -newWidth, -newHeight, newWidth, newHeight);
			context.restore();
		};

		destImage.src = "images/icons/icon_destination.png";
	};

	var _setToolTip = function (route) {
        /*
        try{
		_floor1.appendChild(_toolTip);
        }catch(e){
        }
        
		_toolTip.innerHTML = '<div class="tooltipInner"><span id="tooltiptext">' + route.floors[0].label + '</span></div>';
		var left, top;
		left = route.points[0].x * _scaleRatio;
		top = route.points[0].y * _scaleRatio;
		_toolTip.style.top = top + "px";
		_toolTip.style.left = left + "px";
        */
	};

	var _setLabels = function (route) {
		var f1 = route.floors[0];
		var f2 = route.floors[1];

		var leOffset = 10;
		var left, top, pos;
		var pos = "left";

		if (_labelStart) {

			pos = f1.start.pos;
			_labelStart.innerHTML = f1.start.label;
			left = route.points[0].x * _scaleRatio;
			top = route.points[0].y * _scaleRatio;

			left = left - (_labelStart.scrollWidth / 2);
			top = top - (_labelStart.scrollHeight / 2);

			if (pos == "up") {
				top = top - (_labelStart.scrollHeight / 2);
				top = top - leOffset;
			} else if (pos == "right") {
				left = left + (_labelStart.scrollWidth / 2);
				left = left + leOffset;
			} else if (pos == "down") {
				top = top + (_labelStart.scrollHeight / 2);
				top = top + leOffset;
			} else { // left
				left = left - (_labelStart.scrollWidth / 2);
				left = left - leOffset;
			}

			if (f1.start.x) {
				left = left + parseInt(f1.start.x);
			}
			if (f1.start.y) {
				top = top + parseInt(f1.start.y);
			}

			_labelStart.style.top = top + "px";
			_labelStart.style.left = left + "px";

			Core.debug.log("_setLabels - Start: " + top);
		}

		if (_labelEnd) {
			if (route.floors.length == 2 && route.floors[0].id != route.floors[1].id) {
				_floor2.appendChild(_labelEnd)
			} else {
				_floor1.appendChild(_labelEnd)
			}

			pos = f1.end.pos;
			_labelEnd.innerHTML = f1.end.label;

			left = route.points[route.points.length - 1].x * _scaleRatio;
			top = route.points[route.points.length - 1].y * _scaleRatio;

			left = left - (_labelEnd.scrollWidth / 2);
			top = top - (_labelEnd.scrollHeight / 2);

			if (pos == "up") {
				top = top - (_labelEnd.scrollHeight / 2);
				top = top - leOffset;
			} else if (pos == "right") {
				left = left + (_labelEnd.scrollWidth / 2);
				left = left + leOffset;
			} else if (pos == "down") {
				top = top + (_labelEnd.scrollHeight / 2);
				top = top + leOffset;
			} else { // left
				left = left - (_labelEnd.scrollWidth / 2);
				left = left - leOffset;
			}

			if (f1.end.x) {
				left = left + parseInt(f1.end.x);
			}
			if (f1.end.y) {
				top = top + parseInt(f1.end.y);
			}

			_labelEnd.style.top = top + "px";
			_labelEnd.style.left = left + "px";



			Core.debug.log("_setLabels - End: " + f2.end.y);
		}
	};

	var _setFloors = function () {
		if (!_selectedRoute) {
			return false;
		}

		_floor1.innerHTML = "";
		_floor2.innerHTML = "";
		if (_selectedRoute.floors.length == 2 && _selectedRoute.floors[0].id != _selectedRoute.floors[1].id) {
			_setFloor1(_selectedRoute.floors[0].id);
			_setFloor2(_selectedRoute.floors[1].id);
		} else {
			_setFloor1(_selectedRoute.floors[0].id);
			_setFloor2(false);
		}
	};

	var _setFloor1 = function (floorId) {
		Core.debug.info("HOSPITALS.MapsContainer._setFloor1(" + floorId + ")");
		var floor = HOSPITALS.Model.getFloorById(floorId);
		if (!floor) {
			return;
		}
		_selectedFloor1 = floor;
		_floor1.innerHTML = "";
		floor.canvas.className = "mapFloor";
		_floor1.appendChild(floor.canvas);
        
        // print scale
        
        //alert(_selectedFloor1.ratio)
        
        /*
        document.getElementById('map1Image').style.width = floor.floorWidth+"px";
        document.getElementById('map1Image').style.height = floor.floorHeight+"px";
            
        document.getElementById('map1').style.width = floor.floorWidth+"px";
        document.getElementById('map1').style.height = floor.floorHeight+"px"
            
        //alert(document.getElementById('map1').width);
        console.log("_setFloor1");
        console.log(document.getElementById('map1'));
        */
	};

	var _setFloor2 = function (floorId) {
		Core.debug.info("HOSPITALS.MapsContainer._setFloor2(" + floorId + ")");
		var floor = HOSPITALS.Model.getFloorById(floorId);
		if (!floor) {
			return;
		}
		_selectedFloor2 = floor;
		_floor2.innerHTML = "";
		floor.canvas.className = "mapFloor";
		_floor2.appendChild(floor.canvas);
		//console.log("_setFloor2 set");
		//console.log(document.getElementById('map2'));

	};
	
	var _setFloorSwitchCallback = function(callback){
		_floorSwitchCallback = callback;
	}

	var _public = {
		setStartFloor:function(floorID){
			_startFloor = floorID;
		},
		setFloorSwitchCallback: function(callback){
			_setFloorSwitchCallback(callback);
		},
		init: function () {
			_init();
		},
		selectRoute: function (route) {
			_selectRoute(route);
		},
        selectedRoute: function () {
			return _selectedRoute;
		},
        
		startEmpty: function (route) {
			_startEmpty(route);
		},
		getScaleRatio: function () {
			return _scaleRatio;
		},
		setScaleRatio: function (value) {
			_scaleRatio = value;
		},
		setWidth: function (value) {
            //alert("sw out")
			_setWidth(value);
		},
		selectedFloor2: function () {
			return _selectedFloor2;
		},
		selectedFloor1: function () {
			return _selectedFloor1;
		}
	};
	return (_public);
})();