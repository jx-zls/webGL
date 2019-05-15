
var VSHADER_SOURCE =
    ' attribute vec4 a_Position;\n' +
    ' attribute vec4 a_Color;\n' +
    ' varying vec4 v_Color;\n' +
    ' void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  v_Color = a_Color;\n' +
    '}\n';

var FSHADER_SOURCE =
    'precision mediump float;\n' +
    ' varying vec4 v_Color;\n' +
    ' void main() {\n' +
    ' gl_FragColor = v_Color;\n' +
    '}\n';



function main() {

    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)
    if(!gl){
        console.log('gl creae failure')
        return ;
    }
    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('init shader failure ==')
        return ;
    }

    let n = initBuffer(gl)
    if(n < 0){
        console.log('get position failure')
        return ;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
}

function initBuffer(gl) {
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        0.0,  0.5,  1.0,  0.0,  0.0,
        -0.5, -0.5,  0.0,  1.0,  0.0,
        0.5, -0.5,  0.0,  0.0,  1.0,
    ]);
    var n = 3;

    var verDataBuffer = gl.createBuffer()
    if(!verDataBuffer){
        console.log('create buffer failure ')
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, verDataBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var a_position = gl.getAttribLocation(gl.program, 'a_Position')
    if(a_position < 0){
        console.log('get attribute failure')
        return -1;
    }
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, FSIZE * 5, 0)
    gl.enableVertexAttribArray(a_position)

    var a_color = gl.getAttribLocation(gl.program, 'a_Color')
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2)
    gl.enableVertexAttribArray(a_color)

    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    return n
}