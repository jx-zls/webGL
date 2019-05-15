

var VSHADER_SOURCE =
    ' attribute vec4 a_Position;' +
    ' attribute vec4 a_Color;' +
    ' varying vec4 v_Color;' +
    ' uniform mat4 u_ViewMatrix;' +
    ' uniform mat4 u_ProjectViewMatrix;' +
    ' void main(){' +
    '  v_Color = a_Color;' +
    '  gl_Position = u_ProjectViewMatrix * u_ViewMatrix * a_Position;' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'varying vec4 v_Color;' +
    'void main(){' +
    ' gl_FragColor = v_Color;' +
    '}';

function main() {

    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('shader init failure')
        return
    }

    var n = initVertexBuffer(gl)


    var viewMatrix = new Matrix4()
    var projectMatrix = new Matrix4()


    viewMatrix.setLookAt(0,0,5, 0,0,-100, 0, 1,0)
    projectMatrix.perspective(45, canvas.width / canvas.height, 1, 100)

    draw(gl, n, viewMatrix, projectMatrix)

}


function draw(gl, n, viewMatrix, projectMatirx){
    var u_viewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix')
    var u_ProjectMatrix = gl.getUniformLocation(gl.program, 'u_ProjectViewMatrix')

    gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix.elements)
    gl.uniformMatrix4fv(u_ProjectMatrix, false, projectMatirx.elements)

    gl.clearColor(0,0,0,1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function initVertexBuffer(gl) {
    var verticesColors = new Float32Array([
    // Three triangles on the right side
    0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
    1.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

    0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
    1.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

    0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one
    0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
    1.25, -1.0,   0.0,  1.0,  0.4,  0.4,

    // Three triangles on the left side
    -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
    -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4,

    -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
    -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4,

    -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,
    -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
    -0.25, -1.0,   0.0,  1.0,  0.4,  0.4,
]);




    var vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color')

    if(a_Position < 0 || a_Color < 0){
        console.log('attribute failure')
        return -1
    }

    var SIZE = verticesColors.BYTES_PER_ELEMENT
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6*SIZE, 0)
    gl.enableVertexAttribArray(a_Position)

    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * SIZE, 3 * SIZE)
    gl.enableVertexAttribArray(a_Color)

    return verticesColors.length / 6
}