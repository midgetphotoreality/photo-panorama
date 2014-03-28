Site.view.Panorama = (function () {
    var _divAsset,
        _pan1, _pan2,
        _pan1Container, _pan2Container,
        pan1ContainerCopy, pan2ContainerCopy,
        pan1Canvas, pan2Canvas,
        pan1CanvasCopy, pan2CanvasCopy,
        _route,
        btnSnapShot, btnClose,
        w = 300,
        h = 200;
    /*
    var camera, scene, renderer;
    var texture_placeholder,
        isUserInteracting = false,
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        lon = 0,
        onMouseDownLon = 0,
        lat = 0,
        onMouseDownLat = 0,
        phi = 0,
        theta = 0;
*/
    var _panorama = function (canvas, container, width, height, webgl) {
        var camera, scene, renderer, mesh,
            texture_placeholder,
            isUserInteracting = false,
            onMouseDownMouseX = 0,
            onMouseDownMouseY = 0,
            lon = 0,
            onMouseDownLon = 0,
            lat = 0,
            onMouseDownLat = 0,
            phi = 0,
            theta = 0,
            container = container,
            canvas = canvas,
            _w = width,
            _h = height,
            webgl = webgl,
            _onPanoMouseDown = function (event) {
                event.preventDefault();

                isUserInteracting = true;

                onPointerDownPointerX = event.clientX;
                onPointerDownPointerY = event.clientY;

                onPointerDownLon = lon;
                onPointerDownLat = lat;
            },
            _onPanoMouseMove = function (event) {
                if (isUserInteracting === true) {

                    lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
                    //lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

                }
            },
            _onPanoMouseUp = function (event) {
                isUserInteracting = false;
            },
            _init = function (imageUrl) {
                camera = new THREE.PerspectiveCamera(75, _w / _h, 1, 1100);
                camera.target = new THREE.Vector3(0, 0, 0);

                scene = new THREE.Scene();

                var geometry = new THREE.SphereGeometry(500, 60, 40);
                geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

                var material = new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture(imageUrl),
                    overdraw: false
                });

                mesh = new THREE.Mesh(geometry, material);

                scene.add(mesh);
                if (webgl) {
                    renderer = new THREE.WebGLRenderer({
                        canvas: canvas
                    });
                } else {
                    renderer = new THREE.CanvasRenderer({
                        canvas: canvas
                    });
                }
                
                renderer.setSize(_w, _h);
                container.appendChild(renderer.domElement);

                container.addEventListener('mousedown', _onPanoMouseDown, false);
                container.addEventListener('mousemove', _onPanoMouseMove, false);
                container.addEventListener('mouseup', _onPanoMouseUp, false);
            },
            _update = function () {
                lat = Math.max(-85, Math.min(85, lat));
                phi = THREE.Math.degToRad(90 - lat);
                theta = THREE.Math.degToRad(lon);

                camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
                camera.target.y = 500 * Math.cos(phi);
                camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

                camera.lookAt(camera.target);
                renderer.render(scene, camera);
            },
            _animate = function () {
                requestAnimationFrame(_animate);
                _update();
            },
            _public = {
                init: function (imageUrl) {
                    _init(imageUrl)
                },
                update: function () {
                    _update()
                },
                animate: function () {
                    _animate()
                }
            }
        return _public;
    }

    /*__FUNCTIONS_____________________________________________________________________________________________________*/
    //data:image/gif;base64,
    var _snapShot = function () {
        console.log("Site.view.Panorama -> _snapShot()");
        var ctx1 = pan1CanvasCopy.getContext('2d');
        ctx1.drawImage(pan1Canvas, w, h);
        var ctx2 = pan2CanvasCopy.getContext('2d');
        ctx2.drawImage(pan2Canvas, w, h);

        console.log(pan1Canvas.toDataURL("image/jpeg"));
        var img = document.createElement('img');
        img.src = pan1Canvas.toDataURL("image/jpeg");

        pan1ContainerCopy.appendChild(img);
        //document.getElementById('pan1ImageCopy').src = pan1Canvas.toDataURL("image/jpeg");
        //document.getElementById('pan2ImageCopy').src = pan2Canvas.toDataURL("image/jpeg");

    }
    var _setButtonHandlers = function () {
        btnSnapShot.onclick = function () {
            _snapShot();
        }
    }

    /*__CORE_FUNCTIONS________________________________________________________________________________________________*/
    var _init = function () {
        console.log("Site.view.Panorama -> _init()");
        Core.debug.log("Site.view.Panorama -> _init()");
        _divAsset = document.getElementById("panorama");

        _pan1Container = document.getElementById("pan1Container");
        _pan2Container = document.getElementById("pan2Container");
        pan1ContainerCopy = document.getElementById("pan1ContainerCopy");
        pan2ContainerCopy = document.getElementById("pan2ContainerCopy");

        pan1Canvas = document.getElementById("pan1Canvas");
        pan2Canvas = document.getElementById("pan2Canvas");
        pan1CanvasCopy = document.getElementById("pan1CanvasCopy");
        pan2CanvasCopy = document.getElementById("pan2CanvasCopy");

        btnSnapShot = document.getElementById("btnSnapShot");
        btnClose = document.getElementById("btnClose");

        pan1CanvasCopy.width = w;
        pan1CanvasCopy.height = h;

        pan2CanvasCopy.width = w;
        pan2CanvasCopy.height = h;

        Site.AnimationManager.genContentInit(_divAsset);

        _route = HOSPITALS.MapsContainer.selectedRoute();

        console.log(_route.points);

        if (_route.points && _route.points.length > 2) {
            
            var i1 = 1,
                i2 = 1,
                p1 = 'images/pano/' + _route.points[i1].panorama[0].linkage + ".jpg",
                p2 = 'images/pano/' + _route.points[i2].panorama[0].linkage + ".jpg";

            _pan1 = _panorama(pan1Canvas, _pan1Container, w, h,true);
            _pan1.init(p1);
            _pan1.animate();

            _pan2 = _panorama(pan2Canvas, _pan2Container, w, h,false);
            _pan2.init(p2);
            _pan2.animate();
        }

        _setButtonHandlers();
    }

    var onBtnOverzichtsplattegrond = function (event) {

        Core.debug.log("Site.view.Menu -> onBtnOverzichtsplattegrond()");
        Core.managers.NavigationManager.showAsset(Site.Setup.content.Overzichtsplattegrond);
    }

    var _show = function () {
        Core.debug.log("Site.view.Panorama1 -> _show()");
        Site.AnimationManager.genContentShow(_divAsset);
    }

    var _hide = function (callback) {
        Core.debug.log("Site.view.Panorama1 -> _hide()");
        Site.AnimationManager.genContentHide(_divAsset, callback);
    }

    var _remove = function () {
        Core.debug.log("Site.view.Panorama1 -> _remove()");
        Site.Setup.content.Panorama.removeView(Site.view.Panorama);
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
Site.Setup.content.Panorama.addView(Site.view.Panorama);