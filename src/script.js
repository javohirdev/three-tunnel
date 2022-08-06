import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui';

// Audio stream
var audioStream = 'https://cdn.rawgit.com/ellenprobst/web-audio-api-with-Threejs/57582104/lib/TheWarOnDrugs.m4a';

// Canvas
const canvas = document.querySelector('canvas.webgl')

// GUI
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene()

// Array points
const points = [
    [18.1, 58.2],
    [93.6, 8.6],
    [145.3, 89.5],
    [75.9, 148],
    [81.7, 90.2],
    [18.1, 58.2],
];

for(var i = 0; i < points.length; i++){
    var x = points[i][0];
    var y = 0;
    var z = points[i][1];
    points[i] = new THREE.Vector3(x, y, z);
}

// Path
const path = new THREE.CatmullRomCurve3(points);

// Objects
const geometry = new THREE.TubeGeometry(path, 300, 4, 32, true)

// Materials
const material = new THREE.MeshLambertMaterial({
    wireframe: true,
    side: THREE.BackSide
})

// Mesh
const tube = new THREE.Mesh(geometry, material)
scene.add(tube)

// Lights
const light = new THREE.PointLight(0xffffff, 1, 200);
scene.add(light);

// light gui

const data = {
    color: light.color.getHex(),
    mapsEnabled: true,
}
const lightFolder = gui.addFolder('Three.Light')
lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')))
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.001, 500)
camera.position.z = 400;
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Audio
var listener = new THREE.AudioListener();
camera.add(listener)

var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();

audioLoader.load(audioStream, function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
    sound.play();
},
    function ( xhr ) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },

    function ( err ) {
        console.log('Error');
    }
)

/**
 * Animate
 */

const clock = new THREE.Clock()

var speed = 0;
const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    speed += 0.0015;
    var p1 = path.getPointAt(speed%1);
    var p2 = path.getPointAt((speed + 0.01)%1);
    var p3 = path.getPointAt((speed + 0.07)%1);
    camera.position.set(p1.x, p1.y, p1.z);
    camera.lookAt(p2)
    light.position.set(p3.x, p3.y, p3.z)

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()