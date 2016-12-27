let gl,
    shaderProgram,
    vertices,
    matrix = mat4.create()
    // vertexCount = 30

initGL()
createShader()
createVertices()
draw()

function initGL() {
  const canvas = document.getElementById('canvas')

  gl = canvas.getContext('webgl')
  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(1, 1, 1, 1);
}

function createShader() {
  let vertexShader = getShader(gl, "shader-vs")
  let fragmentShader = getShader(gl, "shader-fs")

  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)
  gl.useProgram(shaderProgram)
}

function createVertices () {
  vertices = []
  const colors = []
  for (var i = 0; i < 2; i += 0.01) {
    vertices.push(i - 1);
    vertices.push(-0.3);
    vertices.push(Math.sin(i * 10) * 0.2);
    vertices.push(i / 2);
    vertices.push(0);
    vertices.push(i - i / 2);
    vertices.push(1);

    vertices.push(i - 1);
    vertices.push(+0.3);
    vertices.push(Math.sin(i * 10) * 0.2);
    vertices.push(i - i / 2);
    vertices.push(i / 2);
    vertices.push(1);
    vertices.push(1);
  }
  vertexCount = vertices.length / 7;
  // for(var i = 0; i < vertexCount; i++) {
  //   vertices.push(Math.random() * 2 - 1)
  //   vertices.push(Math.random() * 2 - 1)
  //   vertices.push(Math.random() * 2 - 1)
  //   vertices.push(Math.random())
  //   vertices.push(Math.random())
  //   vertices.push(Math.random())
  //   vertices.push(1)
  // }

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  var coords = gl.getAttribLocation(shaderProgram, "coords")
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0)
  gl.enableVertexAttribArray(coords)
  // gl.bindBuffer(gl.ARRAY_BUFFER, null)

  // var colorBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)
  //
  var colorsLocation = gl.getAttribLocation(shaderProgram, "colors")
  gl.vertexAttribPointer(colorsLocation, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 3)
  gl.enableVertexAttribArray(colorsLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  var pointSize = gl.getAttribLocation(shaderProgram, "pointSize")
  gl.vertexAttrib1f(pointSize, 10)

  // var color = gl.getUniformLocation(shaderProgram, "color")
  // gl.uniform4f(color, 0, 1, 0, 1)

  let perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, 1.3, canvas.width / canvas.height, 0.1, 10)

  perspectiveLocation = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
  gl.uniformMatrix4fv(perspectiveLocation, false, perspectiveMatrix)

  mat4.translate(matrix, matrix, [0, 0, -2])
}

function draw() {
  mat4.rotateZ(matrix, matrix, 0.01)
  mat4.rotateY(matrix, matrix, 0.02)
  mat4.rotateX(matrix, matrix, 0.03)

  const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix")
  gl.uniformMatrix4fv(transformMatrix, false, matrix)

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)

  requestAnimationFrame(draw)
}
