
var VSHADER_SOURCE =
    ' attribute vec4 a_Position;' +
    ' attribute vec4 a_Color;' +
    ' attribute vec4 a_Normal;' +
    ' varying vec4 v_Color;' +
    ' uniform mat4 u_ViewMatrix;' +
    ' uniform mat4 u_NormalMatrix;' +
    ' uniform vec3 lightColor;' +
    ' uniform vec3 lightDirection;' +
    ' uniform vec3 ambiteLight;' +
    ' void main(){' +
    ' gl_Position = u_ViewMatrix * a_Position;' +
    ' vec4 normal = u_NormalMatrix * a_Normal;' +
    ' float nDotl = max(dot(lightDirection, normalize(normal.xyz)), 0.0);' +
    ' vec3 diffuse = lightColor * a_Color.rgb * nDotl;' +
    ' vec3 ambite = ambiteLight * a_Color.rgb;' +
    ' v_Color = vec4(diffuse + ambite, a_Color.a);' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main() {' +
    ' gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){

        return;
    }

    let n = initVertexBuffer(gl)

    if(n < 0){
        console.log('n < 0 failure')
        return
    }
    gl.clearColor(0,0,0,1.0)

    var u_LightColor = gl.getUniformLocation(gl.program, 'lightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program, 'lightDirection');
    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_ambiteLight = gl.getUniformLocation(gl.program, 'ambiteLight');

    if(!u_LightColor || !u_LightColor || !u_LightDirection || !u_NormalMatrix){
        console.log('attribute failure');
        return
    }

    gl.enable(gl.DEPTH_TEST)
    // gl.uniformMatrix4fv()
    // gl.uniform3f()
    var viewMatrix = new Matrix4()
    var modelMatrix = new Matrix4()
    var normalMatrix = new Matrix4()
    var viewMatrixs = new Matrix4()
    viewMatrix.perspective(30, 1, 1, 100);
    viewMatrix.lookAt(3,3,7,0,0,0,0, 1,0)

    // gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    var lightDirection = new Vector3([3.5, 3.0, 4.0]);
    lightDirection.normalize();     // Normalize
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    gl.uniform3f(u_ambiteLight, 0.2, 0.2, 0.2)
    var angle = 0.0

   var tack = function(){
        angle = animate(angle)
        modelMatrix.setRotate(angle, 1.0, 1.0, 1.0)
        viewMatrixs.set(viewMatrix).multiply(modelMatrix)
        gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrixs.elements)
        normalMatrix.setInverseOf(modelMatrix);
        normalMatrix.transpose()
        gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0)
        requestAnimationFrame(tack, canvas)
    }

    tack()

}


var ANGLE_STEP = 30.0;
var g_last = Date.now();
function animate(angle) {
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}

function initVertexBuffer(gl) {
    var vertices = new Float32Array([   // Coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0, // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0, // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0, // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0, // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0, // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0  // v4-v7-v6-v5 back
    ]);


    var colors = new Float32Array([    // Colors
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
        1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    ]);


    var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
        -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
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



    var indiceBuffer = gl.createBuffer()
    if(!initArrayBuffer(gl, vertices, 3, 'a_Position', gl.FLOAT)){
        console.log('position failure')
        return -1
    }
    if(!initArrayBuffer(gl, normals, 3, 'a_Normal', gl.FLOAT)){
        console.log('normal failure')
        return -1
    }
    if(!initArrayBuffer(gl, colors, 3, 'a_Color', gl.FLOAT)){
        console.log('color failure')
        return -1
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length
}

function initArrayBuffer(gl, data, num, attribute, type) {
    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    var attributeValue = gl.getAttribLocation(gl.program, attribute)
    if(attributeValue < 0){
        console.log('attribute failue');
        return false
    }
    gl.vertexAttribPointer(attributeValue, num, gl.FLOAT, false, 0,0)
    gl.enableVertexAttribArray(attributeValue)


    return true

}