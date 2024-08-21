import * as THREE from 'three';
import { normalizeToRange } from './utils';
import * as constants from './contants';


/**
 * Draw stations
 * @param {THREE.Renderer} renderer - Renderer object. 
 * @param {Set} colors - Colors set. 
 * @param {string} source - Source to query stations from.
 * @param {function} errorFunc - Function to call on loading error.
 * @returns 
 */
export async function drawStations(renderer, colors, source, errorFunc) {
    const stations = await fetch(source)
                                .then(response => response.json())
                                .catch(err => {
                                    console.log(err.message);
                                    errorFunc();
                                });

    if (renderer.domElement.style.display !== 'none') {
        const xPositions = [], yPositions = [], zPositions = [];
        stations.map(station => {
            xPositions.push(station.position_x);
            yPositions.push(station.position_y);
            zPositions.push(station.position_z);
        });
        const minX = Math.min(...xPositions), maxX = Math.max(...xPositions);
        const minY = Math.min(...yPositions), maxY = Math.max(...yPositions);
        const minZ = Math.min(...zPositions), maxZ = Math.max(...zPositions);

        // All stations use same geometry 
        const stationGeometry = new THREE.SphereGeometry(0.7, 10, 10);
        console.log(`Loading ${stations.length} stations`);
        // Create object for each station
        const objects = [];
        const stationsData = {};
        stations.map(station => {
            // Mesh
            const currentMaterial = new THREE.MeshBasicMaterial({ 
                color: colors[station.line] || "#000000", 
                transparent: true,
                opacity: 0.9
            });
            const stationObject = new THREE.Mesh( stationGeometry, currentMaterial );
            // Normalize coordinates and measures 
            const normalizedX = normalizeToRange(station.position_x, minX, maxX, constants.MIN_X_SCALE, constants.MAX_X_SCALE);
            const normalizedY = normalizeToRange(station.position_z, minZ, maxZ, constants.MIN_Y_SCALE, constants.MAX_Y_SCALE);
            const normalizedZ = normalizeToRange(station.position_y, minY, maxY, constants.MIN_Z_SCALE, constants.MAX_Z_SCALE);
            stationObject.position.set(normalizedX, normalizedY, normalizedZ);
            // Rotate to show crossing stations 
            stationObject.rotation.x = station.line / 15;
            stationObject.rotation.y = station.line / 15;
            stationObject.rotation.y = station.line / 15;
            // Add mesh to schene 
            objects.push(stationObject);
            stationsData[station.no] = new THREE.Vector3(normalizedX, normalizedY, normalizedZ);
        });
        console.log('Stations loaded');

        return {objects: objects, data: stationsData, minY: minZ, maxY: maxZ};
    }
    return {objects: [], data: undefined};
};
