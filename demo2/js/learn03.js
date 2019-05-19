
window.onload = function () {
    init()
}

function init() {

    var stats = initStats()
    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
    scene.overrideMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 0.1, 1000.0);
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xffffff, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapCascade = true;


    var planeG = new THREE.PlaneGeometry(60, 30);
    var plangM = new THREE.MeshBasicMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeG, plangM);
    plane.position.set(-0.5, 0,0,);
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)

    camera.position.set(-40, 30, 30);
    camera.lookAt(scene.position)

    var ambiteLigth = new THREE.AmbientLight(0x0c0c0c)
    scene.add(ambiteLigth)

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);



    document.getElementById('webgl').appendChild(renderer.domElement)
    // renderer.render(scene, camera)

    var step = 0
    var controls = new function () {
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function () {
            var allChildren = scene.children;
            var lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function () {

            var cubeSize = Math.ceil((Math.random() * 3));
            var cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            var cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = "cube-" + scene.children.length;

            cube.position.x = -30 + Math.round((Math.random() * planeG.parameters.width));
            cube.position.y = Math.round((Math.random() * 5)) + cubeSize;
            cube.position.z = -20 + Math.round((Math.random() * planeG.parameters.height));

            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function () {
            console.log(scene.children);
        }
    }

    var gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    render()

    function render() {
        stats.update();

        // rotate the cubes around its axes
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {

                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


    function initStats() {
        var stats = new Stats()
        stats.setMode(0);
        stats.domElement.position = 'absolute';
        stats.domElement.left = '0px';
        stats.domElement.top = '0px';
        document.getElementById('stats').appendChild(stats.domElement)
        return stats
    }
}