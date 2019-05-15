

var VSHADER_SOURCE =
    'attribute vec4 a_Position;' +
    'attribute vec4 a_Color;' +
    'varying vec4 v_Color;' +
    'uniform mat4 u_ViewMatrix;' +
    'void main() {' +
    ' v_Color = a_Color;' +
    ' gl_Position = u_ViewMatrix * a_Position;' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main() {' +
        'gl_FragColor = v_Color;' +
    '}';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas)
    if (!gl){
        console.log('gl create failure')
        return ;
    }

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('shader init failure')
        return;
    }

    let n = initVertexBuffer(gl)

    if(n < 0){
        console.log('init Verterx Buffer failure')
        return
    }

    var viewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!viewMatrix){
        console.log('viewMatrix failure')
        return ;
    }

    var mat = new Matrix4()
    mat.setLookAt(0.2, 0.2, 0.2, 0, 0, 0, 1, 1, 0)

    gl.uniformMatrix4fv(viewMatrix, false, mat.elements)

    gl.clearColor(0.0,0.0,0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffer(gl) {
    var verticesColors = new Float32Array([

        0.0,  0.5,  -0.4,  0.4,  1.0,  0.4,
        -0.5, -0.5,  -0.4,  0.4,  1.0,  0.4,
        0.5, -0.5,  -0.4,  1.0,  0.4,  0.4,

        0.5,  0.4,  -0.2,  1.0,  0.4,  0.4,
        -0.5,  0.4,  -0.2,  1.0,  1.0,  0.4,
        0.0, -0.6,  -0.2,  1.0,  1.0,  0.4,

        0.0,  0.5,   0.0,  0.4,  0.4,  1.0,
        -0.5, -0.5,   0.0,  0.4,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4,

    ]);
    var n = 9;

    var verticeBuffer = gl.createBuffer()
    if(!verticeBuffer){
        console.log('buffer failure ');
        return -1
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, verticeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');


    if(a_Position < 0 || a_Color < 0){
       console.log('attribute failure');
       return -1
    }

    var SIZE = verticesColors.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * SIZE, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * SIZE,3 *SIZE)
    gl.enableVertexAttribArray(a_Color)

    return n

}