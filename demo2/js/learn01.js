
window.onload = function () {
    init()
}

function init() {

    var stats = initStats()

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    var axes = new THREE.AxisHelper(5);
    scene.add(axes);

    var planeGeometry = new THREE.PlaneGeometry(60, 20,1,1)
    var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 10;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane)

    var cubeGeomery = new THREE.BoxGeometry(4,4,4);
    var cubeMaterial = new THREE.MeshLambertMaterial({color:0xff0000, wireframe:false})
    var cube = new THREE.Mesh(cubeGeomery, cubeMaterial);
    cube.castShadow = true;

    cube.position.x = -6;
    cube.position.y = 3;
    cube.position.z = 0;
    scene.add(cube)

    var sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    var sphereMatrial = new THREE.MeshLambertMaterial({color:0x7777ff})
    var sphere = new THREE.Mesh(sphereGeometry, sphereMatrial);
    sphere.position.x = 10;
    sphere.position.y = 3;
    sphere.position.z = 0;

    scene.add(sphere)



    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    var ambiteLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambiteLight)

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true
    scene.add(spotLight)


    document.getElementById("webgl_output").appendChild(renderer.domElement);
    renderer.render(scene, camera);

    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
    };

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);



    renderScene()
    var step = 0

    function renderScene () {

        stats.update();
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + ( 10 * (Math.cos(step)));
        sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(renderScene)
        renderer.render(scene, camera)
    }

    function initStats() {

        var stats = new Stats();

        stats.setMode(0); // 0: fps, 1: ms

        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onResize, false);


}

