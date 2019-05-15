
var VSHADER_SHOURCE =
    ' attribute vec4 a_Position;' +
    ' attribute vec4 a_Color;' +
    ' varying vec4 v_Color;' +
    ' uniform mat4 u_ViewMatrix;' +
    ' void main(){' +
    ' gl_Position = u_ViewMatrix * a_Position;' +
    ' v_Color = a_Color;' +
    ' gl_PointSize = 10.0;' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    ' void main(){' +
    ' gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)

    if(!gl){
        console.log('gl init failure');
        return;
    }

    if(!initShaders(gl, VSHADER_SHOURCE, FSHADER_SOURCE)){
        console.log('init shader failure ');
        return;
    }

    var n = initVertexBuffer(gl)

    if(n < 0){
        console.log('init vertex data failure')
        return
    }


    var u_viewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    if(!u_viewMatrix){
        console.log('u_viewMatrix failure')
        return;
    }

    var matrix = new Matrix4()

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    document.onkeydown = function(e){
        keydown(e, gl, n, u_viewMatrix, matrix)
    }

    draw(gl, n, u_viewMatrix, matrix)
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
        -0.5, -0.5,   0.0,  1.0,  0.4,  1.0,
        0.5, -0.5,   0.0,  1.0,  0.4,  0.4,

    ]);
    var n = verticesColors.length / 6;




    var verBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, verBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');



    if(a_Position < 0 || a_Color < 0){
        console.log('getAttribute failure');
        return -1
    }

    var SIZE = verticesColors.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * SIZE, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * SIZE, 3 * SIZE)
    gl.enableVertexAttribArray(a_Color)

    return n
}

var g_eyeX = 0.20, g_eyeY = 0.25, g_eyeZ = 0.25; // Eye position
function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
    if(ev.keyCode == 39) {
        g_eyeX += 0.01;
    } else
    if (ev.keyCode == 37) {
        g_eyeX -= 0.01;
    } else { return; }
    draw(gl, n, u_ViewMatrix, viewMatrix);
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
