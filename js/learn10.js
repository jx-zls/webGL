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
    ' vec3 lightDirection = normalize(vec3(0.0. 0.5, 0.7));' +
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

    var u_mvprojectMatrix = gl.getUniformLocation(gl.program, 'u_MVProjectMatrix')
    var u_normalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix')
    if(!u_mvprojectMatrix || !u_normalMatrix){
        console.log('matrix failure')
        return
    }

    var mvpMatrix = new Matrix4()
    var modelMatrix = new Matrix4()
    var normalMatrix = new Matrix4()
    mvpMatrix.setPerspective(50, 1, 1, 100)
    mvpMatrix.setLookAt(0, 0, 30, 0,0,0,0, 1,0)
    var mvpMatrix_2 = new Matrix4()
    mvpMatrix_2.set(mvpMatrix).multiply(normalMatrix)
    gl.uniformMatrix4fv(u_mvprojectMatrix, false, mvpMatrix_2)

    normalMatrix.setInverseOf(modelMatrix)
    normalMatrix.transpose()
    gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrix)


    gl.clearColor(0,0,0,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl) {
    var vertices = new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
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

    if(!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')){
        console.log('a_Position failure');
        return -1;
    }

    if(!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')){
        console.log('a_Normal failure');
        return -1;
    }
    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
}

function initArrayBuffer(gl, data, num, type, attribute) {

    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)

    var attributeValue = gl.getAttribLocation(gl.program, attribute);
    if(!attributeValue){
        return false
    }
    gl.vertexAttribPointer(attributeValue, num, type, false, 0,0);
    gl.enableVertexAttribArray(attributeValue)

    return true
}
