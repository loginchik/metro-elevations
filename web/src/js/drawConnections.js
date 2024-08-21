import * as THREE from 'three';


/**
 * Draw connections between the stations 
 * @param {THREE.Renderer} renderer - Renderer object. 
 * @param {Set} stations - Set of stations to get locations from.
 * @param {Set} colors - Colors set. 
 * @param {string} source - Source to query stations from.
 * @param {function} errorFunc - Function to call on loading error.
 * @returns 
 */
export async function drawConnections(renderer, stations, colors, source, errorFunc) {
    const connections = await fetch(source)
                                .then(response => response.json())
                                .catch(err => {
                                    console.log(err.message);
                                    errorFunc()
                                })

    if (renderer.domElement.style.display !== 'none') {
        
        // Get stations on lines in ascending order 
        const lines = {}
        connections.forEach(connection => {
            if (!lines[connection.line]) {
                lines[connection.line] = new Set();
            }
            if (connection.type == 'train') {
                lines[connection.line].add(connection.from);
                lines[connection.line].add(connection.to);
            }
        })
        // Convert lines back into arrays 
        for (const line in lines) {
            lines[line] = Array.from(lines[line]).sort((a, b) => a - b);
        }
        // Create array of line geometries 
        const vectorizedLines = []
        Object.keys(lines).forEach(line => {
            const lineVectors = [];
            for (const stationNo of lines[line]) {
                lineVectors.push(stations[stationNo])
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(lineVectors);
            const material = new THREE.LineBasicMaterial({ 
                color: colors[line], 
                linewidth: 10, 
            });
            vectorizedLines.push(new THREE.Line(geometry, material));
        });

        return vectorizedLines;
    } else {
        return [];
    }
}