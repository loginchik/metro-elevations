import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { drawStations } from './drawStations';
import { drawConnections } from './drawConnections';
import * as constants from './contants';
import { normalizeToRange } from './utils';
import { drawOrientationLines } from './drawOrientationLines';
import { drawIntersections } from './drawIntersections';


if ( WebGL.isWebGL2Available() ) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, -100, -100 );
    camera.lookAt( 0, 0, 0 );


    // Configure renderer 
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('#242424');
    renderer.setPixelRatio(2);
    document.body.appendChild( renderer.domElement );

    let stationObjects = [];
    /**
     * Animation cycle
     */
    function animate() {
        renderer.render( scene, camera );
    }

    /**
     * Updates camera and renderer on window resize
     */
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);


    /** 
     * Orbit controls to allow view rotation
     */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });

    /**
     * Loads preconfigured data and configures display. 
     * 
     * In case there are some errors with resource loading, error message is displayed 
     * whilst renderere domElement is hidden.
     */
    async function loadData() {
        /**
         * Switches visibility of error message block and hides canvas 
         * in case there is an error loading resources
         */
        const showErrorMessage = () => {
            const errorElement = document.body.querySelector('#error-message');
            errorElement.style.display = 'block';
            renderer.domElement.style.display = 'none';
        }
        
        let projectColors;
        let stationsData;
        fetch('/colors.json')
            // Fetch colors 
            .then(response => response.json())
            .then(colors => {
                projectColors = colors;
                return drawStations(renderer, colors, '/stations.json', showErrorMessage)
            })
            // Create station objects 
            .then(stations => {
                scene.add(...stations.objects);
                stationObjects = stations.objects;
                stationsData = stations;
                return drawConnections(renderer, stationsData.data, projectColors, '/connections.json', showErrorMessage);
            })
            // Draw lines between stations
            .then(connections => {
                scene.add(...connections);
                // const zeroYPosition = normalizeToRange(0, stationsData.minY, stationsData.maxY, constants.MIN_Y_SCALE, constants.MAX_Y_SCALE);
                // scene.add( ...drawOrientationLines(zeroYPosition) );
                return drawIntersections(renderer, stationsData.data, '/intersections.json', showErrorMessage);
            })
            .then(intersections => {
                const material = new THREE.LineBasicMaterial({ color: "#efefef" });
                intersections.map(intersection => scene.add(new THREE.Line(intersection, material)));
                renderer.setAnimationLoop( animate );
            })
            .catch(err => {
                console.log(err.message);
                showErrorMessage();
            });
    }
    
	loadData();

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'container' ).appendChild( warning );

};