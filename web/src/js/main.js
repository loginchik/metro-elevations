import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { drawStations, drawConnections } from './drawStations';


if ( WebGL.isWebGL2Available() ) {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 0, -100, -100 );
    camera.lookAt( 0, 0, 0 );


    // Configure renderer 
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('#efefef');
    renderer.setPixelRatio(2);
    document.body.appendChild( renderer.domElement );

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
        
        fetch('/colors.json')
            // Fetch colors 
            .then(response => response.json())
            .then(colors => drawStations(renderer, colors, '/stations.json'))
            // Create station objects 
            .then(stations => {
                scene.add(...stations);
                return drawConnections();
            })
            .then(connections => {
                // scene.add(...connections);
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