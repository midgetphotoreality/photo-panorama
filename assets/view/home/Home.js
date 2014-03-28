Site.view.Home = (function () {
    var _divAsset;

    /*__FUNCTIONS_____________________________________________________________________________________________________*/

    /*__CORE_FUNCTIONS________________________________________________________________________________________________*/
    var _init = function () {
        Core.debug.log("Site.view.Home -> _init()");
        _divAsset = document.getElementById("Home");
        Site.AnimationManager.genContentInit(_divAsset);
        HOSPITALS.MapsContainer.init();
        Site.Menu.buildDesktopMenu();
        HOSPITALS.MapsContainer.setWidth(300);
        
        Core.managers.NavigationManager.showAsset(Site.Setup.content.Panorama);
    }

    var onBtnOverzichtsplattegrond = function (event) {

        Core.debug.log("Site.view.Menu -> onBtnOverzichtsplattegrond()");
        Core.managers.NavigationManager.showAsset(Site.Setup.content.Overzichtsplattegrond);
    }

    var _show = function () {
        Core.debug.log("Site.view.Home1 -> _show()");
        Site.AnimationManager.genContentShow(_divAsset);
    }

    var _hide = function (callback) {
        Core.debug.log("Site.view.Home1 -> _hide()");
        Site.AnimationManager.genContentHide(_divAsset, callback);
    }

    var _remove = function () {
        Core.debug.log("Site.view.Home1 -> _remove()");
        Site.Setup.content.Home.removeView(Site.view.Home);
        _divAsset = null;
    }


    /*__PUBLIC_FUNCTIONS______________________________________________________________________________________________*/
    var _public = {
        init: function () {
            _init();
        },
        show: function () {
            _show();
        },
        hide: function (callback) {
            _hide(callback);
        },
        remove: function () {
            _remove();
        }
    }
    return _public;
})();
Site.Setup.content.Home.addView(Site.view.Home);