import * as THREE from 'three';
import * as constants from './contants';

/**
 * Draw lines to help orient in space. 
 * @param {number} zeroPosition - Zero (land) position.
 * @param {string} color - Line color. 
 */
export function drawOrientationLines(zeroPosition, color="#858585") {
    const geometryX = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(constants.MIN_X_SCALE, zeroPosition, 0),
        new THREE.Vector3(constants.MAX_X_SCALE, zeroPosition, 0), 
    ]);
    const geometryY = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, constants.MIN_Y_SCALE, 0),
        new THREE.Vector3(0, constants.MAX_Y_SCALE, 0), 
    ]);
    const geometryZ = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, zeroPosition, constants.MIN_Z_SCALE),
        new THREE.Vector3(0, zeroPosition, constants.MAX_Z_SCALE), 
    ]);
    const material = new THREE.LineBasicMaterial({ color: color });
    const lineX = new THREE.Line( geometryX, material );
    const lineY = new THREE.Line( geometryY, material );
    const lineZ = new THREE.Line( geometryZ, material );
    return [lineX, lineY, lineZ];
}