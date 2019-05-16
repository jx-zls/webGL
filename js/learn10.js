var VSHADER_SOURCE =
    ' attribute vec4 a_Position;' +
    ' varying vec4 v_Color;' +
    ' attribute vec4 a_Normal;' +
    ' uniform mat4 u_MVProjectMatrix;' +
    ' uniform mat4 u_NormalMatrix;' +
    ' void main() {' +
    ' gl_Position = u_MVProjectMatrix * a_Position;' +
    ' vec4 color = vec4(1.0, 0.4, 0.0, 1.0);' +
    ' vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);' +
    ' vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));' +
    ' float nDotL = max(dot(normal, lightDirection), 0.0);' +
    ' v_Color = vec4(color.rgb * nDotL, color.a);' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    ' varying vec4 v_Color;' +
    ' void main() {' +
    '   gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl')

    var gl = getWebGLContext(canvas)
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('init shader failure');
        return;
    }

    var n = initVertexBuffer(gl)
    if(n < 0){
        console.log('n < 0', n)
        return
    }
    gl.clearColor(0,0,0,1.0);

    gl.enable(gl.DEPTH_TEST);

    var u_mvprojectMatrix = gl.getUniformLocation(gl.program, 'u_MVProjectMatrix')
    var u_normalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    if(!u_mvprojectMatrix || !u_normalMatrix){
        console.log('matrix failure')
        return
    }

    var mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective(50.0, 1, 1.0, 100.0)
    mvpMatrix.lookAt(20.0, 10.0, 30.0, 0,0,0,0, 1.0,0)

    document.onkeydown = function(ev){
        keyDown(gl, n, mvpMatrix, u_mvprojectMatrix, u_normalMatrix, ev)
    }


    draw(gl, n, mvpMatrix, u_mvprojectMatrix, u_normalMatrix);  // Draw the robot arm
}

var ANGLE_STEP = 30.0
var g_arm1Angle = 90.0
var g_joint1Angle = 0.0

var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4();
var g_normalMatrix = new Matrix4();


function keyDown(gl, n, mvpMatrix, u_mvprojectMatrix, u_normalMatrix, ev) {

    switch (ev.keyCode) {
        case 38:
            if (g_joint1Angle < 135.0) g_joint1Angle += ANGLE_STEP;
            break;
        case 40:
            if (g_joint1Angle > -135.0) g_joint1Angle -= ANGLE_STEP;
            break;
        case 39:
            g_arm1Angle = (g_arm1Angle + ANGLE_STEP) % 360;
            break;
        case 37:
            g_arm1Angle = (g_arm1Angle - ANGLE_STEP) % 360;
            break;
        default: return;
    }

    draw(gl, n, mvpMatrix, u_mvprojectMatrix, u_normalMatrix);

}

function draw(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var arm1Length = 10.0;
    g_modelMatrix.setTranslate(0.0, -12.0, 0.0);
    g_modelMatrix.rotate(g_arm1Angle, 0.0, 1.0, 0.0);    // Rotate around the y-axis
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix)
    //
    g_modelMatrix.translate(0.0, 10.0, 0.0);
    g_modelMatrix.rotate(g_joint1Angle, 0.0, 0.0, 1.0);
    g_modelMatrix.scale(1.3, 1.0, 1.3);
    drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}

function drawBox(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {

    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, g_mvpMatrix.elements);
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
        -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
        -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
    ]);

    // Normal
    var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
    ]);

    if(!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3 )){
        console.log('a_Position failure');
        return -1;
    }

    if(!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3 )){
        console.log('a_Position failure');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
}


function initArrayBuffer(gl, attribute, data, type, num) {

    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    var attributeValue = gl.getAttribLocation(gl.program, attribute);
    if(attributeValue < 0){
        return false
    }
    gl.vertexAttribPointer(attributeValue, num, type, false, 0,0);
    gl.enableVertexAttribArray(attributeValue)

    return true
}
