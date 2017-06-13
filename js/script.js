/*
	PHOTOSPHERE with THREEE.js code
*/

var container 	= document.getElementById('container');

var width 		= window.innerWidth,
	height 		= window.innerHeight;

var renderer = Detector.webgl ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();	// use if webgl if present or fallback to canvas
	renderer.setSize(width,height);

/* CONSTANTS */
var PI 		= Math.PI,
	Camera 	= {
		FOV 	: 75,
		ASPECT 	: width/height,
		NEAR 	: 1,
		FAR 	: 1000 
	},
	Sphere 	= {
		RADIUS 	  : 150,
		HSEGMENTS : 50,
		VSEGMENTS : 100
	},
	Sphere_universe 	= {
		RADIUS 	  : 151,
		HSEGMENTS : 50,
		VSEGMENTS : 50
	},
	Sphere_spacecraft 	= {
		RADIUS 	  : 30,
		HSEGMENTS : 50,
		VSEGMENTS : 50
	},
	CamMask = {
		h: 30
	}

/*
 Creation of a scene, a camera and a sphere .
*/

var scene 		= new THREE.Scene(),
	camera	 	= new THREE.PerspectiveCamera(Camera.FOV, Camera.ASPECT, Camera.NEAR, Camera.FAR);

var geometry    = new THREE.SphereGeometry(Sphere.RADIUS,Sphere.HSEGMENTS,Sphere.VSEGMENTS),
	material 	= new THREE.MeshBasicMaterial(
						{
							map : THREE.ImageUtils.loadTexture('earth.png'),
							overdraw : true, // To the make the division lines of geometry disappear 
							transparent: true,
							alphaTest: 0.5
						}
				 	),
	sphere 		= new THREE.Mesh(geometry,material); 
	
var geometry_universe    = new THREE.SphereGeometry(Sphere_universe.RADIUS,Sphere_universe.HSEGMENTS,Sphere_universe.VSEGMENTS),
	material_universe 	= new THREE.MeshBasicMaterial(
						{
							map : THREE.ImageUtils.loadTexture('universe.png'),
							overdraw : true, // To the make the division lines of geometry disappear 
							transparent: true,
							alphaTest: 0.5
						}
				 	),
	sphere_universe 		= new THREE.Mesh(geometry_universe,material_universe); 
	
/*var maskgeo = new THREE.PlaneGeometry( CamMask.h*Camera.ASPECT, CamMask.h),
	maskmaterial = new THREE.MeshBasicMaterial( 
						{
							map : THREE.ImageUtils.loadTexture('img/spacecraft.png'),
							transparent: true,
							alphaTest: 0.5
							
						} 
					),
	maskplane = new THREE.Mesh( maskgeo, maskmaterial );*/
	
var geometry_spacecraft    = new THREE.SphereGeometry(Sphere_spacecraft.RADIUS,Sphere_spacecraft.HSEGMENTS,Sphere_spacecraft.VSEGMENTS),
	material_spacecraft 	= new THREE.MeshBasicMaterial(
						{
							map : THREE.ImageUtils.loadTexture('img/spacecraft.png'),
							overdraw : true, // To the make the division lines of geometry disappear 
							transparent: true,
							alphaTest: 0.5
						}
				 	),
	sphere_spacecraft 		= new THREE.Mesh(geometry_spacecraft,material_spacecraft); 

/* Positioning and other transforms */

sphere.scale.x = -1; // Invert the sphere to get the picture inside of sphere because our camera will be inside
sphere_universe.scale.x = -1;
sphere_spacecraft.scale.x = -1;

camera.position.x = 0.1; //TODO with lookAt and stuff

scene.add(sphere);
//scene.add(sphere_universe);
//scene.add(sphere_spacecraft);
scene.add(camera);
scene.add( sphere_universe );
camera.add( sphere_spacecraft );
//maskplane.position.set( 0, 0, -0.5*Math.sqrt(CamMask.h*CamMask.h*Camera.ASPECT*Camera.ASPECT+CamMask.h*CamMask.h)/Math.tan(0.95*Camera.FOV/180*PI) );

/*Controls*/
var controls = new THREE.OrbitControls(camera,renderer.domElement);
	controls.noPan = true;
	controls.noZoom = true;
	controls.autoRotate = false;
	controls.autoRotateSpeed = 0.1; //TODO

/*Rendering*/
container.appendChild(renderer.domElement);
render();
animate();

/*var no_background = 0;
setInterval(function() {
  no_background++;
  if (no_background % 2 == 1) {
  	sphere.material.map = THREE.ImageUtils.loadTexture( 'B271_panorama.jpg' );
	sphere.material.needsUpdate = true;
  }
  else {
  	sphere.material.map = THREE.ImageUtils.loadTexture( 'B272_panorama.jpg' );
	sphere.material.needsUpdate = true;
  }
},500);*/

function animate() {

	requestAnimationFrame( animate );

	sphere.rotation.y += 0.0005;
	//sphere.rotation.y += 0.02;

	renderer.render( scene, camera );

}

function render() {
	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene,camera);

}

/* Events when scrolling, and on window resize*/
function onMouseWheel(event){
	event.preventDefault();

	if(event.wheelDeltaY) {
		//Webkit
		camera.fov -= event.wheelDeltaY * 0.05;

	}
	else if(event.wheelDelta) {
		camera.fov -= event.wheelDelta * 0.05;
	}
	else if(event.detail) {
		camera.fov += event.detail * 1.0;
	}

	camera.fov = Math.max(50, Math.min(90, camera.fov));
	camera.updateProjectionMatrix();
}

container.addEventListener('mousewheel',onMouseWheel,false);
container.addEventListener('DOMMouseScroll',onMouseWheel,false);


function onResized(event) {
	renderer.setSize(window.innerWidth,window.innerHeight);
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	render();
}

window.addEventListener('resize',onResized,false);

function onCameraReset(){
	document.querySelector('.zoom-range-value.default').classList.remove('default');
	document.querySelector('[data-zoom="75"]').classList.add('default');
	camera.fov = 75;
	camera.updateProjectionMatrix();
}


var resetButton = document.getElementById('reset-button');
	if (resetButton) {
		resetButton.addEventListener('click',onCameraReset);
	}

/*Arrow controls*/
var arrows = document.getElementById('controls');
	if (arrows) {
		arrows.addEventListener('click',moveOnClick,false);
	}

function moveOnClick(e){
	var button = e.target;
		switch(button.dataset.movement) {
			case "up" 	: 	
					    rotate("y",-PI/20)
					    break;
			case "down" :
						rotate("y",PI/20);
						break;
			case "left"	: 
						rotate("x",-PI/20);
						break;
			case "right":	
						rotate("x",PI/20);
						break;
			default : break;
		}
}

function rotate(plane,radians) {
	if(plane === "x") controls.rotateLeft(radians);
	else controls.rotateUp(radians);
}

/* Zoom Controls */

var zoomPlus 	= document.getElementById('zoom-plus'),
	zoomMinus 	= document.getElementById('zoom-minus');

function zoom(increase){
	var current = camera.fov;
	var ranges = [].slice.call(document.querySelectorAll('.zoom-range-value'));

	if(increase) {
		for(var i=0; i< ranges.length; ++i) {

			var newFOV = parseInt(ranges[i].getAttribute('data-zoom'));

			if(newFOV < current) {
				document.querySelector('.zoom-range-value.default').classList.remove('default');
				ranges[i].classList.add('default');
				camera.fov = newFOV;
				break;
			}

		}
	}
	else {
		for(var i=ranges.length-1; i >= 0; --i) {

			var newFOV = parseInt(ranges[i].getAttribute('data-zoom'));

			if(newFOV > current) {
				document.querySelector('.zoom-range-value.default').classList.remove('default');
				ranges[i].classList.add('default');
				camera.fov = newFOV;
				break;
			}

		}

	}

	camera.updateProjectionMatrix();
}

if (zoomPlus) {
	zoomPlus.addEventListener('click',function(){ zoom(true)});
}
if (zoomMinus) {
	zoomMinus.addEventListener('click',function(){ zoom(false)});
}


/* Stop/Start Auto roate*/

function toggleAutoRotate(){
	controls.autoRotate = !controls.autoRotate;
	controls.update();
}

var checkbox = document.getElementById('auto-rotate');
if (checkbox){
	checkbox.addEventListener('change',toggleAutoRotate);
}


