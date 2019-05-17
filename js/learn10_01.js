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

var VSHADER_SOURCE = 
    'attribute vec4 a_Position;' +
    'attribute vec4 a_Normal;' +
    'varying vec4 v_Color;' +
    'uniform mat4 u_MvproMatrix;' +
    'uniform mat4 u_NormalMatrix;' +
    'void main() {' +
    ' gl_Position = u_MvproMatrix * a_Position;' +
    ' vec4 color = vec4(1.0, 0.0, 0.0, 1.0);' +
    ' vec3 lightDirection = normalize(vec3(1.0, 5.0, 2.0));' +
    ' vec3 ambiteLight = vec3(0.0, 1.0, 1.0);' +
    ' vec3 ambiteColor = ambiteLight * color.rgb;' +
    ' vec3 normal = normalize(vec4(u_NormalMatrix * a_Normal).xyz);' +
    ' float dotl = max(dot(lightDirection, normal), 0.0);' +
    ' v_Color = vec4(color.rgb * dotl + ambiteColor, color.a);' +
    '}';


var FSHADER_SOURCE = 
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main() {' +
    ' gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('init shader failure')
        return
    }

    let n = initVertexBuffers(gl)
    if(n < 0){
        console.log('n < 0')
        return;
    }

    gl.enable(gl.DEPTH_TEST)
    gl.clearColor(0,0,0,0.0)

    var u_proectionMatrix = gl.getUniformLocation(gl.program, 'u_MvproMatrix');
    var u_normalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    if(!u_proectionMatrix || !u_normalMatrix){
        console.log('attribute failure');
        return;
    }
    var viewPMatrix = new Matrix4()
    viewPMatrix.perspective(30.0, 1, 1.0, 100.0);
    viewPMatrix.lookAt(0.0, 0.0, 50.0, 0,0,0,0,1,0);


    document.onkeydown = function(ev){
        keydown(gl, n, viewPMatrix, u_proectionMatrix, u_normalMatrix, ev)
    }


    draw(gl, n, viewPMatrix, u_proectionMatrix, u_normalMatrix)

}

var g_modelMatrix = new Matrix4(), g_mvpMatrix = new Matrix4(), g_normalMatrix = new Matrix4();

var matrixStack = []

var step = 10.0
var angle = 45.0
var rotateAngle = 45.0
var headAngle = 0

function push(m) {
    let createMatrix = new Matrix4(m)
    matrixStack.push(createMatrix)
}

function pop() {
   return matrixStack.pop()
}

function keydown(gl, n, viewPMatrix, u_proectionMatrix, u_normalMatrix, ev) {
    console.log('ev ==', ev.keyCode)
    switch (ev.keyCode) {
        case 37:
            angle -= step;
            break;
        case 38:
            rotateAngle -= step;
            break;
        case 39:
            angle += step;
            break;
        case 40:
            rotateAngle += step;
            break;
        case 187:
            headAngle += step;
            break;
        case 189:
            headAngle -= step;
            break;
    }

        draw(gl, n, viewPMatrix, u_proectionMatrix, u_normalMatrix)
}

function draw(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix){
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);// 需要在图形变换前面调用，否则，会导致前面的不进行渲染

    g_modelMatrix.setTranslate(0, -10, 0)
    g_modelMatrix.rotate(angle, 0,1, 0)
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 5, 1,5)


    g_modelMatrix.translate(0,1 , 0)
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 2, 8,2)

    g_modelMatrix.translate(0.5, 8, 0)
    g_modelMatrix.rotate(rotateAngle, 0, 0, 1)
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 3, 6,3)

    g_modelMatrix.translate(0, 6, 0)
    g_modelMatrix.rotate(headAngle, 0, 1, 0);
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 2, 1,5)

    push(g_modelMatrix)
    g_modelMatrix.translate(0, 1, -1)
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 0.5, 0.5,0.5)
    g_modelMatrix = pop()

    g_modelMatrix.translate(0, 1, 1)
    drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, 0.5, 0.5,0.5)

}

function drawBox(gl, n, viewMatrix, u_proectionMatrix, u_normalMatrix, width, height, depth) {
    push(g_modelMatrix)
    g_modelMatrix.scale(width, height, depth);
    g_mvpMatrix.set(viewMatrix).multiply(g_modelMatrix);
    gl.uniformMatrix4fv(u_proectionMatrix, false, g_mvpMatrix.elements)
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose()
    gl.uniformMatrix4fv(u_normalMatrix, false, g_normalMatrix.elements)
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

    g_modelMatrix = pop()
}





function initVertexBuffers(gl) {

    if(!initArrayBuffers(gl, vertices, 3, 'a_Position')){
        return -1;
    }
    if(!initArrayBuffers(gl, normals, 3, 'a_Normal')){
        return -1;
    }

    var indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length
}

function initArrayBuffers(gl, data, num, attribute) {

    var buffers = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var attributeValue = gl.getAttribLocation(gl.program, attribute)
    if(attributeValue < 0){
        console.log('attribute failures=====');
        return false
    }

    gl.vertexAttribPointer(attributeValue, num, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attributeValue)


    return true


}