import * as THREE from 'three';
import { normalizeToRange } from './utils';
import * as constants from './contants';


export async function drawStations(renderer, colors, source) {
    const stations = await fetch(source)
                                .then(response => response.json())
                                .catch(err => {
                                    console.log(err.message);
                                    showErrorMessage();
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
        const stationGeometry = new THREE.BoxGeometry(1, 1, 1);
        console.log(`Loading ${stations.length} stations`);
        // Create object for each station
        const objects = []
        stations.map(station => {
            // Mesh
            const currentMaterial = new THREE.MeshBasicMaterial({ color: colors[station.line] || "#000000" });
            const stationObject = new THREE.Mesh( stationGeometry, currentMaterial );
            // Normalize coordinates and measures 
            const normalizedX = normalizeToRange(station.position_x, minX, maxX, constants.MIN_X_SCALE, constants.MAX_X_SCALE);
            const normalizedY = normalizeToRange(station.position_z, minZ, maxZ, constants.MIN_Y_SCALE, constants.MAX_Y_SCALE);
            const normalizedZ = normalizeToRange(station.position_y, minY, maxY, constants.MIN_Z_SCALE, constants.MAX_Z_SCALE);
            stationObject.position.set(normalizedX, normalizedY, normalizedZ);
            // Add mesh to schene 
            objects.push(stationObject);
        });
        console.log('Stations loaded');

        return objects;
    }
    return [];
};


export async function drawConnections(renderer, colors, source) {
    return [];
}