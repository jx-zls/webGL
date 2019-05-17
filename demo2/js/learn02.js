

window.onload = function () {

    init()

}

function init() {


    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMapEnabled = true;
    //
    var axes = new THREE.AxisHelper(5);
    scene.add(axes);

    var planeG = new THREE.PlaneGeometry(60, 20, 1, 1);
    var planeM = new THREE.MeshBasicMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeG, planeM);
    plane.receiveShadow = true;
    plane.position.set(10, 0,0);
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)

    var curbG = new THREE.CubeGeometry(4, 4, 4)
    var curbM = new THREE.MeshBasicMaterial({color: 0xff0000});
    var curb = new THREE.Mesh(curbG, curbM)
    curb.castShadow = true
    curb.position.set(-10, 10, 0)
    scene.add(curb)


    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position)


    var spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-10, 50, 0);
    spotLight.castShadow = true
    scene.add(spotLight)

    document.getElementById("webgl_output").appendChild(renderer.domElement);
    renderer.render(scene, camera)

}