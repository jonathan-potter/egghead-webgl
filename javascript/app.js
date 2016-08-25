var gl, shaderProgram, vertices;

var matrix = mat4.create();

var VERTEX_COUNT = 30;


initGL();
createShaders();
createVertices();
draw();

function initGL() {
  var canvas = document.getElementById("canvas");
  gl = canvas.getContext("webgl");

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

function createShaders() {

  var vertexShader = getShader(gl, "shader-vs");
  var fragmentShader = getShader(gl, "shader-fs")

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);

  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVertices() {
  vertices = [];
  for(var i = 0; i < VERTEX_COUNT; i++) {
    vertices.push(Math.random() * 2 - 1);
    vertices.push(Math.random() * 2 - 1);
    vertices.push(Math.random() * 2 - 1);
  }

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  var coords = gl.getAttribLocation(shaderProgram, 'coords');
  // gl.vertexAttrib3f(coords, 0.5, 0, 0);
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coords);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 100.0);

  var color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 0, 1.0, 0.0, 1.0);
}

function draw() {
  mat4.rotateX(matrix, matrix, 0.03);
  mat4.rotateY(matrix, matrix, 0.02);
  mat4.rotateZ(matrix, matrix, 0.01);

  var transformMatrix = gl.getUniformLocation(shaderProgram, 'transformMatrix');
  gl.uniformMatrix4fv(transformMatrix, false, matrix)

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, VERTEX_COUNT);

  requestAnimationFrame(draw)
}
