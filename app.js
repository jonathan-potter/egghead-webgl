let gl,
    shaderProgram,
    vertices,
    matrix = mat4.create(),
    indexCount
    // vertexCount = 30

initGL()
createShader()
createVertices()
createIndices()
draw()

function initGL() {
  const canvas = document.getElementById('canvas')

  gl = canvas.getContext('webgl')
  gl.enable(gl.DEPTH_TEST)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0, 0, 0, 1);
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
  vertices = [
    -1, -1, -1,
     1, -1, -1,
    -1, -1,  1,
     1, -1,  1,
    -1,  1,  1,
     1,  1,  1,
    -1,  1, -1,
     1,  1, -1
  ]
  vertexCount = vertices.length / 3

  var buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  var coords = gl.getAttribLocation(shaderProgram, "coords")
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coords)

  const normals = [
     0,  0,  1,    0,  0,  1,    0,  0,  1,    0,  0,  1,
     0,  1,  0,    0,  1,  0,    0,  1,  0,    0,  1,  0,
     0,  0, -1,    0,  0, -1,    0,  0, -1,    0,  0, -1,
     0, -1,  0,    0, -1,  0,    0, -1,  0,    0, -1,  0,
    -1,  0,  0,   -1,  0,  0,   -1,  0,  0,   -1,  0,  0,
     1,  0,  0,    1,  0,  0,    1,  0,  0,    1,  0,  0
  ]

  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)

  const normalLocation = gl.getAttribLocation(shaderProgram, "normal")
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(normalLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)

  var lightColor = gl.getUniformLocation(shaderProgram, "lightColor")
  gl.uniform3f(lightColor, 1, 1, 1)

  const lightDirection = gl.getUniformLocation(shaderProgram, "lightDirection")
  gl.uniform3f(lightDirection, 0.5, 1, 0)

  let perspectiveMatrix = mat4.create();
  mat4.perspective(perspectiveMatrix, 1, canvas.width / canvas.height, 0.1, 10)

  perspectiveLocation = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
  gl.uniformMatrix4fv(perspectiveLocation, false, perspectiveMatrix)

  mat4.translate(matrix, matrix, [0, 0, -4])
}

function createIndices() {
  const indices = [
    0, 1, 2,  1, 2, 3,
    2, 3, 4,  3, 4, 5,
    4, 5, 6,  5, 6, 7,
    6, 7, 0,  7, 0, 1,
    0, 2, 6,  2, 6, 4,
    1, 3, 7,  3, 7, 5
  ]
  indexCount = indices.length

  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW)
}

function draw() {
  mat4.rotateZ(matrix, matrix, 0.01)
  mat4.rotateY(matrix, matrix, 0.02)
  mat4.rotateX(matrix, matrix, 0.03)

  const transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix")
  gl.uniformMatrix4fv(transformMatrix, false, matrix)

  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount)
  gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_BYTE, 0)

  requestAnimationFrame(draw)
}
