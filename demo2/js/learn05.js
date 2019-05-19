window.onload = function () {

    init()
}

function init() {

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer()

    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMapCascade = true

    var planeG = new THREE.PlaneGeometry(60, 20);
    var planeM = new THREE.MeshBasicMaterial({color:0xff0000});
    var plane = new THREE.Mesh(planeG, planeM)

    plane.position.set(-0.5, 0 ,0)
    plane.rotation.x = -0.5 * Math.PI
    scene.add(plane)




    camera.position.set(-30, 30, 20);
    camera.lookAt(new THREE.Vector3(-5, 0, 0))

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    document.getElementById('webgl').appendChild(renderer.domElement)
    // renderer.render(scene, camera)

    var step = 0

    var vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ]

    var faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4),
    ];

    var geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals()


    var materials = [
        new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
    ];

    var mesh = new THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    mesh.children.forEach(function (e) {
        e.castShadow = true
    });
    scene.add(mesh);

    function addControl(x, y, z) {
        var controls = new function () {
            this.x = x;
            this.y = y;
            this.z = z;
        };

        return controls;
    }

    var controlPoints = [];
    controlPoints.push(addControl(1, 3, 1));
    controlPoints.push(addControl(1, 3, -1));
    controlPoints.push(addControl(1, -1, 1));
    controlPoints.push(addControl(1, -1, -1));
    controlPoints.push(addControl(-1, 3, -1));
    controlPoints.push(addControl(-1, 3, 1));
    controlPoints.push(addControl(-1, -1, -1));
    controlPoints.push(addControl(-1, -1, 1));

    var gui = new dat.GUI();

    // gui.add(new function () {
    //     this.clone = function () {
    //         var clonedGeometry = mesh.children[0].geometry.clone();
    //         // var materials = [
    //         //     // new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
    //         //     new THREE.MeshBasicMaterial({color: 0x000000, wireframe: false})
    //         //
    //         // ];
    //         // var mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
    //         // mesh2.children.forEach(function (e) {
    //         //     e.castShadow = true
    //         // });
    //         // // mesh2.translateX(10);
    //         // // mesh2.translateZ(10);
    //         // mesh2.name = "clone";
    //         // scene.remove(scene.getChildByName("clone"));
    //         // scene.add(mesh2)
    //     }
    // },'clone')
    for (var i = 0; i < 8; i++) {

        f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);
    }
    render();

    function render() {
        var vertices = [];
        for (var i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
        }

        mesh.children.forEach(function (e) {
            e.geometry.vertices = vertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
        });

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }


}