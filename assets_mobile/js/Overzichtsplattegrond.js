AZM.view.Overzichtsplattegrond = (function() {
	var _divAsset;
	var textCar = "Als u met de auto vanuit de richting Eindhoven komt, neemt u op de A2 de afslag 55 'academisch ziekenhuis Maastricht'. Komende vanaf Luik neemt u op de A2 richting Eindhoven de afslag 55 'academisch ziekenhuis Maastricht'. U rijdt vanaf de P. Debyelaan de parkeerplaats op. Vervolgens gaat u naar de eerste verdieping.";
	var textTrain = "U neemt de trein naar station Maastricht Randwijck. Op het perron gaat u met de trap omhoog naar de uitgang. Uit het station komend gaat u naar rechts. Na ongeveer vijf minuten lopen kunt u links via de loopbrug (ingang Noord) naar het AZM. Er is bewegwijzering aanwezig. Voor informatie over de dienstregeling van de treinen zie <a class=\"over_link\" href=\"http://www.ns.nl\" target=\"_blank\">ns.nl</a>";
	var textBus = "U neemt de roltrap of lift naar niveau 1. Informatie dienstregeling stads- en streekbussen zien <a class=\"over_link\" href=\"http://www.veolia-transport.nl\" target=\"_blank\">www.veolia-transport.nl</a>";


	/*__FUNCTIONS_____________________________________________________________________________________________________*/

	var _setText = function(){

		Core.dom.removeClass(document.getElementById('menuAreaBtnReisAuto'),"menuButtonSelected");
		Core.dom.removeClass(document.getElementById('menuAreaBtnReisAutoDiv'),"menuButtonSelected");
		Core.dom.removeClass(document.getElementById('menuAreaBtnReisTrein'),"menuButtonSelected");
		Core.dom.removeClass(document.getElementById('menuAreaBtnReisTreinDiv'),"menuButtonSelected");
		Core.dom.removeClass(document.getElementById('menuAreaBtnReisBusTaxi'),"menuButtonSelected");
		Core.dom.removeClass(document.getElementById('menuAreaBtnReisBusTaxiDiv'),"menuButtonSelected");

		//alert(AZM.Menu.selectedTransportation());
		if(AZM.Menu.selectedTransportation() == 'transport_car'){
			document.getElementById('helpText').innerHTML = textCar;
			Core.dom.addClass(document.getElementById('menuAreaBtnReisAuto'),"menuButtonSelected");
			Core.dom.addClass(document.getElementById('menuAreaBtnReisAutoDiv'),"menuButtonSelected");
		}
		if(AZM.Menu.selectedTransportation() == 'transport_train'){
			document.getElementById('helpText').innerHTML = textTrain;
			Core.dom.addClass(document.getElementById('menuAreaBtnReisTrein'),"menuButtonSelected");
			Core.dom.addClass(document.getElementById('menuAreaBtnReisTreinDiv'),"menuButtonSelected");
		}
		if(AZM.Menu.selectedTransportation() == 'transport_bus'){
			document.getElementById('helpText').innerHTML = textBus;
			Core.dom.addClass(document.getElementById('menuAreaBtnReisBusTaxi'),"menuButtonSelected");
			Core.dom.addClass(document.getElementById('menuAreaBtnReisBusTaxiDiv'),"menuButtonSelected");
		}
	}

	/*__CORE_FUNCTIONS________________________________________________________________________________________________*/
	var _init = function() {
		Core.debug.log("AZM.view.Overzichtsplattegrond -> _init()");
		_divAsset = document.getElementById("Overzichtsplattegrond");
		AZM.AnimationManager.genContentInit(_divAsset);
		
		document.getElementById("menuAreaBtnReisAuto").onclick = function(){
			AZM.Menu.selectTransportMode('transport_car');
			_setText();
		}
		document.getElementById("menuAreaBtnReisTrein").onclick = function(){
			AZM.Menu.selectTransportMode('transport_train');
			_setText();
		}
		document.getElementById("menuAreaBtnReisBusTaxi").onclick = function(){
			AZM.Menu.selectTransportMode('transport_bus');
			_setText();
		}
		
		_setText();
		//HOSPITALS.MapsContainer.init();
	}

	var _show = function() {
		Core.debug.log("AZM.view.Overzichtsplattegrond -> _show()");
		AZM.AnimationManager.genContentShow(_divAsset);
	}

	var _hide = function(callback) {
		Core.debug.log("AZM.view.Overzichtsplattegrond -> _hide()");
		AZM.AnimationManager.genContentHide(_divAsset, callback);
	}

	var _remove = function() {
		Core.debug.log("AZM.view.Overzichtsplattegrond -> _remove()");
		AZM.Setup.content.Overzichtsplattegrond.removeView(AZM.view.Overzichtsplattegrond);
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
AZM.Setup.content.Overzichtsplattegrond.addView(AZM.view.Overzichtsplattegrond);