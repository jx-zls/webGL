
var VSHDER_SOURCE =
    ' attribute vec4 a_Position;' +
    ' attribute vec4 a_Color;' +
    ' varying vec4 v_Color;' +
    ' uniform mat4 u_ViewMatrix;' +
    ' void main() {' +
    ' gl_Position = u_ViewMatrix * a_Position;' +
    ' v_Color = a_Color;' +
    '}'

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main(){' +
    ' gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)

    if(!initShaders(gl, VSHDER_SOURCE, FSHADER_SOURCE)){
        return;
    }

    let n = initVertexBuffer(gl)

    gl.enable(gl.DEPTH_TEST);
    let u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    if(!u_ViewMatrix){
        console.log('attribute failure')
        return;
    }

    var viewMatrix = new Matrix4()
    viewMatrix.setPerspective(30, 1, 1, 100);
    viewMatrix.lookAt(3,3,7, 0,0,0,0,1,0)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

    gl.clearColor(0,0,0,1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);

}

function initVertexBuffer(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
        1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
        1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
        1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);


    var arraybuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, arraybuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color')

    if(a_Position < 0 || a_Color < 0){
        console.log('attribute failure')
        return -1
    }

    var SIZE = verticesColors.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * SIZE, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * SIZE, 3 * SIZE)
    gl.enableVertexAttribArray(a_Color)


    var indexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return indices.length

}
