

window.onload = function () {
    init()
}

function init() {

    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer()


    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapCascade = true

    var planeG = new THREE.PlaneGeometry(60,20);
    var planeM = new THREE.MeshBasicMaterial({color:0xcccccc});
    var plane = new THREE.Mesh(planeG, planeM)
    plane.receiveShadow = true

    plane.position.set(0, 0, 0)
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane)

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 30, 10);
    spotLight.castShadow = true;
    scene.add(spotLight)

    camera.position.set(-40, 30, 30);
    camera.lookAt(new THREE.Vector3(-10, 0, 0));

    var ambiteLight = new THREE.AmbientLight(0x090909)
    scene.add(ambiteLight)
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 40, 50);
    spotLight.castShadow = true;
    scene.add(spotLight);
    addG(scene)
    document.getElementById('webgl').appendChild(renderer.domElement)
    renderer.render(scene, camera)


    function addG(scene) {
        var geoms = [];
        geoms.push(new THREE.CylinderGeometry(1, 4, 4));
        geoms.push(new THREE.BoxGeometry(2, 2, 2));
        geoms.push(new THREE.SphereGeometry(2));
        geoms.push(new THREE.IcosahedronGeometry(4));

        var points = [
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(2, 2, -2),
            new THREE.Vector3(-2, 2, -2),
            new THREE.Vector3(-2, 2, 2),
            new THREE.Vector3(2, -2, 2),
            new THREE.Vector3(2, -2, -2),
            new THREE.Vector3(-2, -2, -2),
            new THREE.Vector3(-2, -2, 2)
        ];
        geoms.push(new THREE.ConvexGeometry(points));
        var pts = [];
        var detail = .1;
        var radius = 3;
        for (var angle = 0.0; angle < Math.PI; angle += detail)
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        geoms.push(new THREE.LatheGeometry(pts, 12));

        geoms.push(new THREE.OctahedronGeometry(3, 1));

        geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

        //
        geoms.push(new THREE.TetrahedronGeometry(3, 3));

        geoms.push(new THREE.TorusGeometry(5, 3, 30, 5));

        geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

        var j = 0;
        for (var i = 0; i < geoms.length; i++) {
            var cubeMaterial = new THREE.MeshLambertMaterial({wireframe: false, color: Math.random() * 0xffffff});
            var baseMaterial = new THREE.MeshBasicMaterial({wireframe: false, color: Math.random() * 0xffffff});


            var materials = [

                new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff, shading: THREE.FlatShading}),
                new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})

            ];

            var mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
            // var mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], [baseMaterial]);
            mesh.traverse(function (e) {
                e.castShadow = true
            });

            //var mesh = new THREE.Mesh(geoms[i],materials[i]);
            //mesh.castShadow=true;
            mesh.position.x = -24 + ((i % 4) * 12);
            mesh.position.y = 4;
            mesh.position.z = -8 + (j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }

    }
}