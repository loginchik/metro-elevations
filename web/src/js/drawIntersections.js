import * as THREE from 'three';


export async function drawIntersections(renderer, stations, source, errorFunc) {
    const connections = await fetch(source)
                                .then(response => response.json())
                                .catch(err => {
                                    console.log(err.message);
                                    errorFunc()
                                })

    if (renderer.domElement.style.display !== 'none') {
        const vectors = [];
        connections.map(connection => {
            vectors.push(new THREE.BufferGeometry().setFromPoints([
                stations[connection.from], 
                stations[connection.to]
            ]));
        });
        return vectors;
    } else {
        return [];
    }
}