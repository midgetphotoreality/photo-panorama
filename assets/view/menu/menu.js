Site.view.Menu = (function () {
    var _divAsset;

    /*__FUNCTIONS_____________________________________________________________________________________________________*/
    var _build = function(){
        Site.Menu.buildDesktopMenu();
    }
    
    /*__CORE_FUNCTIONS________________________________________________________________________________________________*/
    var _init = function () {
        Core.debug.log("Site.view.Menu -> _init()");
        _divAsset = document.getElementById("Menu");
        Site.AnimationManager.genContentInit(_divAsset);
    }

    var onBtnOverzichtsplattegrond = function (event) {

        Core.debug.log("Site.view.Menu -> onBtnOverzichtsplattegrond()");
        Core.managers.NavigationManager.showAsset(Site.Setup.content.Overzichtsplattegrond);
    }

    var _show = function () {
        Core.debug.log("Site.view.Menu1 -> _show()");
        Site.AnimationManager.genContentShow(_divAsset);
    }

    var _hide = function (callback) {
        Core.debug.log("Site.view.Menu1 -> _hide()");
        Site.AnimationManager.genContentHide(_divAsset, callback);
    }

    var _remove = function () {
        Core.debug.log("Site.view.Menu1 -> _remove()");
        Site.Setup.content.Menu.removeView(Site.view.Menu);
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
Site.Setup.content.Menu.addView(Site.view.Menu);