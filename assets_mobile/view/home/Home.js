Site.view.Home = (function() {
	var _divAsset,theWidth,margin,btnPanorama;


	/*__FUNCTIONS_____________________________________________________________________________________________________*/

	/*__CORE_FUNCTIONS________________________________________________________________________________________________*/
	var _setButtonHandlers = function() {
        btnPanorama.onclick = function(){
            Core.managers.NavigationManager.showAsset(Site.Setup.content.Panorama);
        }
    }
	var _init = function() {
		Core.debug.log("Site.view.Home -> _init()");
		_divAsset = document.getElementById("Home");
		btnPanorama = document.getElementById("btnPanorama");
        
        _setButtonHandlers();
		Site.AnimationManager.genContentInit(_divAsset);
		Core.dom.addClass(document.getElementById('floor2Text'),"hidden");
		var _itemSpace = 10;
		document.getElementById('map1').style.top = parseInt(document.getElementById('floor1Text').offsetHeight)+_itemSpace+"px" ;
		
		var f1Height = document.getElementById('map1').getBoundingClientRect().height;
		document.getElementById('versionText').innerHTML = HOSPITALS.Model.settings().version;
		document.getElementById('versionText').style.top = parseInt(document.getElementById('map1').style.top)+parseInt(f1Height)+_itemSpace+"px";
		
		//alert(document.getElementById('versionText').style.top);
		
		HOSPITALS.MapsContainer.init();
		//HOSPITALS.MapsContainer.setWidth(Core.utils.getViewportSize().w);
		
        
        margin = 30;
        theWidth = window.innerWidth-margin;
        HOSPITALS.MapsContainer.setWidth(theWidth);
        window.onresize = function(event) {
            theWidth = window.innerWidth-margin;
            HOSPITALS.MapsContainer.setWidth(theWidth);
        };
         window.addEventListener('orientationchange', function(){
            theWidth = window.innerWidth-margin
            HOSPITALS.MapsContainer.setWidth(theWidth);
         });
        
        
		Site.Menu.buildMenu();
	}

	var _show = function() {
		Core.debug.log("Site.view.Home1 -> _show()");
		Site.AnimationManager.genContentShow(_divAsset);
	}

	var _hide = function(callback) {
		Core.debug.log("Site.view.Home1 -> _hide()");
		Site.AnimationManager.genContentHide(_divAsset, callback);
	}

	var _remove = function() {
		Core.debug.log("Site.view.Home1 -> _remove()");
		Site.Setup.content.Home.removeView(Site.view.Home);
		_divAsset = null;
	}


	/*__PUBLIC_FUNCTIONS______________________________________________________________________________________________*/
	var _public = {
		init: function() { _init(); },
		show: function() { _show(); },
		hide: function(callback) { _hide(callback); },
		remove: function() { _remove(); }
	}
	return _public;
})();
Site.Setup.content.Home.addView(Site.view.Home);