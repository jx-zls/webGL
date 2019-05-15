
var VSHADER_SOURCE =
    ' attribute vec4 a_Position;' +
    ' attribute vec2 a_Textcood;' +
    ' varying vec2 v_Textcood;' +
    ' void main(){' +
    ' gl_Position = a_Position;' +
    ' v_Textcood = a_Textcood;' +
    '}';

var FSHADER_SOURCE =
    'precision mediump float;' +
    'uniform sampler2D u_sampler0;' +
    'uniform sampler2D u_sampler1;' +
    'varying vec2 v_Textcood;'+
    ' void main() {' +
    ' vec4 color0 = texture2D(u_sampler0, v_Textcood);' +
    ' vec4 color1 = texture2D(u_sampler1, v_Textcood);' +
    ' gl_FragColor = color0 * color1;' +
    '}';


function main() {
    var canvas = document.getElementById('webgl')
    var gl = getWebGLContext(canvas)

    if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
        console.log('shader init Failure');
        return ;
    }

    var n = initVertexBuffer(gl)
    console.log('n ===', n)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    initTextureBuffer(gl, n)



}

function initVertexBuffer(gl) {
    var verticesTexCoords = new Float32Array([
        -0.5,  0.5,   0.0, 1.0,
        -0.5, -0.5,   0.0, 0.0,
        0.5,  0.5,   1.0, 1.0,
        0.5, -0.5,   1.0, 0.0,
    ]);
    var n = 4;

    var vertexData = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexData)
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW)


    var a_positon = gl.getAttribLocation(gl.program, 'a_Position')
    var a_textcood = gl.getAttribLocation(gl.program, 'a_Textcood');

    if(a_positon < 0 || a_textcood < 0){
        console.log('get attribute failure');
        return -1
    }

    var VSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_positon, 2, gl.FLOAT, false, 4 * VSIZE, 0)
    gl.enableVertexAttribArray(a_positon)

    gl.vertexAttribPointer(a_textcood, 2, gl.FLOAT, false, 4 * VSIZE, 2 * VSIZE)
    gl.enableVertexAttribArray(a_textcood)

    return n
}

function initTextureBuffer(gl, n) {

    var texture0 = gl.createTexture()
    var texture1 = gl.createTexture()
    if(!texture0 || !texture1){
        console.log('texture create failure')
        return false
    }

    var u_sample0 = gl.getUniformLocation(gl.program, 'u_sampler0');
    var u_sample1 = gl.getUniformLocation(gl.program, 'u_sampler1')
    if(!u_sample0 || !u_sample1){
        console.log('sample load failure')
        return false
    }

    var image0 = new Image()
    var image1 = new Image()

    image0.src = './resources/sky.JPG';
    image1.src = './resources/circle.gif';
    image0.onload = function () {
        loadtexture(gl, n, texture0, u_sample0, image0, 1)
    }
    image1.onload = function () {
        loadtexture(gl, n, texture1, u_sample1, image1, 0)
    }

}

var first = false
var second = false

function loadtexture(gl, n, texture, usample, image, isImage0) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    if(isImage0 == 0){
        gl.activeTexture(gl.TEXTURE0)
        first = true
    }else{
        gl.activeTexture(gl.TEXTURE1)
        second = true
    }

    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.uniform1i(usample, isImage0)
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (second ) {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);

    }
}
